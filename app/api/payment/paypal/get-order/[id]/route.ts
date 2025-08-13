import { baseUrl, getAccessToken } from "@/lib/paypal";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {

    const id  = (await params).id;

    const token = await getAccessToken();
    const headers =
    {
        "content-type": "application/json",
        "authorization": "Bearer " + token
    }
    
    const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders/${id}`,
        {
            headers
        }
    );

    if (!orderResponse.ok){
        return NextResponse.json({msg: "Failed to fetch resource"}, {status: orderResponse.status});
    }

    const orderData = await orderResponse.json();

    const response = {
        id: orderData.id,
        status: orderData.status,
        firstName: orderData.payer.name.given_name,
        lastName: orderData.payer.name.surname,
        email: orderData.payer.email_address,
    }

    return NextResponse.json(response, {status: 200});

}