import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { addToCart } from "@/lib/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const gymHero = "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F56076a5843aa49afaee6765ec232fb48?format=webp&width=1600&quality=95";
const performanceImage = "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F6af834a3717748bcb25681adfb4d935f?format=webp&width=1400&quality=95";
const gymProducts = [
  { id: "gym-set", name: "Crimson Performance Leggings Set", price: 4999, image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F897f9afa654c44f292a3fed3858eeb93?format=webp&width=800&height=1200" },
  { id: "motion-bodysuit", name: "Fuchsia Halter Bodysuit", price: 4299, image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fafb1ea344f204331a0bc446e3d8efd35?format=webp&width=800&height=1200" },
  { id: "studio-legging", name: "Aqua Active Shorts & Crop", price: 4299, image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F2b939239e652498cba1172e841dcc89d?format=webp&width=800&height=1200" },
  { id: "wrap-layer", name: "Midnight Sculpt Zip Set", price: 5899, image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F2034f77daf684b7fb584d6403bd9af9c?format=webp&width=800&height=1200" },
];

const editorial = [
  { title: "The Studio Set", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F0a39aea80a894baab5125b343377e4ff?format=webp&width=1400&quality=95" },
  { title: "Designed To Move", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&h=1200&fit=crop" },
  { title: "Quiet Strength", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fc09762a587cd4b7e88b529cc61d301c5?format=webp&width=800&height=1200" },
];

const GymProduct = ({ product }: { product: (typeof gymProducts)[number] }) => {
  const [saved, setSaved] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const handleAdd = () => { addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: "Gym Wear", colour: "Signature colour", option: "M", quantity }); setAdded(true); };
  return <article className="group"><div className="relative overflow-hidden bg-beige/30 mb-4"><Link to={`/product/${product.id}`}><img src={product.image} alt={product.name} className="w-full aspect-[3/4] object-cover group-hover:scale-[1.03] transition-transform duration-500" /></Link><button type="button" aria-label={`${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} wishlist`} onClick={() => setSaved(!saved)} className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-stone-700 hover:text-teal"><Heart size={16} className={saved ? "fill-teal text-teal" : ""} /></button><div className="absolute inset-x-0 bottom-0 flex translate-y-0 md:translate-y-full items-center justify-between gap-2 bg-white/95 p-3 transition-transform duration-300 group-hover:translate-y-0"><div className="flex items-center border border-stone-200"><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-stone-600 hover:text-teal"><Minus size={13} /></button><span className="w-6 text-center text-sm">{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)} className="p-2 text-stone-600 hover:text-teal"><Plus size={13} /></button></div><button type="button" onClick={handleAdd} className="flex flex-1 items-center justify-center gap-1 bg-teal px-3 py-2 text-[10px] uppercase tracking-[0.1em] text-white hover:bg-teal-dark"><ShoppingBag size={14} />{added ? "Added" : "Add"}</button></div></div><Link to={`/product/${product.id}`}><h3 className="font-serif text-lg text-stone-900 group-hover:text-teal transition-colors">{product.name}</h3></Link><p className="text-sm text-stone-800 mt-2">BDT {product.price.toLocaleString()}</p></article>;
};

const GymWear = () => (
  <div className="min-h-screen bg-ivory">
    <Header />
    <main>
      <section className="relative min-h-[620px] md:h-[700px] overflow-hidden bg-stone-900 flex items-end"><img src={gymHero} alt="Amelie Milano Gym Wear" className="absolute inset-0 w-full h-full object-cover object-center" /><div className="absolute inset-0 bg-gradient-to-r from-stone-950/65 via-stone-950/15 to-transparent" /><div className="relative z-10 container mx-auto px-4 pb-16 md:pb-20 text-white"><p className="text-[10px] uppercase tracking-[0.28em] text-white/80 mb-5">Gym Wear</p><h1 className="font-serif text-6xl md:text-8xl leading-[0.86] max-w-2xl mb-6">Empowered Elegance in Motion</h1><p className="text-sm md:text-base text-white/80 max-w-md leading-relaxed mb-8">Premium activewear designed for confidence, style, and performance.</p><Link to="#gym-collection" className="inline-flex border border-white px-6 py-3 text-xs uppercase tracking-[0.16em] hover:bg-white hover:text-stone-900 transition-colors">Shop Collection</Link></div></section>

      <section className="bg-ivory py-20 md:py-32 text-center"><div className="container mx-auto px-4 max-w-2xl"><p className="text-teal text-[10px] uppercase tracking-[0.28em] mb-5">The Gym Wear Ritual</p><h2 className="font-serif text-4xl md:text-6xl text-stone-900 mb-6">Where Performance Meets Luxury</h2><p className="text-stone-600 leading-relaxed">Amelie Milano Gym Wear combines European-inspired style with modern functionality to empower women through movement.</p></div></section>

      <section className="bg-white py-14 md:py-24"><div className="container mx-auto px-4"><div className="text-center mb-10"><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">The movement edit</p><h2 className="font-serif text-4xl md:text-5xl text-stone-900">Made for your rhythm</h2></div><div className="grid md:grid-cols-3 gap-5 md:gap-7">{editorial.map((item) => <Link to="#gym-collection" key={item.title} className="group"><div className="overflow-hidden mb-4"><img src={item.image} alt={item.title} className="w-full aspect-[3/4] object-cover group-hover:scale-[1.03] transition-transform duration-500" /></div><h3 className="font-serif text-2xl text-stone-900 group-hover:text-teal transition-colors">{item.title}</h3><span className="mt-2 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-teal">Explore <ChevronRight size={14} /></span></Link>)}</div></div></section>

      <section id="gym-collection" className="bg-ivory py-16 md:py-24"><div className="container mx-auto px-4"><div className="flex items-end justify-between mb-10"><div><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">The collection</p><h2 className="font-serif text-4xl md:text-5xl text-stone-900">Gym Wear</h2></div><span className="text-sm text-stone-500">4 considered pieces</span></div><div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-14">{gymProducts.map((product) => <GymProduct key={product.id} product={product} />)}</div></div></section>

      <section className="bg-cream/60 py-16 md:py-24"><div className="container mx-auto px-4"><div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center"><div className="overflow-hidden"><img src={performanceImage} alt="Luxury in motion" className="w-full aspect-[4/5] object-cover" /></div><div className="max-w-md"><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-4">Performance &amp; Comfort</p><h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-5">Luxury in Motion</h2><p className="text-stone-600 leading-relaxed">Every piece of Amelie Milano Gym Wear is crafted with attention to fit, comfort, and modern elegance.</p></div></div></div></section>

      <section className="bg-white py-16 md:py-24"><div className="container mx-auto px-4"><div className="text-center mb-10"><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">Styling guide</p><h2 className="font-serif text-4xl md:text-5xl text-stone-900">Mix. Move. Repeat.</h2></div><div className="grid md:grid-cols-3 gap-5"><div className="bg-cream/50 p-7"><span className="text-gold font-serif text-4xl">01</span><h3 className="font-serif text-2xl mt-5 mb-3">Studio to street</h3><p className="text-sm text-stone-600 leading-relaxed">Layer a sculpted set with a soft wrap for an effortless day-to-evening silhouette.</p></div><div className="bg-cream/50 p-7"><span className="text-gold font-serif text-4xl">02</span><h3 className="font-serif text-2xl mt-5 mb-3">Tone on tone</h3><p className="text-sm text-stone-600 leading-relaxed">Keep the palette refined and let fabric, line and movement speak.</p></div><div className="bg-cream/50 p-7"><span className="text-gold font-serif text-4xl">03</span><h3 className="font-serif text-2xl mt-5 mb-3">Your ritual</h3><p className="text-sm text-stone-600 leading-relaxed">Choose pieces that make movement feel personal, powerful and beautifully yours.</p></div></div></div></section>

      <section className="bg-beige/70 py-16 md:py-24"><div className="container mx-auto px-4 text-center max-w-2xl"><p className="text-teal text-[10px] uppercase tracking-[0.26em] mb-5">Amelie Milano</p><h2 className="font-serif text-4xl md:text-6xl text-stone-900 leading-tight mb-5">Luxury is not just style.<br />It is movement, confidence, and modern elegance.</h2><Link to="/about" className="btn-outline inline-flex">Discover More</Link></div></section>
    </main>
    <Footer />
  </div>
);

export default GymWear;
