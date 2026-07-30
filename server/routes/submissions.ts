import { RequestHandler } from "express";
import { insertSupabaseRow } from "../lib/supabase";

const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const handleContactSubmission: RequestHandler = async (req, res) => {
  const name = text(req.body?.name);
  const email = text(req.body?.email).toLowerCase();
  const phone = text(req.body?.phone);
  const message = text(req.body?.message);
  if (!name || !emailPattern.test(email) || !phone || !message) {
    res.status(400).json({ message: "Complete all required contact fields." });
    return;
  }

  try {
    await insertSupabaseRow("contact_submissions", { name, email, phone, message });
    res.status(201).json({ message: "Your message has reached our team." });
  } catch {
    res.status(503).json({ message: "We could not send your message right now." });
  }
};

export const handleStyleConciergeSubmission: RequestHandler = async (req, res) => {
  const name = text(req.body?.name);
  const email = text(req.body?.email).toLowerCase();
  const phone = text(req.body?.phone);
  const occasion = text(req.body?.occasion);
  const budget = text(req.body?.budget);
  const notes = text(req.body?.notes);
  if (!name || !emailPattern.test(email) || !phone || !occasion) {
    res.status(400).json({ message: "Complete all required Style Concierge fields." });
    return;
  }

  try {
    await insertSupabaseRow("style_concierge_submissions", { name, email, phone, occasion, budget, notes });
    res.status(201).json({ message: "Your Style Concierge request has been received." });
  } catch {
    res.status(503).json({ message: "We could not submit your request right now." });
  }
};
