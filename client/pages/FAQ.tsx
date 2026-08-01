import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  CreditCard,
  Gift,
  HelpCircle,
  LucideIcon,
  Package,
  Search,
  Shirt,
  Truck,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchCmsFaq } from "@/lib/cms";

const categoryIcons: Record<string, LucideIcon> = {
  "Orders & Payments": CreditCard,
  "Shipping & Delivery": Truck,
  "Returns & Exchanges": Package,
  "Product Information": Shirt,
  "Account & Login": UserRound,
  "Promotions & Offers": Gift,
};

const defaultCategories = [
  {
    title: "Orders & Payments",
    questions: [
      [
        "How do I place an order?",
        "Select your product, choose your size or variant, and click Add to Cart. Proceed to checkout and follow the payment instructions.",
      ],
      [
        "What payment methods are accepted?",
        "We accept Credit/Debit Cards, Mobile Banking, Net Banking, Pay on Delivery, and QR payments.",
      ],
      ["Can I apply a discount code?", "Yes, enter your code at checkout. Discounts will reflect immediately on the cart total."],
      ["Is it safe to store my card details?", "Yes, our payment system is PCI DSS compliant and fully secure."],
    ],
  },
  {
    title: "Shipping & Delivery",
    questions: [
      [
        "What are the delivery options?",
        "Regular Delivery takes 3–5 business days and is free. Express Delivery is same or next day for BDT 200. Collect from Store is free.",
      ],
      ["Can I track my order?", "Yes, a tracking link will be emailed once your order is dispatched."],
      ["Do you deliver internationally?", "Currently, we deliver only within Bangladesh."],
    ],
  },
  {
    title: "Returns & Exchanges",
    questions: [
      [
        "What is your return policy?",
        "Returns are accepted within 7 days of delivery for unused products with tags intact.",
      ],
      [
        "Can I exchange a product for a different size or color?",
        "Yes, exchanges are possible within 7 days. Additional shipping fees may apply.",
      ],
      ["How do I initiate a return?", "Visit your order page, click Request Return, and follow the instructions."],
    ],
  },
  {
    title: "Product Information",
    questions: [
      ["How do I know my size?", "Refer to our Size Guide page or the product measurement charts."],
      [
        "What materials are used in the products?",
        "We use premium fabrics sourced from Italy and Europe, crafted with high attention to detail.",
      ],
      [
        "Are the colors true to the images?",
        "We ensure accurate color representation, but screen settings may slightly vary the shades.",
      ],
    ],
  },
  {
    title: "Account & Login",
    questions: [
      [
        "Do I need an account to order?",
        "You can checkout as a guest, but creating an account allows faster checkout, order tracking, and wishlists.",
      ],
      ["How do I reset my password?", "Click Forgot Password? on the login page and follow the instructions."],
      ["Can I link my social accounts?", "Yes, you can sign in with Google or Facebook for convenience."],
    ],
  },
  {
    title: "Promotions & Offers",
    questions: [
      [
        "How can I stay updated with promotions?",
        "Subscribe to our newsletter or follow us on social media for the latest offers.",
      ],
      ["Can I use multiple promo codes?", "Only one promo code can be applied per order."],
      ["Are discounts valid in-store?", "Some promotions are online-exclusive. Check individual promotion terms."],
    ],
  },
];

type FaqCategory = { title: string; icon: LucideIcon; questions: [string, string][] };

const FAQ = () => {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<FaqCategory[]>(
    defaultCategories.map((category) => ({
      ...category,
      icon: categoryIcons[category.title] ?? HelpCircle,
      questions: category.questions as [string, string][],
    })),
  );

  useEffect(() => {
    void fetchCmsFaq().then((items) => {
      if (!items.length) return;
      const grouped = new Map<string, [string, string][]>();
      for (const item of items) {
        const list = grouped.get(item.category) ?? [];
        list.push([item.question, item.answer]);
        grouped.set(item.category, list);
      }
      setCategories(
        [...grouped.entries()].map(([title, questions]) => ({
          title,
          icon: categoryIcons[title] ?? HelpCircle,
          questions,
        })),
      );
    });
  }, []);

  const normalizedQuery = query.toLowerCase().trim();
  const filtered = useMemo(
    () =>
      categories
        .map((category) => ({
          ...category,
          questions: category.questions.filter(([question, answer]) =>
            `${question} ${answer}`.toLowerCase().includes(normalizedQuery),
          ),
        }))
        .filter((category) => category.questions.length),
    [categories, normalizedQuery],
  );

  return (
    <div className="min-h-screen bg-[#F9F5F0] text-[#0A0A0A]">
      <Header />
      <main>
        <section className="border-b border-stone-200 bg-[#F9F5F0] px-4 py-20 text-center md:py-28">
          <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-[#0057B8]">The Amelie Milano guide</p>
          <h1 className="font-serif text-4xl font-semibold md:text-6xl">Frequently Asked Questions</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-stone-600 md:text-lg">
            Your questions answered. Explore our guidance for a smooth and luxurious shopping experience.
          </p>
          <div className="relative mx-auto mt-9 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0057B8]" size={19} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search FAQs…"
              className="w-full rounded-full border border-stone-200 bg-white py-4 pl-12 pr-5 text-sm shadow-sm outline-none focus:border-[#0057B8]"
            />
          </div>
        </section>
        <section className="container mx-auto px-4 py-14 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
            {filtered.map(({ title, icon: Icon, questions }) => (
              <div key={title}>
                <div className="mb-5 flex items-center gap-3 border-b border-stone-200 pb-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0057B8]/10 text-[#0057B8]">
                    <Icon size={18} />
                  </span>
                  <h2 className="font-serif text-2xl md:text-3xl">{title}</h2>
                </div>
                <div className="space-y-2">
                  {questions.map(([question, answer]) => (
                    <details key={question} className="group border-b border-stone-200">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-sm font-medium">
                        <span>{question}</span>
                        <ChevronDown
                          size={17}
                          className="shrink-0 text-[#0057B8] transition-transform group-open:rotate-180"
                        />
                      </summary>
                      <p className="pb-5 pr-8 text-sm leading-7 text-stone-600">{answer}</p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {!filtered.length && (
            <div className="py-20 text-center">
              <HelpCircle className="mx-auto mb-4 text-[#0057B8]" />
              <h2 className="font-serif text-3xl">No answers found</h2>
              <p className="mt-2 text-sm text-stone-600">Try a different keyword or contact our support team.</p>
            </div>
          )}
        </section>
        <section className="bg-white px-4 py-16 text-center">
          <h2 className="font-serif text-4xl">Still have questions?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-stone-600">
            Our team is always happy to help with your order, fit, or Amelie experience.
          </p>
          <Link
            to="/contact"
            className="mt-7 inline-flex bg-[#0057B8] px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#00458f]"
          >
            Contact our support team
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
