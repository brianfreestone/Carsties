

using BiddingService.Models;
using Contracts;
using MongoDB.Entities;

namespace BiddingService
{
    public class CheckAuctionFinished : BackgroundService
    {
        private readonly ILogger _logger;
        private readonly IServiceProvider _services;

        public CheckAuctionFinished(ILogger<CheckAuctionFinished> logger, IServiceProvider services)
        {
            _logger = logger;
            _services = services;
        }
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Check Auction Finished Service is starting.");

            stoppingToken.Register(() =>
                _logger.LogInformation("==> Check Auction Finished Service is stopping."));

            while (!stoppingToken.IsCancellationRequested)
            {
                await CheckAuctions(stoppingToken);

                await Task.Delay(5000, stoppingToken);
            }
        }

        private async Task CheckAuctions(CancellationToken stoppingToken)
        {
            var finishedAuctions = await DB.Find<Auction>()
                .Match(x => x.AuctionEnd <= DateTime.UtcNow)
                .Match(x => !x.Finished)
                .ExecuteAsync(stoppingToken);

            if (finishedAuctions.Count == 0) return;

            _logger.LogInformation("==> Found {Count} finished auctions", finishedAuctions.Count);

            using (var scope = _services.CreateScope())
            {
                var publishEndpoint = scope.ServiceProvider.GetRequiredService<MassTransit.IPublishEndpoint>();
                foreach (var auction in finishedAuctions)
                {
                    auction.Finished = true;
                    await auction.SaveAsync(null, stoppingToken);
                    var winningBid = await DB.Find<Bid>()
                        .Match(x => x.AuctionId == auction.ID)
                        .Match(x => x.BidStatus == BidStatus.Accepted)
                        .Sort(x => x.Descending(s => s.Amount))
                        .ExecuteFirstAsync(stoppingToken);

                    await publishEndpoint.Publish(new AuctionFinished
                    {
                        ItemSold = winningBid != null,
                        AuctionId = auction.ID,
                        Winner = winningBid?.Bidder,
                        Amount = winningBid?.Amount,
                        Seller = auction.Seller
                    }, stoppingToken);
                    _logger.LogInformation("==> Published AuctionFinished event for AuctionId: {AuctionId}", auction.ID);
                }
            }
        }
    }
}
