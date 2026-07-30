import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "./supabase";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  provider: "email" | "phone" | "google" | "facebook";
}

let currentUser: AuthUser | null = null;
const AUTH_EVENT = "amelie-auth-updated";

const providerFromUser = (user: User): AuthUser["provider"] => {
  const provider = user.app_metadata?.provider || user.identities?.[0]?.provider;
  if (provider === "phone") return "phone";
  if (provider === "google") return "google";
  if (provider === "facebook") return "facebook";
  return "email";
};

export const authUserFromSupabase = (user: User | null): AuthUser | null => {
  if (!user) return null;
  const metadata = user.user_metadata || {};
  const fullName = String(metadata.full_name || metadata.name || "").trim().split(/\s+/).filter(Boolean);
  return {
    id: user.id,
    email: user.email || "",
    firstName: String(metadata.first_name || fullName[0] || ""),
    lastName: String(metadata.last_name || fullName.slice(1).join(" ") || ""),
    phone: user.phone || String(metadata.phone || ""),
    provider: providerFromUser(user),
  };
};

const requireSupabase = () => {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase Authentication is not configured for this storefront.");
  return supabase;
};

const publishUser = (user: User | null) => {
  currentUser = authUserFromSupabase(user);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(AUTH_EVENT));
  return currentUser;
};

export const readSession = () => currentUser;

export const initializeAuth = async () => {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return publishUser(data.session?.user || null);
};

export const subscribeToAuth = (callback: (user: AuthUser | null, event: AuthChangeEvent) => void) => {
  if (!supabase) return () => undefined;
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    const user = publishUser(session?.user || null);
    callback(user, event);
  });
  return () => data.subscription.unsubscribe();
};

export const authEventName = AUTH_EVENT;

export const getAccessToken = async () => {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token || null;
};

export const signUpWithEmail = async (email: string, password: string, firstName: string, lastName: string) => {
  const client = requireSupabase();
  const { data, error } = await client.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { first_name: firstName.trim(), last_name: lastName.trim(), full_name: `${firstName.trim()} ${lastName.trim()}`.trim() } },
  });
  if (error) throw error;
  return publishUser(data.user);
};

export const signInWithEmail = async (email: string, password: string) => {
  const client = requireSupabase();
  const { data, error } = await client.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
  if (error) throw error;
  return publishUser(data.user);
};

export const requestPhoneOtp = async (phone: string) => {
  const client = requireSupabase();
  const { error } = await client.auth.signInWithOtp({ phone: phone.trim() });
  if (error) throw error;
};

export const verifyPhoneOtp = async (phone: string, otp: string) => {
  const client = requireSupabase();
  const { data, error } = await client.auth.verifyOtp({ phone: phone.trim(), token: otp.trim(), type: "sms" });
  if (error) throw error;
  return publishUser(data.user);
};

export const signInWithOAuth = async (provider: "google" | "facebook") => {
  const client = requireSupabase();
  const { error } = await client.auth.signInWithOAuth({ provider, options: { redirectTo: `${window.location.origin}/auth/callback` } });
  if (error) throw error;
};

export const signOut = async () => {
  const client = requireSupabase();
  const { error } = await client.auth.signOut();
  if (error) throw error;
  publishUser(null);
};
