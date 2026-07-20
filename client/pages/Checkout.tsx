import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Lock, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cartSubtotal, readCart, writeCart, type CartItem } from "@/lib/cart";
import { createOrder, orderTax, type DeliveryAddress } from "@/lib/orders";

const initialAddress: DeliveryAddress = { firstName: "", lastName: "", email: "", phone: "", address: "", city: "", postalCode: "" };
const paymentOptions = [["card", "Credit / Debit Card"], ["bkash", "bKash"], ["net", "Net Banking"], ["qr", "Bangla QR"], ["cod", "Cash on Delivery"]];

const Checkout = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [delivery, setDelivery] = useState<"regular" | "express">("regular");
  const [payment, setPayment] = useState("card");
  const [step, setStep] = useState<"details" | "payment">("details");
  const [address, setAddress] = useState(initialAddress);
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvc: "" });
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => setItems(readCart()), []);

  const subtotal = useMemo(() => cartSubtotal(items), [items]);
  const shipping = delivery === "express" ? 200 : subtotal >= 3000 ? 0 : 150;
  const tax = orderTax(subtotal);
  const total = subtotal + shipping + tax;
  const updateAddress = (field: keyof DeliveryAddress, value: string) => setAddress((current) => ({ ...current, [field]: value }));

  const continueToPayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep("payment");
  };

  const completeOrder = () => {
    if (payment === "card" && Object.values(cardDetails).some((value) => !value.trim())) {
      setPaymentError("Please complete your card details before placing the order.");
      return;
    }
    setPaymentError("");
    const order = createOrder({ items, address, delivery, payment, subtotal, discount: 0, shipping, tax, total });
    writeCart([]);
    navigate(`/order-confirmation?order=${encodeURIComponent(order.number)}`);
  };

  if (!items.length) return <div className="min-h-screen bg-[#F9F5F1]"><Header /><main className="container mx-auto px-4 py-24 text-center"><h1 className="font-serif text-5xl mb-4">Your checkout is empty</h1><p className="text-stone-600 mb-8">Add a signature piece before continuing.</p><Link to="/shop/new" className="btn-primary inline-flex">Explore New Arrivals</Link></main><Footer /></div>;

  return <div className="min-h-screen bg-[#F9F5F1] text-stone-900"><Header /><main className="container mx-auto px-4 py-10 md:py-16"><div className="max-w-6xl mx-auto"><div className="flex items-center justify-between mb-10"><div><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">Amelie Milano private checkout</p><h1 className="font-serif text-5xl">{step === "details" ? "Confirm Your Order" : "Secure Payment"}</h1></div><div className="hidden md:flex items-center gap-3 text-xs uppercase tracking-[0.14em]"><span className={step === "details" ? "text-teal" : "text-stone-400"}>01 Details</span><span className="text-stone-300">—</span><span className={step === "payment" ? "text-teal" : "text-stone-400"}>02 Payment</span></div></div><div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start"><section className="space-y-5">{step === "details" ? <form onSubmit={continueToPayment} className="bg-white border border-stone-200 p-6 md:p-8"><h2 className="font-serif text-3xl mb-6">Delivery details</h2><div className="grid md:grid-cols-2 gap-4">{([["firstName", "First name"], ["lastName", "Last name"], ["email", "Email address"], ["phone", "Phone number"], ["address", "Delivery address"], ["city", "City"], ["postalCode", "Postal code"]] as [keyof DeliveryAddress, string][]).map(([field, placeholder]) => <input key={field} required placeholder={placeholder} type={field === "email" ? "email" : "text"} value={address[field]} onChange={(event) => updateAddress(field, event.target.value)} className={`field ${field === "email" || field === "phone" || field === "address" ? "md:col-span-2" : ""}`} />)}</div><div className="mt-8"><h3 className="font-serif text-2xl mb-4">Delivery method</h3><div className="grid gap-3">{[["regular", "Standard delivery", "3–5 business days · Complimentary over BDT 3,000"], ["express", "Express delivery", "1–2 business days · BDT 200"]].map(([value, label, detail]) => <label key={value} className={`flex items-center justify-between border p-4 cursor-pointer ${delivery === value ? "border-teal bg-[#F0E9E2]/40" : "border-stone-200"}`}><span className="flex items-center gap-3"><input type="radio" checked={delivery === value} onChange={() => setDelivery(value as "regular" | "express")} /><span><strong className="block text-sm">{label}</strong><small className="text-stone-500">{detail}</small></span></span><span className="text-sm">{value === "express" ? "BDT 200" : shipping === 0 ? "Free" : "BDT 150"}</span></label>)}</div></div><button type="submit" className="btn-primary mt-8 inline-flex items-center gap-2">Continue to payment <ArrowRight size={16} /></button></form> : <div className="bg-white border border-stone-200 p-6 md:p-8"><button type="button" onClick={() => setStep("details")} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-teal mb-8"><ArrowLeft size={15} /> Edit delivery details</button><h2 className="font-serif text-3xl mb-6">Payment method</h2><div className="grid gap-3">{paymentOptions.map(([value, label]) => <button key={value} type="button" onClick={() => setPayment(value)} className={`border px-4 py-4 text-sm text-left ${payment === value ? "border-teal bg-[#F0E9E2]/40 text-teal" : "border-stone-200"}`}>{label}</button>)}</div>{payment === "card" && <div className="grid gap-4 mt-6 md:grid-cols-2"><input required placeholder="Card number" inputMode="numeric" value={cardDetails.number} onChange={(event) => setCardDetails((current) => ({ ...current, number: event.target.value }))} className="field md:col-span-2" /><input required placeholder="MM / YY" value={cardDetails.expiry} onChange={(event) => setCardDetails((current) => ({ ...current, expiry: event.target.value }))} className="field" /><input required placeholder="CVC" value={cardDetails.cvc} onChange={(event) => setCardDetails((current) => ({ ...current, cvc: event.target.value }))} className="field" /></div>}{paymentError && <p className="text-sm text-red-700 mt-4" role="alert">{paymentError}</p>}<div className="flex items-center gap-2 text-xs text-stone-500 mt-7"><ShieldCheck size={18} className="text-teal" /> PCI-ready encrypted checkout · Your details stay private.</div><button type="button" onClick={completeOrder} className="btn-primary mt-8 inline-flex items-center gap-2">{payment === "cod" ? "Place Order" : `Pay BDT ${total.toLocaleString()}`} <Lock size={15} /></button></div>}</section><aside className="bg-white border border-stone-200 p-6 md:p-7 lg:sticky lg:top-6"><h2 className="font-serif text-2xl mb-5">Your selection</h2><div className="space-y-4 border-b border-stone-200 pb-5">{items.map((item) => <div key={`${item.id}-${item.option}-${item.colour}`} className="flex gap-3"><img src={item.image} alt={item.name} className="w-16 h-20 object-cover" /><div className="min-w-0"><p className="font-serif text-lg leading-tight">{item.name}</p><p className="text-xs text-stone-500 mt-1">{item.colour} · {item.option} · Qty {item.quantity}</p><p className="text-sm mt-2">BDT {(item.price * item.quantity).toLocaleString()}</p></div></div>)}</div><div className="space-y-3 text-sm pt-5"><div className="flex justify-between"><span className="text-stone-500">Subtotal</span><span>BDT {subtotal.toLocaleString()}</span></div><div className="flex justify-between"><span className="text-stone-500">Shipping</span><span>{shipping ? `BDT ${shipping.toLocaleString()}` : "Free"}</span></div><div className="flex justify-between"><span className="text-stone-500">Taxes</span><span>BDT {tax.toLocaleString()}</span></div><div className="flex justify-between border-t border-stone-200 pt-4 text-base font-medium"><span>Total</span><span className="text-teal">BDT {total.toLocaleString()}</span></div></div></aside></div></div></main><Footer /></div>;
};

export default Checkout;
