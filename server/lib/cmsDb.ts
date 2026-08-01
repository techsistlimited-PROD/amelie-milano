import { supabaseRequest } from "./supabase";

export const cmsTables = {
  products: "cms_products",
  collections: "cms_collections",
  editorials: "cms_editorials",
  sections: "cms_site_sections",
  pages: "cms_pages",
  faq: "cms_faq_items",
} as const;

export type CmsTable = (typeof cmsTables)[keyof typeof cmsTables];

const snakeToCamel = (key: string) => key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

export const mapRow = <T extends Record<string, unknown>>(row: Record<string, unknown>): T => {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    out[snakeToCamel(key)] = value;
  }
  return out as T;
};

export const mapRows = <T extends Record<string, unknown>>(rows: Record<string, unknown>[]) =>
  rows.map((row) => mapRow<T>(row));

export const camelToSnake = (key: string) => key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);

export const mapPayloadToRow = (payload: Record<string, unknown>) => {
  const out: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined) continue;
    out[camelToSnake(key)] = value;
  }
  return out;
};

export const cmsConfigured = () => Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));

export const listRows = async (table: CmsTable, order = "display_order.asc") => {
  const rows = await supabaseRequest<Record<string, unknown>[]>(`${table}?select=*&order=${order}`);
  return rows ?? [];
};

export const listVisibleRows = async (table: CmsTable, order = "display_order.asc") => {
  const rows = await supabaseRequest<Record<string, unknown>[]>(`${table}?select=*&is_visible=eq.true&order=${order}`);
  return rows ?? [];
};

export const getByField = async (table: CmsTable, field: string, value: string) => {
  const rows = await supabaseRequest<Record<string, unknown>[]>(`${table}?${field}=eq.${encodeURIComponent(value)}&select=*&limit=1`);
  return rows?.[0] ?? null;
};

export const insertRow = async (table: CmsTable, payload: Record<string, unknown>) => {
  const rows = await supabaseRequest<Record<string, unknown>[]>(table, {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(mapPayloadToRow(payload)),
  });
  return rows?.[0] ?? null;
};

export const updateRow = async (table: CmsTable, id: string, payload: Record<string, unknown>) => {
  const rows = await supabaseRequest<Record<string, unknown>[]>(`${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify(mapPayloadToRow(payload)),
  });
  return rows?.[0] ?? null;
};

export const deleteRow = async (table: CmsTable, id: string) => {
  await supabaseRequest(`${table}?id=eq.${id}`, { method: "DELETE", headers: { Prefer: "return=minimal" } });
};

export const mapProduct = (row: Record<string, unknown>) => ({
  slug: String(row.slug ?? ""),
  title: String(row.title ?? ""),
  description: row.description ? String(row.description) : undefined,
  priceBdt: Number(row.price_bdt ?? 0),
  salePriceBdt: row.sale_price_bdt != null ? Number(row.sale_price_bdt) : undefined,
  heroImage: String(row.hero_image ?? ""),
  category: String(row.category ?? ""),
  isNew: Boolean(row.is_new),
  badge: row.badge ? String(row.badge) : undefined,
  colour: row.colour ? String(row.colour) : undefined,
  material: row.material ? String(row.material) : undefined,
  sizes: Array.isArray(row.sizes) ? (row.sizes as string[]) : [],
  occasions: Array.isArray(row.occasions) ? (row.occasions as string[]) : [],
  length: row.length ? String(row.length) : undefined,
  availability: row.availability ? String(row.availability) : "In Stock",
  variants: (row.variants as unknown[]) ?? [],
  stylingTips: row.styling_tips ? String(row.styling_tips) : undefined,
});

export const mapCollection = (row: Record<string, unknown>) => ({
  slug: String(row.slug ?? ""),
  title: String(row.title ?? ""),
  description: row.description ? String(row.description) : undefined,
  heroImage: row.hero_image ? String(row.hero_image) : undefined,
  images: (row.images as string[]) ?? [],
  editorialCopy: row.editorial_copy ? String(row.editorial_copy) : undefined,
  products: (row.product_slugs as string[]) ?? [],
  featured: Boolean(row.featured),
  seoTitle: row.seo_title ? String(row.seo_title) : undefined,
  seoDescription: row.seo_description ? String(row.seo_description) : undefined,
});

export const mapEditorial = (row: Record<string, unknown>) => ({
  slug: String(row.slug ?? ""),
  title: String(row.title ?? ""),
  excerpt: row.excerpt ? String(row.excerpt) : undefined,
  heroImage: row.hero_image ? String(row.hero_image) : undefined,
  category: row.category ? String(row.category) : undefined,
  gallery: (row.gallery as string[]) ?? [],
  author: row.author ? String(row.author) : undefined,
  publishedAt: row.published_at ? String(row.published_at) : undefined,
  featured: Boolean(row.featured),
  isVisible: Boolean(row.is_visible ?? true),
  displayOrder: Number(row.display_order ?? 0),
  body: row.body,
  seoTitle: row.seo_title ? String(row.seo_title) : undefined,
  seoDescription: row.seo_description ? String(row.seo_description) : undefined,
});

export const mapSection = (row: Record<string, unknown>) => ({
  key: String(row.section_key ?? ""),
  title: row.title ? String(row.title) : undefined,
  subheading: row.subheading ? String(row.subheading) : undefined,
  eyebrow: row.eyebrow ? String(row.eyebrow) : undefined,
  body: row.body ? String(row.body) : undefined,
  heroImage: row.hero_image ? String(row.hero_image) : undefined,
  images: (row.images as string[]) ?? [],
  items: (row.items as unknown[]) ?? [],
  buttons: (row.buttons as unknown[]) ?? [],
  productReferences: (row.product_slugs as string[]) ?? [],
  collectionReferences: (row.collection_slugs as string[]) ?? [],
  displayOrder: Number(row.display_order ?? 0),
  isVisible: Boolean(row.is_visible ?? true),
});

export const mapPage = (row: Record<string, unknown>) => ({
  path: String(row.path ?? ""),
  title: String(row.title ?? ""),
  content: row.content ?? [],
  seoTitle: row.seo_title ? String(row.seo_title) : undefined,
  seoDescription: row.seo_description ? String(row.seo_description) : undefined,
  isVisible: Boolean(row.is_visible ?? true),
});
