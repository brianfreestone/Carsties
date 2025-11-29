import { numberWithCommas } from "@/lib/numberWithComma";
import { Bid } from "@/types";
import { format } from "date-fns";
import React from "react";

type Props = {
  bid: Bid;
};

export default function BidItem({ bid }: Props) {
  function getBidInfo() {
    let bgColor = "";
    let text = "";

    switch (bid.bidStatus) {
      case "Accepted":
        bgColor = "bg-green-100";
        text = "Bid Accepted";
        break;
      case "AcceptedBelowReserve":
        bgColor = "bg-amber-100";
        text = "Reserve Not Met";
        break;
      case "TooLow":
        bgColor = "bg-red-100";
        text = "Bid was Too Low   ";
        break;
      default:
        bgColor = "bg-red-100";
        text = "Bid placedd after auction ended";
        break;
    }
    return { bgColor, text };
  }

  return (
    <div
      className={`
            border-gray-300 border-2 px-3 py-2 rounded-lg
            flex justify-between items-center mb-2
            ${getBidInfo().bgColor} mb-2`}
    >
        <div className="flex flex-col">
            <span>Bidder: {bid.bidder}</span>
            <span className="text-gray-700 text-sm">Time: {format(new Date(bid.bidTime), "dd MMM yyyy h:mm:ss a")}</span>
        </div>
        <div className="flex flex-col text-right">
            <div className='text-xl font-semibold'>${numberWithCommas(bid.amount)}</div>
            <div className="flex flex-row items-center">
                {getBidInfo().text}</div>
        </div>
    </div>
  );
}

