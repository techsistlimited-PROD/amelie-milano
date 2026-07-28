const routes = [
  "/",
  "/shop",
  "/shop/new",
  "/shop/dresses",
  "/shop/occasionwear",
  "/shop/body-care",
  "/shop/gym-wear",
  "/shop/bags",
  "/shop/shoes",
  "/collection/new",
  "/collection/dresses",
  "/collection/occasionwear",
  "/collection/gym-wear",
  "/collection/bags",
  "/collection/shoes",
  "/collection/body-care",
  "/about",
  "/brand-story",
  "/style-concierge",
  "/journal",
  "/journal/italian-tailoring",
  "/journal/wardrobe-essentials",
  "/journal/softer-pace",
  "/journal/occasion-edit",
  "/journal/modern-femininity",
  "/contact",
  "/faq",
  "/size-guide",
  "/shipping",
  "/returns",
  "/privacy",
  "/terms",
  "/the-amelie-edit",
  "/product/1",
  "/product/2",
  "/product/3",
  "/product/4",
  "/product/5",
  "/product/6",
  "/product/7",
  "/product/8",
  "/product/shoe-1",
  "/product/shoe-2",
  "/product/shoe-3",
  "/product/shoe-4",
  "/product/gym-set",
  "/product/motion-bodysuit",
  "/product/studio-legging",
  "/product/wrap-layer",
  "/product/bag-1",
  "/product/bag-2",
  "/product/bag-3",
  "/product/bag-4",
  "/product/body-oil",
  "/product/silk-butter",
  "/product/amber-wash",
  "/product/signature-mist",
];

const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export const handler = async (event: { headers?: Record<string, string | undefined> }) => {
  const headers = event.headers || {};
  const protocol = headers["x-forwarded-proto"] || "https";
  const host = headers["x-forwarded-host"] || headers.host;
  const configuredOrigin = process.env.PUBLIC_SITE_URL?.replace(/\/$/, "");
  const origin = configuredOrigin || `${protocol}://${host}`;
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((route) => `<url><loc>${escapeXml(`${origin}${route}`)}</loc></url>`).join("")}</urlset>`;
  return { statusCode: 200, headers: { "Content-Type": "application/xml; charset=UTF-8", "Cache-Control": "public, max-age=3600" }, body };
};
