import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Category from "./pages/Category";
import NewIn from "./pages/NewIn";
import Occasionwear from "./pages/Occasionwear";
import BodyCare from "./pages/BodyCare";
import GymWear from "./pages/GymWear";
import Bags from "./pages/Bags";
import Shoes from "./pages/Shoes";
import TheAmelieEdit from "./pages/TheAmelieEdit";
import Collection from "./pages/Collection";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import OrderHistory from "./pages/OrderHistory";
import About from "./pages/About";
import BrandStory from "./pages/BrandStory";
import StyleConcierge from "./pages/StyleConcierge";
import Journal from "./pages/Journal";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import SizeGuide from "./pages/SizeGuide";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/new" element={<NewIn />} />
          <Route path="/shop/occasionwear" element={<Occasionwear />} />
          <Route path="/shop/body-care" element={<BodyCare />} />
          <Route path="/shop/gym-wear" element={<GymWear />} />
          <Route path="/shop/bags" element={<Bags />} />
          <Route path="/shop/shoes" element={<Shoes />} />
          <Route path="/shop/:category" element={<Category />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/collection/:id" element={<Collection />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Account />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/about" element={<About />} />
          <Route path="/brand-story" element={<BrandStory />} />
          <Route path="/style-concierge" element={<StyleConcierge />} />
          <Route path="/journal/*" element={<Journal />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/size-guide" element={<SizeGuide />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/the-amelie-edit" element={<TheAmelieEdit />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
