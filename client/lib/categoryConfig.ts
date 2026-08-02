export interface CategoryConfig {
  slug: string;
  category: string;
  kicker: string;
  title: string;
  description: string;
  fallbackImage: string;
}

export const categoryMap: Record<string, CategoryConfig> = {
  dresses: {
    slug: "dresses",
    category: "Dresses",
    kicker: "Signature silhouettes",
    title: "The Dress Collection",
    description: "Fluid drapes, sculpted lines, and quiet drama for every kind of day.",
    fallbackImage:
      "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F1402e9f761a74a90bece95b695aaece8?format=webp&width=1800&height=1100&quality=95",
  },
  occasionwear: {
    slug: "occasionwear",
    category: "Occasionwear",
    kicker: "Made for the moment",
    title: "Occasionwear",
    description: "Refined pieces designed for the evenings, celebrations, and entrances you will remember.",
    fallbackImage:
      "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F21ada796a3144e7c95cbfbeb0f436fe6?format=webp&width=1800&height=1100&quality=95",
  },
  "gym-wear": {
    slug: "gym-wear",
    category: "Gym Wear",
    kicker: "A stronger kind of ease",
    title: "Movement Edit",
    description: "Performance pieces with a polished point of view, made to move from studio to street.",
    fallbackImage:
      "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fdcf230d68b79461a81796291c421c11e?format=webp&width=1800&height=1100&quality=95",
  },
  bags: {
    slug: "bags",
    category: "Bags",
    kicker: "The considered finishing touch",
    title: "The Bag Edit",
    description: "Evening clutches with texture and presence.",
    fallbackImage:
      "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F3988c05f36f646f7a4b4e3d2bb4d5577?format=webp&width=1800&height=1100&quality=95",
  },
  shoes: {
    slug: "shoes",
    category: "Shoes",
    kicker: "Sculptural finishing pieces",
    title: "The Shoe Edit",
    description: "From minimalist slingbacks to gilded platforms.",
    fallbackImage:
      "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fa188b5e269974be1a7c523bdc5828e29?format=webp&width=1800&height=1100&quality=95",
  },
  "body-care": {
    slug: "body-care",
    category: "Body Care",
    kicker: "Elevate your self-care",
    title: "Body Care Rituals",
    description: "Indulgent fragrances, textures and botanical care.",
    fallbackImage:
      "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F0d417769e65540bd9117838b5867ff55?format=webp&width=1800&height=1100&quality=95",
  },
};

export const getCategoryConfig = (slug: string) => categoryMap[slug];
