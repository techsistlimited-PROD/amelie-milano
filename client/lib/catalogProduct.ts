import type { CmsProduct } from "./cms";

export interface CatalogProduct {
  id: string;
  name: string;
  price: number;
  salePrice?: number;
  image: string;
  badge?: string;
  colour: string;
  category: string;
  material?: string;
  sizes: string[];
  occasions: string[];
  length?: string;
  availability: string;
  isNew?: boolean;
}

export const cmsToCatalog = (data: CmsProduct): CatalogProduct => ({
  id: data.slug,
  name: data.title,
  price: data.priceBdt,
  salePrice: data.salePriceBdt,
  image: data.heroImage,
  badge: data.badge ?? (data.isNew ? "New" : undefined),
  colour: data.colour ?? "",
  category: data.category,
  material: data.material,
  sizes: data.sizes ?? [],
  occasions: data.occasions ?? [],
  length: data.length,
  availability: data.availability ?? "In Stock",
  isNew: data.isNew,
});

/** Match sidebar filter checkbox labels to product metadata */
export const productMatchesFilter = (product: CatalogProduct, filter: string) => {
  const price = product.salePrice ?? product.price;

  if (["XS", "S", "M", "L", "XL"].includes(filter)) {
    return product.sizes.includes(filter);
  }
  if (["Evening", "Daywear", "Occasion"].includes(filter)) {
    return product.occasions.includes(filter);
  }
  if (["Mini", "Midi", "Maxi"].includes(filter)) {
    return product.length === filter;
  }
  if (filter === "Under BDT 8,000") return price < 8000;
  if (filter === "BDT 8,000–12,000") return price >= 8000 && price <= 12000;
  if (filter === "Over BDT 12,000") return price > 12000;
  if (filter === "In Stock") return product.availability === "In Stock";
  if (filter === "Low Stock") return product.availability === "Low Stock";

  // Colour — match label or product colour name
  const colourAliases: Record<string, string[]> = {
    Black: ["Noir", "Black"],
    Ivory: ["Ivory"],
    Champagne: ["Champagne"],
    Plum: ["Plum", "Burgundy", "Espresso"],
  };
  const aliases = colourAliases[filter];
  if (aliases) return aliases.some((item) => item.toLowerCase() === product.colour.toLowerCase());
  return product.colour.toLowerCase() === filter.toLowerCase();
};

export const filterCatalogProducts = (products: CatalogProduct[], selectedFilters: string[]) => {
  if (!selectedFilters.length) return products;
  return products.filter((product) => selectedFilters.every((filter) => productMatchesFilter(product, filter)));
};

export const sortCatalogProducts = (products: CatalogProduct[], sort: string) => {
  const list = [...products];
  if (sort === "Price: Low to High") {
    return list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
  }
  if (sort === "Price: High to Low") {
    return list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
  }
  return list;
};
