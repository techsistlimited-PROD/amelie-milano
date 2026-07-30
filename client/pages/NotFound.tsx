import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl md:text-7xl font-serif font-bold text-teal mb-6">
            404
          </div>

          <h1 className="text-heading text-stone-900 mb-4">
            Page Not Found
          </h1>

          <p className="text-stone-600 mb-8 text-lg">
            We couldn't find the page you're looking for. It may have been moved or doesn't exist.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-primary">
              Back to Home
            </Link>
            <Link to="/shop" className="btn-secondary">
              Continue Shopping
            </Link>
          </div>

          <div className="mt-12 text-center">
            <p className="text-stone-600 mb-4">
              Need help finding something?
            </p>
            <Link to="/contact" className="text-teal hover:text-teal-dark font-medium transition-colors">
              Get in touch with us
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
