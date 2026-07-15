import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const products = [
  { id: "2", name: "Champagne Pleated Corset Dress", price: 11500, image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F9e4e485b99eb4fd9b45892f8bf08f453?format=webp&width=800&height=1200" },
  { id: "3", name: "Ivory Off-Shoulder Sash Gown", price: 9200, image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F7d742ca7c32545b4bf89e1999827cb6f?format=webp&width=800&height=1200" },
  { id: "6", name: "Burgundy Sequin Cape Gown", price: 12500, image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Ff2edad5f9989469e9179290f0356a25b?format=webp&width=800&height=1200" },
  { id: "9", name: "Aurora Silk Draped Dress", price: 13900, image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F87192a4e5d0949b8b89c181ebaa5ef28?format=webp&width=800&height=1200" },
];

const collections = [
  { label: "Evening Glamour", image: products[2].image },
  { label: "Wedding Guest", image: products[1].image },
  { label: "Statement Pieces", image: products[0].image },
];

const occasions = [
  { label: "Wedding Guest", image: products[1].image },
  { label: "Cocktail Evening", image: products[0].image },
  { label: "Black Tie", image: products[2].image },
  { label: "Romantic Dinner", image: products[3].image },
  { label: "Festive Celebration", image: products[0].image },
];

const OccasionProduct = ({ product }: { product: (typeof products)[number] }) => {
  const [wishlisted, setWishlisted] = useState(false);
  return (
    <article className="group">
      <div className="relative overflow-hidden bg-beige/30 mb-4">
        <Link to={`/product/${product.id}`}><img src={product.image} alt={product.name} className="w-full aspect-[3/4] object-cover group-hover:scale-[1.03] transition-transform duration-500" /></Link>
        <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-stone-700">New</span>
        <button type="button" aria-label={`${wishlisted ? "Remove" : "Add"} ${product.name} ${wishlisted ? "from" : "to"} wishlist`} onClick={() => setWishlisted(!wishlisted)} className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-stone-700 hover:text-teal"><Heart size={16} className={wishlisted ? "fill-teal text-teal" : ""} /></button>
      </div>
      <Link to={`/product/${product.id}`}><h3 className="font-serif text-lg leading-tight text-stone-900 group-hover:text-teal transition-colors">{product.name}</h3></Link>
      <p className="mt-2 text-sm text-stone-800">BDT {product.price.toLocaleString()}</p>
    </article>
  );
};

const Occasionwear = () => (
  <div className="min-h-screen bg-ivory">
    <Header />
    <main>
      <section className="relative min-h-[620px] md:h-[700px] overflow-hidden bg-stone-900 flex items-end">
        <img src="https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F8ecc599f40e0487a9a970b3aeb611869?format=webp&width=1600&quality=95" alt="Amelie Milano Occasionwear" className="absolute inset-0 w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-stone-950/20 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 pb-16 md:pb-20 text-white max-w-7xl"><p className="text-[10px] uppercase tracking-[0.28em] text-white/80 mb-5">Occasionwear</p><h1 className="font-serif text-6xl md:text-8xl leading-[0.86] max-w-2xl mb-6">Elegance For Every Occasion</h1><p className="text-sm md:text-base text-white/80 max-w-md leading-relaxed mb-8">Discover timeless silhouettes designed for life's most unforgettable moments.</p><Link to="#occasion-collection" className="inline-flex border border-white px-6 py-3 text-xs uppercase tracking-[0.16em] hover:bg-white hover:text-stone-900 transition-colors">Explore Collection</Link></div>
      </section>

      <section className="bg-ivory py-20 md:py-32 text-center"><div className="container mx-auto px-4 max-w-2xl"><p className="text-teal text-[10px] uppercase tracking-[0.28em] mb-5">The Occasion Edit</p><h2 className="font-serif text-4xl md:text-6xl text-stone-900 mb-6">Designed To Be Remembered</h2><p className="text-stone-600 leading-relaxed">From intimate celebrations to grand evenings, Amelie Milano creates refined pieces that celebrate confidence, femininity and timeless elegance.</p></div></section>

      <section id="occasion-collection" className="bg-white py-14 md:py-24"><div className="container mx-auto px-4"><div className="text-center mb-10"><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">Curated collections</p><h2 className="font-serif text-4xl md:text-5xl text-stone-900">Find your moment</h2></div><div className="grid md:grid-cols-3 gap-5 md:gap-7">{collections.map((collection) => <Link to="/shop/occasionwear" key={collection.label} className="group"><div className="overflow-hidden mb-4"><img src={collection.image} alt={collection.label} className="w-full aspect-[3/4] object-cover group-hover:scale-[1.03] transition-transform duration-500" /></div><h3 className="font-serif text-2xl text-stone-900 group-hover:text-teal transition-colors">{collection.label}</h3><span className="text-teal text-xs uppercase tracking-[0.16em] mt-2 inline-flex items-center gap-2">Explore <ChevronRight size={14} /></span></Link>)}</div></div></section>

      <section className="bg-cream/60 py-16 md:py-24"><div className="container mx-auto px-4"><div className="grid md:grid-cols-2 gap-10 md:gap-20 items-center"><div className="overflow-hidden"><img src="https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F3abee068625f43fbb7ab80d054951ad7?format=webp&width=1400&quality=95" alt="Aurora Silk Gown" className="w-full aspect-[4/5] object-cover" /></div><div className="max-w-md"><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-4">Featured Piece</p><h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-5">Aurora Silk Gown</h2><p className="text-stone-600 leading-relaxed mb-7">A sculpted silhouette inspired by Italian evening elegance, designed to move with quiet confidence from first arrival to final dance.</p><Link to="/product/9" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-teal hover:text-teal-dark">Discover Now <ChevronRight size={15} /></Link></div></div></div></section>

      <section className="bg-ivory py-16 md:py-24"><div className="container mx-auto px-4"><div className="flex items-end justify-between mb-10"><div><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">The collection</p><h2 className="font-serif text-4xl md:text-5xl text-stone-900">Occasionwear</h2></div><span className="text-sm text-stone-500">4 considered pieces</span></div><div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-14">{products.map((product) => <OccasionProduct key={product.id} product={product} />)}</div></div></section>

      <section className="bg-white py-14 md:py-20"><div className="container mx-auto px-4"><div className="text-center mb-9"><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">Style by occasion</p><h2 className="font-serif text-4xl text-stone-900">Dress for the moment</h2></div><div className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-5">{occasions.map((occasion) => <Link to="/shop/occasionwear" key={occasion.label} className="group min-w-[150px] md:min-w-0"><div className="overflow-hidden mb-3"><img src={occasion.image} alt={occasion.label} className="w-full aspect-[3/4] object-cover group-hover:scale-[1.03] transition-transform duration-500" /></div><p className="font-serif text-lg text-stone-900 group-hover:text-teal transition-colors">{occasion.label}</p></Link>)}</div></div></section>

      <section className="bg-beige/70 py-16 md:py-24"><div className="container mx-auto px-4 text-center max-w-2xl"><p className="text-teal text-[10px] uppercase tracking-[0.26em] mb-5">Amelie Milano</p><h2 className="font-serif text-4xl md:text-6xl text-stone-900 leading-tight mb-5">For moments that deserve something unforgettable.</h2><p className="text-stone-600 mb-8">Italian-inspired elegance, crafted for the modern woman.</p><Link to="/about" className="btn-outline inline-flex">Discover Amelie Milano</Link></div></section>
    </main>
    <Footer />
  </div>
);

export default Occasionwear;
