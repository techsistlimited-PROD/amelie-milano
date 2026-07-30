import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface SeoProduct {
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
  sku?: string;
  availability?: "InStock" | "OutOfStock";
}

export interface SeoArticle {
  headline: string;
  description: string;
  image: string;
  author?: string;
  publishedAt?: string;
}

interface SeoProps {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "product" | "article";
  product?: SeoProduct;
  article?: SeoArticle;
  breadcrumbs?: { name: string; url: string }[];
}

const defaultImage = "/placeholder.svg";
const brandName = "Amelie Milano";

const Seo = ({ title, description, image = defaultImage, type = "website", product, article, breadcrumbs }: SeoProps) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const origin = window.location.origin;
    const canonicalUrl = `${origin}${pathname}`;
    const imageUrl = image.startsWith("http") ? image : `${origin}${image}`;
    document.title = title;
    const setMeta = (selector: string, attributes: Record<string, string>) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) { element = document.createElement("meta"); document.head.appendChild(element); }
      Object.entries(attributes).forEach(([key, value]) => element!.setAttribute(key, value));
    };
    setMeta('meta[name="description"]', { name: "description", content: description });
    setMeta('meta[property="og:title"]', { property: "og:title", content: title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: description });
    setMeta('meta[property="og:image"]', { property: "og:image", content: imageUrl });
    setMeta('meta[property="og:url"]', { property: "og:url", content: canonicalUrl });
    setMeta('meta[property="og:type"]', { property: "og:type", content: type === "product" ? "product" : type });
    setMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    setMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    setMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    setMeta('meta[name="twitter:image"]', { name: "twitter:image", content: imageUrl });
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = canonicalUrl;

    const schemas: Record<string, unknown>[] = [{
      "@context": "https://schema.org",
      "@type": "Organization",
      name: brandName,
      url: origin,
      sameAs: [],
    }];
    const trail = breadcrumbs || pathname.split("/").filter(Boolean).map((segment, index, parts) => ({ name: segment.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()), url: `${origin}/${parts.slice(0, index + 1).join("/")}` }));
    schemas.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: origin }, ...trail.map((item, index) => ({ "@type": "ListItem", position: index + 2, name: item.name, item: item.url }))] });
    if (product) schemas.push({ "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description, image: [product.image], sku: product.sku, category: product.category, brand: { "@type": "Brand", name: brandName }, offers: { "@type": "Offer", url: canonicalUrl, priceCurrency: "BDT", price: product.price, availability: `https://schema.org/${product.availability || "InStock"}`, itemCondition: "https://schema.org/NewCondition" } });
    if (article) schemas.push({ "@context": "https://schema.org", "@type": "Article", headline: article.headline, description: article.description, image: [article.image], datePublished: article.publishedAt, author: { "@type": "Person", name: article.author || brandName }, publisher: { "@type": "Organization", name: brandName, url: origin }, mainEntityOfPage: canonicalUrl });
    let script = document.head.querySelector<HTMLScriptElement>('script[data-amelie-seo="true"]');
    if (!script) { script = document.createElement("script"); script.type = "application/ld+json"; script.dataset.amelieSeo = "true"; document.head.appendChild(script); }
    script.textContent = JSON.stringify(schemas);
  }, [article, breadcrumbs, description, image, pathname, product, title, type]);

  return null;
};

export default Seo;
