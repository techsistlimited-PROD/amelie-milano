import type { OrderRecord } from "./orders";

export type PaymentState = "pending" | "initiated" | "successful" | "failed" | "cancelled";

export interface PaymentInitiationResponse {
  transactionId: string;
  state: PaymentState;
  redirectUrl: string;
}

export const initiatePayment = async (order: OrderRecord, userId = "guest") => {
  const response = await fetch("/api/payments/initiate", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-user-id": userId },
    body: JSON.stringify({
      orderNumber: order.number,
      amount: order.total,
      customer: {
        firstName: order.address.firstName,
        lastName: order.address.lastName,
        email: order.address.email,
        phone: order.address.phone,
      },
      address: {
        address: order.address.address,
        city: order.address.city,
        postalCode: order.address.postalCode,
      },
      method: order.payment,
    }),
  });
  const payload = await response.json() as PaymentInitiationResponse & { message?: string };
  if (!response.ok) throw new Error(payload.message || "Unable to start payment.");
  return payload;
};

export const paymentStateLabel = (state: PaymentState) => ({
  pending: "Payment pending",
  initiated: "Redirecting to secure payment",
  successful: "Payment successful",
  failed: "Payment failed",
  cancelled: "Payment cancelled",
}[state]);
