import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Minus, Plus, Tag, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { cartEventName, cartSubtotal, readCart, writeCart, type CartItem } from "@/lib/cart";

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener(cartEventName, sync);
    return () => window.removeEventListener(cartEventName, sync);
  }, []);

  const subtotal = useMemo(() => cartSubtotal(items), [items]);
  const shipping = subtotal >= 3000 || subtotal === 0 ? 0 : 150;
  const total = subtotal - discount + shipping;
  const updateQuantity = (index: number, change: number) => {
    const next = items.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: Math.max(1, item.quantity + change) } : item);
    setItems(next); writeCart(next);
  };
  const removeItem = (index: number) => {
    const next = items.filter((_, itemIndex) => itemIndex !== index);
    setItems(next); writeCart(next);
  };
  const applyCoupon = () => setDiscount(coupon.trim().toUpperCase() === "AMELIE10" ? Math.round(subtotal * 0.1) : 0);

  return <div className="min-h-screen bg-[#F9F5F1] text-stone-900"><Header /><main className="container mx-auto px-4 py-12 md:py-20"><Breadcrumbs items={[{ label: "Cart" }]} /><div className="max-w-6xl mx-auto"><div className="mb-10"><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">Your selection</p><h1 className="font-serif text-5xl md:text-6xl">My Cart</h1><p className="text-stone-600 mt-3">{items.length ? `${items.reduce((sum, item) => sum + item.quantity, 0)} pieces selected` : "Your considered wardrobe begins here."}</p></div>
    {items.length === 0 ? <div className="bg-white border border-stone-200 text-center px-6 py-20"><div className="mx-auto mb-6 h-14 w-14 rounded-full bg-[#F0E9E2] flex items-center justify-center"><Tag className="text-teal" /></div><h2 className="font-serif text-3xl mb-3">Your cart is waiting</h2><p className="text-stone-600 mb-8">Discover pieces designed for your most memorable moments.</p><Link to="/shop/new" className="btn-primary inline-flex items-center gap-2">Explore New Arrivals <ArrowRight size={16} /></Link></div> : <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start"><div className="space-y-4">{items.map((item, index) => <article key={`${item.id}-${item.option}-${item.colour}`} className="bg-white border border-stone-200 p-4 md:p-5 flex gap-4"><Link to={`/product/${item.id}`} className="w-28 md:w-36 shrink-0"><img src={item.image} alt={item.name} className="w-full aspect-[3/4] object-cover" /></Link><div className="flex-1 flex flex-col"><div className="flex justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[0.16em] text-teal mb-2">{item.category}</p><Link to={`/product/${item.id}`} className="font-serif text-xl hover:text-teal">{item.name}</Link><p className="text-sm text-stone-500 mt-2">{item.colour} · {item.option}</p></div><p className="font-medium whitespace-nowrap">BDT {(item.price * item.quantity).toLocaleString()}</p></div><div className="mt-auto pt-5 flex items-center justify-between"><div className="inline-flex items-center border border-stone-200"><button onClick={() => updateQuantity(index, -1)} className="p-2 hover:text-teal" aria-label="Decrease quantity"><Minus size={14} /></button><span className="w-8 text-center text-sm">{item.quantity}</span><button onClick={() => updateQuantity(index, 1)} className="p-2 hover:text-teal" aria-label="Increase quantity"><Plus size={14} /></button></div><button onClick={() => removeItem(index)} className="text-xs uppercase tracking-[0.14em] text-stone-500 hover:text-red-700 inline-flex items-center gap-2"><Trash2 size={14} /> Remove</button></div></div></article>)}</div><aside className="bg-white border border-stone-200 p-6 md:p-8 lg:sticky lg:top-6"><h2 className="font-serif text-3xl mb-6">Cart Summary</h2><div className="flex gap-2 mb-6"><input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Discount code" className="min-w-0 flex-1 border border-stone-200 px-4 py-3 text-sm focus:outline-none focus:border-teal" /><button onClick={applyCoupon} className="border border-teal px-4 text-xs uppercase tracking-[0.12em] text-teal hover:bg-teal hover:text-white">Apply</button></div><div className="space-y-3 text-sm border-t border-stone-200 pt-5"><div className="flex justify-between"><span className="text-stone-600">Subtotal</span><span>BDT {subtotal.toLocaleString()}</span></div><div className="flex justify-between"><span className="text-stone-600">Shipping</span><span>{shipping ? `BDT ${shipping}` : "Complimentary"}</span></div>{discount > 0 && <div className="flex justify-between text-teal"><span>AMELIE10</span><span>- BDT {discount.toLocaleString()}</span></div>}<div className="flex justify-between border-t border-stone-200 pt-4 text-lg font-medium"><span>Total</span><span>BDT {total.toLocaleString()}</span></div></div><button onClick={() => navigate("/checkout")} className="btn-primary w-full mt-7 inline-flex items-center justify-center gap-2">Proceed to Checkout <ArrowRight size={16} /></button><p className="text-center text-xs text-stone-500 mt-4">Complimentary delivery on orders over BDT 3,000</p></aside></div>}
  </div></main><Footer /></div>;
};

export default Cart;
