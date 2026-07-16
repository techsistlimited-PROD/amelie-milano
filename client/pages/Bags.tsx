import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const bagHero = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1800&h=900&fit=crop";
const bagProducts = [
  { id: "bag-1", name: "Milano Structured Bag", price: 18999, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=1200&fit=crop", tag: "New" },
  { id: "bag-2", name: "Luna Soft Leather Shoulder Bag", price: 15400, salePrice: 12900, image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=900&h=1200&fit=crop", tag: "Sale" },
  { id: "bag-3", name: "Sera Evening Clutch", price: 8900, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&h=1200&fit=crop", tag: "New" },
  { id: "bag-4", name: "Amelie Mini Top Handle", price: 11900, image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=900&h=1200&fit=crop" },
];

const BagCard = ({ product }: { product: (typeof bagProducts)[number] }) => {
  const [saved, setSaved] = useState(false);
  return <article className="group"><div className="relative overflow-hidden bg-beige/30 mb-4"><Link to={`/product/${product.id}`}><img src={product.image} alt={product.name} className="w-full aspect-[3/4] object-cover group-hover:scale-[1.03] transition-transform duration-500" /></Link>{product.tag && <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-stone-700">{product.tag}</span>}<button type="button" aria-label={`${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} wishlist`} onClick={() => setSaved(!saved)} className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-stone-700 hover:text-teal"><Heart size={16} className={saved ? "fill-teal text-teal" : ""} /></button></div><Link to={`/product/${product.id}`}><h3 className="font-serif text-lg text-stone-900 group-hover:text-teal transition-colors">{product.name}</h3></Link><div className="flex gap-2 items-center mt-2 text-sm">{product.salePrice && <span className="text-stone-400 line-through">BDT {product.price.toLocaleString()}</span>}<span className={product.salePrice ? "text-teal font-semibold" : "text-stone-800"}>BDT {(product.salePrice ?? product.price).toLocaleString()}</span></div></article>;
};

const Bags = () => (
  <div className="min-h-screen bg-ivory">
    <Header />
    <main>
      <section className="relative min-h-[560px] md:h-[650px] overflow-hidden bg-stone-900 flex items-center"><img src={bagHero} alt="Timeless luxury bags" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-stone-950/25 to-transparent" /><div className="relative z-10 container mx-auto px-4 text-white"><p className="text-[10px] uppercase tracking-[0.28em] text-white/80 mb-5">Amelie Accessories</p><h1 className="font-serif text-6xl md:text-8xl leading-[0.86] max-w-2xl mb-6">Timeless Luxury Bags</h1><p className="text-sm md:text-base text-white/80 max-w-md leading-relaxed mb-8">Discover curated designs for every occasion and style.</p><Link to="#bag-collection" className="inline-flex bg-gold px-6 py-3 text-xs uppercase tracking-[0.16em] text-stone-900 hover:bg-white transition-colors">Explore Collection</Link></div></section>

      <section id="bag-collection" className="bg-ivory py-16 md:py-24"><div className="container mx-auto px-4"><div className="flex items-end justify-between mb-10"><div><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">The collection</p><h2 className="font-serif text-4xl md:text-5xl text-stone-900">The Bag Edit</h2></div><span className="text-sm text-stone-500">4 considered pieces</span></div><div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-14">{bagProducts.map((product) => <BagCard key={product.id} product={product} />)}</div></div></section>

      <section className="bg-white py-16 md:py-24"><div className="container mx-auto px-4"><div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center"><div className="overflow-hidden"><img src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=1400&h=1600&fit=crop" alt="Amelie Milano bag craftsmanship" className="w-full aspect-[4/5] object-cover" /></div><div className="max-w-md"><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-4">The Amelie Craft</p><h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-5">Designed to be carried beautifully.</h2><p className="text-stone-600 leading-relaxed mb-6">From softly structured leather to polished evening silhouettes, every Amelie Milano bag is selected for its balance of Italian inspiration, considered detail and everyday elegance.</p><Link to="/about" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-teal hover:text-teal-dark">Discover our story <ChevronRight size={15} /></Link></div></div></div></section>

      <section className="bg-beige/70 py-16 md:py-24"><div className="container mx-auto px-4 text-center max-w-2xl"><p className="text-teal text-[10px] uppercase tracking-[0.26em] mb-5">Amelie Milano</p><h2 className="font-serif text-4xl md:text-6xl text-stone-900 leading-tight mb-5">Subscribe for exclusive releases and styling guides.</h2><form onSubmit={(event) => event.preventDefault()} className="mx-auto flex max-w-md border-b border-stone-700"><input type="email" placeholder="Your email address" className="min-w-0 flex-1 bg-transparent px-0 py-3 text-sm focus:outline-none" /><button type="submit" className="bg-gold px-5 py-2 text-xs uppercase tracking-[0.16em] text-stone-900 hover:bg-teal hover:text-white transition-colors">Subscribe</button></form></div></section>
    </main>
    <Footer />
  </div>
);

export default Bags;
