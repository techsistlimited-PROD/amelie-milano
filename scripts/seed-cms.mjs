/**
 * Seed Amelie CMS from existing website content (products, images, sections).
 * Usage: node scripts/seed-cms.mjs
 */
import "dotenv/config";
import { products, collections, sections, editorials, faqItems } from "./seed-cms-data.mjs";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
  Prefer: "return=minimal",
};

const upsertOne = async (table, row, conflictColumn) => {
  const response = await fetch(`${url}/rest/v1/${table}?on_conflict=${conflictColumn}`, {
    method: "POST",
    headers: { ...headers, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(row),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${table} (${row[conflictColumn] ?? row.slug ?? row.section_key ?? "?"}): ${response.status} ${text}`);
  }
};

const upsertMany = async (table, rows, conflictColumn) => {
  for (const row of rows) {
    await upsertOne(table, row, conflictColumn);
  }
};

try {
  console.log(`Seeding ${products.length} products…`);
  await upsertMany("cms_products", products, "slug");

  console.log(`Seeding ${sections.length} homepage sections…`);
  await upsertMany("cms_site_sections", sections, "section_key");

  console.log(`Seeding ${collections.length} collections…`);
  await upsertMany("cms_collections", collections, "slug");

  console.log(`Seeding ${editorials.length} journal articles…`);
  await upsertMany("cms_editorials", editorials, "slug");

  console.log(`Seeding ${faqItems.length} FAQ items…`);
  for (const row of faqItems) {
    const response = await fetch(`${url}/rest/v1/cms_faq_items`, {
      method: "POST",
      headers,
      body: JSON.stringify(row),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`cms_faq_items: ${response.status} ${text}`);
    }
  }

  console.log("CMS seed complete — all existing website images and content preserved.");
} catch (error) {
  console.error(error);
  process.exit(1);
}
