export interface StoreProduct { id: string; name: string; price: number; category: string; colour: string; material: string; image: string; isNew?: boolean; }

const asset = (id: string) => `https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F${id}?format=webp&width=900&height=1200&quality=95`;

export const storeCatalog: StoreProduct[] = [
  { id: "1", name: "Espresso Drape Kaftan Dress", price: 8375, category: "Dresses", colour: "Espresso", material: "Silk-touch satin", image: asset("ca01513621cd4cd19c92e5bb2129ea91"), isNew: true },
  { id: "4", name: "Noir One-Shoulder Cutout Dress", price: 10500, category: "Dresses", colour: "Noir", material: "Stretch jersey", image: asset("ac1870ce26284d1e9c304a0b6fa78fde") },
  { id: "2", name: "Champagne Pleated Corset Dress", price: 11500, category: "Occasionwear", colour: "Champagne", material: "Pleated satin", image: asset("9e4e485b99eb4fd9b45892f8bf08f453"), isNew: true },
  { id: "6", name: "Burgundy Sequin Cape Gown", price: 12500, category: "Occasionwear", colour: "Burgundy", material: "Sequin mesh", image: asset("f2edad5f9989469e9179290f0356a25b") },
  { id: "shoe-1", name: "Minimalist Strappy Slingback", price: 12500, category: "Shoes", colour: "Black", material: "Italian leather", image: asset("2212b0db0546488f91f833bc79c19386") },
  { id: "shoe-2", name: "Golden Luxe Platform Heel", price: 18000, category: "Shoes", colour: "Gold", material: "Metallic leather", image: asset("63618dadc38341448c40401de698c1a3"), isNew: true },
  { id: "gym-set", name: "Crimson Performance Leggings Set", price: 4999, category: "Gym Wear", colour: "Crimson", material: "Technical stretch", image: asset("897f9afa654c44f292a3fed3858eeb93") },
  { id: "motion-bodysuit", name: "Fuchsia Halter Bodysuit", price: 4299, category: "Gym Wear", colour: "Fuchsia", material: "Performance jersey", image: asset("afb1ea344f204331a0bc446e3d8efd35"), isNew: true },
  { id: "body-oil", name: "Nourishing Body Oil", price: 3500, category: "Body Care", colour: "Amber", material: "Botanical body oil", image: asset("0d417769e65540bd9117838b5867ff55") },
  { id: "silk-butter", name: "Silk Touch Body Butter", price: 4200, category: "Body Care", colour: "Ivory", material: "Shea and botanical butter", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&h=1200&fit=crop", isNew: true },
  { id: "bag-1", name: "Cocoa Ruched Suede Clutch", price: 18999, category: "Bags", colour: "Cocoa", material: "Suede finish", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Ff027f54464044c2aa55976ea27dc0ee0?format=webp&width=900&height=1200", isNew: true },
  { id: "bag-2", name: "Noir Floral Sequin Clutch", price: 12900, category: "Bags", colour: "Noir", material: "Embroidered sequin velvet", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F67b0e8db28dc48d48e09be9a4afa2e23?format=webp&width=900&height=1200" },
];

export const shopCategories = ["All", "New In", "Dresses", "Occasionwear", "Gym Wear", "Body Care", "Bags", "Shoes"];
