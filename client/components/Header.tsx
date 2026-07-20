import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, User, Heart, ShoppingBag } from "lucide-react";
import { cartEventName, cartItemCount, readCart } from "@/lib/cart";
import { storeCatalog } from "@/lib/storeCatalog";

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const syncCartCount = () => setCartCount(cartItemCount(readCart()));
    syncCartCount();
    window.addEventListener(cartEventName, syncCartCount);
    window.addEventListener("storage", syncCartCount);
    return () => {
      window.removeEventListener(cartEventName, syncCartCount);
      window.removeEventListener("storage", syncCartCount);
    };
  }, []);

  const suggestions = searchQuery.trim().length > 1 ? storeCatalog.filter((product) => product.name.toLowerCase().includes(searchQuery.trim().toLowerCase())).slice(0, 5) : [];
  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setSearchOpen(false);
    navigate(`/shop?query=${encodeURIComponent(query)}`);
  };
  const chooseSuggestion = (name: string) => {
    setSearchQuery(name);
    setSearchOpen(false);
    navigate(`/shop?query=${encodeURIComponent(name)}`);
  };

  const mainMenu = [
    { label: "About Amelie", href: "/about" },
    { label: "New In", href: "/shop/new" },
    { label: "Dresses", href: "/shop/dresses" },
    { label: "Occasionwear", href: "/shop/occasionwear" },
    { label: "Body Care", href: "/shop/body-care" },
    { label: "Gym Wear", href: "/shop/gym-wear" },
    { label: "Bags", href: "/shop/bags" },
    { label: "Shoes", href: "/shop/shoes" },
    { label: "The Amelie Edit", href: "/the-amelie-edit" },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-teal text-white text-center py-2 text-sm font-medium">
        Free delivery on orders over BDT 3,000 | Subscribe to our newsletter for exclusive offers
      </div>

      {/* Desktop Header */}
      <header className="hidden md:block bg-white border-b border-stone-200">
        {/* Top Navigation Bar */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-6">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 h-12">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fdf5c9374fa1341c5b13ec5b76a227fc3?format=webp&width=800&height=1200"
                alt="Amelie Milano"
                className="h-full object-contain"
              />
            </Link>

            {/* Main Navigation */}
            <nav className="flex-1 mx-12">
              <ul className="flex items-center justify-center gap-8">
                {mainMenu.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="text-sm font-medium text-stone-600 hover:text-teal transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-6">
              <button type="button" aria-label="Open product search" aria-expanded={searchOpen} onClick={() => setSearchOpen(true)} className="text-stone-600 hover:text-teal transition-colors duration-200">
                <Search size={20} />
              </button>
              <Link
                to="/account"
                className="text-stone-600 hover:text-teal transition-colors duration-200"
              >
                <User size={20} />
              </Link>
              <Link
                to="/wishlist"
                className="text-stone-600 hover:text-teal transition-colors duration-200"
              >
                <Heart size={20} />
              </Link>
              <Link
                to="/cart"
                className="text-stone-600 hover:text-teal transition-colors duration-200"
              >
                <span className="relative"><ShoppingBag size={20} />{cartCount > 0 && <span className="absolute -top-2 -right-3 bg-teal text-white text-[10px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center">{cartCount}</span>}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-stone-200 sticky top-9 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-stone-600 hover:text-teal transition-colors duration-200"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-1 text-center h-10">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fdf5c9374fa1341c5b13ec5b76a227fc3?format=webp&width=800&height=1200"
                alt="Amelie Milano"
                className="h-full object-contain inline"
              />
            </Link>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              <button type="button" aria-label="Open product search" aria-expanded={searchOpen} onClick={() => setSearchOpen(true)} className="text-stone-600 hover:text-teal transition-colors duration-200">
                <Search size={20} />
              </button>
              <Link
                to="/cart"
                className="text-stone-600 hover:text-teal transition-colors duration-200 relative"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-teal text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                  {cartCount}
                </span>}
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="py-4 border-t border-stone-200">
              <ul className="space-y-3">
                {mainMenu.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="block text-sm font-medium text-stone-600 hover:text-teal transition-colors duration-200 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-stone-200 mt-4 pt-4 flex gap-4">
                <Link
                  to="/account"
                  className="flex-1 text-center text-sm font-medium text-stone-600 hover:text-teal transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account
                </Link>
                <Link
                  to="/wishlist"
                  className="flex-1 text-center text-sm font-medium text-stone-600 hover:text-teal transition-colors duration-200 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Wishlist
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>
      {searchOpen && <div className="fixed inset-x-0 top-9 z-50 border-b border-stone-200 bg-white px-4 py-5 shadow-lg"><form onSubmit={submitSearch} className="container mx-auto max-w-3xl"><div className="flex items-center gap-3 border-b border-stone-300 pb-3"><Search size={20} className="shrink-0 text-teal" /><label htmlFor="header-search" className="sr-only">Search Amelie Milano products</label><input id="header-search" autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search dresses, bags, body care..." className="min-w-0 flex-1 bg-transparent text-base text-stone-900 outline-none placeholder:text-stone-400" /><button type="submit" className="text-xs uppercase tracking-[0.14em] text-teal hover:text-teal-dark">Search</button><button type="button" aria-label="Close product search" onClick={() => setSearchOpen(false)} className="text-stone-500 hover:text-teal"><X size={20} /></button></div>{suggestions.length > 0 && <div className="mt-3" role="listbox" aria-label="Product suggestions">{suggestions.map((product) => <button type="button" key={product.id} onClick={() => chooseSuggestion(product.name)} className="flex w-full items-center gap-3 px-2 py-2 text-left hover:bg-[#F0E9E2]"><img src={product.image} alt="" className="h-10 w-8 object-cover" /><span><span className="block font-serif text-base text-stone-900">{product.name}</span><span className="block text-[10px] uppercase tracking-[0.12em] text-stone-500">{product.category} · BDT {product.price.toLocaleString()}</span></span></button>)}</div>}{searchQuery.trim().length > 1 && suggestions.length === 0 && <p className="mt-3 text-sm text-stone-500">Press Search to view matching pieces.</p>}</form></div>}
    </>
  );
};

export default Header;
