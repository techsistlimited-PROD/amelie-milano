import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBuilderProducts, fetchBuilderSiteSections, type BuilderSiteSectionData } from "@/lib/builder";
import { resolveSectionProducts, sortByDisplayOrder, toProductCard } from "@/lib/cmsCatalog";
import type { CmsProduct } from "@/lib/cms";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import CategoryCardSimple from "@/components/CategoryCardSimple";
import { ChevronRight, MessageCircle } from "lucide-react";

// Mock data - will be replaced with CMS data
const newArrivals = [
  {
    id: "1",
    name: "Espresso Drape Kaftan",
    price: 8375,
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fca01513621cd4cd19c92e5bb2129ea91?format=webp&width=800&height=1200",
    isNew: true,
  },
  {
    id: "2",
    name: "Champagne Pleated Corset",
    price: 11500,
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F9e4e485b99eb4fd9b45892f8bf08f453?format=webp&width=800&height=1200",
    isNew: true,
  },
  {
    id: "3",
    name: "Ivory Off-Shoulder Sash Gown",
    price: 9200,
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F7d742ca7c32545b4bf89e1999827cb6f?format=webp&width=800&height=1200",
    isNew: true,
  },
  {
    id: "4",
    name: "Noir One-Shoulder Cutout",
    price: 10500,
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fac1870ce26284d1e9c304a0b6fa78fde?format=webp&width=800&height=1200",
    isNew: true,
  },
];

const bestSellers = [
  {
    id: "5",
    name: "Emerald Sculpted Cut-Out Midi",
    price: 9800,
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fdcc6f86cb6304c5fb08d26ef7042210a?format=webp&width=800&height=1200",
  },
  {
    id: "6",
    name: "Noir Draped Signature Midi",
    price: 8200,
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F95373c4bbed741118a67d63a23bbdf72?format=webp&width=800&height=1200",
  },
  {
    id: "7",
    name: "Ivory Lace Trim Satin Mini",
    price: 9200,
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fb635bffe5fd04d4a8f493a13dd95ab3d?format=webp&width=800&height=1200",
  },
  {
    id: "8",
    name: "Cobalt Ruched Draped Mini",
    price: 7200,
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F8a0c8e89869744efbbc501318fe5aef5?format=webp&width=800&height=1200",
  },
];

const categories = [
  {
    name: "Dresses",
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fd82ccb0930fd4d0e8a2edb49f49368e1?format=webp&width=800&height=1200",
    href: "/shop/dresses",
  },
  {
    name: "Occasionwear",
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Ff2edad5f9989469e9179290f0356a25b?format=webp&width=800&height=1200",
    href: "/shop/occasionwear",
  },
  {
    name: "Bags",
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F3988c05f36f646f7a4b4e3d2bb4d5577?format=webp&width=800&height=1200",
    href: "/shop/bags",
  },
  {
    name: "Shoes",
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fa188b5e269974be1a7c523bdc5828e29?format=webp&width=800&height=1200",
    href: "/shop/shoes",
  },
  {
    name: "Body Care",
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fb5e5c4bd8fac48ca88b902093690eca1?format=webp&width=800&height=1200",
    href: "/shop/body-care",
  },
  {
    name: "Gym Wear",
    image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F61b91b6c3b7641a5a64f36a2e0bd93b6?format=webp&width=800&height=1200",
    href: "/shop/gym-wear",
  },
];

const Index = () => {
  const [cmsSections, setCmsSections] = useState<BuilderSiteSectionData[]>([]);
  const [cmsProducts, setCmsProducts] = useState<CmsProduct[]>([]);
  const [cmsReady, setCmsReady] = useState(false);

  useEffect(() => {
    void (async () => {
      const [sections, products] = await Promise.all([
        fetchBuilderSiteSections(),
        fetchBuilderProducts(),
      ]);
      setCmsSections(sections);
      setCmsProducts(sortByDisplayOrder(products));
      setCmsReady(true);
    })();
  }, []);

  const sections = useMemo(() => new Map(cmsSections.map((section) => [section.key, section])), [cmsSections]);
  const getSection = (key: string) => sections.get(key);
  const sectionVisible = (key: string) => {
    const section = getSection(key);
    if (!section) return true;
    return section.isVisible !== false;
  };
  const homepageCategories = getSection("homepage-categories")?.items?.length
    ? getSection("homepage-categories")?.items?.map((item) => typeof item === "string" ? { name: item, image: "", href: "#" } : { name: item.name ?? item.label ?? item.title ?? "", image: item.image ?? "", href: item.href ?? item.url ?? "#" })
    : categories;
  const homepageNewArrivals = cmsReady
    ? resolveSectionProducts(getSection("homepage-new-arrivals"), cmsProducts, (product) => Boolean(product.isNew))
    : newArrivals;
  const homepageBestSellers = cmsReady
    ? resolveSectionProducts(getSection("homepage-best-sellers"), cmsProducts, (product) => !product.isNew)
    : bestSellers;
  const hero = getSection("homepage-hero");

  return (
    <div className="min-h-screen bg-ivory">
      <Header />

      {/* Hero Section */}
      <section className={`${sectionVisible("homepage-hero") ? "" : "hidden"} relative aspect-[4/3] md:aspect-[3/1] flex items-center justify-center overflow-hidden bg-stone-950`}>
        <img
          src={hero?.heroImage || "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F41503ed6b6384ec098bdd9f6977128f5?format=webp&width=2000&quality=95"}
          alt={hero?.title || "Italian Elegance. Bengali Soul."}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center text-white">
          {hero?.eyebrow && (
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-teal-200 md:text-xs">
              {hero.eyebrow}
            </p>
          )}
          <h1 className="font-serif text-3xl font-semibold leading-tight md:text-5xl lg:text-6xl">
            {hero?.title || "Italian Elegance. Bengali Soul."}
          </h1>
          {hero?.body && (
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-stone-100 md:text-base">
              {hero.body}
            </p>
          )}
        </div>
      </section>

      {/* Shop by Category */}
      <section className={`${sectionVisible("homepage-categories") ? "" : "hidden"} bg-white py-8 md:py-12`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-stone-900 mb-2">
              {getSection("homepage-categories")?.title || "Shop by Category"}
            </h2>
            <p className="text-stone-600 text-sm max-w-lg mx-auto">
              {getSection("homepage-categories")?.body || "Explore our curated collections designed for every occasion and lifestyle"}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-4">
            {homepageCategories.map((cat) => (
              <CategoryCardSimple key={cat.name} {...cat} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className={`${sectionVisible("homepage-new-arrivals") ? "" : "hidden"} section-spacing bg-white`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-heading text-stone-900 mb-2">{getSection("homepage-new-arrivals")?.title || "New Arrivals"}</h2>
              <p className="text-stone-600">{getSection("homepage-new-arrivals")?.body || "Discover what's trending this season"}</p>
            </div>
            <Link to="/shop/new" className="hidden md:flex items-center gap-2 text-teal hover:text-teal-dark transition-colors">
              View All <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            {homepageNewArrivals.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="flex md:hidden justify-center">
            <Link to="/shop/new" className="btn-outline">
              View All New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Promise Section */}
      <section className={`${sectionVisible("homepage-brand-promise") ? "" : "hidden"} section-spacing bg-gradient-to-r from-teal-50 to-cream`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-5xl font-serif font-semibold text-teal mb-4">✓</div>
              <h3 className="text-subheading text-stone-900 mb-3">Premium Quality</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Ethically sourced Italian and European materials, crafted with meticulous attention to detail.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif font-semibold text-teal mb-4">✓</div>
              <h3 className="text-subheading text-stone-900 mb-3">Fast Delivery</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Secure, tracked delivery throughout Bangladesh. Free shipping on orders over BDT 3,000.
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-serif font-semibold text-teal mb-4">✓</div>
              <h3 className="text-subheading text-stone-900 mb-3">Hassle-free Returns</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                30-day returns and exchanges. We want you to feel confident in every purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Occasionwear Feature */}
      <section className={`${sectionVisible("homepage-occasionwear") ? "" : "hidden"} section-spacing bg-white`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <p className="text-teal font-medium text-sm tracking-wider uppercase mb-4">
                Special Collection
              </p>
              <h2 className="text-heading text-stone-900 mb-6">
                {getSection("homepage-occasionwear")?.title || "Occasion Wear Collection"}
              </h2>
              <p className="text-stone-600 mb-6 leading-relaxed">
                {getSection("homepage-occasionwear")?.body || "From intimate gatherings to grand celebrations, our Occasionwear collection offers timeless elegance for every special moment. Each piece is designed to make you feel confident, beautiful, and unforgettable."}
              </p>
              <ul className="space-y-3 mb-8 text-sm text-stone-600">
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold mt-1">•</span>
                  <span>Premium fabrics including silk charmeuse and Italian linen</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold mt-1">•</span>
                  <span>Thoughtful designs that flatter every body type</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold mt-1">•</span>
                  <span>Professional styling support via WhatsApp</span>
                </li>
              </ul>
              <Link to="/shop/occasionwear" className="btn-primary inline-block">
                Explore Occasionwear
              </Link>
            </div>
            <div className="relative h-96 md:h-full rounded-lg overflow-hidden">
              <img
                src={getSection("homepage-occasionwear")?.heroImage || "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fa040fefdb8b84ba48c5f3f10f68cf2db?format=webp&width=1600&quality=90"}
                alt={getSection("homepage-occasionwear")?.title || "Occasionwear"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* The Amelie Edit Editorial Section */}
      <section className={`${sectionVisible("homepage-editorial") ? "" : "hidden"} section-spacing bg-ivory`}>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
            <p className="text-teal text-[10px] font-semibold uppercase tracking-[0.24em] mb-3">
              Editorial
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 mb-4">
              The Amelie Edit
            </h2>
            <p className="text-stone-600 text-sm md:text-base leading-relaxed">
              Stories of craftsmanship, style, and the art of dressing beautifully.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center mb-16 md:mb-24">
            <article className="group max-w-md md:justify-self-end">
              <p className="text-teal text-[10px] font-semibold mb-3 uppercase tracking-[0.2em]">
                Italian Craftsmanship
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4 group-hover:text-teal transition-colors">
                The Art of Italian Tailoring
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-4">
                Explore how centuries of Italian fashion heritage inspire every stitch in the Amelie collection.
              </p>
              <Link to="/journal/italian-tailoring" className="text-teal font-medium text-xs hover:text-teal-dark flex items-center gap-2">
                Read More <ChevronRight size={15} />
              </Link>
            </article>
            <div className="relative h-64 md:h-72 overflow-hidden">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F92b67c169b484849bc0557782bc3580b?format=webp&width=1600&quality=90"
                alt="Italian craftsmanship with fabric and thread"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="relative h-64 md:h-72 overflow-hidden md:order-1">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fc09eb3a2d9da4b20b5d3d99979a90b4f?format=webp&width=1600&quality=90"
                alt="Style guide editorial with fashion sketch and accessories"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <article className="group max-w-md md:order-2">
              <p className="text-teal text-[10px] font-semibold mb-3 uppercase tracking-[0.2em]">
                Style Guide
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4 group-hover:text-teal transition-colors">
                Styling the Perfect Wardrobe Essentials
              </h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-4">
                Learn how to mix and match our pieces to create sophisticated, versatile looks for any occasion.
              </p>
              <Link to="/journal/wardrobe-essentials" className="text-teal font-medium text-xs hover:text-teal-dark flex items-center gap-2">
                Read More <ChevronRight size={15} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className={`${sectionVisible("homepage-best-sellers") ? "" : "hidden"} section-spacing bg-white`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-heading text-stone-900 mb-2">{getSection("homepage-best-sellers")?.title || "Best Sellers"}</h2>
              <p className="text-stone-600">{getSection("homepage-best-sellers")?.body || "Customer favorites and trending pieces"}</p>
            </div>
            <Link to="/shop?sort=popular" className="hidden md:flex items-center gap-2 text-teal hover:text-teal-dark transition-colors">
              View All <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            {homepageBestSellers.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="flex md:hidden justify-center">
            <Link to="/shop?sort=popular" className="btn-outline">
              View All Best Sellers
            </Link>
          </div>
        </div>
      </section>

      {/* Style Concierge */}
      <section className={`${sectionVisible("homepage-style-concierge") ? "" : "hidden"} section-spacing bg-gradient-to-r from-teal-50 via-cream to-teal-50`}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-teal font-medium text-sm tracking-wider uppercase mb-4">
              Personal Styling
            </p>
            <h2 className="text-heading text-stone-900 mb-6">
              Style Concierge
            </h2>
            <p className="text-stone-600 mb-8 leading-relaxed">
              Need help curating your perfect look? Our style experts are here to guide you. Share your preferences, occasion, and budget, and receive personalized recommendations tailored just for you.
            </p>

            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div>
                  <h4 className="font-serif font-semibold text-stone-900 mb-3">
                    Tell Us About You
                  </h4>
                  <p className="text-sm text-stone-600">
                    Share your style preferences, size, and favorite occasions
                  </p>
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-stone-900 mb-3">
                    Expert Curation
                  </h4>
                  <p className="text-sm text-stone-600">
                    Our team carefully selects pieces matching your unique taste
                  </p>
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-stone-900 mb-3">
                    Direct Support
                  </h4>
                  <p className="text-sm text-stone-600">
                    Connect with our stylists via WhatsApp for real-time guidance
                  </p>
                </div>
              </div>

              <Link to="/style-concierge" className="btn-primary inline-flex items-center gap-2">
                <MessageCircle size={18} />
                Get Started with Style Concierge
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Body Care & Lifestyle */}
      <section className={`${sectionVisible("homepage-body-care") ? "" : "hidden"} section-spacing bg-white`}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative h-96 md:h-full rounded-lg overflow-hidden">
              <img
                src={getSection("homepage-body-care")?.heroImage || "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F0d417769e65540bd9117838b5867ff55?format=webp&width=1600&quality=90"}
                alt={getSection("homepage-body-care")?.title || "Luxury Body Care"}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-teal font-medium text-sm tracking-wider uppercase mb-4">
                Lifestyle Collection
              </p>
              <h2 className="text-heading text-stone-900 mb-6">
                {getSection("homepage-body-care")?.title || "Luxury Body Care"}
              </h2>
              <p className="text-stone-600 mb-6 leading-relaxed">
                {getSection("homepage-body-care")?.body || "Elevate your self-care ritual with our carefully curated body care collection. From luxurious oils and butters to premium skincare essentials, each product is selected to nourish and pamper."}
              </p>
              <ul className="space-y-3 mb-8 text-sm text-stone-600">
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold mt-1">•</span>
                  <span>Natural, sustainably sourced ingredients</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold mt-1">•</span>
                  <span>Indulgent fragrances and textures</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal font-bold mt-1">•</span>
                  <span>Perfect for gifting or personal indulgence</span>
                </li>
              </ul>
              <Link to="/shop/body-care" className="btn-primary inline-block">
                Explore Body Care
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className={`${sectionVisible("homepage-instagram") ? "" : "hidden"} section-spacing bg-gradient-to-b from-cream to-ivory`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-teal font-medium text-sm tracking-wider uppercase mb-4">
              Community
            </p>
            <h2 className="text-heading text-stone-900 mb-4">
              Follow @ameliamilano
            </h2>
            <p className="text-stone-600">
              See how our community styles Amelie pieces
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <a
                key={i}
                href="https://www.instagram.com/ameliemilano16"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View Amelie Milano Instagram post ${i}`}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <img
                  src={[
                    "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F364feacf7efb4d44a25c5c9e3d6993a1?format=webp&width=800&height=1200",
                    "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F16fa447f693649098784bf9dda62013e?format=webp&width=800&height=1200",
                    "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fb4f07e253f7d4d9b9dbe177a23c45542?format=webp&width=800&height=1200",
                    "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F0650cd08c0e24f9f826d751cec812038?format=webp&width=800&height=1200",
                    "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F63a7deba53de4477819e21620ada607c?format=webp&width=800&height=1200",
                    "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F53321ed54c234d73bda8c6d825654742?format=webp&width=800&height=1200",
                  ][i - 1]}
                  alt={`Instagram post ${i}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-colors duration-300 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.646.069 4.85 0 3.204-.012 3.584-.07 4.85-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA - Handled in Footer */}
      <Footer />
    </div>
  );
};

export default Index;
