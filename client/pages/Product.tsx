import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight, Heart, Minus, Plus, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { addToCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { fetchBuilderProduct, type BuilderProductData, fetchBuilderProducts } from "@/lib/builder";

const productCatalog = {
  "1": { name: "Espresso Drape Kaftan Dress", price: 8375, category: "Dresses", tagline: "A fluid silhouette with effortless evening movement.", material: "Silk-touch satin", colour: "Espresso", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fca01513621cd4cd19c92e5bb2129ea91?format=webp&width=1000&height=1400" },
  "2": { name: "Champagne Pleated Corset Dress", price: 11500, category: "Occasionwear", tagline: "Sculpted pleats and a luminous champagne finish.", material: "Pleated satin", colour: "Champagne", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F9e4e485b99eb4fd9b45892f8bf08f453?format=webp&width=1000&height=1400" },
  "3": { name: "Ivory Off-Shoulder Sash Gown", price: 9200, category: "Occasionwear", tagline: "An elegant drape made for unforgettable entrances.", material: "Soft crepe", colour: "Ivory", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F7d742ca7c32545b4bf89e1999827cb6f?format=webp&width=1000&height=1400" },
  "4": { name: "Noir One-Shoulder Cutout Dress", price: 10500, category: "Dresses", tagline: "A confident line with a quietly dramatic finish.", material: "Stretch jersey", colour: "Noir", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fac1870ce26284d1e9c304a0b6fa78fde?format=webp&width=1000&height=1400" },
  "5": { name: "Plum One-Shoulder Column Dress", price: 9800, category: "Dresses", tagline: "A sculpted column silhouette in deep plum.", material: "Fluid jersey", colour: "Plum", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fd82ccb0930fd4d0e8a2edb49f49368e1?format=webp&width=1000&height=1400" },
  "6": { name: "Burgundy Sequin Cape Gown", price: 12500, category: "Occasionwear", tagline: "A statement cape gown that catches every light.", material: "Sequin mesh", colour: "Burgundy", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Ff2edad5f9989469e9179290f0356a25b?format=webp&width=1000&height=1400" },
  "7": { name: "Emerald Sculpted Cut-Out Midi", price: 9800, category: "Dresses", tagline: "Sculptural elegance with a modern emerald finish.", material: "Sculpted stretch", colour: "Emerald", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fdcc6f86cb6304c5fb08d26ef7042210a?format=webp&width=1000&height=1400" },
  "8": { name: "Cobalt Ruched Draped Mini", price: 7200, category: "Dresses", tagline: "A playful drape in an unmistakable cobalt blue.", material: "Stretch satin", colour: "Cobalt", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F8a0c8e89869744efbbc501318fe5aef5?format=webp&width=1000&height=1400" },
  "shoe-1": { name: "Minimalist Strappy Slingback", price: 12500, category: "Shoes", tagline: "A clean, sculptural line for evenings and beyond.", material: "Italian leather", colour: "Black", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F2212b0db0546488f91f833bc79c19386?format=webp&width=1000&height=1400" },
  "shoe-2": { name: "Golden Luxe Platform Heel", price: 18000, category: "Shoes", tagline: "A gilded platform with confident height.", material: "Metallic leather", colour: "Gold", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F63618dadc38341448c40401de698c1a3?format=webp&width=1000&height=1400" },
  "shoe-3": { name: "Plum Satin Pointed Pump", price: 15500, category: "Shoes", tagline: "A pointed satin finish with evening allure.", material: "Satin", colour: "Plum", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fd7b4fd59933245aa890cebc73c7fb97a?format=webp&width=1000&height=1400" },
  "shoe-4": { name: "Sleek Noir Stiletto", price: 16000, category: "Shoes", tagline: "The timeless stiletto, refined for the modern wardrobe.", material: "Polished leather", colour: "Noir", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F606f0c5a602940c39450810bc343af4e?format=webp&width=1000&height=1400" },
  "gym-set": { name: "Crimson Performance Leggings Set", price: 4999, category: "Gym Wear", tagline: "Sculpted performance with a confident colour story.", material: "Technical stretch", colour: "Crimson", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F897f9afa654c44f292a3fed3858eeb93?format=webp&width=1000&height=1400" },
  "motion-bodysuit": { name: "Fuchsia Halter Bodysuit", price: 4299, category: "Gym Wear", tagline: "A supportive second skin for every movement.", material: "Performance jersey", colour: "Fuchsia", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fafb1ea344f204331a0bc446e3d8efd35?format=webp&width=1000&height=1400" },
  "studio-legging": { name: "Aqua Active Shorts & Crop", price: 4299, category: "Gym Wear", tagline: "Lightweight movement with a polished finish.", material: "Breathable stretch", colour: "Aqua", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F2b939239e652498cba1172e841dcc89d?format=webp&width=1000&height=1400" },
  "wrap-layer": { name: "Midnight Sculpt Zip Set", price: 5899, category: "Gym Wear", tagline: "A sleek layer for studio, street and everywhere between.", material: "Technical stretch", colour: "Midnight", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F2034f77daf684b7fb584d6403bd9af9c?format=webp&width=1000&height=1400" },
  "bag-1": { name: "Cocoa Ruched Suede Clutch", price: 18999, category: "Bags", tagline: "A softly gathered clutch with an understated evening presence.", material: "Suede finish", colour: "Cocoa", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Ff027f54464044c2aa55976ea27dc0ee0?format=webp&width=800&height=1200" },
  "bag-2": { name: "Noir Floral Sequin Clutch", price: 12900, category: "Bags", tagline: "A floral sequin statement for evenings that call for something unforgettable.", material: "Embroidered sequin velvet", colour: "Noir", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F67b0e8db28dc48d48e09be9a4afa2e23?format=webp&width=800&height=1200" },
  "bag-3": { name: "Sera Evening Clutch", price: 8900, category: "Bags", tagline: "A polished finishing touch for after-dark moments.", material: "Satin finish", colour: "Black", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000&h=1400&fit=crop" },
  "bag-4": { name: "Amelie Mini Top Handle", price: 11900, category: "Bags", tagline: "A petite icon with a considered silhouette.", material: "Italian leather", colour: "Camel", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=1000&h=1400&fit=crop" },
  "body-oil": { name: "Nourishing Body Oil", price: 3500, category: "Body Care", tagline: "A sensorial oil ritual for luminous, nourished skin.", material: "Botanical body oil", colour: "Amber", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F0d417769e65540bd9117838b5867ff55?format=webp&width=1000&height=1400" },
  "silk-butter": { name: "Silk Touch Body Butter", price: 4200, category: "Body Care", tagline: "A rich, velvety ritual inspired by Italian spa care.", material: "Shea and botanical butter", colour: "Ivory", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1000&h=1400&fit=crop" },
  "amber-wash": { name: "Amber Ritual Body Wash", price: 2800, category: "Body Care", tagline: "A warm, softly scented cleanse for everyday ritual.", material: "Gentle cleansing formula", colour: "Amber", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1000&h=1400&fit=crop" },
  "signature-mist": { name: "Milano Signature Body Mist", price: 3900, category: "Body Care", tagline: "A delicate veil of signature fragrance for the skin.", material: "Scented body mist", colour: "Clear", image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1000&h=1400&fit=crop" },
};

type Product = (typeof productCatalog)[keyof typeof productCatalog] & { salePrice?: number };

const responsiveSrcSet = (source: string) => source.includes("cdn.builder.io")
  ? [400, 800, 1200, 1600].map((width) => `${source.replace(/width=\d+/, `width=${width}`)} ${width}w`).join(", ")
  : undefined;

const relatedProducts = [
  { name: "Luna Gold Flower Heel", price: 11999, image: "https://images.unsplash.com/photo-1543163521-9145f931371e?w=600&h=800&fit=crop", href: "/product/shoe-1" },
  { name: "Milano Structured Bag", price: 18999, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=800&fit=crop", href: "/product/bag-1" },
  { name: "Silk Touch Body Butter", price: 4200, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=800&fit=crop", href: "/product/body-oil" },
];

const ProductPage = () => {
  const { id = "1" } = useParams();
  const fallbackProduct: Product = productCatalog[id as keyof typeof productCatalog] ?? productCatalog["1"];
  const [cmsProduct, setCmsProduct] = useState<BuilderProductData | null>(null);
  const [relatedItems, setRelatedItems] = useState(relatedProducts);

  useEffect(() => {
    setCmsProduct(null);
    void (async () => {
      const [data, allProducts] = await Promise.all([
        fetchBuilderProduct(id),
        fetchBuilderProducts(),
      ]);
      if (data) setCmsProduct(data);
      if (allProducts.length) {
        const related = allProducts
          .filter((item) => item.slug !== id)
          .slice(0, 3)
          .map((item) => ({
            name: item.title,
            price: item.priceBdt,
            image: item.heroImage,
            href: `/product/${item.slug}`,
          }));
        if (related.length) setRelatedItems(related);
      }
    })();
  }, [id]);

  const product: Product = cmsProduct
    ? {
        name: cmsProduct.title,
        price: cmsProduct.priceBdt,
        salePrice: cmsProduct.salePriceBdt,
        category: cmsProduct.category,
        tagline: cmsProduct.description ?? "",
        material: cmsProduct.material ?? "Amelie Milano signature finish",
        colour: cmsProduct.colour ?? cmsProduct.variants?.[0]?.color ?? "Signature",
        image: cmsProduct.heroImage,
      }
    : fallbackProduct;
  const onSale = product.salePrice != null && product.salePrice < product.price;
  const displayPrice = onSale ? product.salePrice! : product.price;
  const [size, setSize] = useState("M");
  const [colour, setColour] = useState(product.colour);
  const { saved, toggle: toggleWishlist } = useWishlist({ id, name: product.name, price: displayPrice, image: product.image, category: product.category, colour: product.colour, option: size });
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const images = [product.image, product.image, product.image];
  const isBodyCare = product.category === "Body Care";
  const isBag = product.category === "Bags";
  const optionLabel = isBodyCare ? "Volume" : isBag ? "Details" : "Size";
  const optionValues = isBodyCare ? ["100ml", "200ml", "300ml"] : isBag ? ["One Size"] : ["XS", "S", "M", "L", "XL"];

  useEffect(() => {
    setSize(isBodyCare ? "100ml" : isBag ? "One Size" : "M");
    setColour(product.colour);
    setQuantity(1);
    setActiveImage(0);
    setAddedToCart(false);
  }, [id, isBodyCare, isBag, product.colour]);

  useEffect(() => {
    const description = product.tagline || `Shop ${product.name} from Amelie Milano.`;
    const canonicalUrl = `${window.location.origin}/product/${id}`;
    document.title = `${product.name} | Amelie Milano`;
    const setMeta = (selector: string, attributes: Record<string, string>) => { let element = document.head.querySelector<HTMLMetaElement>(selector); if (!element) { element = document.createElement("meta"); document.head.appendChild(element); } Object.entries(attributes).forEach(([key, value]) => element!.setAttribute(key, value)); };
    setMeta('meta[name="description"]', { name: "description", content: description });
    setMeta('meta[property="og:title"]', { property: "og:title", content: `${product.name} | Amelie Milano` });
    setMeta('meta[property="og:description"]', { property: "og:description", content: description });
    setMeta('meta[property="og:image"]', { property: "og:image", content: product.image });
    setMeta('meta[property="og:type"]', { property: "og:type", content: "product" });
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]'); if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); } canonical.href = canonicalUrl;
    let script = document.head.querySelector<HTMLScriptElement>('script[data-amelie-product-schema="true"]'); if (!script) { script = document.createElement("script"); script.type = "application/ld+json"; script.dataset.amelieProductSchema = "true"; document.head.appendChild(script); }
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: product.name, description, image: [product.image], sku: id, category: product.category, brand: { "@type": "Brand", name: "Amelie Milano" }, offers: { "@type": "Offer", url: canonicalUrl, priceCurrency: "BDT", price: displayPrice, availability: "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition" } });
  }, [id, product.category, product.image, product.name, product.price, product.tagline, displayPrice]);

  const handleAddToCart = () => {
    addToCart({
      id,
      name: product.name,
      price: displayPrice,
      image: product.image,
      category: product.category,
      colour,
      option: size,
      quantity,
    });
    setAddedToCart(true);
  };

  return <div className="min-h-screen bg-[#F0E9E2] text-[#0F0F0F]"><Header /><main>
    <section className="bg-white py-8 md:py-16"><div className="container mx-auto px-4"><div className="mb-6 text-xs text-stone-500"><Link to="/" className="hover:text-teal">Home</Link><span className="mx-2">/</span><Link to={`/shop/${product.category.toLowerCase().replace(" ", "-")}`} className="hover:text-teal">{product.category}</Link><span className="mx-2">/</span><span>{product.name}</span></div><div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start"><div className="grid grid-cols-[72px_1fr] gap-4 lg:sticky lg:top-6"><div className="space-y-3">{images.map((image, index) => <button key={`${image}-${index}`} type="button" onClick={() => setActiveImage(index)} className={`block w-full overflow-hidden border ${activeImage === index ? "border-teal" : "border-transparent"}`}><img src={image} srcSet={responsiveSrcSet(image)} decoding="async" alt={`${product.name} view ${index + 1}`} className="w-full aspect-[3/4] object-cover" /></button>)}</div><div className="relative overflow-hidden bg-white"><img src={images[activeImage]} alt={product.name} className="w-full aspect-[3/4] object-cover hover:scale-105 transition-transform duration-700" /><span className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-stone-600">Move to zoom</span></div></div><div className="max-w-xl pt-2"><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-4">{product.category} · New Arrival</p><h1 className="font-serif text-4xl md:text-6xl leading-[0.95] mb-4">{product.name}</h1><p className="font-serif italic text-xl text-stone-600 mb-6">{product.tagline}</p><p className="text-xl text-stone-900 mb-8">{onSale ? (<><span className="text-stone-400 line-through text-lg mr-3">BDT {product.price.toLocaleString()}</span><span className="font-semibold text-teal">BDT {product.salePrice!.toLocaleString()}</span></>) : <>BDT {product.price.toLocaleString()}</>}</p><div className="space-y-7 border-y border-stone-200 py-7"><div><p className="text-xs uppercase tracking-[0.16em] mb-3">Colour: <span className="normal-case tracking-normal text-stone-600">{colour}</span></p><div className="flex gap-2"><button type="button" onClick={() => setColour(product.colour)} className="w-7 h-7 rounded-full border-2 border-teal bg-stone-800" aria-label={`Select ${product.colour}`} /><button type="button" onClick={() => setColour("Ivory")} className="w-7 h-7 rounded-full border border-stone-300 bg-[#eee7dc]" aria-label="Select Ivory" /></div></div><div><div className="flex justify-between mb-3"><p className="text-xs uppercase tracking-[0.16em]">{optionLabel}: <span className="normal-case tracking-normal text-stone-600">{size}</span></p><button type="button" className="text-xs text-teal underline">Size Guide</button></div><div className="flex gap-2">{optionValues.map((option) => <button key={option} type="button" onClick={() => setSize(option)} className={`w-12 h-11 border text-sm ${size === option ? "border-teal bg-teal text-white" : "border-stone-300 hover:border-teal"}`}>{option}</button>)}</div></div></div><div className="flex gap-3 mt-8"><div className="flex items-center border border-stone-300"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3"><Minus size={14} /></button><span className="w-8 text-center text-sm">{quantity}</span><button type="button" onClick={() => setQuantity(quantity + 1)} className="p-3"><Plus size={14} /></button></div><button type="button" onClick={handleAddToCart} className="flex-1 bg-teal px-6 py-4 text-xs uppercase tracking-[0.16em] text-white hover:bg-teal-dark transition-colors">{addedToCart ? "Added to Cart" : "Add to Cart"}</button><button type="button" onClick={() => toggleWishlist()} aria-label="Add to wishlist" className="border border-stone-300 px-4 text-stone-700 hover:text-teal"><Heart className={saved ? "fill-teal text-teal" : ""} /></button></div><p className="text-xs text-stone-500 mt-4">Complimentary delivery on orders over BDT 3,000.</p></div></div></div></section>

    <section className="bg-[#F0E9E2] py-16 md:py-24"><div className="container mx-auto px-4 max-w-4xl"><div className="grid md:grid-cols-2 gap-10 md:gap-20"><div><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-4">The story</p><h2 className="font-serif text-4xl md:text-5xl mb-5">Designed to become a signature.</h2><p className="text-stone-600 leading-relaxed">{product.tagline} Every detail is considered for the modern Amelie woman — from the first impression to the way the piece moves with you.</p></div><div className="space-y-5 text-sm text-stone-600 leading-relaxed"><p><strong className="text-stone-900">Material:</strong> {product.material}</p><p><strong className="text-stone-900">Care:</strong> Dry clean or hand wash gently in cold water. Store away from direct sunlight.</p><p><strong className="text-stone-900">Origin:</strong> Designed with an Italian-inspired point of view for the modern Bangladesh wardrobe.</p><blockquote className="font-serif italic text-2xl text-teal border-l-2 border-gold pl-5 pt-2">“The most beautiful pieces leave room for you to become yourself.”</blockquote></div></div></div></section>

    <section className="bg-white py-16 md:py-24"><div className="container mx-auto px-4"><div className="flex items-end justify-between mb-9"><div><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">Complete the look</p><h2 className="font-serif text-4xl">Style &amp; Pairing</h2></div><Link to="/shop" className="text-xs uppercase tracking-[0.16em] text-teal">Shop More</Link></div><div className="grid grid-cols-3 gap-4 md:gap-6">{relatedItems.map((item) => <Link key={item.name} to={item.href} className="group"><div className="overflow-hidden mb-4"><img src={item.image} alt={item.name} className="w-full aspect-[3/4] object-cover group-hover:scale-[1.03] transition-transform duration-500" /></div><h3 className="font-serif text-lg group-hover:text-teal transition-colors">{item.name}</h3><p className="text-sm text-stone-600 mt-2">BDT {item.price.toLocaleString()}</p><span className="mt-3 inline-flex text-xs uppercase tracking-[0.14em] text-teal">Shop Now <ChevronRight size={14} /></span></Link>)}</div></div></section>

    <section className="bg-[#F0E9E2] py-16 md:py-24"><div className="container mx-auto px-4 max-w-4xl"><div className="text-center mb-10"><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">The Amelie Fit</p><h2 className="font-serif text-4xl">Size Guide &amp; Fit</h2><p className="text-sm text-stone-600 mt-3">Need help? Our Style Concierge can help you find your perfect fit.</p></div><div className="grid md:grid-cols-2 gap-4"><details className="bg-white p-5 group"><summary className="flex justify-between cursor-pointer text-xs uppercase tracking-[0.16em]">How it fits <ChevronDown size={16} className="group-open:rotate-180 transition-transform" /></summary><p className="text-sm text-stone-600 leading-relaxed mt-4">Our pieces are designed for a graceful, true-to-size fit. For a more fluid silhouette, choose one size up.</p></details><details className="bg-white p-5 group"><summary className="flex justify-between cursor-pointer text-xs uppercase tracking-[0.16em]">Size conversion <ChevronDown size={16} className="group-open:rotate-180 transition-transform" /></summary><p className="text-sm text-stone-600 leading-relaxed mt-4">XS 6–8 · S 8–10 · M 10–12 · L 12–14 · XL 14–16. Measurements may vary by silhouette.</p></details></div></div></section>

    <section className="bg-white py-16 md:py-24"><div className="container mx-auto px-4"><div className="text-center mb-10"><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">In the world of Amelie</p><h2 className="font-serif text-4xl">Editorial Inspiration</h2></div><div className="grid grid-cols-3 gap-3 md:gap-5"><img src={product.image} alt="Styled lookbook detail" className="w-full aspect-[3/4] object-cover" /><img src={relatedProducts[1].image} alt="Amelie styling detail" className="w-full aspect-[3/4] object-cover mt-8" /><img src={relatedProducts[0].image} alt="Amelie footwear detail" className="w-full aspect-[3/4] object-cover" /></div></div></section>

    <section className="bg-[#F0E9E2] py-16 md:py-24"><div className="container mx-auto px-4 max-w-4xl"><div className="flex items-center justify-between mb-8"><div><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">The community</p><h2 className="font-serif text-4xl">Reviews &amp; Ratings</h2></div><div className="flex items-center gap-2 text-gold"><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><Star fill="currentColor" size={16} /><span className="text-stone-600 text-sm ml-2">4.9 / 5</span></div></div><div className="grid md:grid-cols-2 gap-5"><blockquote className="bg-white p-6"><div className="text-gold mb-3">★★★★★</div><p className="font-serif italic text-xl mb-4">“The fit, fabric and detail are even more beautiful in person.”</p><cite className="text-xs uppercase tracking-[0.14em] text-stone-500 not-italic">— Ayesha, verified customer</cite></blockquote><blockquote className="bg-white p-6"><div className="text-gold mb-3">★★★★★</div><p className="font-serif italic text-xl mb-4">“It feels like a piece I will return to for years.”</p><cite className="text-xs uppercase tracking-[0.14em] text-stone-500 not-italic">— Nadia, verified customer</cite></blockquote></div></div></section>

    <section className="bg-beige/70 py-16 md:py-24 text-center"><div className="container mx-auto px-4 max-w-2xl"><h2 className="font-serif text-4xl md:text-5xl mb-5">Stay Inspired by Amelie Milano</h2><p className="text-stone-600 mb-7">Join our world of refined fashion, new arrivals and considered stories.</p><Link to="/shop/new" className="btn-primary inline-flex">Explore New Arrivals</Link></div></section>
  </main><Footer /></div>;
};

export default ProductPage;
