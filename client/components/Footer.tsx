import { Link } from "react-router-dom";
import { Mail, Instagram, Facebook, TrendingUp } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";

const Footer = () => {
  return (
    <footer className="bg-ivory border-t border-stone-200">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-teal-50 to-cream">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-serif font-semibold text-stone-900 mb-4">
              Join the Amelie Milano Club
            </h3>
            <p className="text-stone-600 mb-6 text-sm md:text-base">
              Subscribe to our newsletter for exclusive styles, early access to collections, and special offers.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1">
            <div className="h-12 mb-4">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fdf5c9374fa1341c5b13ec5b76a227fc3?format=webp&width=800&height=1200"
                alt="Amelie Milano"
                className="h-full object-contain"
              />
            </div>
            <p className="text-sm text-stone-600 mb-6 leading-relaxed">
              Premium Italian-Western fashion and lifestyle brand for the modern, sophisticated woman.
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/ameliemilano16" target="_blank" rel="noopener noreferrer" aria-label="Amelie Milano on Instagram" className="text-teal hover:text-teal-dark transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/people/Amelie-Milano/61585229184857" target="_blank" rel="noopener noreferrer" aria-label="Amelie Milano on Facebook" className="text-teal hover:text-teal-dark transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-serif font-semibold text-stone-900 mb-4">Shop</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/shop/dresses" className="text-stone-600 hover:text-teal transition-colors">
                  Dresses
                </Link>
              </li>
              <li>
                <Link to="/shop/occasionwear" className="text-stone-600 hover:text-teal transition-colors">
                  Occasionwear
                </Link>
              </li>
              <li>
                <Link to="/shop/body-care" className="text-stone-600 hover:text-teal transition-colors">
                  Body Care
                </Link>
              </li>
              <li>
                <Link to="/shop/gym-wear" className="text-stone-600 hover:text-teal transition-colors">
                  Gym Wear
                </Link>
              </li>
              <li>
                <Link to="/shop/bags" className="text-stone-600 hover:text-teal transition-colors">
                  Bags
                </Link>
              </li>
              <li>
                <Link to="/shop/shoes" className="text-stone-600 hover:text-teal transition-colors">
                  Shoes
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-serif font-semibold text-stone-900 mb-4">Customer Care</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/contact" className="text-stone-600 hover:text-teal transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-stone-600 hover:text-teal transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-stone-600 hover:text-teal transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-stone-600 hover:text-teal transition-colors">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-stone-600 hover:text-teal transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-serif font-semibold text-stone-900 mb-4">About</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="text-stone-600 hover:text-teal transition-colors">
                  About Amelie
                </Link>
              </li>
              <li>
                <Link to="/brand-story" className="text-stone-600 hover:text-teal transition-colors">
                  Brand Story
                </Link>
              </li>
              <li>
                <Link to="/style-concierge" className="text-stone-600 hover:text-teal transition-colors">
                  Style Concierge
                </Link>
              </li>
              <li>
                <Link to="/journal" className="text-stone-600 hover:text-teal transition-colors">
                  Journal
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-stone-600 hover:text-teal transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-stone-600 hover:text-teal transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-stone-200 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-stone-600">
          <div className="mb-4 md:mb-0">
            <p>&copy; 2024 Amelie Milano. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-4">
            <span>Made with care in Bangladesh</span>
            <div className="flex gap-2">
              <span className="inline-block w-8 h-5 bg-stone-300 rounded text-xs flex items-center justify-center">Visa</span>
              <span className="inline-block w-8 h-5 bg-stone-300 rounded text-xs flex items-center justify-center">MC</span>
              <span className="inline-block w-8 h-5 bg-stone-300 rounded text-xs flex items-center justify-center">bKash</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
