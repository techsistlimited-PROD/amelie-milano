import type { CmsResource } from "@/lib/cms";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "image" | "select" | "readonly";

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
  "Shoes",
  "Bags",
  "Body Care",
  "Gym Wear",
] as const;

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
    description: "Every item in Shop and homepage rows. Products appear automatically — no manual ID lists.",
    previewPath: "/shop",
  },
  collections: {
    label: "Collections",
    description: "Banner + title for each /shop/… category page (e.g. /shop/bags). Products appear automatically by category.",
    previewPath: "/shop/bags",
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
  context: { sectionKey?: string; productSlug?: string; isEdit?: boolean } = {},
): FieldConfig[] => {
  if (resource === "products") {
    const base: FieldConfig[] = [
      req({ key: "title", label: "Product name" }),
      { key: "description", label: "Short description", type: "textarea" },
      req({ key: "priceBdt", label: "Price (BDT)", type: "number" }),
      req({
        key: "category",
        label: "Category",
        type: "select",
        options: PRODUCT_CATEGORIES.map((item) => ({ value: item, label: item })),
      }),
      req({ key: "heroImage", label: "Product image", type: "image" }),
      { key: "colour", label: "Colour" },
      { key: "material", label: "Material" },
      {
        key: "length",
        label: "Dress length",
        type: "select",
        options: [{ value: "", label: "N/A" }, { value: "Mini", label: "Mini" }, { value: "Midi", label: "Midi" }, { value: "Maxi", label: "Maxi" }],
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
    if (context.isEdit && context.productSlug) {
      return [{ key: "slug", label: "Product URL", type: "readonly", hint: `/product/${context.productSlug}` }, ...base];
    }
    return base;
  }

  if (resource === "collections") {
    return [
      req({
        key: "slug",
        label: "Collection page",
        type: "select",
        options: [
          { value: "new-in", label: "/collection/new-in" },
          { value: "dresses", label: "/collection/dresses" },
          { value: "occasionwear", label: "/collection/occasionwear" },
          { value: "gym-wear", label: "/collection/gym-wear" },
          { value: "bags", label: "/collection/bags" },
          { value: "shoes", label: "/collection/shoes" },
          { value: "body-care", label: "/collection/body-care" },
        ],
      }),
      req({ key: "title", label: "Collection title" }),
      { key: "description", label: "Description", type: "textarea" },
      req({ key: "heroImage", label: "Banner image", type: "image" }),
      { key: "editorialCopy", label: "Subtitle above title" },
      bool("featured", "Featured collection"),
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
  if (resource === "products") return `/product/${row.slug}`;
  if (resource === "collections") return `/collection/${row.slug}`;
  if (resource === "editorials") return `/journal/${row.slug ?? slugify(String(row.title ?? ""))}`;
  if (resource === "faq") return String(row.category ?? "");
  if (resource === "sections") {
    const key = String(row.sectionKey ?? "");
    return sectionKeyOptions.find((item) => item.value === key)?.location ?? "";
  }
  return "";
};

export const validateDraft = (resource: CmsResource, draft: Record<string, unknown>, context: { sectionKey?: string } = {}) => {
  return fieldsForResource(resource, { ...context, isEdit: Boolean(draft.id) })
    .filter((field) => field.required && field.type !== "readonly")
    .filter((field) => {
      const value = draft[field.key];
      return value === undefined || value === null || value === "";
    })
    .map((field) => field.label);
};

export const preparePayload = (resource: CmsResource, draft: Record<string, unknown>, isNew = false) => {
  const sectionKey = String(draft.sectionKey ?? "");
  const fields = fieldsForResource(resource, { sectionKey, isEdit: !isNew });
  const payload: Record<string, unknown> = {};

  for (const field of fields) {
    if (field.type === "readonly") continue;
    const value = draft[field.key];
    if (value === undefined || value === "") continue;
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

export const rowToDraft = (resource: CmsResource, row: Record<string, unknown>) => ({ ...row });
