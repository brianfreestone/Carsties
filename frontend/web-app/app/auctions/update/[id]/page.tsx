import { getDetailedViewData } from "@/app/actions/auctionActions";
import Heading from "@/app/components/Heading";
import React from "react";
import AuctionForm from "../../AuctionForm";

export default async function Update({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getDetailedViewData(id);
  return (
    <div className="mx-auto max-w-[75%] p-10 shadow-lg rounded-lg bg-white">
      <Heading
        title={`Update your auction: ${data.make} ${data.model}`}
        subtitle={`Please update the details for your car (only these auction details can be changed).`}/>
        <AuctionForm auction={data} />
    </div>
  );
}
