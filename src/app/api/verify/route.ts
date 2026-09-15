import { getPaymentProvider } from "@/lib/payments";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderId = body.razorpay_order_id || body.orderId;
    const paymentId = body.razorpay_payment_id || body.paymentId;
    const signature = body.razorpay_signature || body.signature;

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json(
        { verified: false, error: "Missing verification parameters (order_id, payment_id, signature)." },
        { status: 400 }
      );
    }

    const provider = getPaymentProvider();
    const verification = await provider.verifyPayment({
      orderId,
      paymentId,
      signature,
    });

    if (!verification.verified) {
      return NextResponse.json(
        { verified: false, error: verification.error || "Signature mismatch." },
        { status: 400 }
      );
    }

    // Optional: database updates for marking order as paid can be hooked here
    return NextResponse.json(
      { verified: true, transactionId: verification.transactionId },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Signature verification failed:", err);
    return NextResponse.json(
      { verified: false, error: "Verification failed due to a server error." },
      { status: 500 }
    );
  }
}
