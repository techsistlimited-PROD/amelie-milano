import type { RequestHandler } from "express";
import { getSupabaseUserId } from "../lib/supabase";

const orders = new Map<string, unknown[]>();

export type OrderStatus = "Pending" | "Confirmed" | "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled" | "Returned";

export const updateOrderStatus = (orderNumber: string, status: OrderStatus, paymentState?: string, transactionId?: string) => {
  for (const records of orders.values()) {
    const order = records.find((item: any) => item.number === orderNumber) as any;
    if (order) {
      order.status = status;
      if (paymentState) order.paymentState = paymentState;
      if (transactionId) order.paymentTransactionId = transactionId;
      return order;
    }
  }
  return null;
};

const accountId = async (req: Parameters<RequestHandler>[0]) => {
  const authorization = req.headers.authorization;
  if (authorization) return await getSupabaseUserId(authorization);
  return "guest";
};

export const listOrders: RequestHandler = async (req, res) => {
  const id = await accountId(req);
  if (!id) { res.status(401).json({ message: "Authentication required." }); return; }
  res.json(orders.get(id) || []);
};

export const requestReturn: RequestHandler = async (req, res) => {
  const id = await accountId(req);
  if (!id) { res.status(401).json({ message: "Authentication required." }); return; }
  const existing = orders.get(id) || [];
  const order = existing.find((item: any) => item.number === req.params.number) as any;
  if (!order) { res.status(404).json({ message: "Order not found." }); return; }
  order.returnRequested = true;
  order.status = "Returned";
  res.json(order);
};

export const claimGuestOrders: RequestHandler = async (req, res) => {
  const id = await getSupabaseUserId(req.headers.authorization);
  if (!id) { res.status(401).json({ message: "Authentication required." }); return; }
  const incoming = Array.isArray(req.body?.orders) ? req.body.orders : [];
  const existing = orders.get(id) || [];
  const claimed = incoming.filter((item: any) => item?.number && Array.isArray(item.items) && typeof item.total === "number").map((item: any) => ({ ...item, customerId: id }));
  orders.set(id, [...claimed, ...existing.filter((item: any) => !claimed.some((entry: any) => entry.number === item.number))]);
  res.json(orders.get(id));
};

export const createOrder: RequestHandler = async (req, res) => {
  const id = await accountId(req);
  if (!id) { res.status(401).json({ message: "Authentication required." }); return; }
  const record = { ...req.body, status: req.body?.status || "Pending", paymentState: req.body?.paymentState || "pending", customerId: id === "guest" ? null : id };
  if (!record?.number || !Array.isArray(record.items) || typeof record.total !== "number") {
    res.status(400).json({ message: "Invalid order record." });
    return;
  }
  const existing = orders.get(id) || [];
  orders.set(id, [record, ...existing.filter((item: any) => item.number !== record.number)]);
  res.status(201).json(record);
};
