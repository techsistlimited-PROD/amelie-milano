import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Seo from "./Seo";
import { fetchBuilderPage, isBuilderConfigured } from "@/lib/builder";

const descriptions: Record<string, string> = {
  "/": "Amelie Milano — Italian-inspired fashion, beauty and lifestyle for the modern woman.",
  "/shop": "Shop the complete Amelie Milano wardrobe of considered fashion, body care and accessories.",
  "/journal": "Stories, style notes and thoughtful inspiration from Amelie Milano.",
  "/about": "Discover the philosophy and considered point of view behind Amelie Milano.",
  "/brand-story": "The Amelie Milano story: Italian-inspired design, considered details and modern femininity.",
  "/contact": "Contact Amelie Milano for orders, styling guidance, care and customer support.",
  "/faq": "Answers to common questions about Amelie Milano orders, sizing, delivery and care.",
  "/size-guide": "Find your considered fit with the Amelie Milano size guide.",
  "/shipping": "Amelie Milano delivery information, shipping options and estimated timelines.",
  "/returns": "Amelie Milano returns and exchange information.",
  "/privacy": "Amelie Milano privacy policy and customer data practices.",
  "/terms": "Amelie Milano terms and conditions.",
  "/the-amelie-edit": "The Amelie Edit — considered collections, styling and inspiration from Amelie Milano.",
};

const SiteMeta = () => {
  const { pathname } = useLocation();
  const [cmsMeta, setCmsMeta] = useState<{ seoTitle?: string; seoDescription?: string; title?: string } | null>(null);

  useEffect(() => {
    let active = true;
    setCmsMeta(null);
    if (isBuilderConfigured()) {
      fetchBuilderPage(pathname).then((page) => {
        if (active && page) setCmsMeta(page as typeof cmsMeta);
      });
    }
    return () => {
      active = false;
    };
  }, [pathname]);

  const section = pathname.split("/").filter(Boolean).pop();
  const label = section ? section.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Home";
  const fallbackTitle = pathname === "/" ? "Amelie Milano | Italian-Inspired Fashion & Lifestyle" : `${label} | Amelie Milano`;
  const fallbackDescription = descriptions[pathname] || `Discover ${label.toLowerCase()} from Amelie Milano, an Italian-inspired fashion and lifestyle house.`;

  return (
    <Seo
      title={cmsMeta?.seoTitle || cmsMeta?.title || fallbackTitle}
      description={cmsMeta?.seoDescription || fallbackDescription}
    />
  );
};

export default SiteMeta;
