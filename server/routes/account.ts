import type { RequestHandler } from "express";
import { getSupabaseUserId, supabaseRequest } from "../lib/supabase";

interface AccountRecord {
  profile: { firstName: string; lastName: string; email: string; phone: string };
  addresses: { id: string; label: string; recipient: string; address: string; city: string; postalCode: string; phone: string }[];
  payments: { id: string; type: string; label: string; detail: string }[];
  preferences: { emailUpdates: boolean; smsUpdates: boolean; styleUpdates: boolean };
}

const accounts = new Map<string, AccountRecord>();
const commerceConfigured = () => Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));
const accountFor = (id: string, req: Parameters<RequestHandler>[0]): AccountRecord => {
  const existing = accounts.get(id);
  if (existing) return existing;
  const record: AccountRecord = { profile: { firstName: String(req.headers["x-user-first-name"] || ""), lastName: String(req.headers["x-user-last-name"] || ""), email: String(req.headers["x-user-email"] || ""), phone: String(req.headers["x-user-phone"] || "") }, addresses: [], payments: [], preferences: { emailUpdates: true, smsUpdates: true, styleUpdates: true } };
  accounts.set(id, record);
  return record;
};

const authenticatedId = async (req: Parameters<RequestHandler>[0]) => getSupabaseUserId(req.headers.authorization);

const loadPersistentAccount = async (id: string, req: Parameters<RequestHandler>[0]) => {
  const customers = await supabaseRequest<any[]>(`customers?id=eq.${id}&select=*`);
  const customer = customers[0];
  const addresses = await supabaseRequest<any[]>(`customer_addresses?customer_id=eq.${id}&select=*`);
  return {
    profile: { firstName: customer?.first_name || String(req.headers["x-user-first-name"] || ""), lastName: customer?.last_name || String(req.headers["x-user-last-name"] || ""), email: customer?.email || String(req.headers["x-user-email"] || ""), phone: customer?.phone || String(req.headers["x-user-phone"] || "") },
    addresses: addresses.map((item) => ({ id: item.id, label: item.label, recipient: item.recipient, address: item.address, city: item.city, postalCode: item.postal_code, phone: item.phone })),
    payments: [],
    preferences: customer?.preferences || { emailUpdates: true, smsUpdates: true, styleUpdates: true },
  } satisfies AccountRecord;
};

export const getAccount: RequestHandler = async (req, res) => {
  const id = await authenticatedId(req);
  if (!id) { res.status(401).json({ message: "Authentication required." }); return; }
  try { res.json(commerceConfigured() ? await loadPersistentAccount(id, req) : accountFor(id, req)); } catch { res.status(503).json({ message: "Unable to load account." }); }
};

export const updateAccount: RequestHandler = async (req, res) => {
  const id = await authenticatedId(req);
  if (!id) { res.status(401).json({ message: "Authentication required." }); return; }
  const body = req.body || {};
  if (!commerceConfigured()) {
    const account = accountFor(id, req);
    if (body.profile) account.profile = { ...account.profile, ...body.profile };
    if (Array.isArray(body.addresses)) account.addresses = body.addresses;
    if (Array.isArray(body.payments)) account.payments = body.payments;
    if (body.preferences) account.preferences = { ...account.preferences, ...body.preferences };
    res.json(account); return;
  }
  try {
    const profile = body.profile || {};
    await supabaseRequest("customers", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" }, body: JSON.stringify({ id, email: profile.email, first_name: profile.firstName || "", last_name: profile.lastName || "", phone: profile.phone || "", preferences: body.preferences || undefined }) });
    if (Array.isArray(body.addresses)) {
      await supabaseRequest(`customer_addresses?customer_id=eq.${id}`, { method: "DELETE" });
      for (const address of body.addresses) await supabaseRequest("customer_addresses", { method: "POST", body: JSON.stringify({ customer_id: id, label: address.label, recipient: address.recipient, address: address.address, city: address.city, postal_code: address.postalCode, phone: address.phone }) });
    }
    res.json(await loadPersistentAccount(id, req));
  } catch { res.status(503).json({ message: "Unable to save account changes." }); }
};

export const changePassword: RequestHandler = async (req, res) => {
  const id = await authenticatedId(req);
  if (!id) { res.status(401).json({ message: "Authentication required." }); return; }
  const next = String(req.body?.newPassword || "");
  if (next.length < 8) { res.status(400).json({ message: "Enter a new password of at least 8 characters." }); return; }
  res.json({ message: "Password changes must be completed through Supabase Auth." });
};
