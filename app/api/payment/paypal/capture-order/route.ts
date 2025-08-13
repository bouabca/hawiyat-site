// app/api/paypal/capture-order/route.ts
import { NextResponse } from 'next/server';
import { captureOrder } from '@/lib/paypal';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    if (!orderId) throw new Error('Missing orderId');

    const capture = await captureOrder(orderId);
    return NextResponse.json({ ok: true, capture });
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as {message: string}).message }, { status: 400 });
  }
}
