import { getPaymentProvider } from "@/lib/payments";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = "INR", receipt, notes } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "A valid positive numeric 'amount' is required." },
        { status: 400 }
      );
    }

    const provider = getPaymentProvider();
    const order = await provider.createOrder({
      amount,
      currency,
      receipt,
      notes,
    });

    return NextResponse.json({ order }, { status: 200 });
  } catch (err: any) {
    console.error("Payment order creation failed:", err);
    const detail =
      err?.error?.description ||
      err?.description ||
      err?.message ||
      "Failed to create payment order.";

    return NextResponse.json({ error: detail }, { status: 500 });
  }
}
