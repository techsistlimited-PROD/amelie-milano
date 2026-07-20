import { useEffect, useState } from "react";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { addToCart } from "@/lib/cart";
import { readWishlist, removeFromWishlist, wishlistEventName, type WishlistItem } from "@/lib/wishlist";

const Wishlist = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<WishlistItem[]>([]);
  useEffect(() => { const sync = () => setItems(readWishlist()); sync(); window.addEventListener(wishlistEventName, sync); return () => window.removeEventListener(wishlistEventName, sync); }, []);
  const addItem = (item: WishlistItem) => { addToCart({ ...item, quantity: 1 }); navigate("/cart"); };
  const addAll = () => { items.forEach((item) => addToCart({ ...item, quantity: 1 })); navigate("/cart"); };
  return <div className="min-h-screen bg-[#F9F6F2] text-stone-900"><Header /><main className="container mx-auto px-4 py-10 md:py-16"><div className="mx-auto max-w-6xl"><div className="mb-10 flex items-end justify-between gap-4"><div><p className="mb-3 text-[10px] uppercase tracking-[0.26em] text-teal">Home / My Wishlist</p><h1 className="font-serif text-5xl md:text-6xl">My Wishlist</h1><p className="mt-3 text-sm text-stone-600">Pieces you love, kept close for later.</p></div>{items.length > 1 && <button onClick={addAll} className="hidden items-center gap-2 bg-teal px-5 py-3 text-xs uppercase tracking-[0.14em] text-white hover:bg-teal-dark sm:inline-flex"><ShoppingBag size={15} /> Add All to Cart</button>}</div>{items.length ? <><div className="mb-8 flex items-center gap-3 border-y border-stone-200 py-4 text-sm text-stone-600"><Heart size={16} className="fill-[#C69B6D] text-[#C69B6D]" /> {items.length} saved pieces <span className="text-stone-300">·</span> <span>Saved across your Amelie account.</span></div><div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">{items.map((item) => <article key={item.id} className="group"><div className="relative overflow-hidden bg-stone-100"><Link to={`/product/${item.id}`}><img src={item.image} alt={item.name} className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /></Link><button type="button" onClick={() => removeFromWishlist(item.id)} aria-label={`Remove ${item.name} from wishlist`} className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-stone-700 transition-colors hover:text-red-700"><Trash2 size={16} /></button></div><Link to={`/product/${item.id}`}><h2 className="mt-4 font-serif text-lg text-stone-900 transition-colors group-hover:text-teal">{item.name}</h2></Link><p className="mt-2 text-sm text-stone-600">BDT {item.price.toLocaleString()}</p><button type="button" onClick={() => addItem(item)} className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-teal hover:text-teal-dark"><ShoppingBag size={14} /> Add to Cart</button></article>)}</div></> : <div className="bg-white px-6 py-20 text-center ring-1 ring-stone-200"><Heart className="mx-auto mb-5 text-teal" size={30} /><h2 className="font-serif text-3xl">Your wishlist is waiting</h2><p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone-600">Save the pieces that feel like you, then return whenever you are ready.</p><Link to="/shop" className="btn-primary mt-7 inline-flex">Explore the wardrobe</Link></div>}</div></main><Footer /></div>;
};

export default Wishlist;
