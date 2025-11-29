import React from 'react'

type Props = {
    amount?: number
    reservePrice: number
}

export default function CurrentBid({amount, reservePrice}: Props) {
    const text = amount ? `$${amount.toLocaleString()}` : "No bids yet"
    const color = amount ? amount > reservePrice ?  "bg-green-600" : "bg-amber-600" : "bg-red-600"
  return (
    <div className={
        `${color}  border-2 border-white  text-white px-2 py-1 rounded-lg flex justify-center`}>
      {text}
    </div>
  )
}
