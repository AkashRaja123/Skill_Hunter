import crypto from "crypto";
import Razorpay from "razorpay";
import {
  CreateOrderParams,
  PaymentOrder,
  PaymentProvider,
  VerifyPaymentParams,
  VerifyPaymentResult,
} from "../types";

export class RazorpayPaymentProvider implements PaymentProvider {
  public readonly name = "razorpay";

  private isPlaceholder(value?: string): boolean {
    if (!value) return true;
    const val = value.trim();
    return (
      val === "" ||
      val.includes("xxxxxxxx") ||
      val.includes("your_test_secret") ||
      val.includes("your_key")
    );
  }

  private getRazorpayInstance(): Razorpay | null {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (this.isPlaceholder(keyId) || this.isPlaceholder(keySecret)) {
      return null;
    }

    return new Razorpay({
      key_id: keyId!,
      key_secret: keySecret!,
    });
  }

  async createOrder(params: CreateOrderParams): Promise<PaymentOrder> {
    const { amount, currency = "INR", receipt, notes } = params;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      throw new Error("A valid positive numeric 'amount' is required.");
    }

    const amountInPaise = Math.round(amount * 100);
    const generatedReceipt = receipt || `receipt_${Date.now()}`;
    const razorpay = this.getRazorpayInstance();

    // If environment variables are missing or placeholder keys, support mock test order for easy DX
    if (!razorpay) {
      console.warn(
        "[Razorpay] Using placeholder test keys. Generating mock test order. Provide real keys in .env.local for live Razorpay API responses."
      );
      const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      return {
        id: mockOrderId,
        amount: amountInPaise,
        currency,
        receipt: generatedReceipt,
        provider: this.name,
        providerData: {
          id: mockOrderId,
          entity: "order",
          amount: amountInPaise,
          currency,
          receipt: generatedReceipt,
          status: "created",
          isMock: true,
        },
      };
    }

    try {
      const options = {
        amount: amountInPaise,
        currency,
        receipt: generatedReceipt,
        notes: notes || {},
      };

      const order = await razorpay.orders.create(options);

      return {
        id: order.id,
        amount: Number(order.amount),
        currency: order.currency,
        receipt: order.receipt || generatedReceipt,
        provider: this.name,
        providerData: order as unknown as Record<string, any>,
      };
    } catch (err: any) {
      console.error("Razorpay order creation error:", err);
      const detail =
        err?.error?.description ||
        err?.description ||
        err?.message ||
        "Failed to create order with Razorpay API.";
      throw new Error(`Razorpay API Error: ${detail}`);
    }
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult> {
    const { orderId, paymentId, signature } = params;

    if (!orderId || !paymentId || !signature) {
      return {
        verified: false,
        error: "Missing verification parameters (orderId, paymentId, signature are required).",
      };
    }

    // Handle mock test orders seamlessly
    if (orderId.startsWith("order_mock_")) {
      return {
        verified: true,
        transactionId: paymentId || `pay_mock_${Date.now()}`,
      };
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (this.isPlaceholder(keySecret)) {
      // If mock key secret was used
      return {
        verified: true,
        transactionId: paymentId,
      };
    }

    try {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret!)
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

      const generatedBuffer = Buffer.from(generatedSignature, "utf-8");
      const signatureBuffer = Buffer.from(signature, "utf-8");

      let isValid = false;
      if (generatedBuffer.length === signatureBuffer.length) {
        isValid = crypto.timingSafeEqual(generatedBuffer, signatureBuffer);
      } else {
        isValid = generatedSignature === signature;
      }

      if (!isValid) {
        return {
          verified: false,
          error: "Signature mismatch.",
        };
      }

      return {
        verified: true,
        transactionId: paymentId,
      };
    } catch (err: any) {
      console.error("Razorpay signature verification error:", err);
      const detail =
        err?.error?.description ||
        err?.description ||
        err?.message ||
        "Verification failed due to a server error.";
      return {
        verified: false,
        error: detail,
      };
    }
  }
}
