import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const shoeHero = "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F21fa9163980c45ff97fd07989209f916?format=webp&width=1800&quality=95";
const shoeProducts = [
  { id: "shoe-1", name: "Minimalist Strappy Slingback", price: 12500, salePrice: undefined, image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F2212b0db0546488f91f833bc79c19386?format=webp&width=800&height=1200", tag: "New" },
  { id: "shoe-2", name: "Golden Luxe Platform Heel", price: 18000, salePrice: undefined, image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F63618dadc38341448c40401de698c1a3?format=webp&width=800&height=1200", tag: undefined },
  { id: "shoe-3", name: "Plum Satin Pointed Pump", price: 15500, salePrice: undefined, image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fd7b4fd59933245aa890cebc73c7fb97a?format=webp&width=800&height=1200", tag: undefined },
  { id: "shoe-4", name: "Sleek Noir Stiletto", price: 16000, salePrice: undefined, image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F606f0c5a602940c39450810bc343af4e?format=webp&width=800&height=1200", tag: undefined },
];

const ShoeCard = ({ product }: { product: (typeof shoeProducts)[number] }) => {
  const [saved, setSaved] = useState(false);
  return <article className="group"><div className="relative overflow-hidden bg-beige/30 mb-4"><Link to={`/product/${product.id}`}><img src={product.image} alt={product.name} className="w-full aspect-[3/4] object-cover group-hover:scale-[1.03] transition-transform duration-500" /></Link>{product.tag && <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-stone-700">{product.tag}</span>}<button type="button" aria-label={`${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} wishlist`} onClick={() => setSaved(!saved)} className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-stone-700 hover:text-teal"><Heart size={16} className={saved ? "fill-teal text-teal" : ""} /></button></div><Link to={`/product/${product.id}`}><h3 className="font-serif text-lg text-stone-900 group-hover:text-teal transition-colors">{product.name}</h3></Link><div className="flex gap-2 items-center mt-2 text-sm">{product.salePrice && <span className="text-stone-400 line-through">BDT {product.price.toLocaleString()}</span>}<span className={product.salePrice ? "text-teal font-semibold" : "text-stone-800"}>BDT {(product.salePrice ?? product.price).toLocaleString()}</span></div></article>;
};

const Shoes = () => (
  <div className="min-h-screen bg-ivory">
    <Header />
    <main>
      <section className="relative min-h-[560px] md:h-[650px] overflow-hidden bg-stone-900 flex items-center"><img src={shoeHero} alt="Step Into Elegance" className="absolute inset-0 w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-stone-950/25 to-transparent" /><div className="relative z-10 container mx-auto px-4 text-white"><p className="text-[10px] uppercase tracking-[0.28em] text-white/80 mb-5">Amelie Footwear</p><h1 className="font-serif text-6xl md:text-8xl leading-[0.86] max-w-2xl mb-6">Step Into Elegance</h1><p className="text-sm md:text-base text-white/80 max-w-md leading-relaxed mb-8">Discover curated designs for every occasion and style.</p><Link to="#shoe-collection" className="inline-flex bg-gold px-6 py-3 text-xs uppercase tracking-[0.16em] text-stone-900 hover:bg-white transition-colors">Explore Collection</Link></div></section>

      <section id="shoe-collection" className="bg-ivory py-16 md:py-24"><div className="container mx-auto px-4"><div className="flex items-end justify-between mb-10"><div><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">The collection</p><h2 className="font-serif text-4xl md:text-5xl text-stone-900">The Shoe Edit</h2></div><span className="text-sm text-stone-500">4 considered pairs</span></div><div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-14">{shoeProducts.map((product) => <ShoeCard key={product.id} product={product} />)}</div></div></section>

      <section className="bg-white py-16 md:py-24"><div className="container mx-auto px-4"><div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center"><div className="overflow-hidden"><img src="https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=1400&h=1600&fit=crop" alt="Italian shoe craftsmanship" className="w-full aspect-[4/5] object-cover" /></div><div className="max-w-md"><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-4">The Amelie Craft</p><h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-5">A beautiful step forward.</h2><p className="text-stone-600 leading-relaxed mb-6">From elegant heels to refined everyday silhouettes, each pair is selected for premium materials, graceful proportion and the quiet confidence of Italian design.</p><Link to="/about" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-teal hover:text-teal-dark">Discover our story <ChevronRight size={15} /></Link></div></div></div></section>

      <section className="bg-beige/70 py-16 md:py-24"><div className="container mx-auto px-4 text-center max-w-2xl"><p className="text-teal text-[10px] uppercase tracking-[0.26em] mb-5">Amelie Milano</p><h2 className="font-serif text-4xl md:text-6xl text-stone-900 leading-tight mb-5">Subscribe for exclusive footwear releases and style guides.</h2><form onSubmit={(event) => event.preventDefault()} className="mx-auto flex max-w-md border-b border-stone-700"><input type="email" placeholder="Your email address" className="min-w-0 flex-1 bg-transparent px-0 py-3 text-sm focus:outline-none" /><button type="submit" className="bg-gold px-5 py-2 text-xs uppercase tracking-[0.16em] text-stone-900 hover:bg-teal hover:text-white transition-colors">Subscribe</button></form></div></section>
    </main>
    <Footer />
  </div>
);

export default Shoes;
