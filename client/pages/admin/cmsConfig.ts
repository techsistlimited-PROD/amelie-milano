import type { CmsResource } from "@/lib/cms";
import { fieldsForProductCategory } from "@/lib/productFields";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "image" | "select" | "readonly" | "multiselect";

export interface FieldConfig {
  key: string;
  label: string;
  hint?: string;
  type?: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
}

export const PRODUCT_CATEGORIES = [
  "Dresses",
  "Occasionwear",
  "Body Care",
  "Gym Wear",
  "Bags",
  "Shoes",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const categoryShopPath = (category: string) => {
  const paths: Record<string, string> = {
    Dresses: "/shop/dresses",
    Occasionwear: "/shop/occasionwear",
    "Body Care": "/shop/body-care",
    "Gym Wear": "/shop/gym-wear",
    Bags: "/shop/bags",
    Shoes: "/shop/shoes",
  };
  return paths[category] ?? "/shop";
};

export const groupRecordsByCategory = (records: Record<string, unknown>[]) => {
  const groups = PRODUCT_CATEGORIES.map((category) => ({
    category,
    shopPath: categoryShopPath(category),
    items: records.filter((row) => String(row.category ?? "") === category),
  })).filter((group) => group.items.length > 0);

  const known = new Set<string>(PRODUCT_CATEGORIES);
  const other = records.filter((row) => !known.has(String(row.category ?? "")));
  if (other.length) {
    groups.push({ category: "Uncategorised", shopPath: "/shop", items: other });
  }
  return groups;
};

export const FAQ_CATEGORIES = [
  "Orders & Payments",
  "Shipping & Delivery",
  "Returns & Exchanges",
  "Product Information",
  "Account & Login",
  "Promotions & Offers",
] as const;

export const EDITORIAL_CATEGORIES = ["Fashion", "Style Tips", "Lifestyle", "Editorial"] as const;

export const resourceMeta: Record<
  CmsResource,
  { label: string; description: string; previewPath?: string }
> = {
  products: {
    label: "Products",
    description: "Add items by type (Dresses, Bags, Shoes…). Each product appears on its matching shop page automatically.",
    previewPath: "/shop",
  },
  collections: {
    label: "Shop pages",
    description: "Banner and title for each menu page — Dresses, Bags, Shoes, Body Care, etc.",
    previewPath: "/shop/dresses",
  },
  editorials: {
    label: "Journal",
    description: "Articles on /journal.",
    previewPath: "/journal",
  },
  sections: {
    label: "Homepage sections",
    description: "Only fields that appear on the homepage are shown for each block.",
    previewPath: "/",
  },
  pages: {
    label: "Pages",
    description: "SEO for static pages.",
  },
  faq: {
    label: "FAQ",
    description: "Questions on /faq.",
    previewPath: "/faq",
  },
};

export const sectionKeyOptions = [
  { value: "homepage-hero", label: "Homepage → Top hero banner", location: "Banner image only — no text overlay" },
  { value: "homepage-categories", label: "Homepage → Shop by Category", location: "Heading above category tiles" },
  { value: "homepage-new-arrivals", label: "Homepage → New Arrivals", location: "Product row (auto: New products)" },
  { value: "homepage-best-sellers", label: "Homepage → Best Sellers", location: "Product row (auto: other products)" },
  { value: "homepage-brand-promise", label: "Homepage → Brand promise", location: "Show/hide quality row" },
  { value: "homepage-occasionwear", label: "Homepage → Occasionwear", location: "Text + image block" },
  { value: "homepage-editorial", label: "Homepage → Editorial", location: "Show/hide Amelie Edit block" },
  { value: "homepage-style-concierge", label: "Homepage → Style Concierge", location: "Show/hide concierge block" },
  { value: "homepage-body-care", label: "Homepage → Body Care", location: "Show/hide body care block" },
  { value: "homepage-instagram", label: "Homepage → Instagram", location: "Show/hide Instagram grid" },
];

const bool = (key: string, label: string): FieldConfig => ({ key, label, type: "boolean" });
const req = (field: FieldConfig): FieldConfig => ({ ...field, required: true });

export const fieldsForSectionKey = (sectionKey: string): FieldConfig[] => {
  const show = bool("isVisible", "Show on homepage");
  switch (sectionKey) {
    case "homepage-hero":
      return [
        req({ key: "heroImage", label: "Banner image", type: "image" }),
        show,
      ];
    case "homepage-categories":
      return [
        req({ key: "title", label: "Section heading" }),
        { key: "body", label: "Description", type: "textarea" },
        show,
      ];
    case "homepage-new-arrivals":
    case "homepage-best-sellers":
      return [
        req({ key: "title", label: "Section heading" }),
        { key: "body", label: "Description", type: "textarea" },
        show,
      ];
    case "homepage-occasionwear":
    case "homepage-body-care":
      return [
        req({ key: "title", label: "Heading" }),
        req({ key: "body", label: "Description", type: "textarea" }),
        req({ key: "heroImage", label: "Feature image", type: "image" }),
        show,
      ];
    default:
      return [show];
  }
};

export const fieldsForResource = (
  resource: CmsResource,
  context: { sectionKey?: string; productSlug?: string; productCategory?: string; isEdit?: boolean } = {},
): FieldConfig[] => {
  if (resource === "products") {
    const category = context.productCategory ?? "";
    const shared: FieldConfig[] = [
      req({ key: "title", label: "Product name" }),
      req({
        key: "category",
        label: "Product type",
        type: "select",
        hint: "Choose the menu section — fields below change based on type.",
        options: PRODUCT_CATEGORIES.map((item) => ({
          value: item,
          label: `${item} → ${categoryShopPath(item)}`,
        })),
      }),
      { key: "description", label: "Short description", type: "textarea" },
      req({ key: "priceBdt", label: "Price (BDT)", type: "number" }),
      req({ key: "heroImage", label: "Product image", type: "image" }),
      { key: "colour", label: "Colour" },
      { key: "material", label: "Material" },
    ];
    const typeFields = category ? (fieldsForProductCategory(category) as FieldConfig[]) : [];
    const tail: FieldConfig[] = [
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
      { key: "salePriceBdt", label: "Sale price (BDT)", type: "number" },
      {
        key: "badge",
        label: "Badge",
        type: "select",
        options: [{ value: "", label: "None" }, { value: "New", label: "New" }, { value: "Sale", label: "Sale" }, { value: "Low Stock", label: "Low Stock" }],
      },
      bool("isNew", "Show in New In"),
      bool("isVisible", "Visible on website"),
    ];
    const fields = [...shared, ...typeFields, ...tail];
    if (context.isEdit && context.productSlug) {
      return [{ key: "slug", label: "Product URL", type: "readonly", hint: `/product/${context.productSlug}` }, ...fields];
    }
    return fields;
  }

  if (resource === "collections") {
    return [
      req({
        key: "slug",
        label: "Shop page",
        type: "select",
        options: [
          { value: "dresses", label: "Dresses → /shop/dresses" },
          { value: "occasionwear", label: "Occasionwear → /shop/occasionwear" },
          { value: "body-care", label: "Body Care → /shop/body-care" },
          { value: "gym-wear", label: "Gym Wear → /shop/gym-wear" },
          { value: "bags", label: "Bags → /shop/bags" },
          { value: "shoes", label: "Shoes → /shop/shoes" },
        ],
      }),
      req({ key: "title", label: "Page title" }),
      { key: "description", label: "Description", type: "textarea" },
      req({ key: "heroImage", label: "Banner image", type: "image" }),
      { key: "editorialCopy", label: "Subtitle above title" },
      bool("featured", "Featured on homepage"),
      bool("isVisible", "Visible on website"),
    ];
  }

  if (resource === "editorials") {
    return [
      req({ key: "title", label: "Article title" }),
      req({ key: "excerpt", label: "Summary", type: "textarea" }),
      req({ key: "heroImage", label: "Cover image", type: "image" }),
      req({
        key: "category",
        label: "Category",
        type: "select",
        options: EDITORIAL_CATEGORIES.map((item) => ({ value: item, label: item })),
      }),
      { key: "author", label: "Author" },
      bool("featured", "Featured on Journal"),
      bool("isVisible", "Visible on website"),
    ];
  }

  if (resource === "sections") {
    const key = context.sectionKey ?? "";
    if (!key) {
      return [
        req({
          key: "sectionKey",
          label: "Which homepage block?",
          type: "select",
          options: sectionKeyOptions.map((item) => ({ value: item.value, label: item.label })),
        }),
        bool("isVisible", "Show on homepage"),
      ];
    }
    return [
      {
        key: "sectionKey",
        label: "Homepage block",
        type: "select",
        options: sectionKeyOptions.map((item) => ({ value: item.value, label: item.label })),
      },
      ...fieldsForSectionKey(key),
    ];
  }

  if (resource === "pages") {
    return [
      req({ key: "path", label: "Page path" }),
      req({ key: "title", label: "Page title" }),
      { key: "seoTitle", label: "SEO title" },
      { key: "seoDescription", label: "SEO description", type: "textarea" },
      bool("isVisible", "Visible"),
    ];
  }

  return [
    req({
      key: "category",
      label: "FAQ group",
      type: "select",
      options: FAQ_CATEGORIES.map((item) => ({ value: item, label: item })),
    }),
    req({ key: "question", label: "Question" }),
    req({ key: "answer", label: "Answer", type: "textarea" }),
    { key: "displayOrder", label: "Sort order", type: "number" },
    bool("isVisible", "Visible on /faq"),
  ];
};

export const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";

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
  if (resource === "products") {
    const category = String(row.category ?? "");
    return category ? `${categoryShopPath(category)} · /product/${row.slug}` : `/product/${row.slug}`;
  }
  if (resource === "collections") {
    const slug = String(row.slug ?? "");
    return slug ? `/shop/${slug}` : "";
  }
  if (resource === "editorials") return `/journal/${row.slug ?? slugify(String(row.title ?? ""))}`;
  if (resource === "faq") return String(row.category ?? "");
  if (resource === "sections") {
    const key = String(row.sectionKey ?? "");
    return sectionKeyOptions.find((item) => item.value === key)?.location ?? "";
  }
  return "";
};

export const validateDraft = (resource: CmsResource, draft: Record<string, unknown>, context: { sectionKey?: string; productCategory?: string } = {}) => {
  return fieldsForResource(resource, { ...context, productCategory: context.productCategory ?? String(draft.category ?? ""), isEdit: Boolean(draft.id) })
    .filter((field) => field.required && field.type !== "readonly")
    .filter((field) => {
      const value = draft[field.key];
      return value === undefined || value === null || value === "";
    })
    .map((field) => field.label);
};

export const preparePayload = (resource: CmsResource, draft: Record<string, unknown>, isNew = false) => {
  const sectionKey = String(draft.sectionKey ?? "");
  const productCategory = String(draft.category ?? "");
  const fields = fieldsForResource(resource, { sectionKey, productCategory, isEdit: !isNew });
  const payload: Record<string, unknown> = {};

  for (const field of fields) {
    if (field.type === "readonly") continue;
    const value = draft[field.key];
    if (value === undefined || value === "") continue;
    if (field.type === "multiselect") {
      payload[field.key] = Array.isArray(value) ? value : [];
      continue;
    }
    payload[field.key] = value;
  }

  if (isNew && payload.isVisible === undefined) payload.isVisible = true;
  if (resource === "products" && isNew) {
    payload.slug = slugify(String(draft.title ?? "product"));
    if (payload.priceBdt === undefined) payload.priceBdt = 0;
  }
  if (resource === "editorials" && isNew && draft.title) {
    payload.slug = slugify(String(draft.title));
  }

  return payload;
};

export const rowToDraft = (resource: CmsResource, row: Record<string, unknown>) => {
  const draft = { ...row };
  if (resource === "products") {
    if (!Array.isArray(draft.sizes)) draft.sizes = [];
    if (!Array.isArray(draft.occasions)) draft.occasions = [];
  }
  return draft;
};
