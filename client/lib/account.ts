import type { AuthUser } from "@/lib/auth";

export interface AccountAddress { id: string; label: string; recipient: string; address: string; city: string; postalCode: string; phone: string; }
export interface PaymentMethod { id: string; type: string; label: string; detail: string; }
export interface AccountData { profile: { firstName: string; lastName: string; email: string; phone: string }; addresses: AccountAddress[]; payments: PaymentMethod[]; preferences: { emailUpdates: boolean; smsUpdates: boolean; styleUpdates: boolean }; }

const accountKey = (userId: string) => `amelie-milano-account-${userId}`;
const defaultAccount = (user: AuthUser | null): AccountData => ({ profile: { firstName: user?.firstName || "", lastName: user?.lastName || "", email: user?.email || "", phone: user?.phone || "" }, addresses: [], payments: [], preferences: { emailUpdates: true, smsUpdates: true, styleUpdates: true } });

export const readLocalAccount = (user: AuthUser | null) => {
  if (!user || typeof window === "undefined") return defaultAccount(user);
  try { return { ...defaultAccount(user), ...JSON.parse(window.localStorage.getItem(accountKey(user.id)) || "{}") }; } catch { return defaultAccount(user); }
};

const headersFor = (user: AuthUser) => ({ "Content-Type": "application/json", "x-user-id": user.id, "x-user-email": user.email, "x-user-first-name": user.firstName, "x-user-last-name": user.lastName, "x-user-phone": user.phone });

export const loadAccount = async (user: AuthUser) => {
  const local = readLocalAccount(user);
  try { const response = await fetch("/api/account", { headers: headersFor(user) }); if (!response.ok) throw new Error("Unable to load account."); const remote = await response.json() as AccountData; const merged = { ...local, ...remote, profile: { ...local.profile, ...remote.profile }, addresses: remote.addresses.length ? remote.addresses : local.addresses, payments: remote.payments.length ? remote.payments : local.payments, preferences: { ...local.preferences, ...remote.preferences } }; window.localStorage.setItem(accountKey(user.id), JSON.stringify(merged)); return merged; } catch { return local; }
};

export const saveAccount = async (user: AuthUser, account: AccountData) => {
  window.localStorage.setItem(accountKey(user.id), JSON.stringify(account));
  const response = await fetch("/api/account", { method: "PUT", headers: headersFor(user), body: JSON.stringify(account) });
  if (!response.ok) throw new Error("Unable to save account changes.");
  return account;
};

export const savePassword = async (user: AuthUser, currentPassword: string, newPassword: string) => {
  const response = await fetch("/api/account/password", { method: "PUT", headers: headersFor(user), body: JSON.stringify({ currentPassword, newPassword }) });
  const result = await response.json() as { message?: string };
  if (!response.ok) throw new Error(result.message || "Unable to update password.");
  return result.message || "Password updated successfully.";
};
