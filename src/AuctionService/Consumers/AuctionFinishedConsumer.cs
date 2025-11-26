using AuctionService.Data;
using Contracts;
using MassTransit;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Consumers
{
    public class AuctionFinishedConsumer : IConsumer<AuctionFinished>
    {
        private readonly AuctionDbContext _dbContext;

        public AuctionFinishedConsumer(AuctionDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task Consume(ConsumeContext<AuctionFinished> context)
        {

            Console.WriteLine("--> Consuming auction finished");

            var auctionId = Guid.Parse(context.Message.AuctionId);
            var auction = await _dbContext.Auctions.FindAsync(auctionId);

            if (context.Message.ItemSold)
            {
                auction.Winner = context.Message.Winner;
                auction.SoldAmount = context.Message.Amount;
            }

            auction.Status = auction.SoldAmount > auction.ReservePrice ? Entities.Status.Finished : Entities.Status.ReserveNotMet;

            await _dbContext.SaveChangesAsync();  
        }
    }
}
