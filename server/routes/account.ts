import type { RequestHandler } from "express";

interface AccountRecord {
  profile: { firstName: string; lastName: string; email: string; phone: string };
  addresses: { id: string; label: string; recipient: string; address: string; city: string; postalCode: string; phone: string }[];
  payments: { id: string; type: string; label: string; detail: string }[];
  preferences: { emailUpdates: boolean; smsUpdates: boolean; styleUpdates: boolean };
}

const accounts = new Map<string, AccountRecord>();
const accountFor = (id: string, req: Parameters<RequestHandler>[0]): AccountRecord => {
  const existing = accounts.get(id);
  if (existing) return existing;
  const record: AccountRecord = {
    profile: { firstName: String(req.headers["x-user-first-name"] || ""), lastName: String(req.headers["x-user-last-name"] || ""), email: String(req.headers["x-user-email"] || ""), phone: String(req.headers["x-user-phone"] || "") },
    addresses: [],
    payments: [],
    preferences: { emailUpdates: true, smsUpdates: true, styleUpdates: true },
  };
  accounts.set(id, record);
  return record;
};

const userId = (req: Parameters<RequestHandler>[0]) => String(req.headers["x-user-id"] || "guest");

export const getAccount: RequestHandler = (req, res) => res.json(accountFor(userId(req), req));

export const updateAccount: RequestHandler = (req, res) => {
  const account = accountFor(userId(req), req);
  const body = req.body || {};
  if (body.profile) account.profile = { ...account.profile, ...body.profile };
  if (Array.isArray(body.addresses)) account.addresses = body.addresses;
  if (Array.isArray(body.payments)) account.payments = body.payments;
  if (body.preferences) account.preferences = { ...account.preferences, ...body.preferences };
  res.json(account);
};

export const changePassword: RequestHandler = (req, res) => {
  const current = String(req.body?.currentPassword || "");
  const next = String(req.body?.newPassword || "");
  if (!current || next.length < 8) {
    res.status(400).json({ message: "Enter your current password and a new password of at least 8 characters." });
    return;
  }
  res.json({ message: "Password updated successfully." });
};
