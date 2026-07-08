import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-teal hover:text-teal-dark mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm border border-stone-200">
            <div className="w-16 h-16 bg-teal-50 rounded-full mx-auto mb-6 flex items-center justify-center">
              <div className="text-2xl">✨</div>
            </div>

            <h1 className="text-heading text-stone-900 mb-4">{title}</h1>

            <p className="text-stone-600 mb-8 leading-relaxed">
              {description}
            </p>

            <p className="text-sm text-stone-500 mb-8">
              This page is being designed and will be ready soon. In the meantime, explore our collection or let us know if you need anything!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="btn-primary">
                Back to Home
              </Link>
              <Link to="/shop" className="btn-secondary">
                Shop Now
              </Link>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-stone-600 mb-4">
              Have questions? Let's chat!
            </p>
            <p className="text-sm text-stone-500">
              Contact us at support@ameliamilano.com or message us on WhatsApp
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PlaceholderPage;
