'use client';

import { deleteAuction } from "@/app/actions/auctionActions";
import { Button, Spinner } from "flowbite-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast/headless";

type Props = {
    id: string
}   

export default function DeleteButton({id}: Props) {
    const [loading, setLoading] = React.useState(false);
const router = useRouter();

function handleDelete() {
    setLoading(true);
    deleteAuction(id).then((res) => {
        if (res.error) {
            throw res.error;
        }
        router.push('/');
    }).catch((error) => {
        toast.error(error.status + ' ' + error.message);
    }).finally(() => {
        setLoading(false);
    });
}

    return (
<Button outline color ="failure" disabled={loading} onClick={handleDelete}> 
    {loading && <Spinner size="sm"  className="mr-3"/>}Delete Auction
 </Button>  
  )
}
