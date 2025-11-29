import { numberWithCommas } from "@/lib/numberWithComma";
import { Auction, AuctionFinished } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  finishedAuction: AuctionFinished;
  auction: Auction;
};

export default function AuctionFinishedToast({
  finishedAuction,
  auction,
}: Props) {
  return (
    <Link
      href={`/auctions/details/${auction.id}`}
      className="flex flex-col items-center"
    >
      <div className="flex flex-row items-center gap-2">
        <Image
          src={auction.imageUrl}
          alt="Image of car"
          width={80}
          height={80}
          className="rounded-lg w-auto h-auto"
        />
        <div className="flex flex-col">
          <span>
            Auction for {auction.make} {auction.model} has finished
            {finishedAuction.itemSold && finishedAuction.amount ? (
              <p>
                ! Sold to {finishedAuction.winner} for $
                {numberWithCommas(finishedAuction.amount)}
              </p>
            ) : (
              <p> without a sale.</p>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
