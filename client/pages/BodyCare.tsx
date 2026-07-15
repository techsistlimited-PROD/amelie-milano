import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const bodyCareImage = "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F0d417769e65540bd9117838b5867ff55?format=webp&width=1600&quality=95";
const products = [
  { id: "body-oil", name: "Nourishing Body Oil", price: 3500, image: bodyCareImage },
  { id: "silk-butter", name: "Silk Touch Body Butter", price: 4200, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&h=1200&fit=crop" },
  { id: "amber-wash", name: "Amber Ritual Body Wash", price: 2800, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=900&h=1200&fit=crop" },
  { id: "signature-mist", name: "Milano Signature Body Mist", price: 3900, image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=900&h=1200&fit=crop" },
];

const collections = [
  { title: "Body Essentials", image: bodyCareImage },
  { title: "Hydration Ritual", image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&h=1200&fit=crop" },
  { title: "Signature Scents", image: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?w=900&h=1200&fit=crop" },
];

const Product = ({ product }: { product: (typeof products)[number] }) => {
  const [saved, setSaved] = useState(false);
  return <article className="group"><div className="relative overflow-hidden bg-beige/30 mb-4"><Link to={`/product/${product.id}`}><img src={product.image} alt={product.name} className="w-full aspect-[3/4] object-cover group-hover:scale-[1.03] transition-transform duration-500" /></Link><button type="button" aria-label={`${saved ? "Remove" : "Add"} ${product.name} ${saved ? "from" : "to"} wishlist`} onClick={() => setSaved(!saved)} className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-stone-700 hover:text-teal"><Heart size={16} className={saved ? "fill-teal text-teal" : ""} /></button></div><Link to={`/product/${product.id}`}><h3 className="font-serif text-lg text-stone-900 group-hover:text-teal transition-colors">{product.name}</h3></Link><p className="text-sm text-stone-800 mt-2">BDT {product.price.toLocaleString()}</p></article>;
};

const BodyCare = () => (
  <div className="min-h-screen bg-ivory">
    <Header />
    <main>
      <section className="relative min-h-[620px] md:h-[700px] overflow-hidden bg-stone-900 flex items-end"><img src={bodyCareImage} alt="Amelie Milano luxury body care ritual" className="absolute inset-0 w-full h-full object-cover object-center" /><div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-stone-950/20 to-transparent" /><div className="relative z-10 container mx-auto px-4 pb-16 md:pb-20 text-white"><p className="text-[10px] uppercase tracking-[0.28em] text-white/80 mb-5">Body Care</p><h1 className="font-serif text-6xl md:text-8xl leading-[0.86] max-w-2xl mb-6">A Ritual Of Elegance</h1><p className="text-sm md:text-base text-white/80 max-w-md leading-relaxed mb-8">Discover luxurious body essentials crafted to nourish your skin and elevate everyday moments.</p><Link to="#signature-body-care" className="inline-flex border border-white px-6 py-3 text-xs uppercase tracking-[0.16em] hover:bg-white hover:text-stone-900 transition-colors">Explore Collection</Link></div></section>

      <section className="bg-ivory py-20 md:py-32 text-center"><div className="container mx-auto px-4 max-w-2xl"><p className="text-teal text-[10px] uppercase tracking-[0.28em] mb-5">The Beauty Ritual</p><h2 className="font-serif text-4xl md:text-6xl text-stone-900 mb-6">Where Self-Care Meets Luxury</h2><p className="text-stone-600 leading-relaxed">Inspired by Italian beauty traditions, Amelie Milano transforms everyday care into a refined sensory experience.</p></div></section>

      <section className="bg-white py-14 md:py-24"><div className="container mx-auto px-4"><div className="text-center mb-10"><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">The collection</p><h2 className="font-serif text-4xl md:text-5xl text-stone-900">A considered ritual</h2></div><div className="grid md:grid-cols-3 gap-5 md:gap-7">{collections.map((collection) => <Link to="#signature-body-care" key={collection.title} className="group"><div className="overflow-hidden mb-4"><img src={collection.image} alt={collection.title} className="w-full aspect-[3/4] object-cover group-hover:scale-[1.03] transition-transform duration-500" /></div><h3 className="font-serif text-2xl text-stone-900 group-hover:text-teal transition-colors">{collection.title}</h3><span className="text-teal text-xs uppercase tracking-[0.16em] mt-2 inline-flex items-center gap-2">Explore <ChevronRight size={14} /></span></Link>)}</div></div></section>

      <section className="bg-cream/60 py-16 md:py-24"><div className="container mx-auto px-4"><div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center"><div className="overflow-hidden"><img src={bodyCareImage} alt="Italian inspired body care ingredients" className="w-full aspect-[4/5] object-cover" /></div><div className="max-w-md"><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-4">Italian Inspired Care</p><h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-5">Thoughtfully Crafted For Your Skin</h2><p className="text-stone-600 leading-relaxed">Inspired by luxurious ingredients, sensorial textures and timeless beauty rituals, every formula is chosen to make your daily care feel beautifully considered.</p></div></div></div></section>

      <section id="signature-body-care" className="bg-ivory py-16 md:py-24"><div className="container mx-auto px-4"><div className="flex items-end justify-between mb-10"><div><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">The essentials</p><h2 className="font-serif text-4xl md:text-5xl text-stone-900">Signature Body Care</h2></div><span className="text-sm text-stone-500">4 considered rituals</span></div><div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-14">{products.map((product) => <Product key={product.id} product={product} />)}</div></div></section>

      <section className="bg-white py-16 md:py-24"><div className="container mx-auto px-4 max-w-4xl"><div className="text-center mb-12"><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">Beauty Ritual Guide</p><h2 className="font-serif text-4xl md:text-5xl text-stone-900">Three quiet moments</h2></div><div className="grid md:grid-cols-3 gap-10 text-center"><div><span className="font-serif text-5xl text-gold/80">01</span><h3 className="font-serif text-2xl mt-4 mb-3">Cleanse</h3><p className="text-sm text-stone-600 leading-relaxed">Begin with a warm, gentle cleanse that leaves skin soft and refreshed.</p></div><div><span className="font-serif text-5xl text-gold/80">02</span><h3 className="font-serif text-2xl mt-4 mb-3">Nourish</h3><p className="text-sm text-stone-600 leading-relaxed">Layer rich oils and butters into the skin with slow, intentional movement.</p></div><div><span className="font-serif text-5xl text-gold/80">03</span><h3 className="font-serif text-2xl mt-4 mb-3">Glow</h3><p className="text-sm text-stone-600 leading-relaxed">Finish with a signature scent and carry the ritual into your day.</p></div></div></div></section>

      <section className="bg-beige/70 py-16 md:py-24"><div className="container mx-auto px-4 text-center max-w-2xl"><p className="text-teal text-[10px] uppercase tracking-[0.26em] mb-5">Amelie Milano</p><h2 className="font-serif text-4xl md:text-6xl text-stone-900 leading-tight mb-5">Luxury is not only what you wear.<br />It is how you care for yourself.</h2><Link to="/about" className="btn-outline inline-flex">Discover More</Link></div></section>
    </main>
    <Footer />
  </div>
);

export default BodyCare;
