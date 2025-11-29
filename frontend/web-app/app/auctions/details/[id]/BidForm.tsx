"use client";

type Props = {
  auctionId: string;
  highBid: number;
};

import { placeBidForAuction } from "@/app/actions/auctionActions";
import { useBidStore } from "@/hooks/useBidStore";
import { numberWithCommas } from "@/lib/numberWithComma";
import React from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function BidForm({ auctionId, highBid }: Props) {
  const { register, handleSubmit, reset } = useForm();

  const addBid = useBidStore((state) => state.addBid);

  async function onSubmit(data: FieldValues) {
    if(+data.amount <= highBid) {
      reset();
      toast.error(`Your bid must be at least $${numberWithCommas(highBid + 1)}.`);
      return;
    }
    placeBidForAuction(auctionId, +data.amount)
      .then((bid) => {
        if (bid.error) {
          reset();
          throw bid.error;
        }
        addBid(bid);
        reset();
      })
      .catch((error) => {
        // Handle the error, e.g., show a toast notification
        toast.error(error.message);
      });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center border-2 rounded-lg py2"
    >
      <input
        type="number"
        {...register("amount")}
        className="
             flex-grow
             pl-5
             bg-transparent
             focus:outline-none
             border-transparent
             focus:border-transparent
             focus:ring-0
             text-sm
             text-gray-600
            "
        placeholder={`Enter your bid (minimum bid is $${numberWithCommas(
          highBid + 1
        )})`}
      />
    </form>
  );
}
