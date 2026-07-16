import { FormEvent, useState } from "react";
import { Clock3, Mail, MapPin, MessageCircle, Phone, Send, X } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const contactDetails = [
  { icon: MapPin, label: "Visit us", content: "Shanta Zen, House-4, Road-137, Gulshan-1, Dhaka-1212, Bangladesh" },
  { icon: Phone, label: "Call us", content: "+8801777-993895", href: "tel:+8801777993895" },
  { icon: Mail, label: "Email us", content: "support@ameliemilano.com", href: "mailto:support@ameliemilano.com" },
];

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setError("Please complete all required fields before sending your message.");
      form.reportValidity();
      return;
    }
    setError("");
    setSubmitted(true);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-[#F9F5F0] text-stone-900">
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-stone-200 bg-gradient-to-br from-[#F9F5F0] via-[#F3E9DE] to-[#E8DCD0] py-20 md:py-28">
          <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full border border-[#F7941D]/20" />
          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border border-[#0057B8]/10" />
          <div className="container relative mx-auto px-4 text-center">
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#0057B8]">The Amelie Milano concierge</p>
            <h1 className="font-serif text-5xl font-medium md:text-7xl">Get in Touch</h1>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-stone-600 md:text-base">Have questions about our products or need assistance? We’re here to help every step of the way.</p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#0057B8]">We would love to hear from you</p>
              <h2 className="font-serif text-4xl md:text-5xl">Contact Information</h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-stone-600">Whether you are looking for a fit recommendation, tracking an order, or simply want to discover more about our world, our team is here for you.</p>
              <div className="mt-9 space-y-6">
                {contactDetails.map(({ icon: Icon, label, content, href }) => <div key={label} className="flex gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0057B8]/10 text-[#0057B8]"><Icon size={19} strokeWidth={1.5} /></span><div><p className="text-[10px] uppercase tracking-[0.16em] text-stone-500">{label}</p>{href ? <a href={href} className="mt-1 block text-sm leading-6 hover:text-[#0057B8]">{content}</a> : <p className="mt-1 max-w-xs text-sm leading-6">{content}</p>}</div></div>)}
                <div className="flex gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F7941D]/10 text-[#F7941D]"><Clock3 size={19} strokeWidth={1.5} /></span><div><p className="text-[10px] uppercase tracking-[0.16em] text-stone-500">Store hours</p><p className="mt-1 text-sm leading-7">Sunday – Thursday: 9:00 AM – 6:00 PM<br />Saturday: 10:00 AM – 4:00 PM<br /><span className="text-stone-500">Friday: Closed</span></p></div></div>
              </div>
              <div className="mt-10 border-l-2 border-[#F7941D] pl-5"><p className="font-serif text-xl italic text-stone-700">“Every conversation is part of the Amelie experience.”</p></div>
            </div>

            <div className="bg-white p-6 shadow-sm ring-1 ring-stone-200 md:p-9">
              <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#0057B8]">Personal assistance</p>
              <h2 className="font-serif text-4xl">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm text-stone-700">Full name *<input name="name" required className="contact-field" placeholder="Your name" /></label><label className="text-sm text-stone-700">Email address *<input name="email" required type="email" className="contact-field" placeholder="you@example.com" /></label></div>
                <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm text-stone-700">Phone number<input name="phone" type="tel" className="contact-field" placeholder="+880" /></label><label className="text-sm text-stone-700">Subject *<select name="subject" required className="contact-field"><option value="">Choose a subject</option><option>Inquiry</option><option>Feedback</option><option>Complaint</option><option>Collaboration</option></select></label></div>
                <label className="block text-sm text-stone-700">Message *<textarea name="message" required rows={6} className="contact-field resize-none" placeholder="How can we help?" /></label>
                {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
                <button type="submit" className="inline-flex w-full items-center justify-center gap-2 bg-[#0057B8] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#00458f]">Send Message <Send size={16} /></button>
                <p className="text-center text-xs text-stone-500">We typically respond within 24 hours.</p>
              </form>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 md:py-24"><div className="container mx-auto px-4"><div className="mx-auto max-w-6xl"><div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#0057B8]">Come say hello</p><h2 className="font-serif text-4xl md:text-5xl">Visit Our Store</h2></div><a href="https://www.google.com/maps/search/?api=1&query=Shanta+Zen+House+4+Road+137+Gulshan+1+Dhaka+Bangladesh" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#0057B8] hover:text-[#F7941D]">View on Google Maps <MapPin size={15} /></a></div><div className="overflow-hidden border border-stone-200 bg-[#E8DCD0]"><iframe title="Amelie Milano store location" src="https://www.google.com/maps?q=Shanta%20Zen%2C%20House-4%2C%20Road-137%2C%20Gulshan-1%2C%20Dhaka-1212%2C%20Bangladesh&output=embed" className="h-[320px] w-full grayscale-[20%] md:h-[430px]" loading="lazy" /></div></div></div></section>

        <section className="bg-[#0057B8] py-14 text-white"><div className="container mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 px-4 md:flex-row md:items-center"><div><p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-white/70">Need assistance?</p><h2 className="font-serif text-4xl">Let’s make it personal.</h2><p className="mt-2 max-w-xl text-sm text-white/75">Explore our FAQs, return policy, or speak with the Amelie Style Concierge.</p></div><div className="flex flex-wrap gap-3"><Link to="/faq" className="inline-flex items-center gap-2 border border-white/60 px-5 py-3 text-xs uppercase tracking-[0.14em] hover:bg-white hover:text-[#0057B8]">FAQs</Link><Link to="/returns" className="inline-flex items-center gap-2 border border-white/60 px-5 py-3 text-xs uppercase tracking-[0.14em] hover:bg-white hover:text-[#0057B8]">Returns</Link><Link to="/style-concierge" className="inline-flex items-center gap-2 bg-[#F7941D] px-5 py-3 text-xs uppercase tracking-[0.14em] hover:bg-[#e67f0c]"><MessageCircle size={15} /> Concierge</Link></div></div></section>

        <section className="bg-[#F3E9DE] py-16 text-center"><div className="container mx-auto max-w-2xl px-4"><p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-[#0057B8]">Stay close to Amelie</p><h2 className="font-serif text-4xl md:text-5xl">A note from our world to yours.</h2><p className="mt-4 text-sm leading-7 text-stone-600">Be the first to discover new collections, private edits, and considered stories from Milano to Dhaka.</p><form className="mx-auto mt-7 flex max-w-md border-b border-stone-500"><input type="email" required placeholder="Your email address" className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm outline-none placeholder:text-stone-500" /><button type="submit" className="px-2 text-xs uppercase tracking-[0.14em] text-[#0057B8] hover:text-[#F7941D]">Subscribe</button></form></div></section>
      </main>
      <Footer />
      {submitted && <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4"><div className="relative w-full max-w-md bg-[#F9F5F0] p-8 text-center shadow-2xl md:p-10"><button onClick={() => setSubmitted(false)} aria-label="Close confirmation" className="absolute right-4 top-4 text-stone-500 hover:text-stone-900"><X size={18} /></button><div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#0057B8] text-white"><Send size={19} /></div><h2 className="font-serif text-3xl">Thank you!</h2><p className="mt-3 text-sm leading-6 text-stone-600">Your message has reached our team. We’ll respond within 24 hours.</p><button onClick={() => setSubmitted(false)} className="mt-7 bg-[#0057B8] px-6 py-3 text-xs uppercase tracking-[0.14em] text-white hover:bg-[#00458f]">Continue</button></div></div>}
    </div>
  );
};

export default Contact;
