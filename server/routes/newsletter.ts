import { RequestHandler } from "express";
import { insertSupabaseRow } from "../lib/supabase";

export const handleNewsletterSubscribe: RequestHandler = async (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ message: "Enter a valid email address." });
    return;
  }

  try {
    await insertSupabaseRow("newsletter_subscribers", { email });
    res.status(200).json({ message: "Welcome to the Amelie Milano Club.", alreadySubscribed: false });
  } catch (error) {
    if (error instanceof Error && error.message.includes("status 409")) {
      res.status(200).json({ message: "You are already part of the Amelie Milano Club.", alreadySubscribed: true });
      return;
    }
    res.status(503).json({ message: "We could not complete your subscription right now." });
  }
};
