import type { CmsResource } from "@/lib/cms";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "image" | "select";

export interface FieldConfig {
  key: string;
  label: string;
  hint?: string;
  type?: FieldType;
  options?: { value: string; label: string }[];
  websiteLocation?: string;
}

export const resourceMeta: Record<
  CmsResource,
  { label: string; description: string; previewPath?: string }
> = {
  products: {
    label: "Products",
    description: "Every item in Shop, product pages, and homepage product rows.",
    previewPath: "/shop",
  },
  collections: {
    label: "Collections",
    description: "Editorial landing pages at /collection/… (hero banner + curated product list). NOT the same as /shop/dresses filters page.",
    previewPath: "/collection/dresses",
  },
  editorials: {
    label: "Journal",
    description: "Articles on /journal and individual story pages.",
    previewPath: "/journal",
  },
  sections: {
    label: "Homepage sections",
    description: "Blocks on the homepage — hero, categories, new arrivals, etc.",
    previewPath: "/",
  },
  pages: {
    label: "Pages",
    description: "SEO title & description for static pages (About, Policies, etc.).",
  },
  faq: {
    label: "FAQ",
    description: "Questions and answers on /faq.",
    previewPath: "/faq",
  },
};

export const sectionKeyOptions = [
  { value: "homepage-hero", label: "Homepage → Top hero banner", location: "Top of homepage (big image)" },
  { value: "homepage-categories", label: "Homepage → Shop by Category", location: "6 category tiles below hero" },
  { value: "homepage-new-arrivals", label: "Homepage → New Arrivals", location: "Product row — links to /shop/new" },
  { value: "homepage-best-sellers", label: "Homepage → Best Sellers", location: "Second product row on homepage" },
  { value: "homepage-brand-promise", label: "Homepage → Brand promise", location: "Premium Quality / Fast Delivery / Returns" },
  { value: "homepage-occasionwear", label: "Homepage → Occasionwear block", location: "Image + text block mid-page" },
  { value: "homepage-editorial", label: "Homepage → Editorial feature", location: "Journal promo section" },
  { value: "homepage-style-concierge", label: "Homepage → Style Concierge", location: "Concierge call-to-action" },
  { value: "homepage-body-care", label: "Homepage → Body Care", location: "Body care promo block" },
  { value: "homepage-instagram", label: "Homepage → Instagram grid", location: "Social / gallery section" },
];

const bool = (key: string, label: string, hint?: string): FieldConfig => ({
  key,
  label,
  hint,
  type: "boolean",
});

export const fieldsForResource = (resource: CmsResource): FieldConfig[] => {
  if (resource === "products") {
    return [
      { key: "slug", label: "Product ID (URL)", hint: "Used in /product/THIS — e.g. 1, shoe-1, bag-1" },
      { key: "title", label: "Product name", hint: "Shown on shop cards and product page" },
      { key: "description", label: "Short description", hint: "Tagline under the product name", type: "textarea" },
      { key: "priceBdt", label: "Price (BDT)", type: "number" },
      { key: "category", label: "Category", hint: "Dresses, Shoes, Bags, Body Care, Gym Wear, Occasionwear" },
      { key: "heroImage", label: "Product image", hint: "Upload from computer or paste a URL", type: "image" },
      { key: "colour", label: "Colour", hint: "Shown on product card and used in colour filter" },
      { key: "material", label: "Material" },
      { key: "sizes", label: "Available sizes", hint: "Comma-separated: XS,S,M,L,XL" },
      { key: "occasions", label: "Occasions", hint: "Comma-separated: Evening,Daywear,Occasion" },
      {
        key: "length",
        label: "Dress length",
        type: "select",
        options: [
          { value: "Mini", label: "Mini" },
          { value: "Midi", label: "Midi" },
          { value: "Maxi", label: "Maxi" },
        ],
      },
      {
        key: "availability",
        label: "Availability",
        type: "select",
        options: [
          { value: "In Stock", label: "In Stock" },
          { value: "Low Stock", label: "Low Stock" },
          { value: "Out of Stock", label: "Out of Stock" },
        ],
      },
      { key: "salePriceBdt", label: "Sale price (BDT)", hint: "Leave empty if not on sale", type: "number" },
      {
        key: "badge",
        label: "Badge label",
        type: "select",
        options: [
          { value: "", label: "None" },
          { value: "New", label: "New" },
          { value: "Sale", label: "Sale" },
          { value: "Low Stock", label: "Low Stock" },
        ],
      },
      bool("isNew", "Show in New In", "Appears in /shop/new and New In filters"),
      bool("isVisible", "Visible on website"),
    ];
  }
  if (resource === "collections") {
    return [
      { key: "slug", label: "Collection ID (URL)", hint: "Used in /collection/THIS — e.g. dresses, bags. Note: /shop/dresses is a separate category page." },
      { key: "title", label: "Collection title", hint: "Hero heading on /collection/… page" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "heroImage", label: "Banner image", type: "image" },
      { key: "editorialCopy", label: "Subtitle / kicker" },
      { key: "productSlugs", label: "Product IDs (comma-separated)", hint: "Controls which products appear on /collection/… AND /shop/dresses (for dresses collection)" },
      bool("featured", "Featured collection"),
      bool("isVisible", "Visible on website"),
    ];
  }
  if (resource === "editorials") {
    return [
      { key: "slug", label: "Article URL slug", hint: "Used in /journal/THIS — e.g. italian-tailoring" },
      { key: "title", label: "Article title" },
      { key: "excerpt", label: "Summary", type: "textarea" },
      { key: "heroImage", label: "Cover image", type: "image" },
      { key: "category", label: "Category tag", hint: "Fashion, Lifestyle, Style Tips, Editorial" },
      { key: "author", label: "Author" },
      bool("featured", "Featured on Journal page"),
      bool("isVisible", "Visible on website"),
    ];
  }
  if (resource === "sections") {
    return [
      {
        key: "sectionKey",
        label: "Which homepage block?",
        type: "select",
        options: sectionKeyOptions.map((item) => ({ value: item.value, label: item.label })),
      },
      { key: "title", label: "Heading text" },
      { key: "eyebrow", label: "Small label above heading" },
      { key: "subheading", label: "Subheading" },
      { key: "body", label: "Body text", type: "textarea" },
      { key: "heroImage", label: "Section image", hint: "Hero / feature image for this block", type: "image" },
      {
        key: "productSlugs",
        label: "Product IDs for this section",
        hint: "For New Arrivals / Best Sellers — comma-separated, e.g. 1,2,3,4",
      },
      bool("isVisible", "Show this section on homepage"),
      { key: "displayOrder", label: "Sort order", type: "number" },
    ];
  }
  if (resource === "pages") {
    return [
      { key: "path", label: "Page path", hint: "e.g. /about, /shipping, /privacy" },
      { key: "title", label: "Page title" },
      { key: "seoTitle", label: "SEO title (Google)" },
      { key: "seoDescription", label: "SEO description", type: "textarea" },
      bool("isVisible", "Visible"),
    ];
  }
  return [
    { key: "category", label: "FAQ group", hint: "Orders & Payments, Shipping & Delivery, etc." },
    { key: "question", label: "Question" },
    { key: "answer", label: "Answer", type: "textarea" },
    { key: "displayOrder", label: "Sort order", type: "number" },
    bool("isVisible", "Visible on /faq"),
  ];
};

export const listTitleFor = (resource: CmsResource, row: Record<string, unknown>) => {
  if (resource === "faq") return String(row.question ?? "Untitled");
  if (resource === "sections") {
    const key = String(row.sectionKey ?? "");
    return sectionKeyOptions.find((item) => item.value === key)?.label ?? key;
  }
  if (resource === "pages") return String(row.path ?? row.title ?? "Page");
  return String(row.title ?? row.slug ?? row.id ?? "Item");
};

export const listSubtitleFor = (resource: CmsResource, row: Record<string, unknown>) => {
  if (resource === "products") return `/product/${row.slug}`;
  if (resource === "collections") return `/collection/${row.slug}`;
  if (resource === "editorials") return `/journal/${row.slug}`;
  if (resource === "faq") return String(row.category ?? "");
  if (resource === "sections") {
    const key = String(row.sectionKey ?? "");
    return sectionKeyOptions.find((item) => item.value === key)?.location ?? "";
  }
  return "";
};

export const preparePayload = (resource: CmsResource, draft: Record<string, unknown>) => {
  const payload: Record<string, unknown> = {};
  for (const field of fieldsForResource(resource)) {
    const value = draft[field.key];
    if (value === undefined || value === "") continue;
    if (field.key === "productSlugs" && typeof value === "string") {
      payload.productSlugs = value.split(",").map((item) => item.trim()).filter(Boolean);
      continue;
    }
    if ((field.key === "sizes" || field.key === "occasions") && typeof value === "string") {
      payload[field.key] = value.split(",").map((item) => item.trim()).filter(Boolean);
      continue;
    }
    payload[field.key] = value;
  }
  return payload;
};

export const rowToDraft = (resource: CmsResource, row: Record<string, unknown>) => {
  const draft = { ...row };
  if (resource === "collections" || resource === "sections") {
    const slugs = row.productSlugs ?? row.productReferences;
    if (Array.isArray(slugs)) draft.productSlugs = slugs.join(", ");
  }
  if (resource === "products") {
    if (Array.isArray(row.sizes)) draft.sizes = row.sizes.join(", ");
    if (Array.isArray(row.occasions)) draft.occasions = row.occasions.join(", ");
  }
  return draft;
};
