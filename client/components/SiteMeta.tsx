import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const descriptions: Record<string, string> = {
  "/": "Amelie Milano — Italian-inspired fashion, beauty and lifestyle for the modern woman.",
  "/shop": "Shop the complete Amelie Milano wardrobe of considered fashion, body care and accessories.",
  "/journal": "Stories, style notes and thoughtful inspiration from Amelie Milano.",
  "/about": "Discover the philosophy and considered point of view behind Amelie Milano.",
};

const SiteMeta = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const section = pathname.split("/").filter(Boolean).pop();
    const label = section ? section.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Home";
    const title = pathname === "/" ? "Amelie Milano | Italian-Inspired Fashion & Lifestyle" : `${label} | Amelie Milano`;
    const description = descriptions[pathname] || `Discover ${label.toLowerCase()} from Amelie Milano, an Italian-inspired fashion and lifestyle house.`;
    document.title = title;
    const setMeta = (selector: string, attributes: Record<string, string>) => { let element = document.head.querySelector(selector); if (!element) { element = document.createElement("meta"); document.head.appendChild(element); } Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value)); };
    setMeta('meta[name="description"]', { name: "description", content: description });
    setMeta('meta[property="og:title"]', { property: "og:title", content: title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: description });
    setMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]'); if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); } canonical.href = `${window.location.origin}${pathname}`;
  }, [pathname]);
  return null;
};

export default SiteMeta;
