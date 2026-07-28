import type { CartItem } from "@/lib/cart";

export interface DeliveryAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface OrderTotals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface OrderRecord extends OrderTotals {
  number: string;
  createdAt: string;
  items: CartItem[];
  address: DeliveryAddress;
  delivery: "regular" | "express" | "store";
  payment: string;
  status?: "Pending" | "Confirmed" | "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled" | "Returned";
  paymentState?: "pending" | "initiated" | "successful" | "failed" | "cancelled";
  paymentTransactionId?: string;
  returnRequested?: boolean;
}

const ORDERS_KEY = "amelie-milano-orders";
const LAST_ORDER_KEY = "amelie-milano-last-order";

export const readOrders = (): OrderRecord[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const readLastOrder = (): OrderRecord | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(LAST_ORDER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const createOrder = (order: Omit<OrderRecord, "number" | "createdAt">): OrderRecord => {
  const now = new Date();
  const number = `AM-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const record = { ...order, number, createdAt: now.toISOString() };
  const orders = readOrders();
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify([record, ...orders]));
  window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(record));
  return record;
};

const orderHeaders = (userId = "guest") => ({ "Content-Type": "application/json", "x-user-id": userId });

export const syncOrder = async (order: OrderRecord, userId = "guest") => {
  const response = await fetch("/api/orders", { method: "POST", headers: orderHeaders(userId), body: JSON.stringify(order) });
  if (!response.ok) throw new Error("Unable to sync order with the order service.");
  return order;
};

export const fetchOrders = async (userId = "guest") => {
  const response = await fetch("/api/orders", { headers: orderHeaders(userId) });
  if (!response.ok) throw new Error("Unable to load orders.");
  return await response.json() as OrderRecord[];
};

export const requestOrderReturn = async (number: string, userId = "guest") => {
  const response = await fetch(`/api/orders/${encodeURIComponent(number)}/return`, { method: "PATCH", headers: orderHeaders(userId) });
  if (!response.ok) throw new Error("Unable to start the return request.");
  return await response.json() as OrderRecord;
};

export const orderTax = (subtotal: number, discount = 0) => Math.round(Math.max(0, subtotal - discount) * 0.05);
