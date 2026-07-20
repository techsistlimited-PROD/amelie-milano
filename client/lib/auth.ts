export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  provider: "email" | "phone" | "google" | "facebook";
}

const SESSION_KEY = "amelie-milano-session";
const ACCOUNTS_KEY = "amelie-milano-accounts";
const OTP_KEY = "amelie-milano-otp";

const readAccounts = (): Record<string, { user: AuthUser; password: string }> => {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(ACCOUNTS_KEY) || "{}"); } catch { return {}; }
};

export const readSession = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; }
};

const saveSession = (user: AuthUser) => {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("amelie-auth-updated"));
  return user;
};

export const signUpWithEmail = (email: string, password: string, firstName: string, lastName: string) => {
  const accounts = readAccounts();
  const key = email.trim().toLowerCase();
  if (accounts[key]) throw new Error("An account with this email already exists.");
  const user: AuthUser = { id: `email-${Date.now()}`, email: key, firstName: firstName.trim(), lastName: lastName.trim(), phone: "", provider: "email" };
  accounts[key] = { user, password };
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  return saveSession(user);
};

export const signInWithEmail = (email: string, password: string) => {
  const account = readAccounts()[email.trim().toLowerCase()];
  if (!account || account.password !== password) throw new Error("Incorrect email or password.");
  return saveSession(account.user);
};

export const requestPhoneOtp = (phone: string) => {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  window.localStorage.setItem(OTP_KEY, JSON.stringify({ phone, otp, expiresAt: Date.now() + 5 * 60 * 1000 }));
};

export const verifyPhoneOtp = (phone: string, otp: string) => {
  let record: { phone: string; otp: string; expiresAt: number } | null = null;
  try { record = JSON.parse(window.localStorage.getItem(OTP_KEY) || "null"); } catch { record = null; }
  if (!record || record.phone !== phone || record.otp !== otp || record.expiresAt < Date.now()) throw new Error("That OTP is invalid or has expired.");
  const user: AuthUser = { id: `phone-${phone}`, email: "", firstName: "", lastName: "", phone, provider: "phone" };
  window.localStorage.removeItem(OTP_KEY);
  return saveSession(user);
};

export const continueAsGuest = () => {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(null));
  window.dispatchEvent(new Event("amelie-auth-updated"));
};

export const signInWithOAuth = (provider: "google" | "facebook") => {
  throw new Error(`${provider === "google" ? "Google" : "Facebook"} OAuth is not configured for this storefront.`);
};
