import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { addToCart } from "@/lib/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const newInProducts = [
  {
    id: "1",
    name: "Espresso Drape Kaftan Dress",
    price: 8375,
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fca01513621cd4cd19c92e5bb2129ea91?format=webp&width=800&height=1200",
  },
  {
    id: "2",
    name: "Champagne Pleated Corset Dress",
    price: 11500,
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F9e4e485b99eb4fd9b45892f8bf08f453?format=webp&width=800&height=1200",
  },
  {
    id: "3",
    name: "Ivory Off-Shoulder Sash Gown",
    price: 9200,
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F7d742ca7c32545b4bf89e1999827cb6f?format=webp&width=800&height=1200",
  },
  {
    id: "4",
    name: "Noir One-Shoulder Cutout Dress",
    price: 10500,
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fac1870ce26284d1e9c304a0b6fa78fde?format=webp&width=800&height=1200",
  },
  {
    id: "5",
    name: "Plum One-Shoulder Column Dress",
    price: 9800,
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fd82ccb0930fd4d0e8a2edb49f49368e1?format=webp&width=800&height=1200",
  },
  {
    id: "6",
    name: "Burgundy Sequin Cape Gown",
    price: 12500,
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Ff2edad5f9989469e9179290f0356a25b?format=webp&width=800&height=1200",
  },
  {
    id: "7",
    name: "Emerald Sculpted Cut-Out Midi",
    price: 9800,
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fdcc6f86cb6304c5fb08d26ef7042210a?format=webp&width=800&height=1200",
  },
  {
    id: "8",
    name: "Cobalt Ruched Draped Mini",
    price: 7200,
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F8a0c8e89869744efbbc501318fe5aef5?format=webp&width=800&height=1200",
  },
];

const categories = [
  { label: "Dresses", href: "/shop/dresses" },
  { label: "Occasionwear", href: "/shop/occasionwear" },
  { label: "Bags", href: "/shop/bags" },
  { label: "Shoes", href: "/shop/shoes" },
  { label: "Body Care", href: "/shop/body-care" },
  { label: "Gym Wear", href: "/shop/gym-wear" },
];

const NewInProductCard = ({ product }: { product: (typeof newInProducts)[number] }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const handleAdd = () => { addToCart({ id: product.id, name: product.name, price: product.price, image: product.image, category: "New In", colour: "Signature colour", option: "M", quantity }); setAdded(true); };

  return (
    <article className="group">
      <div className="relative overflow-hidden bg-beige/30 mb-4">
        <Link to={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="w-full aspect-[3/4] object-cover group-hover:scale-[1.03] transition-transform duration-500" />
        </Link>
        <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-stone-700">New</span>
        <button type="button" aria-label={`${wishlisted ? "Remove" : "Add"} ${product.name} ${wishlisted ? "from" : "to"} wishlist`} onClick={() => setWishlisted(!wishlisted)} className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-stone-700 hover:text-teal transition-colors"><Heart size={16} className={wishlisted ? "fill-teal text-teal" : ""} /></button>
        <div className="absolute inset-x-0 bottom-0 flex translate-y-0 md:translate-y-full items-center justify-between gap-2 bg-white/95 p-3 transition-transform duration-300 group-hover:translate-y-0"><div className="flex items-center border border-stone-200"><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-stone-600 hover:text-teal"><Minus size={13} /></button><span className="w-6 text-center text-sm">{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)} className="p-2 text-stone-600 hover:text-teal"><Plus size={13} /></button></div><button type="button" onClick={handleAdd} className="flex flex-1 items-center justify-center gap-1 bg-teal px-3 py-2 text-[10px] uppercase tracking-[0.1em] text-white hover:bg-teal-dark"><ShoppingBag size={14} />{added ? "Added" : "Add"}</button></div>
      </div>
      <Link to={`/product/${product.id}`}><h3 className="font-serif text-lg leading-tight text-stone-900 group-hover:text-teal transition-colors">{product.name}</h3></Link>
      <p className="mt-2 text-sm text-stone-800">BDT {product.price.toLocaleString()}</p>
    </article>
  );
};

const NewIn = () => (
  <div className="min-h-screen bg-ivory">
    <Header />
    <main>
      <section className="relative min-h-[620px] md:h-[700px] flex items-end overflow-hidden bg-stone-900">
        <img src="https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F8427b1d1349f455fa006745ab19f45ee?format=webp&width=1600&height=2000" alt="Amelie Milano new collection" className="absolute inset-0 h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/65 via-stone-950/20 to-transparent" />
        <div className="relative z-10 container mx-auto px-4 pb-16 md:pb-20">
          <div className="max-w-xl text-white">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80">New Collection</p>
            <h1 className="font-serif text-6xl md:text-8xl leading-[0.86] mb-6">New Arrivals</h1>
            <p className="max-w-sm text-sm md:text-base leading-relaxed text-white/80 mb-8">Discover the latest Amelie Milano pieces, crafted for modern feminine elegance.</p>
            <Link to="#latest-arrivals" className="inline-flex border border-white px-6 py-3 text-xs uppercase tracking-[0.16em] text-white hover:bg-white hover:text-stone-900 transition-colors">Explore Collection</Link>
          </div>
        </div>
      </section>

      <section className="bg-ivory py-20 md:py-32 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <p className="text-teal text-[10px] font-semibold uppercase tracking-[0.28em] mb-5">The Amelie Edit</p>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight text-stone-900 mb-6">Fresh arrivals.<br />Timeless elegance.</h2>
          <p className="text-stone-600 leading-relaxed">Discover the newest Amelie Milano collection — refined silhouettes, luxurious textures and contemporary designs inspired by European fashion.</p>
        </div>
      </section>

      <section className="bg-white py-14 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 items-center gap-10 md:gap-20">
            <div className="overflow-hidden"><img src={newInProducts[1].image} alt="Featured Champagne Pleated Corset Dress" className="w-full aspect-[4/5] object-cover hover:scale-[1.02] transition-transform duration-500" /></div>
            <div className="max-w-md"><p className="text-teal text-[10px] font-semibold uppercase tracking-[0.24em] mb-4">Featured Arrival</p><h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-5">Aurora Silk Draped Dress</h2><p className="text-stone-600 leading-relaxed mb-7">A statement silhouette designed with graceful draping and timeless feminine movement.</p><Link to="/product/2" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-teal hover:text-teal-dark">Discover Piece <ChevronRight size={15} /></Link></div>
          </div>
        </div>
      </section>

      <section id="latest-arrivals" className="bg-ivory py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center"><p className="text-teal text-[10px] font-semibold uppercase tracking-[0.24em] mb-3">The newest pieces</p><h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-3">Latest Arrivals</h2><p className="text-sm text-stone-600">Explore the newest pieces from Amelie Milano.</p></div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6 md:gap-y-14">{newInProducts.map((product) => <NewInProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>

      <section className="bg-white py-14 md:py-20"><div className="container mx-auto px-4"><div className="flex flex-wrap justify-center gap-x-8 gap-y-4 border-y border-stone-200 py-7">{categories.map((category) => <Link key={category.href} to={category.href} className="text-xs uppercase tracking-[0.16em] text-stone-600 hover:text-teal transition-colors">{category.label}</Link>)}</div></div></section>

      <section className="bg-beige/70 py-16 md:py-24"><div className="container mx-auto px-4 text-center max-w-2xl"><p className="text-teal text-[10px] font-semibold uppercase tracking-[0.26em] mb-5">Amelie Milano</p><h2 className="font-serif text-4xl md:text-6xl leading-tight text-stone-900 mb-5">Italian elegance,<br />designed for modern women.</h2><p className="text-stone-600 mb-8">Join our world of refined fashion, curated collections and timeless pieces.</p><form onSubmit={(event) => event.preventDefault()} className="mx-auto flex max-w-md border-b border-stone-700"><input type="email" placeholder="Your email address" className="min-w-0 flex-1 bg-transparent px-0 py-3 text-sm focus:outline-none" /><button type="submit" className="px-2 py-3 text-xs uppercase tracking-[0.16em] text-teal">Subscribe</button></form></div></section>
    </main>
    <Footer />
  </div>
);

export default NewIn;
