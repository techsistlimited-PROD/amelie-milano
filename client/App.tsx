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
import ShopCategory from "./pages/ShopCategory";
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
import JournalArticle from "./pages/JournalArticle";
import SiteMeta from "./components/SiteMeta";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import SizeGuide from "./pages/SizeGuide";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import BuilderRouteContent from "./components/BuilderRouteContent";
import AuthBootstrap from "./components/AuthBootstrap";
import AuthCallback from "./pages/AuthCallback";
import AdminApp from "./pages/admin/AdminApp";
import { useEffect } from "react";
import { checkCmsStatus } from "./lib/cms";

const CmsBootstrap = () => {
  useEffect(() => {
    void checkCmsStatus();
  }, []);
  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthBootstrap />
        <CmsBootstrap />
        <SiteMeta />
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/" element={<BuilderRouteContent><Index /></BuilderRouteContent>} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/new" element={<NewIn />} />
          <Route path="/shop/dresses" element={<Category />} />
          <Route path="/shop/:category" element={<ShopCategory />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/collection/:id" element={<BuilderRouteContent><Collection /></BuilderRouteContent>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Account />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/about" element={<BuilderRouteContent><About /></BuilderRouteContent>} />
          <Route path="/brand-story" element={<BuilderRouteContent><BrandStory /></BuilderRouteContent>} />
          <Route path="/style-concierge" element={<BuilderRouteContent><StyleConcierge /></BuilderRouteContent>} />
          <Route path="/journal/:slug" element={<JournalArticle />} />
          <Route path="/journal/*" element={<BuilderRouteContent><Journal /></BuilderRouteContent>} />
          <Route path="/contact" element={<BuilderRouteContent><Contact /></BuilderRouteContent>} />
          <Route path="/faq" element={<BuilderRouteContent><FAQ /></BuilderRouteContent>} />
          <Route path="/size-guide" element={<BuilderRouteContent><SizeGuide /></BuilderRouteContent>} />
          <Route path="/shipping" element={<BuilderRouteContent><Shipping /></BuilderRouteContent>} />
          <Route path="/returns" element={<BuilderRouteContent><Returns /></BuilderRouteContent>} />
          <Route path="/privacy" element={<BuilderRouteContent><Privacy /></BuilderRouteContent>} />
          <Route path="/terms" element={<BuilderRouteContent><Terms /></BuilderRouteContent>} />
          <Route path="/the-amelie-edit" element={<BuilderRouteContent><TheAmelieEdit /></BuilderRouteContent>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
