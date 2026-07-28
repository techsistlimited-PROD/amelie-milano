import type { RequestHandler } from "express";
import { getSupabaseUserId } from "../lib/supabase";

const wishlists = new Map<string, unknown[]>();

const userId = async (req: Parameters<RequestHandler>[0]) => getSupabaseUserId(req.headers.authorization);

export const getWishlist: RequestHandler = async (req, res) => {
  const id = await userId(req);
  if (!id) { res.status(401).json({ message: "Authentication required." }); return; }
  res.json(wishlists.get(id) || []);
};

export const saveWishlist: RequestHandler = async (req, res) => {
  const id = await userId(req);
  if (!id) { res.status(401).json({ message: "Authentication required." }); return; }
  if (!Array.isArray(req.body?.items)) { res.status(400).json({ message: "Invalid wishlist." }); return; }
  wishlists.set(id, req.body.items);
  res.json(req.body.items);
};
