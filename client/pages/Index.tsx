import { Link } from "react-router-dom";
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
    name: "Luxury Body Oil",
    price: 3500,
    image: "https://images.unsplash.com/photo-1556410351-2b3a7f6f8a4d?w=500&h=500&fit=crop",
    isSale: true,
  },
  {
    id: "6",
    name: "Leather Structured Bag",
    price: 18999,
    salePrice: 15199,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    isSale: true,
  },
  {
    id: "7",
    name: "Premium Gym Set",
    price: 6999,
    image: "https://images.unsplash.com/photo-1506629082147-11fa2e49a148?w=500&h=500&fit=crop",
  },
  {
    id: "8",
    name: "Italian Leather Heels",
    price: 11999,
    image: "https://images.unsplash.com/photo-1543163521-9145f931371e?w=500&h=500&fit=crop",
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
  return (
    <div className="min-h-screen bg-ivory">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen md:h-[600px] flex items-center justify-center overflow-hidden">
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F5aa7f80c289a43d3b87e7f6ef3a83b4b?format=webp&width=800&height=1200"
          alt="Italian Elegance. Bengali Soul."
          className="absolute inset-0 w-full h-full object-cover"
        />
      </section>

      {/* Shop by Category */}
      <section className="bg-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-stone-900 mb-2">
              Shop by Category
            </h2>
            <p className="text-stone-600 text-sm max-w-lg mx-auto">
              Explore our curated collections designed for every occasion and lifestyle
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-4">
            {categories.map((cat) => (
              <CategoryCardSimple key={cat.name} {...cat} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-heading text-stone-900 mb-2">New Arrivals</h2>
              <p className="text-stone-600">Discover what's trending this season</p>
            </div>
            <Link to="/shop/new" className="hidden md:flex items-center gap-2 text-teal hover:text-teal-dark transition-colors">
              View All <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            {newArrivals.map((product) => (
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
      <section className="section-spacing bg-gradient-to-r from-teal-50 to-cream">
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
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <p className="text-teal font-medium text-sm tracking-wider uppercase mb-4">
                Special Collection
              </p>
              <h2 className="text-heading text-stone-900 mb-6">
                Occasion Wear Collection
              </h2>
              <p className="text-stone-600 mb-6 leading-relaxed">
                From intimate gatherings to grand celebrations, our Occasionwear collection offers timeless elegance for every special moment. Each piece is designed to make you feel confident, beautiful, and unforgettable.
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
                src="https://images.unsplash.com/photo-1540183388-f94340b70d16?w=600&h=600&fit=crop"
                alt="Occasionwear"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Italian Edit Editorial Section */}
      <section className="section-spacing bg-gradient-to-b from-cream to-ivory">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-teal font-medium text-sm tracking-wider uppercase mb-4">
              Editorial
            </p>
            <h2 className="text-heading text-stone-900 mb-6">
              The Amelie Edit
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed">
              Our curated selection of European-inspired pieces that define contemporary femininity. Discover the stories, the craftsmanship, and the soul behind every collection.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <article className="group">
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-6">
                <img
                  src="https://images.unsplash.com/photo-1595916743269-ff24e1ffde43?w=600&h=600&fit=crop"
                  alt="Italian Craftsmanship"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-teal text-sm font-medium mb-2 uppercase tracking-wider">
                Craftsmanship
              </p>
              <h3 className="text-subheading text-stone-900 mb-3 group-hover:text-teal transition-colors">
                The Art of Italian Tailoring
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-4">
                Explore how centuries of Italian fashion heritage inspire every stitch in the Amelie collection...
              </p>
              <Link to="/journal/italian-tailoring" className="text-teal font-medium text-sm hover:text-teal-dark flex items-center gap-2">
                Read More <ChevronRight size={16} />
              </Link>
            </article>

            <article className="group">
              <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-6">
                <img
                  src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&h=600&fit=crop"
                  alt="Style Tips"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-teal text-sm font-medium mb-2 uppercase tracking-wider">
                Style Guide
              </p>
              <h3 className="text-subheading text-stone-900 mb-3 group-hover:text-teal transition-colors">
                Styling the Perfect Wardrobe Essentials
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed mb-4">
                Learn how to mix and match our pieces to create sophisticated, versatile looks for any occasion...
              </p>
              <Link to="/journal/wardrobe-essentials" className="text-teal font-medium text-sm hover:text-teal-dark flex items-center gap-2">
                Read More <ChevronRight size={16} />
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-heading text-stone-900 mb-2">Best Sellers</h2>
              <p className="text-stone-600">Customer favorites and trending pieces</p>
            </div>
            <Link to="/shop?sort=popular" className="hidden md:flex items-center gap-2 text-teal hover:text-teal-dark transition-colors">
              View All <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            {bestSellers.map((product) => (
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
      <section className="section-spacing bg-gradient-to-r from-teal-50 via-cream to-teal-50">
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
      <section className="section-spacing bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative h-96 md:h-full rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1556410351-2b3a7f6f8a4d?w=600&h=600&fit=crop"
                alt="Body Care"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-teal font-medium text-sm tracking-wider uppercase mb-4">
                Lifestyle Collection
              </p>
              <h2 className="text-heading text-stone-900 mb-6">
                Luxury Body Care
              </h2>
              <p className="text-stone-600 mb-6 leading-relaxed">
                Elevate your self-care ritual with our carefully curated body care collection. From luxurious oils and butters to premium skincare essentials, each product is selected to nourish and pamper.
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
      <section className="section-spacing bg-gradient-to-b from-cream to-ivory">
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
                href="#"
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <img
                  src={`https://images.unsplash.com/photo-${
                    [
                      "1595777707802-221466a7e5c0",
                      "1594938298603-c8148c4dae35",
                      "1596215267419-f7e0dc9e7ecd",
                      "1591195853828-11db59a44f6b",
                      "1556410351-2b3a7f6f8a4d",
                      "1553062407-98eeb64c6a62",
                    ][i - 1]
                  }?w=400&h=400&fit=crop`}
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
