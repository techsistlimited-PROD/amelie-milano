import type { RequestHandler } from "express";
import { supabaseRequest } from "../lib/supabase";
import { updateOrderStatus, type OrderStatus } from "./orders";

export const PAYMENT_STATES = ["pending", "initiated", "successful", "failed", "cancelled"] as const;
export type PaymentState = (typeof PAYMENT_STATES)[number];
export type PaymentMethod = "card" | "bkash" | "net" | "qr" | "cod";

interface PaymentRecord {
  transactionId: string;
  orderNumber: string;
  method: PaymentMethod;
  state: PaymentState;
  amount: number;
  currency: string;
  provider: string;
  providerTransactionId?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentInitiationInput {
  orderNumber: string;
  amount: number;
  customer: { firstName: string; lastName: string; email: string; phone: string };
  address: { address: string; city: string; postalCode: string };
  method: PaymentMethod;
}

const payments = new Map<string, PaymentRecord>();
const paymentBaseUrl = () => process.env.SSLCOMMERZ_IS_LIVE === "true"
  ? "https://securepay.sslcommerz.com"
  : "https://sandbox.sslcommerz.com";
const publicBaseUrl = () => process.env.PUBLIC_SITE_URL || "http://localhost:5173";
const sslConfigured = () => Boolean(process.env.SSLCOMMERZ_STORE_ID && process.env.SSLCOMMERZ_STORE_PASSWORD);

const savePayment = async (payment: PaymentRecord) => {
  payments.set(payment.transactionId, payment);
  if (process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)) {
    try {
      const orders = await supabaseRequest<any[]>(`commerce_orders?order_number=eq.${encodeURIComponent(payment.orderNumber)}&select=id`);
      await supabaseRequest("payment_records", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          transaction_id: payment.transactionId,
          order_id: orders[0]?.id || null,
          order_number: payment.orderNumber,
          method: payment.method,
          state: payment.state,
          amount: payment.amount,
          currency: payment.currency,
          provider: payment.provider,
          provider_transaction_id: payment.providerTransactionId || null,
          failure_reason: payment.failureReason || null,
          created_at: payment.createdAt,
          updated_at: payment.updatedAt,
        }),
      });
    } catch (error) {
      if (process.env.NODE_ENV === "production" || !(error instanceof Error) || !error.message.includes("status 404")) throw error;
    }
  }
};

const paymentFor = async (transactionId: string) => {
  const cached = payments.get(transactionId);
  if (cached || !process.env.SUPABASE_URL) return cached;
  const rows = await supabaseRequest<any[]>(`payment_records?transaction_id=eq.${encodeURIComponent(transactionId)}&select=*`);
  const row = rows[0];
  if (!row) return undefined;
  const payment: PaymentRecord = { transactionId: row.transaction_id, orderNumber: row.order_number, method: row.method, state: row.state, amount: Number(row.amount), currency: row.currency, provider: row.provider, providerTransactionId: row.provider_transaction_id || undefined, failureReason: row.failure_reason || undefined, createdAt: row.created_at, updatedAt: row.updated_at };
  payments.set(transactionId, payment);
  return payment;
};

const updatePayment = async (transactionId: string, patch: Partial<PaymentRecord>) => {
  const existing = await paymentFor(transactionId);
  if (!existing) throw new Error("Payment transaction not found.");
  const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() };
  await savePayment(updated);
  const statusByPayment: Partial<Record<PaymentState, OrderStatus>> = {
    pending: "Pending",
    initiated: "Pending",
    successful: "Confirmed",
    failed: "Cancelled",
    cancelled: "Cancelled",
  };
  await updateOrderStatus(updated.orderNumber, statusByPayment[updated.state]!, updated.state, updated.transactionId);
  return updated;
};

const redirectFor = (orderNumber: string, state: PaymentState, reason?: string) => {
  const params = new URLSearchParams({ order: orderNumber, payment: state });
  if (reason) params.set("reason", reason);
  return `${publicBaseUrl()}/order-confirmation?${params.toString()}`;
};

const sslCommerzRequest = async (input: PaymentInitiationInput, transactionId: string) => {
  if (!sslConfigured()) throw new Error("SSLCommerz is not configured. Add SSLCOMMERZ_STORE_ID and SSLCOMMERZ_STORE_PASSWORD before enabling online payments.");
  const form = new URLSearchParams({
    store_id: process.env.SSLCOMMERZ_STORE_ID!,
    store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD!,
    total_amount: String(input.amount),
    currency: "BDT",
    tran_id: transactionId,
    success_url: `${publicBaseUrl()}/api/payments/sslcommerz/success`,
    fail_url: `${publicBaseUrl()}/api/payments/sslcommerz/fail`,
    cancel_url: `${publicBaseUrl()}/api/payments/sslcommerz/cancel`,
    ipn_url: `${publicBaseUrl()}/api/payments/sslcommerz/ipn`,
    product_name: "Amelie Milano order",
    product_category: "fashion",
    shipping_method: "YES",
    num_of_item: "1",
    cus_name: `${input.customer.firstName} ${input.customer.lastName}`.trim(),
    cus_email: input.customer.email,
    cus_phone: input.customer.phone,
    cus_add1: input.address.address,
    cus_city: input.address.city,
    cus_postcode: input.address.postalCode,
    cus_country: "Bangladesh",
    ship_name: `${input.customer.firstName} ${input.customer.lastName}`.trim(),
    ship_add1: input.address.address,
    ship_city: input.address.city,
    ship_postcode: input.address.postalCode,
    ship_country: "Bangladesh",
  });
  const response = await fetch(`${paymentBaseUrl()}/gwprocess/v4/api.php`, { method: "POST", body: form });
  if (!response.ok) throw new Error(`SSLCommerz initiation failed with status ${response.status}.`);
  const result = await response.json() as { GatewayPageURL?: string; status?: string; failedreason?: string };
  if (!result.GatewayPageURL) throw new Error(result.failedreason || "SSLCommerz did not return a payment URL.");
  return result.GatewayPageURL;
};

const verifySslCommerz = async (payload: Record<string, string>) => {
  if (!sslConfigured() || !payload.val_id) return false;
  const params = new URLSearchParams({
    val_id: payload.val_id,
    store_id: process.env.SSLCOMMERZ_STORE_ID!,
    store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD!,
    format: "json",
  });
  const response = await fetch(`${paymentBaseUrl()}/validator/api/validationserverAPI.php?${params.toString()}`);
  if (!response.ok) return false;
  const result = await response.json() as { status?: string; tran_id?: string; amount?: string; currency?: string };
  return ["VALID", "VALIDATED"].includes(result.status || "") && result.currency === "BDT";
};

const completeVerifiedPayment: RequestHandler = async (req, res) => {
  const payload = Object.fromEntries(Object.entries(req.body || {}).map(([key, value]) => [key, String(value)]));
  const transactionId = payload.tran_id || payload.value_a;
  const payment = transactionId ? await paymentFor(transactionId) : undefined;
  if (!payment) {
    res.redirect(redirectFor(payload.value_a || "", "failed", "Payment transaction not found."));
    return;
  }
  const verified = await verifySslCommerz(payload);
  const updated = await updatePayment(transactionId, {
    state: verified ? "successful" : "failed",
    providerTransactionId: payload.val_id,
    failureReason: verified ? undefined : "Transaction verification failed.",
  });
  res.redirect(redirectFor(updated.orderNumber, updated.state, updated.failureReason));
};

export const initiatePayment: RequestHandler = async (req, res) => {
  const input = req.body as PaymentInitiationInput;
  if (!input?.orderNumber || !input.customer?.email || !Number.isFinite(input.amount) || input.amount <= 0) {
    res.status(400).json({ message: "A valid order number, customer email, and amount are required." });
    return;
  }
  const method = input.method || "card";
  const now = new Date().toISOString();
  const transactionId = `${input.orderNumber}-${Date.now()}`;
  const base: PaymentRecord = { transactionId, orderNumber: input.orderNumber, method, state: "pending", amount: input.amount, currency: "BDT", provider: method === "cod" ? "cash_on_delivery" : "sslcommerz", createdAt: now, updatedAt: now };
  try {
    await savePayment(base);
    if (method === "cod") {
      const updated = await updatePayment(transactionId, { state: "successful" });
      res.json({ transactionId, state: updated.state, redirectUrl: redirectFor(input.orderNumber, updated.state) });
      return;
    }
    const gatewayUrl = await sslCommerzRequest(input, transactionId);
    const updated = await updatePayment(transactionId, { state: "initiated" });
    res.json({ transactionId, state: updated.state, redirectUrl: gatewayUrl });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unable to initiate payment.";
    await updatePayment(transactionId, { state: "failed", failureReason: reason }).catch(() => undefined);
    res.status(503).json({ message: reason });
  }
};

export const handlePaymentSuccess: RequestHandler = (req, res, next) => { void completeVerifiedPayment(req, res, next); };
export const handlePaymentFailure: RequestHandler = async (req, res) => {
  const payload = Object.fromEntries(Object.entries(req.body || {}).map(([key, value]) => [key, String(value)]));
  const payment = payload.tran_id ? await paymentFor(payload.tran_id) : undefined;
  if (payment) await updatePayment(payment.transactionId, { state: "failed", failureReason: "The payment provider declined the transaction." });
  res.redirect(redirectFor(payment?.orderNumber || "", "failed", "The payment provider declined the transaction."));
};
export const handlePaymentCancel: RequestHandler = async (req, res) => {
  const payload = Object.fromEntries(Object.entries(req.body || {}).map(([key, value]) => [key, String(value)]));
  const payment = payload.tran_id ? await paymentFor(payload.tran_id) : undefined;
  if (payment) await updatePayment(payment.transactionId, { state: "cancelled", failureReason: "Payment was cancelled by the customer." });
  res.redirect(redirectFor(payment?.orderNumber || "", "cancelled", "Payment was cancelled by the customer."));
};
export const handlePaymentIpn = completeVerifiedPayment;

export const getPayment: RequestHandler = (req, res) => {
  const payment = payments.get(req.params.transactionId);
  if (!payment) { res.status(404).json({ message: "Payment not found." }); return; }
  res.json(payment);
};
