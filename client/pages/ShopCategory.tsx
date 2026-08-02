import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import NotFound from "./NotFound";
import { fetchBuilderCollection, fetchBuilderProducts, type BuilderCollectionData } from "@/lib/builder";
import { resolveCollectionProducts, sortByDisplayOrder } from "@/lib/cmsCatalog";
import { getCategoryConfig } from "@/lib/categoryConfig";
import type { CmsProduct } from "@/lib/cms";

const ShopCategory = () => {
  const { category: slug = "" } = useParams();
  const config = getCategoryConfig(slug);
  const [cmsCollection, setCmsCollection] = useState<BuilderCollectionData | null>(null);
  const [cmsProducts, setCmsProducts] = useState<CmsProduct[]>([]);

  useEffect(() => {
    if (!config) return;
    setCmsCollection(null);
    setCmsProducts([]);
    void (async () => {
      const [collection, products] = await Promise.all([
        fetchBuilderCollection(config.slug),
        fetchBuilderProducts(),
      ]);
      if (collection) setCmsCollection(collection);
      if (products.length) setCmsProducts(sortByDisplayOrder(products));
    })();
  }, [config?.slug]);

  const products = useMemo(() => {
    if (!config) return [];
    return resolveCollectionProducts(cmsCollection?.products, cmsProducts, config.category);
  }, [cmsCollection, cmsProducts, config]);

  if (!config) return <NotFound />;

  const bannerImage = cmsCollection?.heroImage || config.fallbackImage;
  const title = cmsCollection?.title || config.title;
  const description = cmsCollection?.description || config.description;
  const kicker = cmsCollection?.editorialCopy || config.kicker;

  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      <main>
        <div className="container mx-auto px-4 pt-8">
          <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: title }]} />
        </div>

        <section className="relative min-h-[560px] overflow-hidden bg-stone-900 md:h-[650px]">
          <img src={bannerImage} alt={title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/70 via-stone-950/20 to-transparent" />
          <div className="relative z-10 container mx-auto flex min-h-[560px] items-end px-4 pb-16 text-white md:min-h-[650px] md:pb-20">
            <div className="max-w-2xl">
              <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-white/75">{kicker}</p>
              <h1 className="font-serif text-6xl leading-[0.88] md:text-8xl">{title}</h1>
              <p className="mt-6 max-w-lg text-sm leading-7 text-white/85 md:text-base">{description}</p>
              <a
                href="#shop-category-products"
                className="mt-8 inline-flex border border-white px-6 py-3 text-xs uppercase tracking-[0.16em] hover:bg-white hover:text-stone-900 transition-colors"
              >
                Explore Collection
              </a>
            </div>
          </div>
        </section>

        <section id="shop-category-products" className="bg-ivory py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-teal">The collection</p>
                <h2 className="font-serif text-4xl md:text-5xl text-stone-900">{title}</h2>
              </div>
              <span className="text-sm text-stone-500">
                {products.length} {products.length === 1 ? "piece" : "pieces"}
              </span>
            </div>

            {products.length ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-14">
                {products.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="rounded border border-stone-200 bg-white px-6 py-16 text-center">
                <p className="font-serif text-2xl text-stone-900 mb-3">No products yet</p>
                <p className="text-sm text-stone-600 mb-6">
                  Add products in the CMS with category <strong>{config.category}</strong> — they appear here automatically.
                </p>
                <Link to="/shop" className="btn-outline inline-block">
                  Browse all products
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ShopCategory;
