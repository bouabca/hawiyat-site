import { baseUrl, getAccessToken } from "@/lib/paypal";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {

    const { id } = params;

    const token = await getAccessToken();
    const headers =
    {
        "conetent-type": "application/json",
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