import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Lock, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cartSubtotal, readCart, writeCart, type CartItem } from "@/lib/cart";
import { createOrder, orderTax, type DeliveryAddress } from "@/lib/orders";
import { readSession, requestPhoneOtp, signInWithEmail, signInWithOAuth, signUpWithEmail, verifyPhoneOtp, type AuthUser } from "@/lib/auth";

const initialAddress: DeliveryAddress = { firstName: "", lastName: "", email: "", phone: "", address: "", city: "", postalCode: "" };
const paymentOptions = [["card", "Credit / Debit Card"], ["bkash", "bKash"], ["net", "Net Banking"], ["qr", "Bangla QR"], ["cod", "Cash on Delivery"]];

type AuthMode = "signin" | "signup" | "phone";

const AuthModal = ({ onAuthenticated, onGuest }: { onAuthenticated: (user: AuthUser) => void; onGuest: () => void }) => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const submitEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try { onAuthenticated(mode === "signup" ? signUpWithEmail(email, password, firstName, lastName) : signInWithEmail(email, password)); } catch (err) { setError(err instanceof Error ? err.message : "Unable to authenticate."); }
  };
  const sendOtp = () => { if (!phone.trim()) { setError("Enter a phone number first."); return; } requestPhoneOtp(phone); setOtpSent(true); setError(""); setNotice("Your verification code has been sent. Enter it below to continue."); };
  const verifyOtp = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); try { onAuthenticated(verifyPhoneOtp(phone, otp)); } catch (err) { setError(err instanceof Error ? err.message : "Unable to verify OTP."); } };
  const oauth = (provider: "google" | "facebook") => { try { signInWithOAuth(provider); } catch (err) { setError(err instanceof Error ? err.message : "This sign-in method is unavailable."); } };
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/50 px-4 py-6"><div role="dialog" aria-modal="true" aria-labelledby="checkout-auth-title" className="relative max-h-[calc(100vh-3rem)] w-full max-w-md overflow-y-auto bg-[#F9F5F1] p-6 shadow-2xl md:p-8"><div className="mb-7 text-center"><p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-teal">Amelie Milano private checkout</p><h2 id="checkout-auth-title" className="font-serif text-3xl">Sign in to continue</h2><p className="mt-2 text-sm text-stone-600">Save your details and follow every considered order.</p></div><div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => oauth("google")} className="border border-stone-300 bg-white px-3 py-3 text-sm hover:border-teal hover:text-teal">Continue with Google</button><button type="button" onClick={() => oauth("facebook")} className="border border-stone-300 bg-white px-3 py-3 text-sm hover:border-teal hover:text-teal">Continue with Facebook</button></div><div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-stone-400"><span className="h-px flex-1 bg-stone-200" />or<span className="h-px flex-1 bg-stone-200" /></div>{mode === "phone" ? <form onSubmit={verifyOtp} className="space-y-4">{!otpSent ? <><input required type="tel" placeholder="Phone number" value={phone} onChange={(event) => setPhone(event.target.value)} className="field w-full" /><button type="button" onClick={sendOtp} className="btn-primary w-full">Send OTP</button></> : <><input required inputMode="numeric" placeholder="6-digit OTP" value={otp} onChange={(event) => setOtp(event.target.value)} className="field w-full" /><button type="submit" className="btn-primary w-full">Verify OTP</button><button type="button" onClick={() => { setOtpSent(false); setNotice(""); }} className="w-full text-xs uppercase tracking-[0.14em] text-teal">Use a different number</button></>}</form> : <form onSubmit={submitEmail} className="space-y-4">{mode === "signup" && <div className="grid grid-cols-2 gap-3"><input required placeholder="First name" value={firstName} onChange={(event) => setFirstName(event.target.value)} className="field" /><input required placeholder="Last name" value={lastName} onChange={(event) => setLastName(event.target.value)} className="field" /></div>}<input required type="email" placeholder="Email address" value={email} onChange={(event) => setEmail(event.target.value)} className="field w-full" /><input required type="password" minLength={8} placeholder="Password (8+ characters)" value={password} onChange={(event) => setPassword(event.target.value)} className="field w-full" /><button type="submit" className="btn-primary w-full">{mode === "signup" ? "Create account" : "Sign in"}</button></form>}{error && <p role="alert" className="mt-4 text-center text-sm text-red-700">{error}</p>}{notice && <p className="mt-4 text-center text-sm text-teal">{notice}</p>}<div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-3 text-xs text-stone-600">{mode !== "phone" && <button type="button" onClick={() => { setMode("phone"); setError(""); }} className="text-teal underline">Use phone + OTP</button>}{mode === "phone" && <button type="button" onClick={() => { setMode("signin"); setOtpSent(false); setError(""); }} className="text-teal underline">Use email</button>}{mode !== "phone" && <button type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }} className="text-teal underline">{mode === "signin" ? "Create an account" : "Already have an account? Sign in"}</button>}</div><button type="button" onClick={onGuest} className="mt-6 w-full border border-stone-300 px-4 py-3 text-xs uppercase tracking-[0.16em] text-stone-600 hover:border-teal hover:text-teal">Continue as Guest</button></div></div>;
};

const Checkout = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [delivery, setDelivery] = useState<"regular" | "express">("regular");
  const [payment, setPayment] = useState("card");
  const [step, setStep] = useState<"details" | "payment">("details");
  const [address, setAddress] = useState(initialAddress);
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvc: "" });
  const [paymentError, setPaymentError] = useState("");
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => readSession());
  const [showAuth, setShowAuth] = useState(() => !readSession());

  useEffect(() => setItems(readCart()), []);
  useEffect(() => {
    if (!authUser) return;
    setAddress((current) => ({ ...current, firstName: current.firstName || authUser.firstName, lastName: current.lastName || authUser.lastName, email: current.email || authUser.email, phone: current.phone || authUser.phone }));
  }, [authUser]);

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

  return <div className="min-h-screen bg-[#F9F5F1] text-stone-900">{showAuth && <AuthModal onAuthenticated={(user) => { setAuthUser(user); setShowAuth(false); }} onGuest={() => setShowAuth(false)} />}<Header /><main className="container mx-auto px-4 py-10 md:py-16"><div className="max-w-6xl mx-auto"><div className="flex items-center justify-between mb-10"><div><p className="text-teal text-[10px] uppercase tracking-[0.24em] mb-3">Amelie Milano private checkout</p><h1 className="font-serif text-5xl">{step === "details" ? "Confirm Your Order" : "Secure Payment"}</h1></div><div className="hidden md:flex items-center gap-3 text-xs uppercase tracking-[0.14em]"><span className={step === "details" ? "text-teal" : "text-stone-400"}>01 Details</span><span className="text-stone-300">—</span><span className={step === "payment" ? "text-teal" : "text-stone-400"}>02 Payment</span></div></div><div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start"><section className="space-y-5">{step === "details" ? <form onSubmit={continueToPayment} className="bg-white border border-stone-200 p-6 md:p-8"><h2 className="font-serif text-3xl mb-6">Delivery details</h2><div className="grid md:grid-cols-2 gap-4">{([["firstName", "First name"], ["lastName", "Last name"], ["email", "Email address"], ["phone", "Phone number"], ["address", "Delivery address"], ["city", "City"], ["postalCode", "Postal code"]] as [keyof DeliveryAddress, string][]).map(([field, placeholder]) => <input key={field} required placeholder={placeholder} type={field === "email" ? "email" : "text"} value={address[field]} onChange={(event) => updateAddress(field, event.target.value)} className={`field ${field === "email" || field === "phone" || field === "address" ? "md:col-span-2" : ""}`} />)}</div><div className="mt-8"><h3 className="font-serif text-2xl mb-4">Delivery method</h3><div className="grid gap-3">{[["regular", "Standard delivery", "3–5 business days · Complimentary over BDT 3,000"], ["express", "Express delivery", "1–2 business days · BDT 200"]].map(([value, label, detail]) => <label key={value} className={`flex items-center justify-between border p-4 cursor-pointer ${delivery === value ? "border-teal bg-[#F0E9E2]/40" : "border-stone-200"}`}><span className="flex items-center gap-3"><input type="radio" checked={delivery === value} onChange={() => setDelivery(value as "regular" | "express")} /><span><strong className="block text-sm">{label}</strong><small className="text-stone-500">{detail}</small></span></span><span className="text-sm">{value === "express" ? "BDT 200" : shipping === 0 ? "Free" : "BDT 150"}</span></label>)}</div></div><button type="submit" className="btn-primary mt-8 inline-flex items-center gap-2">Continue to payment <ArrowRight size={16} /></button></form> : <div className="bg-white border border-stone-200 p-6 md:p-8"><button type="button" onClick={() => setStep("details")} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-teal mb-8"><ArrowLeft size={15} /> Edit delivery details</button><h2 className="font-serif text-3xl mb-6">Payment method</h2><div className="grid gap-3">{paymentOptions.map(([value, label]) => <button key={value} type="button" onClick={() => setPayment(value)} className={`border px-4 py-4 text-sm text-left ${payment === value ? "border-teal bg-[#F0E9E2]/40 text-teal" : "border-stone-200"}`}>{label}</button>)}</div>{payment === "card" && <div className="grid gap-4 mt-6 md:grid-cols-2"><input required placeholder="Card number" inputMode="numeric" value={cardDetails.number} onChange={(event) => setCardDetails((current) => ({ ...current, number: event.target.value }))} className="field md:col-span-2" /><input required placeholder="MM / YY" value={cardDetails.expiry} onChange={(event) => setCardDetails((current) => ({ ...current, expiry: event.target.value }))} className="field" /><input required placeholder="CVC" value={cardDetails.cvc} onChange={(event) => setCardDetails((current) => ({ ...current, cvc: event.target.value }))} className="field" /></div>}{paymentError && <p className="text-sm text-red-700 mt-4" role="alert">{paymentError}</p>}<div className="flex items-center gap-2 text-xs text-stone-500 mt-7"><ShieldCheck size={18} className="text-teal" /> PCI-ready encrypted checkout · Your details stay private.</div><button type="button" onClick={completeOrder} className="btn-primary mt-8 inline-flex items-center gap-2">{payment === "cod" ? "Place Order" : `Pay BDT ${total.toLocaleString()}`} <Lock size={15} /></button></div>}</section><aside className="bg-white border border-stone-200 p-6 md:p-7 lg:sticky lg:top-6"><h2 className="font-serif text-2xl mb-5">Your selection</h2><div className="space-y-4 border-b border-stone-200 pb-5">{items.map((item) => <div key={`${item.id}-${item.option}-${item.colour}`} className="flex gap-3"><img src={item.image} alt={item.name} className="w-16 h-20 object-cover" /><div className="min-w-0"><p className="font-serif text-lg leading-tight">{item.name}</p><p className="text-xs text-stone-500 mt-1">{item.colour} · {item.option} · Qty {item.quantity}</p><p className="text-sm mt-2">BDT {(item.price * item.quantity).toLocaleString()}</p></div></div>)}</div><div className="space-y-3 text-sm pt-5"><div className="flex justify-between"><span className="text-stone-500">Subtotal</span><span>BDT {subtotal.toLocaleString()}</span></div><div className="flex justify-between"><span className="text-stone-500">Shipping</span><span>{shipping ? `BDT ${shipping.toLocaleString()}` : "Free"}</span></div><div className="flex justify-between"><span className="text-stone-500">Taxes</span><span>BDT {tax.toLocaleString()}</span></div><div className="flex justify-between border-t border-stone-200 pt-4 text-base font-medium"><span>Total</span><span className="text-teal">BDT {total.toLocaleString()}</span></div></div></aside></div></div></main><Footer /></div>;
};

export default Checkout;
