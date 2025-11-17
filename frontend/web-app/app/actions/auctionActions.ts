'use server'

import { fetchWrapper } from "@/lib/fetchWrapper";
import { Auction, PagedResult } from "@/types";
import { FieldValues } from "react-hook-form";

export async function getData(query: string): Promise<PagedResult<Auction>> {
  return fetchWrapper.get(`search${query}`)
}

export async function updateAuctionTest(): Promise<{ status: number, message: string }> {
  const data = {
    mileage: Math.floor(Math.random() * 10000) + 1
  }
  return fetchWrapper.put('auctions/3659ac24-29dd-407a-81f5-ecfe6f924b9b', data);
}

export async function createAuction(data: FieldValues) {
  console.log('Creating auction with data:', data);
  return fetchWrapper.post('auctions', data);
}

export async function getDetailedViewData(id: string): Promise<Auction> {
  return fetchWrapper.get(`auctions/${id}`);
}

export async function updateAuction(data: FieldValues, id: string) {
  return fetchWrapper.put(`auctions/${id}`, data);
}

export async function deleteAuction(id: string) {
  return fetchWrapper.del(`auctions/${id}`);
}
