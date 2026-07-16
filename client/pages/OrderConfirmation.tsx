import { Link, useSearchParams } from "react-router-dom";
import { Check, ArrowRight, Package } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const OrderConfirmation = () => {
  const [params] = useSearchParams();
  const total = Number(params.get("total") || 0);
  const orderNumber = "AM" + Math.random().toString(36).slice(2, 8).toUpperCase();
  return <div className="min-h-screen bg-[#F9F5F1] text-stone-900"><Header /><main className="container mx-auto px-4 py-16 md:py-24"><div className="max-w-3xl mx-auto text-center"><div className="mx-auto mb-7 h-16 w-16 rounded-full bg-teal text-white flex items-center justify-center"><Check size={30} /></div><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">Thank you for choosing Amelie</p><h1 className="font-serif text-5xl md:text-6xl mb-4">Order Confirmed</h1><p className="text-stone-600 max-w-lg mx-auto">Your order has been received and is now being prepared with care.</p><div className="bg-white border border-stone-200 text-left mt-12 p-6 md:p-9"><div className="grid sm:grid-cols-3 gap-5 border-b border-stone-200 pb-6 mb-6"><div><p className="text-[10px] uppercase tracking-[0.14em] text-stone-500 mb-2">Order number</p><p className="font-medium">{orderNumber}</p></div><div><p className="text-[10px] uppercase tracking-[0.14em] text-stone-500 mb-2">Estimated delivery</p><p className="font-medium">3–5 business days</p></div><div><p className="text-[10px] uppercase tracking-[0.14em] text-stone-500 mb-2">Total paid</p><p className="font-medium">BDT {total.toLocaleString()}</p></div></div><div className="flex gap-4 items-start"><Package className="text-teal shrink-0" /><div><h2 className="font-serif text-2xl mb-2">We are preparing your pieces</h2><p className="text-sm text-stone-600 leading-relaxed">A confirmation has been sent to your email. You can follow the journey of your order from your account.</p></div></div></div><div className="flex flex-col sm:flex-row justify-center gap-3 mt-9"><Link to="/shop/new" className="btn-primary inline-flex items-center justify-center gap-2">Continue Shopping <ArrowRight size={16} /></Link><Link to="/order-history" className="btn-secondary inline-flex items-center justify-center">View Orders</Link></div></div></main><Footer /></div>;
};

export default OrderConfirmation;
