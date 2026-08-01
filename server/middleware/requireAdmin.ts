import type { RequestHandler } from "express";
import { getSupabaseUserId } from "../lib/supabase";

const adminEmails = () =>
  (process.env.CMS_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const getRequestUserEmail = async (authorization?: string) => {
  if (!authorization?.startsWith("Bearer ") || !process.env.SUPABASE_URL) return null;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!key) return null;
  const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: key, Authorization: authorization },
  });
  if (!response.ok) return null;
  const user = (await response.json()) as { email?: string };
  return user.email?.toLowerCase() ?? null;
};

export const requireAdmin: RequestHandler = async (req, res, next) => {
  const allowed = adminEmails();
  if (!allowed.length) {
    res.status(503).json({ message: "CMS admin access is not configured. Set CMS_ADMIN_EMAILS in .env." });
    return;
  }
  const userId = await getSupabaseUserId(req.headers.authorization);
  if (!userId) {
    res.status(401).json({ message: "Sign in required." });
    return;
  }
  const email = await getRequestUserEmail(req.headers.authorization);
  if (!email || !allowed.includes(email)) {
    res.status(403).json({ message: "You do not have CMS admin access." });
    return;
  }
  next();
};

export const handleAdminMe: RequestHandler = async (req, res) => {
  const email = await getRequestUserEmail(req.headers.authorization);
  const allowed = adminEmails();
  if (!email || !allowed.includes(email)) {
    res.status(403).json({ message: "Forbidden", isAdmin: false });
    return;
  }
  res.json({ email, isAdmin: true });
};
