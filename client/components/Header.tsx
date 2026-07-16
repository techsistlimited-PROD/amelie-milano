import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search, User, Heart, ShoppingBag } from "lucide-react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <button className="text-stone-600 hover:text-teal transition-colors duration-200">
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
                <ShoppingBag size={20} />
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
              <button className="text-stone-600 hover:text-teal transition-colors duration-200">
                <Search size={20} />
              </button>
              <Link
                to="/cart"
                className="text-stone-600 hover:text-teal transition-colors duration-200 relative"
              >
                <ShoppingBag size={20} />
                <span className="absolute -top-2 -right-2 bg-teal text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
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
    </>
  );
};

export default Header;
