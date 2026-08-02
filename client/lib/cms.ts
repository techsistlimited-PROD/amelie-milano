/** Amelie Milano CMS client — replaces Builder.io fetches via /api/cms */

export interface CmsProduct {
  slug: string;
  title: string;
  description?: string;
  priceBdt: number;
  salePriceBdt?: number;
  heroImage: string;
  category: string;
  isNew?: boolean;
  badge?: string;
  colour?: string;
  material?: string;
  sizes?: string[];
  occasions?: string[];
  length?: string;
  availability?: string;
  displayOrder?: number;
  variants?: { size?: string; color?: string; volume?: string; details?: string }[];
  stylingTips?: string;
}

export interface CmsCollection {
  slug: string;
  title: string;
  description?: string;
  heroImage?: string;
  images?: string[];
  editorialCopy?: string;
  products?: string[];
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CmsSiteSectionItem {
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

export interface CmsSiteSection {
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
  items?: (string | CmsSiteSectionItem)[];
  productReferences?: string[];
  collectionReferences?: string[];
  displayOrder?: number;
  isVisible?: boolean;
}

export interface CmsEditorial {
  slug: string;
  title: string;
  excerpt?: string;
  heroImage?: string;
  type?: string;
  category?: string;
  gallery?: string[];
  author?: string;
  publishedAt?: string;
  featured?: boolean;
  isVisible?: boolean;
  displayOrder?: number;
  body?: unknown;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CmsPage {
  path: string;
  title: string;
  content: unknown;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CmsFaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  displayOrder?: number;
}

let cmsAvailable: boolean | null = null;

const cmsFetch = async <T>(path: string): Promise<T | null> => {
  try {
    const response = await fetch(`/api/cms${path}`, { cache: "no-store" });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

export const checkCmsStatus = async () => {
  const status = await cmsFetch<{ configured: boolean }>("/status");
  if (status?.configured) {
    cmsAvailable = true;
    return true;
  }
  const products = await cmsFetch<unknown[]>("/products");
  cmsAvailable = Array.isArray(products);
  return cmsAvailable;
};

export const isCmsConfigured = () => cmsAvailable === true;

/** Always attempt CMS load — do not gate on isCmsConfigured (it is async). */
export const ensureCmsReady = async () => {
  if (cmsAvailable === null) await checkCmsStatus();
  return cmsAvailable === true;
};

export const fetchCmsProducts = async (): Promise<CmsProduct[]> => {
  if (cmsAvailable === null) await checkCmsStatus();
  const data = (await cmsFetch<CmsProduct[]>("/products")) ?? [];
  if (data.length) cmsAvailable = true;
  return data;
};

export const fetchCmsProduct = async (slug: string): Promise<CmsProduct | null> => {
  if (cmsAvailable === null) await checkCmsStatus();
  const data = await cmsFetch<CmsProduct>(`/products/${encodeURIComponent(slug)}`);
  if (data) cmsAvailable = true;
  return data;
};

export const fetchCmsCollection = async (slug: string): Promise<CmsCollection | null> => {
  if (cmsAvailable === null) await checkCmsStatus();
  const data = await cmsFetch<CmsCollection>(`/collections/${encodeURIComponent(slug)}`);
  if (data) cmsAvailable = true;
  return data;
};

export const fetchCmsEditorials = async (): Promise<CmsEditorial[]> => {
  if (cmsAvailable === null) await checkCmsStatus();
  const data = (await cmsFetch<CmsEditorial[]>("/editorials")) ?? [];
  if (data.length) cmsAvailable = true;
  return data;
};

export const fetchCmsEditorial = async (slug: string): Promise<CmsEditorial | null> => {
  if (cmsAvailable === null) await checkCmsStatus();
  const data = await cmsFetch<CmsEditorial>(`/editorials/${encodeURIComponent(slug)}`);
  if (data) cmsAvailable = true;
  return data;
};

export const fetchCmsSiteSections = async (): Promise<CmsSiteSection[]> => {
  if (cmsAvailable === null) await checkCmsStatus();
  const data = (await cmsFetch<CmsSiteSection[]>("/sections")) ?? [];
  if (data.length) cmsAvailable = true;
  return data;
};

export const fetchCmsPage = async (path: string): Promise<CmsPage | null> => {
  if (cmsAvailable === null) await checkCmsStatus();
  const data = await cmsFetch<CmsPage>(`/pages?path=${encodeURIComponent(path)}`);
  if (data) cmsAvailable = true;
  return data;
};

export const fetchCmsFaq = async (): Promise<CmsFaqItem[]> => {
  if (cmsAvailable === null) await checkCmsStatus();
  const data = (await cmsFetch<CmsFaqItem[]>("/faq")) ?? [];
  if (data.length) cmsAvailable = true;
  return data;
};

// ── Admin API ─────────────────────────────────────────────────────────────────

export type CmsResource = "products" | "collections" | "editorials" | "sections" | "pages" | "faq";

export const adminCmsFetch = async <T>(
  token: string,
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`/api/admin/cms${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((payload as { message?: string }).message || "CMS request failed.");
  }
  return payload as T;
};

export const verifyCmsAdmin = async (token: string) => {
  try {
    await adminCmsFetch<{ isAdmin: boolean }>(token, "/me");
    return true;
  } catch {
    return false;
  }
};

export const listAdminRecords = async (token: string, resource: CmsResource) =>
  adminCmsFetch<Record<string, unknown>[]>(token, `/${resource}`);

export const createAdminRecord = async (token: string, resource: CmsResource, body: Record<string, unknown>) =>
  adminCmsFetch<Record<string, unknown>>(token, `/${resource}`, { method: "POST", body: JSON.stringify(body) });

export const updateAdminRecord = async (
  token: string,
  resource: CmsResource,
  id: string,
  body: Record<string, unknown>,
) => adminCmsFetch<Record<string, unknown>>(token, `/${resource}/${id}`, { method: "PUT", body: JSON.stringify(body) });

export const deleteAdminRecord = async (token: string, resource: CmsResource, id: string) => {
  const response = await fetch(`/api/admin/cms/${resource}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error((payload as { message?: string }).message || "Delete failed.");
  }
};
