import type { RequestHandler } from "express";
import { getSupabaseUserId, supabaseRequest } from "../lib/supabase";

const localOrders = new Map<string, unknown[]>();
const commerceConfigured = () => Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));

export type OrderStatus = "Pending" | "Confirmed" | "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled" | "Returned";

const accountId = async (req: Parameters<RequestHandler>[0]) => {
  const authorization = req.headers.authorization;
  if (authorization) return await getSupabaseUserId(authorization);
  return "guest";
};

const localList = (id: string) => localOrders.get(id) || [];

export const updateOrderStatus = async (orderNumber: string, status: OrderStatus, paymentState?: string, transactionId?: string) => {
  if (commerceConfigured()) {
    const patch: Record<string, unknown> = { status };
    if (paymentState) patch.payment_state = paymentState;
    await supabaseRequest(`commerce_orders?order_number=eq.${encodeURIComponent(orderNumber)}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify(patch) });
    return;
  }
  for (const records of localOrders.values()) {
    const order = records.find((item: any) => item.number === orderNumber) as any;
    if (order) { order.status = status; if (paymentState) order.paymentState = paymentState; if (transactionId) order.paymentTransactionId = transactionId; return; }
  }
};

const toClientOrder = (order: any, items: any[] = []) => ({
  number: order.order_number,
  createdAt: order.created_at,
  items: items.map((item) => ({ id: item.product_slug, name: item.title, price: Number(item.unit_price), image: item.image || "/placeholder.svg", category: "", colour: "Signature", option: item.option || "", quantity: item.quantity })),
  address: order.shipping_address,
  delivery: order.delivery_method,
  payment: order.payment_method,
  status: order.status,
  paymentState: order.payment_state,
  subtotal: Number(order.subtotal),
  discount: 0,
  shipping: Number(order.shipping),
  tax: Number(order.tax),
  total: Number(order.total),
});

export const listOrders: RequestHandler = async (req, res) => {
  const id = await accountId(req);
  if (!id) { res.status(401).json({ message: "Authentication required." }); return; }
  if (!commerceConfigured()) { res.json(localList(id)); return; }
  if (id === "guest") { res.json([]); return; }
  try {
    const orders = await supabaseRequest<any[]>(`commerce_orders?customer_id=eq.${id}&select=*&order=created_at.desc`);
    const result = await Promise.all(orders.map(async (order) => {
      const items = await supabaseRequest<any[]>(`commerce_order_items?order_id=eq.${order.id}&select=*`);
      return toClientOrder(order, items);
    }));
    res.json(result);
  } catch { res.status(503).json({ message: "Unable to load orders." }); }
};

export const requestReturn: RequestHandler = async (req, res) => {
  const id = await accountId(req);
  if (!id || id === "guest") { res.status(401).json({ message: "Authentication required." }); return; }
  if (!commerceConfigured()) {
    const order = localList(id).find((item: any) => item.number === req.params.number) as any;
    if (!order) { res.status(404).json({ message: "Order not found." }); return; }
    order.returnRequested = true; order.status = "Returned"; res.json(order); return;
  }
  try {
    const orders = await supabaseRequest<any[]>(`commerce_orders?order_number=eq.${encodeURIComponent(req.params.number)}&customer_id=eq.${id}&select=id,order_number,status`);
    if (!orders[0]) { res.status(404).json({ message: "Order not found." }); return; }
    await supabaseRequest("commerce_returns", { method: "POST", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ order_id: orders[0].id, customer_id: id }) });
    await supabaseRequest(`commerce_orders?id=eq.${orders[0].id}`, { method: "PATCH", headers: { Prefer: "return=minimal" }, body: JSON.stringify({ status: "Returned" }) });
    res.json({ ...orders[0], status: "Returned", returnRequested: true });
  } catch { res.status(503).json({ message: "Unable to start the return request." }); }
};

export const claimGuestOrders: RequestHandler = async (req, res) => {
  const id = await getSupabaseUserId(req.headers.authorization);
  if (!id) { res.status(401).json({ message: "Authentication required." }); return; }
  const incoming = Array.isArray(req.body?.orders) ? req.body.orders : [];
  if (!commerceConfigured()) { const existing = localList(id); const claimed = incoming.filter((item: any) => item?.number).map((item: any) => ({ ...item, customerId: id })); localOrders.set(id, [...claimed, ...existing]); res.json(localOrders.get(id)); return; }
  try {
    const claimed = [];
    for (const item of incoming) {
      const result = await supabaseRequest<any>("rpc/create_order_with_inventory", { method: "POST", body: JSON.stringify({ p_order_number: item.number, p_customer_id: id, p_guest_email: null, p_guest_phone: null, p_delivery_method: item.delivery, p_payment_method: item.payment, p_shipping_address: item.address, p_items: item.items.map((entry: any) => ({ product_slug: entry.id, option: entry.option, quantity: entry.quantity })) }) });
      claimed.push(result);
    }
    res.json(claimed);
  } catch { res.status(503).json({ message: "Unable to attach guest orders to your account." }); }
};

export const createOrder: RequestHandler = async (req, res) => {
  const id = await accountId(req);
  if (!id) { res.status(401).json({ message: "Authentication required." }); return; }
  const record = req.body || {};
  if (!record.number || !Array.isArray(record.items) || !record.address?.email || !record.delivery || !record.payment) { res.status(400).json({ message: "Invalid order record." }); return; }
  if (!commerceConfigured()) {
    const local = { ...record, status: "Pending", paymentState: "pending", customerId: id === "guest" ? null : id };
    const existing = localList(id); localOrders.set(id, [local, ...existing.filter((item: any) => item.number !== local.number)]); res.status(201).json(local); return;
  }
  try {
    if (id !== "guest") await supabaseRequest("customers", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ id, email: record.address.email, first_name: record.address.firstName || "", last_name: record.address.lastName || "", phone: record.address.phone || "" }) });
    const result = await supabaseRequest<any>("rpc/create_order_with_inventory", { method: "POST", body: JSON.stringify({ p_order_number: record.number, p_customer_id: id === "guest" ? null : id, p_guest_email: id === "guest" ? record.address.email : null, p_guest_phone: id === "guest" ? record.address.phone : null, p_delivery_method: record.delivery, p_payment_method: record.payment, p_shipping_address: record.address, p_items: record.items.map((item: any) => ({ product_slug: item.id, option: item.option, quantity: item.quantity })) }) });
    res.status(201).json({ ...record, ...result, number: result.order_number });
  } catch (error) { res.status(503).json({ message: error instanceof Error ? error.message : "Unable to create order." }); }
};
