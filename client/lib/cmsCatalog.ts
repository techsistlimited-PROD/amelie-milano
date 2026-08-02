import type { CmsProduct, CmsSiteSection } from "./cms";

/** Standard shape used by ProductCard across the storefront */
export interface StoreProductCard {
  id: string;
  name: string;
  price: number;
  image: string;
  isNew?: boolean;
  category?: string;
  colour?: string;
  material?: string;
  salePrice?: number;
  badge?: string;
}

export const toProductCard = (product: CmsProduct): StoreProductCard => ({
  id: product.slug,
  name: product.title,
  price: product.priceBdt,
  salePrice: product.salePriceBdt,
  image: product.heroImage,
  isNew: product.isNew,
  category: product.category,
  colour: product.colour,
  material: product.material,
  badge: product.badge,
});

export const sortByDisplayOrder = (products: CmsProduct[]) =>
  [...products].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

/** Pick products for a homepage section — CMS products are the source of truth. */
export const resolveSectionProducts = (
  section: CmsSiteSection | undefined,
  allProducts: CmsProduct[],
  autoFilter: (product: CmsProduct) => boolean,
): StoreProductCard[] => {
  if (!allProducts.length) return [];

  const refs = section?.productReferences?.filter(Boolean) ?? [];
  const auto = sortByDisplayOrder(allProducts.filter(autoFilter));

  if (refs.length) {
    const referenced = refs
      .map((slug) => allProducts.find((product) => product.slug === slug))
      .filter((product): product is CmsProduct => Boolean(product));
    const seen = new Set(referenced.map((product) => product.slug));
    const extras = auto.filter((product) => !seen.has(product.slug));
    return [...referenced, ...extras].map(toProductCard);
  }

  return auto.map(toProductCard);
};

/** Collection page — listed slugs first, then same-category products from CMS. */
const normalizeCategory = (value: string) => value.toLowerCase().trim().replace(/\s+/g, " ");

export const resolveCollectionProducts = (
  slugList: string[] | undefined,
  allProducts: CmsProduct[],
  categoryLabel: string,
): StoreProductCard[] => {
  if (!allProducts.length) return [];

  const listed = (slugList ?? [])
    .map((slug) => allProducts.find((product) => product.slug === slug))
    .filter((product): product is CmsProduct => Boolean(product));

  const seen = new Set(listed.map((product) => product.slug));
  const target = normalizeCategory(categoryLabel);
  const categoryMatches =
    categoryLabel === "New In"
      ? allProducts.filter((product) => product.isNew)
      : allProducts.filter((product) => normalizeCategory(product.category) === target);

  const merged = [...listed];
  for (const product of sortByDisplayOrder(categoryMatches)) {
    if (!seen.has(product.slug)) merged.push(product);
  }

  return merged.map(toProductCard);
};

export const categoryMatches = (product: CmsProduct, categorySlug: string) => {
  if (categorySlug === "dresses") {
    return product.category === "Dresses" || product.category === "Occasionwear";
  }
  const label = categorySlug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  return product.category.toLowerCase() === label.toLowerCase() || product.category.toLowerCase().replace(" ", "-") === categorySlug;
};
