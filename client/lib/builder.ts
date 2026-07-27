import { fetchOneEntry } from "@builder.io/sdk-react";

export const BUILDER_API_KEY = import.meta.env.VITE_PUBLIC_BUILDER_KEY as string;
export const BUILDER_PAGE_MODEL = "page";
export const BUILDER_PRODUCT_MODEL = "amelie-product";
export const BUILDER_EDITORIAL_MODEL = "amelie-editorial";
export const BUILDER_SITE_SECTION_MODEL = "amelie-site-section";
export const BUILDER_COLLECTION_MODEL = "amelie-collection";

export interface BuilderCollectionData {
  slug: string;
  title: string;
  description?: string;
  heroImage?: string;
  images?: string[];
  editorialCopy?: string;
  products?: (string | { slug?: string; id?: string })[];
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface BuilderSiteSectionItem {
  label?: string;
  name?: string;
  title?: string;
  copy?: string;
  description?: string;
  image?: string;
  href?: string;
  url?: string;
  [key: string]: unknown;
}

export interface BuilderSiteSectionData {
  key: string;
  title?: string;
  subheading?: string;
  eyebrow?: string;
  body?: string;
  description?: string;
  heroImage?: string;
  images?: string[];
  buttons?: { label?: string; url?: string; href?: string }[];
  ctaLabel?: string;
  ctaUrl?: string;
  items?: (string | BuilderSiteSectionItem)[];
  productReferences?: string[];
  collectionReferences?: string[];
  displayOrder?: number;
  isVisible?: boolean;
}

export interface BuilderEditorialData {
  slug: string;
  title: string;
  excerpt?: string;
  heroImage?: string;
  type?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface BuilderProductData {
  slug: string;
  title: string;
  description?: string;
  priceBdt: number;
  heroImage: string;
  category: string;
  isNew?: boolean;
  variants?: { size?: string; color?: string; volume?: string; details?: string }[];
  stylingTips?: string;
}

export const isBuilderConfigured = Boolean(
  BUILDER_API_KEY && !BUILDER_API_KEY.startsWith("__"),
);

export const fetchBuilderPage = async (urlPath: string) => {
  if (!isBuilderConfigured) return null;

  return fetchOneEntry({
    model: BUILDER_PAGE_MODEL,
    apiKey: BUILDER_API_KEY,
    userAttributes: { urlPath },
  });
};

export const fetchBuilderProduct = async (slug: string) => {
  if (!isBuilderConfigured) return null;

  return fetchOneEntry({
    model: BUILDER_PRODUCT_MODEL,
    apiKey: BUILDER_API_KEY,
    query: { "data.slug": slug },
  });
};

export const fetchBuilderEditorial = async (slug: string) => {
  if (!isBuilderConfigured) return null;

  return fetchOneEntry({
    model: BUILDER_EDITORIAL_MODEL,
    apiKey: BUILDER_API_KEY,
    query: { "data.slug": slug },
  });
};

export const fetchBuilderCollection = async (slug: string) => {
  if (!isBuilderConfigured) return null;

  return fetchOneEntry({
    model: BUILDER_COLLECTION_MODEL,
    apiKey: BUILDER_API_KEY,
    query: { "data.slug": slug },
  });
};

export const fetchBuilderProducts = async () => {
  if (!isBuilderConfigured) return [];
  const response = await fetch(`https://cdn.builder.io/api/v3/content/${BUILDER_PRODUCT_MODEL}?apiKey=${BUILDER_API_KEY}&limit=100`);
  if (!response.ok) return [];
  const result = await response.json() as { results?: { id: string; data: BuilderProductData }[] };
  return result.results ?? [];
};

export const fetchBuilderSiteSections = async () => {
  if (!isBuilderConfigured) return [];
  const response = await fetch(`https://cdn.builder.io/api/v3/content/${BUILDER_SITE_SECTION_MODEL}?apiKey=${BUILDER_API_KEY}&limit=100&query.data.isVisible=true`);
  if (!response.ok) return [];
  const result = await response.json() as { results?: { id: string; data: BuilderSiteSectionData }[] };
  return (result.results ?? []).sort((a, b) => (a.data.displayOrder ?? 0) - (b.data.displayOrder ?? 0));
};
