/** Existing website content for CMS seed — same images/URLs as the live site. */

const asset = (id, w = 900, h = 1200) =>
  `https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F${id}?format=webp&width=${w}&height=${h}&quality=95`;

const product = (slug, title, priceBdt, category, heroImage, extra = {}) => ({
  slug,
  title,
  description: extra.description ?? null,
  price_bdt: priceBdt,
  sale_price_bdt: extra.salePrice ?? null,
  category,
  hero_image: heroImage,
  colour: extra.colour ?? "",
  material: extra.material ?? "",
  styling_tips: null,
  is_new: extra.isNew ?? false,
  badge: extra.badge ?? (extra.isNew ? "New" : null),
  sizes: extra.sizes ?? [],
  occasions: extra.occasions ?? [],
  length: extra.length ?? null,
  availability: extra.availability ?? "In Stock",
  is_visible: true,
  display_order: extra.order ?? 0,
});

export const products = [
  product("1", "Espresso Drape Kaftan Dress", 8375, "Dresses", asset("ca01513621cd4cd19c92e5bb2129ea91"), { colour: "Espresso", material: "Silk-touch satin", isNew: true, badge: "New", order: 1, description: "A fluid silhouette with effortless evening movement.", sizes: ["XS", "S", "M", "L", "XL"], occasions: ["Evening", "Daywear"], length: "Maxi", availability: "In Stock" }),
  product("2", "Champagne Pleated Corset Dress", 11500, "Occasionwear", asset("9e4e485b99eb4fd9b45892f8bf08f453"), { colour: "Champagne", material: "Pleated satin", isNew: true, badge: "New", order: 2, description: "Sculpted pleats and a luminous champagne finish.", sizes: ["XS", "S", "M", "L"], occasions: ["Evening", "Occasion"], length: "Midi", availability: "In Stock" }),
  product("3", "Ivory Off-Shoulder Sash Gown", 9200, "Occasionwear", asset("7d742ca7c32545b4bf89e1999827cb6f"), { colour: "Ivory", material: "Soft crepe", isNew: true, badge: "New", order: 3, description: "An elegant drape made for unforgettable entrances.", sizes: ["S", "M", "L", "XL"], occasions: ["Evening", "Occasion"], length: "Maxi", availability: "In Stock" }),
  product("4", "Noir One-Shoulder Cutout Dress", 10500, "Dresses", asset("ac1870ce26284d1e9c304a0b6fa78fde"), { colour: "Noir", material: "Stretch jersey", isNew: true, badge: "Low Stock", order: 4, description: "A confident line with a quietly dramatic finish.", sizes: ["XS", "S", "M", "L"], occasions: ["Evening", "Occasion"], length: "Midi", availability: "Low Stock" }),
  product("5", "Plum One-Shoulder Column Dress", 9800, "Dresses", asset("d82ccb0930fd4d0e8a2edb49f49368e1"), { colour: "Plum", material: "Fluid jersey", order: 5, description: "A sculpted column silhouette in deep plum.", sizes: ["S", "M", "L"], occasions: ["Daywear", "Occasion"], length: "Maxi", availability: "In Stock" }),
  product("6", "Burgundy Sequin Cape Gown", 12500, "Occasionwear", asset("f2edad5f9989469e9179290f0356a25b"), { colour: "Burgundy", material: "Sequin mesh", salePrice: 10625, badge: "Sale", order: 6, description: "A statement cape gown that catches every light.", sizes: ["S", "M", "L"], occasions: ["Evening", "Occasion"], length: "Maxi", availability: "In Stock" }),
  product("7", "Emerald Sculpted Cut-Out Midi", 9800, "Dresses", asset("dcc6f86cb6304c5fb08d26ef7042210a"), { colour: "Emerald", material: "Sculpted stretch", order: 7, description: "Sculptural elegance with a modern emerald finish.", sizes: ["XS", "S", "M", "L"], occasions: ["Daywear", "Evening"], length: "Midi", availability: "In Stock" }),
  product("8", "Cobalt Ruched Draped Mini", 7200, "Dresses", asset("8a0c8e89869744efbbc501318fe5aef5"), { colour: "Cobalt", material: "Stretch satin", order: 8, description: "A playful drape in an unmistakable cobalt blue.", sizes: ["XS", "S", "M"], occasions: ["Daywear"], length: "Mini", availability: "In Stock" }),
  product("shoe-1", "Minimalist Strappy Slingback", 12500, "Shoes", asset("2212b0db0546488f91f833bc79c19386"), { colour: "Black", material: "Italian leather", order: 9, description: "A clean, sculptural line for evenings and beyond." }),
  product("shoe-2", "Golden Luxe Platform Heel", 18000, "Shoes", asset("63618dadc38341448c40401de698c1a3"), { colour: "Gold", material: "Metallic leather", isNew: true, order: 10, description: "A gilded platform with confident height." }),
  product("shoe-3", "Plum Satin Pointed Pump", 15500, "Shoes", asset("d7b4fd59933245aa890cebc73c7fb97a"), { colour: "Plum", material: "Satin", order: 11, description: "A pointed satin finish with evening allure." }),
  product("shoe-4", "Sleek Noir Stiletto", 16000, "Shoes", asset("606f0c5a602940c39450810bc343af4e"), { colour: "Noir", material: "Polished leather", order: 12, description: "The timeless stiletto, refined for the modern wardrobe." }),
  product("gym-set", "Crimson Performance Leggings Set", 4999, "Gym Wear", asset("897f9afa654c44f292a3fed3858eeb93"), { colour: "Crimson", material: "Technical stretch", order: 13, description: "Sculpted performance with a confident colour story." }),
  product("motion-bodysuit", "Fuchsia Halter Bodysuit", 4299, "Gym Wear", asset("afb1ea344f204331a0bc446e3d8efd35"), { colour: "Fuchsia", material: "Performance jersey", isNew: true, order: 14, description: "A supportive second skin for every movement." }),
  product("studio-legging", "Aqua Active Shorts & Crop", 4299, "Gym Wear", asset("2b939239e652498cba1172e841dcc89d"), { colour: "Aqua", material: "Breathable stretch", order: 15, description: "Lightweight movement with a polished finish." }),
  product("wrap-layer", "Midnight Sculpt Zip Set", 5899, "Gym Wear", asset("2034f77daf684b7fb584d6403bd9af9c"), { colour: "Midnight", material: "Technical stretch", order: 16, description: "A sleek layer for studio, street and everywhere between." }),
  product("bag-1", "Cocoa Ruched Suede Clutch", 18999, "Bags", "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Ff027f54464044c2aa55976ea27dc0ee0?format=webp&width=900&height=1200", { colour: "Cocoa", material: "Suede finish", isNew: true, order: 17, description: "A softly gathered clutch with an understated evening presence." }),
  product("bag-2", "Noir Floral Sequin Clutch", 12900, "Bags", "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F67b0e8db28dc48d48e09be9a4afa2e23?format=webp&width=900&height=1200", { colour: "Noir", material: "Embroidered sequin velvet", order: 18, description: "A floral sequin statement for evenings that call for something unforgettable." }),
  product("bag-3", "Sera Evening Clutch", 8900, "Bags", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&h=1200&fit=crop", { colour: "Black", material: "Satin finish", order: 19, description: "A polished finishing touch for after-dark moments." }),
  product("bag-4", "Amelie Mini Top Handle", 11900, "Bags", "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=900&h=1200&fit=crop", { colour: "Camel", material: "Italian leather", order: 20, description: "A petite icon with a considered silhouette." }),
  product("body-oil", "Nourishing Body Oil", 3500, "Body Care", asset("0d417769e65540bd9117838b5867ff55"), { colour: "Amber", material: "Botanical body oil", order: 21, description: "A sensorial oil ritual for luminous, nourished skin." }),
  product("silk-butter", "Silk Touch Body Butter", 4200, "Body Care", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&h=1200&fit=crop", { colour: "Ivory", material: "Shea and botanical butter", isNew: true, order: 22, description: "A rich, velvety ritual inspired by Italian spa care." }),
  product("amber-wash", "Amber Ritual Body Wash", 2800, "Body Care", "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=900&h=1200&fit=crop", { colour: "Amber", material: "Gentle cleansing formula", order: 23, description: "A warm, softly scented cleanse for everyday ritual." }),
  product("signature-mist", "Milano Signature Body Mist", 3900, "Body Care", "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=900&h=1200&fit=crop", { colour: "Clear", material: "Scented body mist", order: 24, description: "A delicate veil of signature fragrance for the skin." }),
];

const section = (sectionKey, data) => ({
  section_key: sectionKey,
  title: data.title ?? null,
  subheading: data.subheading ?? null,
  eyebrow: data.eyebrow ?? null,
  body: data.body ?? null,
  hero_image: data.hero_image ?? null,
  images: data.images ?? [],
  items: data.items ?? [],
  buttons: data.buttons ?? [],
  product_slugs: data.product_slugs ?? [],
  collection_slugs: data.collection_slugs ?? [],
  is_visible: true,
  display_order: data.display_order ?? 0,
});

export const sections = [
  section("homepage-hero", {
    title: "Italian Elegance. Bengali Soul.",
    eyebrow: "Amelie Milano",
    hero_image: asset("41503ed6b6384ec098bdd9f6977128f5", 2000, 1200),
    display_order: 1,
  }),
  section("homepage-categories", {
    title: "Shop by Category",
    body: "Explore our curated collections designed for every occasion and lifestyle",
    items: [
      { name: "Dresses", image: asset("d82ccb0930fd4d0e8a2edb49f49368e1", 800, 1200), href: "/shop/dresses" },
      { name: "Occasionwear", image: asset("f2edad5f9989469e9179290f0356a25b", 800, 1200), href: "/shop/occasionwear" },
      { name: "Bags", image: asset("3988c05f36f646f7a4b4e3d2bb4d5577", 800, 1200), href: "/shop/bags" },
      { name: "Shoes", image: asset("a188b5e269974be1a7c523bdc5828e29", 800, 1200), href: "/shop/shoes" },
      { name: "Body Care", image: asset("b5e5c4bd8fac48ca88b902093690eca1", 800, 1200), href: "/shop/body-care" },
      { name: "Gym Wear", image: asset("61b91b6c3b7641a5a64f36a2e0bd93b6", 800, 1200), href: "/shop/gym-wear" },
    ],
    display_order: 2,
  }),
  section("homepage-new-arrivals", {
    title: "New Arrivals",
    body: "Discover what's trending this season",
    product_slugs: ["1", "2", "3", "4"],
    display_order: 3,
  }),
  section("homepage-brand-promise", {
    title: "The Amelie Promise",
    display_order: 4,
  }),
  section("homepage-occasionwear", {
    title: "Occasion Wear Collection",
    body: "From intimate gatherings to grand celebrations, our Occasionwear collection offers timeless elegance for every special moment.",
    hero_image: asset("a040fefdb8b84ba48c5f3f10f68cf2db", 1600, 1200),
    display_order: 5,
  }),
  section("homepage-best-sellers", {
    title: "Best Sellers",
    body: "Our most loved pieces",
    product_slugs: ["7", "6", "5", "8"],
    display_order: 6,
  }),
];

export const collections = [
  { slug: "new-in", title: "New In", description: "A first look at the newest silhouettes, considered details, and fresh perspectives entering the Amelie wardrobe.", hero_image: asset("9bd2b790b1514a22af7615257f60ceaf", 1800, 1100), editorial_copy: "The latest chapter", featured: true, is_visible: true, display_order: 1, product_slugs: ["1", "2", "3", "4", "6"] },
  { slug: "dresses", title: "The Dress Collection", description: "Fluid drapes, sculpted lines, and quiet drama for every kind of day.", hero_image: asset("1402e9f761a74a90bece95b695aaece8", 1800, 1100), editorial_copy: "Signature silhouettes", is_visible: true, display_order: 2, product_slugs: ["1", "2", "3", "4", "5", "6"] },
  { slug: "occasionwear", title: "Occasionwear", description: "Refined pieces designed for the evenings, celebrations, and entrances you will remember.", hero_image: asset("21ada796a3144e7c95cbfbeb0f436fe6", 1800, 1100), editorial_copy: "Made for the moment", is_visible: true, display_order: 3, product_slugs: ["2", "3", "6"] },
  { slug: "gym-wear", title: "Movement Edit", description: "Performance pieces with a polished point of view, made to move from studio to street.", hero_image: asset("dcf230d68b79461a81796291c421c11e", 1800, 1100), editorial_copy: "A stronger kind of ease", is_visible: true, display_order: 4, product_slugs: ["gym-set", "motion-bodysuit", "studio-legging", "wrap-layer"] },
  { slug: "bags", title: "The Bag Edit", description: "Evening clutches with texture and presence.", hero_image: asset("3988c05f36f646f7a4b4e3d2bb4d5577", 1800, 1100), editorial_copy: "The considered finishing touch", is_visible: true, display_order: 5, product_slugs: ["bag-1", "bag-2", "bag-3", "bag-4"] },
  { slug: "shoes", title: "The Shoe Edit", description: "From minimalist slingbacks to gilded platforms.", hero_image: asset("a188b5e269974be1a7c523bdc5828e29", 1800, 1100), editorial_copy: "Sculptural finishing pieces", is_visible: true, display_order: 6, product_slugs: ["shoe-1", "shoe-2", "shoe-3", "shoe-4"] },
  { slug: "body-care", title: "Body Care Rituals", description: "Indulgent fragrances, textures and botanical care.", hero_image: asset("0d417769e65540bd9117838b5867ff55", 1800, 1100), editorial_copy: "Elevate your self-care", is_visible: true, display_order: 7, product_slugs: ["body-oil", "silk-butter", "amber-wash", "signature-mist"] },
];

export const editorials = [
  { slug: "italian-tailoring", title: "The Art of Italian Tailoring", excerpt: "Explore the quiet craft behind a considered silhouette.", category: "Fashion", author: "Amelie Milano", hero_image: asset("92b67c169b484849bc0557782bc3580b", 1400, 900), featured: true, is_visible: true, display_order: 1, published_at: "2025-01-15T00:00:00Z" },
  { slug: "wardrobe-essentials", title: "Building a Wardrobe With Ease", excerpt: "The pieces, proportions and textures that make dressing feel effortless.", category: "Style Tips", author: "Amelie Milano", hero_image: asset("25041026487d4444b5d4fdcd8344b030", 1200, 1800), is_visible: true, display_order: 2, published_at: "2025-01-22T00:00:00Z" },
  { slug: "softer-pace", title: "A Softer Pace of Living", excerpt: "Finding beauty in the rituals that shape an ordinary day.", category: "Lifestyle", author: "Amelie Milano", hero_image: asset("8643453bf7a947959862f314163ce4f6", 1200, 1800), is_visible: true, display_order: 3, published_at: "2025-02-01T00:00:00Z" },
  { slug: "occasion-edit", title: "The Occasion Edit", excerpt: "Dressing for evenings that deserve to be remembered.", category: "Editorial", author: "Amelie Milano", hero_image: asset("eddf3358484d4793b2020549afc8bf06", 1200, 1800), is_visible: true, display_order: 4, published_at: "2025-02-08T00:00:00Z" },
  { slug: "modern-femininity", title: "Modern Femininity, Reframed", excerpt: "A new perspective on confidence, movement and personal style.", category: "Fashion", author: "Amelie Milano", hero_image: asset("6c87aec0389744e9917cadd6e0d6236d", 1200, 1800), is_visible: true, display_order: 5, published_at: "2025-02-15T00:00:00Z" },
  { slug: "details", title: "Inspiration in the Details", excerpt: "How the smallest choices can become the most distinctive ones.", category: "Lifestyle", author: "Amelie Milano", hero_image: asset("1b6c5c5bfe8a405f929f02fb57a189bb", 1200, 1800), is_visible: true, display_order: 6, published_at: "2025-02-22T00:00:00Z" },
];

export const faqItems = [
  { category: "Orders & Payments", question: "How do I place an order?", answer: "Select your product, choose your size or variant, and click Add to Cart. Proceed to checkout and follow the payment instructions.", display_order: 1, is_visible: true },
  { category: "Orders & Payments", question: "What payment methods are accepted?", answer: "We accept Credit/Debit Cards, Mobile Banking, Net Banking, Pay on Delivery, and QR payments.", display_order: 2, is_visible: true },
  { category: "Orders & Payments", question: "Can I apply a discount code?", answer: "Yes, enter your code at checkout. Discounts will reflect immediately on the cart total.", display_order: 3, is_visible: true },
  { category: "Orders & Payments", question: "Is it safe to store my card details?", answer: "Yes, our payment system is PCI DSS compliant and fully secure.", display_order: 4, is_visible: true },
  { category: "Shipping & Delivery", question: "What are the delivery options?", answer: "Regular Delivery takes 3–5 business days and is free. Express Delivery is same or next day for BDT 200. Collect from Store is free.", display_order: 5, is_visible: true },
  { category: "Shipping & Delivery", question: "Can I track my order?", answer: "Yes, a tracking link will be emailed once your order is dispatched.", display_order: 6, is_visible: true },
  { category: "Shipping & Delivery", question: "Do you deliver internationally?", answer: "Currently, we deliver only within Bangladesh.", display_order: 7, is_visible: true },
  { category: "Returns & Exchanges", question: "What is your return policy?", answer: "Returns are accepted within 7 days of delivery for unused products with tags intact.", display_order: 8, is_visible: true },
  { category: "Returns & Exchanges", question: "Can I exchange a product for a different size or color?", answer: "Yes, exchanges are possible within 7 days. Additional shipping fees may apply.", display_order: 9, is_visible: true },
  { category: "Returns & Exchanges", question: "How do I initiate a return?", answer: "Visit your order page, click Request Return, and follow the instructions.", display_order: 10, is_visible: true },
  { category: "Product Information", question: "How do I know my size?", answer: "Refer to our Size Guide page or the product measurement charts.", display_order: 11, is_visible: true },
  { category: "Product Information", question: "What materials are used in the products?", answer: "We use premium fabrics sourced from Italy and Europe, crafted with high attention to detail.", display_order: 12, is_visible: true },
  { category: "Product Information", question: "Are the colors true to the images?", answer: "We ensure accurate color representation, but screen settings may slightly vary the shades.", display_order: 13, is_visible: true },
  { category: "Account & Login", question: "Do I need an account to order?", answer: "You can checkout as a guest, but creating an account allows faster checkout, order tracking, and wishlists.", display_order: 14, is_visible: true },
  { category: "Account & Login", question: "How do I reset my password?", answer: "Click Forgot Password? on the login page and follow the instructions.", display_order: 15, is_visible: true },
  { category: "Account & Login", question: "Can I link my social accounts?", answer: "Yes, you can sign in with Google or Facebook for convenience.", display_order: 16, is_visible: true },
  { category: "Promotions & Offers", question: "How can I stay updated with promotions?", answer: "Subscribe to our newsletter or follow us on social media for the latest offers.", display_order: 17, is_visible: true },
  { category: "Promotions & Offers", question: "Can I use multiple promo codes?", answer: "Only one promo code can be applied per order.", display_order: 18, is_visible: true },
  { category: "Promotions & Offers", question: "Are discounts valid in-store?", answer: "Some promotions are online-exclusive. Check individual promotion terms.", display_order: 19, is_visible: true },
];
