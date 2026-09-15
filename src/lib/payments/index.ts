import { RazorpayPaymentProvider } from "./providers/razorpay.provider";
import { PaymentProvider } from "./types";

export * from "./types";
export { RazorpayPaymentProvider };

const registry: Record<string, PaymentProvider> = {
  razorpay: new RazorpayPaymentProvider(),
};

/**
 * Register a custom payment provider (e.g., Stripe, PayPal)
 */
export function registerPaymentProvider(provider: PaymentProvider) {
  registry[provider.name.toLowerCase()] = provider;
}

/**
 * Get the configured payment provider. Defaults to 'razorpay' or env.PAYMENT_PROVIDER
 */
export function getPaymentProvider(providerName?: string): PaymentProvider {
  const target = (
    providerName ||
    process.env.PAYMENT_PROVIDER ||
    "razorpay"
  ).toLowerCase();

  const provider = registry[target];
  if (!provider) {
    throw new Error(
      `Payment provider '${target}' is not registered. Available providers: ${Object.keys(
        registry
      ).join(", ")}`
    );
  }

  return provider;
}
