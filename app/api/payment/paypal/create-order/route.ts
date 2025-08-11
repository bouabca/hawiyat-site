// app/api/paypal/create-order/route.ts
import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/paypal';
import { CartItem } from '@/context/cart-context';

type ReqBody = {

  cart: CartItem[];
  total: string;
};

export async function POST(req: Request) {
  try {
    const body: ReqBody = await req.json();
    if (!body.cart || !body.cart.length) throw new Error('Empty cart');

    // Validate & sum server-side
    const cartItems = body.cart;

    const total = body.total;

    console.log("The total is from handler :" + total);
    const order = await createOrder({
      total,
      cartItems,
      currency: 'USD',
      returnUrl: `${process.env.BASE_URL}/pay/success`,
      cancelUrl: `${process.env.BASE_URL}/pay/cancel`,
    });

    const approveLink = order.links?.find((l: any) => l.rel === 'approve')?.href;

    return NextResponse.json({ ok: true, approveLink, orderId: order.id });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}
