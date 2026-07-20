import type { RequestHandler } from "express";

const orders = new Map<string, unknown[]>();
const accountId = (req: Parameters<RequestHandler>[0]) => String(req.headers["x-user-id"] || "guest");

export const listOrders: RequestHandler = (req, res) => res.json(orders.get(accountId(req)) || []);
export const requestReturn: RequestHandler = (req, res) => {
  const existing = orders.get(accountId(req)) || [];
  const order = existing.find((item: any) => item.number === req.params.number) as any;
  if (!order) { res.status(404).json({ message: "Order not found." }); return; }
  order.returnRequested = true;
  res.json(order);
};

export const createOrder: RequestHandler = (req, res) => {
  const record = req.body;
  if (!record?.number || !Array.isArray(record.items) || typeof record.total !== "number") {
    res.status(400).json({ message: "Invalid order record." });
    return;
  }
  const existing = orders.get(accountId(req)) || [];
  orders.set(accountId(req), [record, ...existing.filter((item: any) => item.number !== record.number)]);
  res.status(201).json(record);
};
