export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  colour: string;
  option: string;
  quantity: number;
}

const CART_KEY = "amelie-milano-cart";
const CART_EVENT = "amelie-cart-updated";

export const readCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const writeCart = (items: CartItem[]) => {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
};

export const addToCart = (item: CartItem) => {
  const items = readCart();
  const existing = items.find((entry) => entry.id === item.id && entry.option === item.option && entry.colour === item.colour);
  if (existing) existing.quantity += item.quantity;
  else items.push(item);
  writeCart(items);
};

export const cartItemCount = (items: CartItem[]) => items.reduce((sum, item) => sum + item.quantity, 0);
export const cartSubtotal = (items: CartItem[]) => items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const cartEventName = CART_EVENT;
