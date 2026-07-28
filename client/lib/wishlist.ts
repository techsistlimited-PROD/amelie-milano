import { useEffect, useState } from "react";
import { getAccessToken } from "./auth";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  colour: string;
  option: string;
}

const WISHLIST_KEY = "amelie-milano-wishlist";
const WISHLIST_EVENT = "amelie-wishlist-updated";

export const readWishlist = (): WishlistItem[] => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(WISHLIST_KEY) || "[]"); } catch { return []; }
};

const writeWishlist = (items: WishlistItem[]) => {
  window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(WISHLIST_EVENT));
};

export const isWishlisted = (id: string) => readWishlist().some((item) => item.id === id);
export const removeFromWishlist = (id: string) => writeWishlist(readWishlist().filter((item) => item.id !== id));
export const toggleWishlist = (item: WishlistItem) => {
  const items = readWishlist();
  const next = items.some((entry) => entry.id === item.id) ? items.filter((entry) => entry.id !== item.id) : [...items, item];
  writeWishlist(next);
  return next.some((entry) => entry.id === item.id);
};
export const wishlistEventName = WISHLIST_EVENT;

export const syncWishlist = async () => {
  const token = await getAccessToken();
  if (!token) return readWishlist();
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
  const response = await fetch("/api/wishlist", { headers });
  if (!response.ok) throw new Error("Unable to load wishlist.");
  const remote = await response.json() as WishlistItem[];
  const merged = [...remote, ...readWishlist().filter((item) => !remote.some((entry) => entry.id === item.id))];
  const saved = await fetch("/api/wishlist", { method: "PUT", headers, body: JSON.stringify({ items: merged }) });
  if (!saved.ok) throw new Error("Unable to save wishlist.");
  writeWishlist(merged);
  return merged;
};

export const useWishlist = (item: WishlistItem) => {
  const [saved, setSaved] = useState(() => isWishlisted(item.id));
  useEffect(() => {
    const sync = () => setSaved(isWishlisted(item.id));
    window.addEventListener(WISHLIST_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(WISHLIST_EVENT, sync); window.removeEventListener("storage", sync); };
  }, [item.id]);
  return { saved, toggle: () => setSaved(toggleWishlist(item)) };
};
