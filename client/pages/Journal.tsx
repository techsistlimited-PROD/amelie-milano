import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import NewsletterForm from "@/components/NewsletterForm";
import { fetchBuilderEditorials, type BuilderEditorialData } from "@/lib/builder";

const fallbackArticles = [
  { category: "Fashion", title: "The Art of Italian Tailoring", excerpt: "Explore the quiet craft behind a considered silhouette.", heroImage: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F92b67c169b484849bc0557782bc3580b?format=webp&width=1000&quality=95", slug: "italian-tailoring", author: "Amelie Milano", publishedAt: "2025-01-15" },
  { category: "Style Tips", title: "Building a Wardrobe With Ease", excerpt: "The pieces, proportions and textures that make dressing feel effortless.", heroImage: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F25041026487d4444b5d4fdcd8344b030?format=webp&width=1200&height=1800&quality=95", slug: "wardrobe-essentials", author: "Amelie Milano", publishedAt: "2025-01-22" },
  { category: "Lifestyle", title: "A Softer Pace of Living", excerpt: "Finding beauty in the rituals that shape an ordinary day.", heroImage: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F8643453bf7a947959862f314163ce4f6?format=webp&width=1200&height=1800&quality=95", slug: "softer-pace", author: "Amelie Milano", publishedAt: "2025-02-01" },
  { category: "Editorial", title: "The Occasion Edit", excerpt: "Dressing for evenings that deserve to be remembered.", heroImage: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Feddf3358484d4793b2020549afc8bf06?format=webp&width=1200&height=1800&quality=95", slug: "occasion-edit", author: "Amelie Milano", publishedAt: "2025-02-08" },
  { category: "Fashion", title: "Modern Femininity, Reframed", excerpt: "A new perspective on confidence, movement and personal style.", heroImage: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F6c87aec0389744e9917cadd6e0d6236d?format=webp&width=1200&height=1800&quality=95", slug: "modern-femininity", author: "Amelie Milano", publishedAt: "2025-02-15" },
  { category: "Lifestyle", title: "Inspiration in the Details", excerpt: "How the smallest choices can become the most distinctive ones.", heroImage: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F1b6c5c5bfe8a405f929f02fb57a189bb?format=webp&width=1200&height=1800&quality=95", slug: "details", author: "Amelie Milano", publishedAt: "2025-02-22" },
];

const toArticle = (data: BuilderEditorialData) => ({
  category: data.category || data.type || "Editorial",
  title: data.title,
  excerpt: data.excerpt || "Discover the ideas, references and rituals behind Amelie Milano.",
  heroImage: data.heroImage || "",
  slug: data.slug,
  author: data.author || "Amelie Milano",
  publishedAt: data.publishedAt || "",
  featured: data.featured === true,
});

const Journal = () => {
  const [cmsArticles, setCmsArticles] = useState<ReturnType<typeof toArticle>[]>([]);

  useEffect(() => {
    void fetchBuilderEditorials().then((entries) => {
      setCmsArticles(entries.map((data) => toArticle(data)));
    });
  }, []);

  const articles = cmsArticles.length ? cmsArticles : fallbackArticles;
  const featured = useMemo(() => cmsArticles.length ? cmsArticles.find((article) => article.featured) || articles[0] : articles[0], [articles, cmsArticles]);
  const formatDate = (value: string) => value ? new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(value)) : "";

  return <div className="min-h-screen bg-[#F0E9E2] text-[#0F0F0F]"><Header /><main><div className="container mx-auto px-4 pt-8"><Breadcrumbs items={[{ label: "Journal" }]} /></div><section className="relative min-h-[580px] overflow-hidden bg-stone-900 md:h-[660px] flex items-end"><img src="https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fbbfd759960964ecdb9963d81ba7b70a6?format=webp&width=800&height=1200" alt="Amelie Milano Journal" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-stone-950/15 to-transparent" /><div className="relative z-10 container mx-auto px-4 pb-16 text-white md:pb-20"><p className="mb-5 text-[10px] uppercase tracking-[0.28em] text-white/80">The Journal</p><h1 className="mb-6 max-w-3xl font-serif text-6xl leading-[0.86] md:text-8xl">Amelie Milano Journal</h1><p className="mb-8 max-w-md text-sm leading-relaxed text-white/85 md:text-base">Stories, inspirations and lifestyle insights from the world of Amelie Milano.</p><Link to="#articles" className="inline-flex items-center gap-3 bg-[#C69B6D] px-6 py-3 text-xs uppercase tracking-[0.16em] text-stone-900 transition-colors hover:bg-white">Explore Articles <ArrowRight size={15} /></Link></div></section><section id="articles" className="bg-[#F0E9E2] py-20 md:py-32"><div className="container mx-auto max-w-6xl px-4"><div className="mb-20 grid items-center gap-8 md:grid-cols-[1.2fr_0.8fr] md:gap-16"><Link to={`/journal/${featured.slug}`} className="group overflow-hidden"><img src={featured.heroImage} alt={featured.title} className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" /></Link><div><p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-teal">Spotlight · {featured.category}</p><h2 className="mb-5 font-serif text-4xl md:text-5xl">{featured.title}</h2><p className="mb-7 leading-relaxed text-stone-600">{featured.excerpt}</p><p className="mb-5 text-[10px] uppercase tracking-[0.18em] text-stone-500">{featured.author}{featured.publishedAt ? ` · ${formatDate(featured.publishedAt)}` : ""}</p><Link to={`/journal/${featured.slug}`} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-teal">Read More <ChevronRight size={15} /></Link></div></div><div className="mb-12 flex flex-wrap justify-center gap-4 border-y border-stone-300 py-5"><span className="text-xs uppercase tracking-[0.16em] text-teal">All Stories</span>{[...new Set(articles.map((article) => article.category))].map((category) => <span key={category} className="text-xs uppercase tracking-[0.16em] text-stone-500">{category}</span>)}</div><div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">{articles.filter((article) => article.slug !== featured.slug).map((article) => <article key={article.slug} className="group"><Link to={`/journal/${article.slug}`}><div className="mb-5 overflow-hidden"><img src={article.heroImage} alt={article.title} className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" /></div><p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-teal">{article.category}</p><h3 className="font-serif text-2xl transition-colors group-hover:text-teal">{article.title}</h3><p className="mt-3 text-sm leading-relaxed text-stone-600">{article.excerpt}</p><p className="mt-4 text-[10px] uppercase tracking-[0.16em] text-stone-500">{article.author}{article.publishedAt ? ` · ${formatDate(article.publishedAt)}` : ""}</p></Link></article>)}</div></div></section><section className="bg-white py-16 md:py-24"><div className="container mx-auto max-w-4xl px-4"><div className="grid items-center gap-10 md:grid-cols-2 md:gap-20"><img src="https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F55baf11751a34a54b0e32d4dfe3b2e9f?format=webp&width=1600&height=2400&quality=95" alt="Journal style details" className="aspect-[4/5] w-full object-cover" /><div><p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-teal">From the editor</p><blockquote className="mb-6 font-serif text-3xl italic leading-tight md:text-4xl">“Style begins where intention meets instinct.”</blockquote><p className="leading-relaxed text-stone-600">The Journal is our space for thoughtful ideas, styling notes and the references behind each collection.</p></div></div></div></section><section className="bg-[#E8D7C5] py-16 text-center md:py-24"><div className="container mx-auto max-w-2xl px-4"><h2 className="mb-5 font-serif text-4xl md:text-6xl">Stay Inspired</h2><p className="mb-8 text-stone-600">Join the Journal for new stories, style notes and seasonal inspiration.</p><NewsletterForm className="mx-auto flex max-w-md border-b border-stone-700" inputClassName="min-w-0 flex-1 bg-transparent px-0 py-3 text-sm focus:outline-none" buttonClassName="bg-[#C69B6D] px-5 py-2 text-xs uppercase tracking-[0.16em] text-stone-900 transition-colors hover:bg-white" placeholder="Your email address" /></div></section></main><Footer /></div>;
};

export default Journal;
