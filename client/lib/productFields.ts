export const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL"] as const;
export const SHOE_SIZES = ["36", "37", "38", "39", "40", "41"] as const;
export const BODY_VOLUMES = ["100ml", "200ml", "300ml"] as const;
export const DRESS_LENGTHS = ["Mini", "Midi", "Maxi"] as const;
export const OCCASIONS = ["Evening", "Daywear", "Occasion"] as const;

const toOptions = (values: readonly string[]) => values.map((value) => ({ value, label: value }));

interface ProductFieldConfig {
  key: string;
  label: string;
  type?: string;
  hint?: string;
  options?: { value: string; label: string }[];
}

const multiselect = (key: string, label: string, values: readonly string[]): ProductFieldConfig => ({
  key,
  label,
  type: "multiselect",
  options: toOptions(values),
});

/** Fields shown after common details — depends on product type. */
export const fieldsForProductCategory = (category: string): ProductFieldConfig[] => {
  switch (category) {
    case "Dresses":
    case "Occasionwear":
      return [
        multiselect("sizes", "Available sizes", CLOTHING_SIZES),
        {
          key: "length",
          label: "Dress length",
          type: "select",
          options: [{ value: "", label: "Select…" }, ...toOptions(DRESS_LENGTHS)],
        },
        multiselect("occasions", "Occasions", OCCASIONS),
      ];
    case "Gym Wear":
      return [multiselect("sizes", "Available sizes", CLOTHING_SIZES)];
    case "Shoes":
      return [multiselect("sizes", "Available sizes (EU)", SHOE_SIZES)];
    case "Body Care":
      return [multiselect("sizes", "Available volumes", BODY_VOLUMES)];
    case "Bags":
      return [
        {
          key: "stylingTips",
          label: "Bag style / details",
          type: "textarea",
          hint: "e.g. Clutch, top handle, crossbody — shown on the product page.",
        },
      ];
    default:
      return [];
  }
};

/** Strip fields that do not apply when switching product type. */
export const sanitizeDraftForCategory = (draft: Record<string, unknown>, category: string) => {
  const next = { ...draft, category };
  const dressLike = category === "Dresses" || category === "Occasionwear";
  if (!dressLike) {
    delete next.length;
    delete next.occasions;
  }
  if (category === "Bags") {
    delete next.sizes;
    delete next.length;
    delete next.occasions;
  }
  if (category === "Body Care") {
    delete next.length;
    delete next.occasions;
  }
  if (category === "Shoes") {
    delete next.length;
    delete next.occasions;
  }
  if (category === "Gym Wear") {
    delete next.length;
    delete next.occasions;
  }
  if (dressLike || category === "Gym Wear" || category === "Shoes" || category === "Body Care") {
    delete next.stylingTips;
  }
  return next;
};

export interface ProductOptionConfig {
  label: string;
  values: string[];
  showSizeGuide: boolean;
}

export const getProductOptions = (category: string, sizes: string[] = []) => {
  if (category === "Body Care") {
    return {
      label: "Volume",
      values: sizes.length ? sizes : [...BODY_VOLUMES],
      showSizeGuide: false,
    } satisfies ProductOptionConfig;
  }
  if (category === "Bags") {
    return {
      label: "Details",
      values: ["One Size"],
      showSizeGuide: false,
    } satisfies ProductOptionConfig;
  }
  if (category === "Shoes") {
    return {
      label: "Size (EU)",
      values: sizes.length ? sizes : [...SHOE_SIZES],
      showSizeGuide: true,
    } satisfies ProductOptionConfig;
  }
  return {
    label: "Size",
    values: sizes.length ? sizes : [...CLOTHING_SIZES],
    showSizeGuide: true,
  } satisfies ProductOptionConfig;
};

export const defaultOptionForCategory = (category: string, sizes: string[] = []) => {
  const config = getProductOptions(category, sizes);
  return config.values[0] ?? "M";
};
