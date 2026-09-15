export interface CreateOrderParams {
  amount: number; // In base currency unit (e.g. 499 for ₹499)
  currency?: string; // Default 'INR'
  receipt?: string;
  notes?: Record<string, string>;
}

export interface PaymentOrder {
  id: string;
  amount: number; // In smallest currency unit (e.g. 49900 paise)
  currency: string;
  receipt: string;
  provider: string;
  providerData?: Record<string, any>;
}

export interface VerifyPaymentParams {
  orderId: string;
  paymentId: string;
  signature: string;
  provider?: string;
}

export interface VerifyPaymentResult {
  verified: boolean;
  error?: string;
  transactionId?: string;
}

export interface PaymentProvider {
  readonly name: string;
  createOrder(params: CreateOrderParams): Promise<PaymentOrder>;
  verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult>;
}
