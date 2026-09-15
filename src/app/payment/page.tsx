"use client";

import Script from "next/script";
import Link from "next/link";
import { useState } from "react";
import { BrandLogo } from "@/components/brand-logo";
import { useAuth } from "@/context/auth-context";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface PlanOption {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

const PLANS: PlanOption[] = [
  {
    id: "pro",
    name: "Skill Hunter Pro",
    price: 499,
    description: "Unlimited ATS Resume Scans, Job Matching & AI Resume Optimization",
    features: [
      "Unlimited ATS Score Analysis",
      "AI-Powered Keyword Enhancement",
      "Automated Job Matching Engine",
      "Export Tailored PDF Resumes",
      "Priority Customer Support",
    ],
  },
  {
    id: "basic",
    name: "Starter Pack",
    price: 199,
    description: "10 ATS Resume Scans & Standard Matching",
    features: [
      "10 Detailed ATS Reports",
      "Basic Skill Gap Analysis",
      "Job Feed Access",
    ],
  },
];

export default function PaymentPage() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>(PLANS[0]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setStatus(null);

    try {
      // 1. Create order on server
      const orderRes = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedPlan.price,
          currency: "INR",
          receipt: `receipt_${selectedPlan.id}_${Date.now()}`,
        }),
      });

      const { order, error } = await orderRes.json();

      if (!orderRes.ok || !order) {
        throw new Error(error || "Failed to create payment order.");
      }

      const keyId =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID &&
        !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID.includes("xxxxxxxx")
          ? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
          : "rzp_test_123456789012";

      // 2. Configure Razorpay checkout options
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Skill Hunter",
        description: `Upgrade to ${selectedPlan.name}`,
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          // 3. Verify signature on server
          try {
            const verifyRes = await fetch("/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.verified) {
              setStatus({
                type: "success",
                message: `✅ Payment verified successfully! Transaction ID: ${response.razorpay_payment_id}`,
              });
            } else {
              setStatus({
                type: "error",
                message: `❌ Payment verification failed: ${verifyData.error || "Signature mismatch."}`,
              });
            }
          } catch (verifyErr: any) {
            console.error("Verification Error:", verifyErr);
            setStatus({
              type: "error",
              message: "❌ Error connecting to server during payment verification.",
            });
          }
        },
        prefill: {
          name: user?.displayName || "Test User",
          email: user?.email || "test.user@skillhunter.dev",
          contact: "9999999999",
        },
        readonly: {
          contact: true,
          email: true,
        },
        theme: {
          color: "#2563eb",
        },
        modal: {
          ondismiss: function () {
            setStatus({
              type: "info",
              message: "ℹ️ Payment checkout dialog was closed.",
            });
          },
        },
      };

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay SDK script not loaded yet. Please wait a moment or refresh the page."
        );
      }

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        setStatus({
          type: "error",
          message: `❌ Payment failed: ${response.error?.description || "Transaction declined."}`,
        });
      });

      rzp.open();
    } catch (err: any) {
      console.error("Payment Flow Error:", err);
      setStatus({
        type: "error",
        message: `❌ ${err.message || "An unexpected error occurred."}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="min-h-screen bg-slate-950 text-slate-100">
        <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
          <div className="container-shell flex h-16 items-center justify-between">
            <BrandLogo />
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </header>

        <main className="container-shell py-12 max-w-4xl">
          <div className="text-center space-y-3">
            <span className="pill inline-flex bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold px-3 py-1">
              Secure Checkout · Razorpay Test Gateway
            </span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold">
              Upgrade Your Skill Hunter Plan
            </h1>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              Unlock unlimited AI ATS score improvements, automated job matching, and premium resume formatting tools.
            </p>
          </div>

          {/* Test credentials banner */}
          <div className="mt-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed">
            <p className="font-semibold text-amber-300">🧪 Razorpay Test Mode Guide:</p>
            <ul className="mt-1 list-disc list-inside space-y-0.5 opacity-90">
              <li><strong>Test Card:</strong> 4111 1111 1111 1111 (Any future expiry, CVV: 123)</li>
              <li><strong>Test UPI:</strong> success@razorpay</li>
              <li>Ensure key variables are configured in your <code className="bg-amber-900/50 px-1 py-0.5 rounded text-white">.env.local</code> file.</li>
            </ul>
          </div>

          {/* Status banner */}
          {status && (
            <div
              className={`mt-6 p-4 rounded-xl border text-sm transition font-medium ${
                status.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  : status.type === "error"
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  : "bg-sky-500/10 border-sky-500/30 text-sky-300"
              }`}
            >
              {status.message}
            </div>
          )}

          {/* Plan selection grid */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan.id === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`cursor-pointer rounded-2xl p-6 border transition-all relative ${
                    isSelected
                      ? "border-blue-500 bg-blue-950/30 shadow-lg shadow-blue-500/10 ring-2 ring-blue-500/50"
                      : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-4 right-4 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Selected
                    </span>
                  )}
                  <h3 className="font-heading text-xl font-bold">{plan.name}</h3>
                  <p className="mt-1 text-xs text-slate-400">{plan.description}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">₹{plan.price}</span>
                    <span className="text-xs text-slate-400">/ one-time test</span>
                  </div>

                  <ul className="mt-5 space-y-2 text-xs text-slate-300">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Checkout Action Button */}
          <div className="mt-8 text-center bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur">
            <p className="text-sm text-slate-300">
              Total Amount: <span className="font-bold text-white text-lg">₹{selectedPlan.price} INR</span>
            </p>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="mt-4 w-full sm:w-auto min-w-[240px] px-8 py-3.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing Order...
                </span>
              ) : (
                `Pay ₹${selectedPlan.price} with Razorpay`
              )}
            </button>

            <p className="mt-3 text-[11px] text-slate-500">
              🔒 Encrypted 256-bit payment transaction powered by Razorpay.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
