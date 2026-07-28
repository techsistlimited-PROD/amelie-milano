import type { RequestHandler } from "express";
import { getSupabaseUserId, supabaseRequest } from "../lib/supabase";

const localWishlists = new Map<string, unknown[]>();
const commerceConfigured = () => Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));
const userId = async (req: Parameters<RequestHandler>[0]) => getSupabaseUserId(req.headers.authorization);

export const getWishlist: RequestHandler = async (req, res) => {
  const id = await userId(req);
  if (!id) { res.status(401).json({ message: "Authentication required." }); return; }
  if (!commerceConfigured()) { res.json(localWishlists.get(id) || []); return; }
  try {
    const rows = await supabaseRequest<any[]>(`customer_wishlists?customer_id=eq.${id}&select=item,product_slug`);
    res.json(rows.map((row) => row.item));
  } catch { res.status(503).json({ message: "Unable to load wishlist." }); }
};

export const saveWishlist: RequestHandler = async (req, res) => {
  const id = await userId(req);
  if (!id) { res.status(401).json({ message: "Authentication required." }); return; }
  if (!Array.isArray(req.body?.items)) { res.status(400).json({ message: "Invalid wishlist." }); return; }
  if (!commerceConfigured()) { localWishlists.set(id, req.body.items); res.json(req.body.items); return; }
  try {
    await supabaseRequest(`customer_wishlists?customer_id=eq.${id}`, { method: "DELETE" });
    for (const item of req.body.items) await supabaseRequest("customer_wishlists", { method: "POST", body: JSON.stringify({ customer_id: id, product_slug: item.id, item }) });
    res.json(req.body.items);
  } catch { res.status(503).json({ message: "Unable to save wishlist." }); }
};
