import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Filter, Heart, MessageCircle, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useWishlist } from "@/lib/wishlist";
import { fetchBuilderCollection, fetchBuilderProducts } from "@/lib/builder";
import { CatalogProduct, cmsToCatalog, filterCatalogProducts, sortCatalogProducts } from "@/lib/catalogProduct";
import { resolveCollectionProducts, sortByDisplayOrder } from "@/lib/cmsCatalog";

const DRESS_HERO_IMAGE =
  "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F87192a4e5d0949b8b89c181ebaa5ef28?format=webp&width=1200&height=1600";

const subcategories = [
  "All Dresses",
  "New Arrivals",
  "Evening Dresses",
  "Day Dresses",
  "Maxi Dresses",
  "Midi Dresses",
  "Bodycon",
  "Draped Dresses",
  "Occasion Dresses",
];

const filterGroups = [
  { label: "Size", options: ["XS", "S", "M", "L", "XL"] },
  { label: "Colour", options: ["Black", "Ivory", "Champagne", "Plum"] },
  { label: "Occasion", options: ["Evening", "Daywear", "Occasion"] },
  { label: "Length", options: ["Mini", "Midi", "Maxi"] },
  { label: "Price", options: ["Under BDT 8,000", "BDT 8,000–12,000", "Over BDT 12,000"] },
  { label: "Availability", options: ["In Stock", "Low Stock"] },
];

const DressProductCard = ({ product }: { product: CatalogProduct }) => {
  const { saved: wishlisted, toggle } = useWishlist({ id: product.id, name: product.name, price: product.salePrice ?? product.price, image: product.image, category: "Dresses", colour: product.colour, option: "M" });

  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-sm bg-beige/30 mb-4">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-[3/4] object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        </Link>
        {product.badge && (
          <span className="absolute top-3 left-3 bg-white/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-stone-700">
            {product.badge}
          </span>
        )}
        <button
          type="button"
          aria-label={`${wishlisted ? "Remove" : "Add"} ${product.name} ${wishlisted ? "from" : "to"} wishlist`}
          onClick={toggle}
          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full text-stone-700 hover:text-teal transition-colors"
        >
          <Heart size={16} className={wishlisted ? "fill-teal text-teal" : ""} />
        </button>
      </div>
      <Link to={`/product/${product.id}`}>
        <h3 className="font-serif text-lg text-stone-900 group-hover:text-teal transition-colors leading-tight">
          {product.name}
        </h3>
      </Link>
      <div className="flex items-center gap-2 mt-2 text-sm">
        {product.salePrice != null && product.salePrice < product.price ? (
          <>
            <span className="text-stone-400 line-through">BDT {product.price.toLocaleString()}</span>
            <span className="text-teal font-semibold">BDT {product.salePrice.toLocaleString()}</span>
          </>
        ) : (
          <span className="text-stone-800">BDT {product.price.toLocaleString()}</span>
        )}
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-stone-500">
        <span className="w-3 h-3 rounded-full bg-stone-800" />
        {product.colour}
      </div>
    </article>
  );
};

const Category = () => {
  const [activeSubcategory, setActiveSubcategory] = useState("All Dresses");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [sort, setSort] = useState("Featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [dressProducts, setDressProducts] = useState<CatalogProduct[]>([]);

  useEffect(() => {
    void (async () => {
      const [collection, allProducts] = await Promise.all([
        fetchBuilderCollection("dresses"),
        fetchBuilderProducts(),
      ]);
      const sorted = sortByDisplayOrder(allProducts);
      const cards = resolveCollectionProducts(collection?.products, sorted, "Dresses");
      if (cards.length) {
        setDressProducts(
          cards
            .map((item) => {
              const source = sorted.find((product) => product.slug === item.id);
              return source ? cmsToCatalog(source) : null;
            })
            .filter((item): item is CatalogProduct => Boolean(item)),
        );
      }
    })();
  }, []);

  const visibleProducts = useMemo(() => {
    const filtered = filterCatalogProducts(dressProducts, selectedFilters);
    return sortCatalogProducts(filtered, sort);
  }, [dressProducts, selectedFilters, sort]);

  const toggleFilter = (option: string) => {
    setSelectedFilters((current) => current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
  };

  const filters = (
    <div className="space-y-7">
      {filterGroups.map((group) => (
        <div key={group.label} className="border-b border-stone-200 pb-6">
          <h3 className="font-sans text-xs uppercase tracking-[0.16em] text-stone-800 mb-4">{group.label}</h3>
          <div className="space-y-3">
            {group.options.map((option) => (
              <label key={option} className="flex items-center gap-3 text-sm text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(option)}
                  onChange={() => toggleFilter(option)}
                  className="accent-teal w-4 h-4"
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory">
      <Header />

      <main>
        <section className="bg-cream/60 border-b border-beige/60">
          <div className="container mx-auto px-4 py-14 md:py-20 lg:py-24">
            <div className="grid md:grid-cols-[0.9fr_1.1fr] gap-10 md:gap-16 items-center">
              <div className="max-w-xl">
                <p className="text-teal text-[10px] font-semibold uppercase tracking-[0.24em] mb-5">Dresses</p>
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-stone-900 leading-[0.92] mb-6">
                  Italian Elegance for Every Occasion
                </h1>
                <p className="text-stone-600 leading-relaxed max-w-md mb-8">
                  Discover refined silhouettes, soft drapes, sculpted fits and timeless pieces designed for modern feminine confidence.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/shop/new" className="btn-primary">Shop New Arrivals</Link>
                  <Link to="/shop/occasionwear" className="btn-outline">Explore Occasion Dresses</Link>
                </div>
              </div>
              <div className="relative md:pl-8">
                <div className="absolute -top-5 -right-2 w-32 h-32 rounded-full border border-teal/20" />
                <img
                  src={DRESS_HERO_IMAGE}
                  alt="Amelie Milano dresses"
                  className="relative w-full aspect-[4/5] object-cover rounded-sm"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white border-b border-stone-200">
          <div className="container mx-auto px-4 py-5 overflow-x-auto">
            <div className="flex items-center gap-6 min-w-max">
              {subcategories.map((subcategory) => (
                <button
                  key={subcategory}
                  type="button"
                  onClick={() => setActiveSubcategory(subcategory)}
                  className={`text-xs uppercase tracking-[0.12em] pb-2 border-b transition-colors ${activeSubcategory === subcategory ? "border-teal text-teal" : "border-transparent text-stone-500 hover:text-teal"}`}
                >
                  {subcategory}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-ivory py-8 md:py-10">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
              <div><p className="font-serif text-xl text-stone-900 mb-1">Considered silhouettes</p><p className="text-sm text-stone-500">Designed to move beautifully with you.</p></div>
              <div><p className="font-serif text-xl text-stone-900 mb-1">Premium fabrics</p><p className="text-sm text-stone-500">Selected for softness, drape and lasting quality.</p></div>
              <div><p className="font-serif text-xl text-stone-900 mb-1">Made for Bangladesh</p><p className="text-sm text-stone-500">Tracked delivery and thoughtful service nationwide.</p></div>
            </div>
          </div>
        </section>

        <section className="bg-white py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-teal text-[10px] uppercase tracking-[0.2em] mb-3">The collection</p>
                <h2 className="font-serif text-4xl md:text-5xl text-stone-900">Dresses</h2>
                <p className="text-sm text-stone-500 mt-2">{visibleProducts.length} considered pieces</p>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setMobileFiltersOpen(true)} className="md:hidden inline-flex items-center gap-2 border border-stone-200 px-4 py-2 text-xs uppercase tracking-wider text-stone-700"><Filter size={15} /> Filter</button>
                <label className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="hidden sm:inline">Sort by</span>
                  <select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent border-0 text-xs uppercase tracking-wider text-stone-800 focus:ring-0">
                    <option>Featured</option><option>Price: Low to High</option><option>Price: High to Low</option>
                  </select>
                </label>
              </div>
            </div>

            {selectedFilters.length > 0 && <div className="flex flex-wrap gap-2 mb-7">{selectedFilters.map((filter) => <button key={filter} type="button" onClick={() => toggleFilter(filter)} className="inline-flex items-center gap-2 bg-cream px-3 py-1.5 text-xs text-stone-700">{filter}<X size={13} /></button>)}</div>}

            <div className="grid md:grid-cols-[190px_1fr] lg:grid-cols-[230px_1fr] gap-8 lg:gap-12">
              <aside className="hidden md:block">{filters}</aside>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-5 md:gap-y-12">
                {visibleProducts.map((product) => <DressProductCard key={product.id} product={product} />)}
              </div>
            </div>
          </div>
        </section>

        {mobileFiltersOpen && <div className="fixed inset-0 z-50 md:hidden"><button type="button" aria-label="Close filters" onClick={() => setMobileFiltersOpen(false)} className="absolute inset-0 bg-stone-900/30" /><div className="absolute right-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto bg-ivory p-6"><div className="flex items-center justify-between mb-8"><h2 className="font-serif text-2xl">Filter Dresses</h2><button type="button" onClick={() => setMobileFiltersOpen(false)}><X /></button></div>{filters}</div></div>}

        <section className="bg-cream/60 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="max-w-lg"><p className="text-teal text-[10px] uppercase tracking-[0.2em] mb-4">The Amelie Dress Edit</p><h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-5">Ease, elegance and confidence.</h2><p className="text-stone-600 leading-relaxed mb-7">From soft daytime silhouettes to after-dark statement pieces, each dress is selected to bring ease, elegance and confidence into your wardrobe.</p><Link to="/the-amelie-edit" className="btn-outline inline-flex items-center gap-2">Explore the Edit <ChevronRight size={16} /></Link></div>
              <div className="grid grid-cols-2 gap-4"><img src={visibleProducts[4]?.image ?? dressProducts[4]?.image} alt="Plum evening dress" className="w-full aspect-[3/4] object-cover" /><img src={visibleProducts[5]?.image ?? dressProducts[5]?.image} alt="Burgundy occasion gown" className="w-full aspect-[3/4] object-cover mt-10" /></div>
            </div>
          </div>
        </section>

        <section className="bg-teal-50 py-14 md:py-20">
          <div className="container mx-auto px-4 text-center max-w-2xl"><MessageCircle className="mx-auto text-teal mb-4" size={28} /><h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">Need help choosing the perfect dress?</h2><p className="text-stone-600 leading-relaxed mb-7">Our Style Concierge can help you find the right silhouette, size and styling direction for your occasion.</p><a href="https://wa.me/8801777993895?text=Hello%20Amelie%20Milano%2C%20I%20would%20love%20help%20choosing%20a%20dress." target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">Chat on WhatsApp</a></div>
        </section>

        <section className="bg-white py-14 md:py-20"><div className="container mx-auto px-4"><div className="flex items-end justify-between mb-8"><div><p className="text-teal text-[10px] uppercase tracking-[0.2em] mb-3">Complete the look</p><h2 className="font-serif text-4xl text-stone-900">You May Also Like</h2></div><Link to="/shop" className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-wider text-teal">Shop all <ChevronRight size={15} /></Link></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{visibleProducts.slice(2, 6).map((product) => <DressProductCard key={`related-${product.id}`} product={product} />)}</div></div></section>

        <section className="bg-ivory py-14 md:py-20"><div className="container mx-auto px-4 max-w-3xl text-center"><h2 className="font-serif text-3xl text-stone-900 mb-4">Dresses by Amelie Milano</h2><p className="text-sm text-stone-600 leading-relaxed">Shop premium dresses in Bangladesh, from refined day dresses and sculpted midi silhouettes to occasion gowns made for unforgettable evenings. Discover considered details, graceful draping and versatile pieces designed to become part of your signature wardrobe.</p></div></section>
      </main>
      <Footer />
    </div>
  );
};

export default Category;
