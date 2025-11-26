using AuctionService.Data;
using Grpc.Core;

namespace AuctionService.Services
{
    public class GrpcAuctionService : GrpAuction.GrpAuctionBase
    {
        private readonly AuctionDbContext _dbContext;

        public GrpcAuctionService(AuctionDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public override async Task<GrpcAuctionResponse> GetAuction(GetAuctionRequest request, ServerCallContext context)
        {
            Console.WriteLine("--> Getting auction from Grpc Service");
            var auction = await _dbContext.Auctions.FindAsync(Guid.Parse(request.Id));

            if (auction == null)
            {
                throw new RpcException(new Status(StatusCode.NotFound, $"Auction with ID {request.Id} not found."));
            }

            var response = new AuctionService.GrpcAuctionResponse
            {
                Auction = new GrpAuctionModel
                {
                    AuctionEnd = auction.AuctionEnd.ToString("o"),
                    Id = auction.Id.ToString(),
                    ReservePrice = auction.ReservePrice,
                    Seller = auction.Seller,
                }
            };

            return response;
        }
    }
}
