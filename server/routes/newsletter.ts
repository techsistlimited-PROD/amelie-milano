import type { RequestHandler } from "express";

const subscribers = new Set<string>();

export const handleNewsletterSubscribe: RequestHandler = (req, res) => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ message: "Enter a valid email address." });
    return;
  }
  const alreadySubscribed = subscribers.has(email);
  subscribers.add(email);
  res.status(200).json({ message: alreadySubscribed ? "You are already part of the Amelie Milano Club." : "Welcome to the Amelie Milano Club.", alreadySubscribed });
};
