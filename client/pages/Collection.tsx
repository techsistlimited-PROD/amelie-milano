import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import { storeCatalog } from "@/lib/storeCatalog";
import { fetchBuilderCollection, fetchBuilderProducts, type BuilderCollectionData } from "@/lib/builder";

const collectionMap = {
  new: { title: "New In", kicker: "The latest chapter", copy: "A first look at the newest silhouettes, considered details, and fresh perspectives entering the Amelie wardrobe.", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F9bd2b790b1514a22af7615257f60ceaf?format=webp&width=1800&height=1100&quality=95", category: "New In", builderSlug: "new-in" },
  dresses: { title: "The Dress Collection", kicker: "Signature silhouettes", copy: "Fluid drapes, sculpted lines, and quiet drama for every kind of day.", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F1402e9f761a74a90bece95b695aaece8?format=webp&width=1800&height=1100&quality=95", category: "Dresses", builderSlug: "dresses" },
  occasionwear: { title: "Occasionwear", kicker: "Made for the moment", copy: "Refined pieces designed for the evenings, celebrations, and entrances you will remember.", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F21ada796a3144e7c95cbfbeb0f436fe6?format=webp&width=1800&height=1100&quality=95", category: "Occasionwear", builderSlug: "occasionwear" },
  "gym-wear": { title: "Movement Edit", kicker: "A stronger kind of ease", copy: "Performance pieces with a polished point of view, made to move from studio to street.", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fdcf230d68b79461a81796291c421c11e?format=webp&width=1800&height=1100&quality=95", category: "Gym Wear", builderSlug: "gym-wear" },
  bags: { title: "The Bag Edit", kicker: "The considered finishing touch", copy: "Evening clutches with texture and presence.", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F3988c05f36f646f7a4b4e3d2bb4d5577?format=webp&width=1800&height=1100&quality=95", category: "Bags", builderSlug: "bags" },
  shoes: { title: "The Shoe Edit", kicker: "Sculptural finishing pieces", copy: "From minimalist slingbacks to gilded platforms.", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2Fa188b5e269974be1a7c523bdc5828e29?format=webp&width=1800&height=1100&quality=95", category: "Shoes", builderSlug: "shoes" },
  "body-care": { title: "Body Care Rituals", kicker: "Elevate your self-care", copy: "Indulgent fragrances, textures and botanical care.", image: "https://cdn.builder.io/api/v1/image/assets%2F661d1ac868bc41caba3d7f46cd61e3ce%2F0d417769e65540bd9117838b5867ff55?format=webp&width=1800&height=1100&quality=95", category: "Body Care", builderSlug: "body-care" },
} as const;

type FallbackCollection = (typeof collectionMap)[keyof typeof collectionMap];

const Collection = () => {
  const { id = "new" } = useParams();
  const fallback = collectionMap[id as keyof typeof collectionMap] ?? collectionMap.new;
  const [cmsCollection, setCmsCollection] = useState<BuilderCollectionData | null>(null);
  const [cmsProducts, setCmsProducts] = useState<Array<{ slug: string; title: string; priceBdt: number; heroImage: string; category: string; isNew?: boolean }>>([]);

  useEffect(() => {
    setCmsCollection(null);
    setCmsProducts([]);
    void (async () => {
      const [collectionData, products] = await Promise.all([
        fetchBuilderCollection(fallback.builderSlug),
        fetchBuilderProducts(),
      ]);
      if (collectionData) setCmsCollection(collectionData);
      if (products.length) setCmsProducts(products);
    })();
  }, [fallback.builderSlug]);

  const collection = {
    ...fallback,
    title: cmsCollection?.title || fallback.title,
    copy: cmsCollection?.description || fallback.copy,
    image: cmsCollection?.heroImage || fallback.image,
  };

  const products = useMemo(() => {
    const references = cmsCollection?.products?.map((product) => typeof product === "string" ? product : product).filter(Boolean);
    if (references?.length && cmsProducts.length) {
      const related = cmsProducts.filter((data) => references.includes(data.slug));
      if (related.length) {
        return related.map((data) => ({
          id: data.slug,
          name: data.title,
          price: data.priceBdt,
          category: data.category,
          material: "Amelie Milano signature finish",
          colour: "Signature",
          image: data.heroImage,
          isNew: data.isNew,
        }));
      }
    }
    return storeCatalog.filter((item) => fallback.category === "New In" ? item.isNew : item.category === fallback.category);
  }, [cmsCollection, cmsProducts, fallback.category]);

  useEffect(() => {
    const title = cmsCollection?.seoTitle || `${collection.title} | Amelie Milano`;
    const description = cmsCollection?.seoDescription || collection.copy;
    const canonicalUrl = `${window.location.origin}/collection/${id}`;
    document.title = title;
    const setMeta = (selector: string, attributes: Record<string, string>) => { let meta = document.head.querySelector<HTMLMetaElement>(selector); if (!meta) { meta = document.createElement("meta"); document.head.appendChild(meta); } Object.entries(attributes).forEach(([key, value]) => meta!.setAttribute(key, value)); };
    setMeta('meta[name="description"]', { name: "description", content: description });
    setMeta('meta[property="og:title"]', { property: "og:title", content: title });
    setMeta('meta[property="og:description"]', { property: "og:description", content: description });
    setMeta('meta[property="og:image"]', { property: "og:image", content: collection.image });
    setMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]'); if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); } canonical.href = canonicalUrl;
    let script = document.head.querySelector<HTMLScriptElement>('script[data-amelie-collection-schema="true"]'); if (!script) { script = document.createElement("script"); script.type = "application/ld+json"; script.dataset.amelieCollectionSchema = "true"; document.head.appendChild(script); }
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "CollectionPage", name: collection.title, description, image: collection.image, url: canonicalUrl });
  }, [cmsCollection?.seoDescription, cmsCollection?.seoTitle, collection.copy, collection.image, collection.title, id]);

  return <div className="min-h-screen bg-[#F8F4EE] text-stone-900"><Header /><main><div className="container mx-auto px-4 pt-8"><Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: collection.title }]} /></div><section className="relative min-h-[560px] overflow-hidden bg-stone-900 md:h-[650px]"><img src={collection.image} alt={collection.title} className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-stone-950/20 to-transparent" /><div className="relative z-10 container mx-auto flex min-h-[560px] items-end px-4 pb-16 text-white md:min-h-[650px] md:pb-20"><div className="max-w-2xl"><p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-white/75">{fallback.kicker}</p><h1 className="font-serif text-6xl leading-[0.88] md:text-8xl">{collection.title}</h1><p className="mt-6 max-w-lg text-sm leading-7 text-white/85 md:text-base">{collection.copy}</p><a href="#collection-products" className="mt-8 inline-flex items-center gap-2 bg-[#C69B6D] px-6 py-3 text-xs uppercase tracking-[0.16em] text-stone-900 hover:bg-white">Shop Collection <ArrowRight size={15} /></a></div></div></section>{(cmsCollection?.editorialCopy || cmsCollection?.images?.length) && <section className="bg-white px-4 py-16 md:py-24"><div className="container mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center"><div><p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-teal">The collection story</p><p className="max-w-xl text-sm leading-7 text-stone-600 md:text-base">{cmsCollection.editorialCopy}</p></div>{cmsCollection.images?.[0] && <img src={cmsCollection.images[0]} alt={`${collection.title} editorial`} className="aspect-[4/3] w-full object-cover" />}</div></section>}<section id="collection-products" className="px-4 py-16 md:py-24"><div className="container mx-auto max-w-7xl"><div className="mb-10 flex items-end justify-between"><div><p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-teal">{collection.kicker}</p><h2 className="font-serif text-4xl md:text-5xl">Shop the collection</h2></div><span className="hidden text-sm text-stone-500 md:block">{products.length} pieces</span></div><div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">{products.map((product) => <ProductCard key={product.id} {...product} />)}</div></div></section></main><Footer /></div>;
};

export default Collection;
