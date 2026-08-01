-- Amelie Milano CMS tables (run in Supabase SQL Editor)
-- Public reads go through Express API; writes require admin auth.

create extension if not exists "pgcrypto";

-- ── Products ──────────────────────────────────────────────────────────────────
create table if not exists cms_products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  price_bdt numeric not null default 0,
  category text not null default 'Dresses',
  hero_image text,
  colour text,
  material text,
  styling_tips text,
  is_new boolean not null default false,
  is_visible boolean not null default true,
  display_order int not null default 0,
  variants jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Collections ─────────────────────────────────────────────────────────────────
create table if not exists cms_collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  hero_image text,
  editorial_copy text,
  images jsonb not null default '[]'::jsonb,
  product_slugs jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  is_visible boolean not null default true,
  display_order int not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Journal / editorials ──────────────────────────────────────────────────────
create table if not exists cms_editorials (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body jsonb not null default '[]'::jsonb,
  hero_image text,
  category text,
  author text,
  gallery jsonb not null default '[]'::jsonb,
  published_at timestamptz,
  featured boolean not null default false,
  is_visible boolean not null default true,
  display_order int not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Homepage & site sections ──────────────────────────────────────────────────
create table if not exists cms_site_sections (
  id uuid primary key default gen_random_uuid(),
  section_key text unique not null,
  title text,
  subheading text,
  eyebrow text,
  body text,
  hero_image text,
  images jsonb not null default '[]'::jsonb,
  items jsonb not null default '[]'::jsonb,
  buttons jsonb not null default '[]'::jsonb,
  product_slugs jsonb not null default '[]'::jsonb,
  collection_slugs jsonb not null default '[]'::jsonb,
  is_visible boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Static / marketing pages ────────────────────────────────────────────────────
create table if not exists cms_pages (
  id uuid primary key default gen_random_uuid(),
  path text unique not null,
  title text not null,
  content jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  is_visible boolean not null default true,
  updated_at timestamptz not null default now()
);

-- ── FAQ ───────────────────────────────────────────────────────────────────────
create table if not exists cms_faq_items (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'General',
  question text not null,
  answer text not null,
  display_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_cms_products_category on cms_products(category);
create index if not exists idx_cms_products_visible on cms_products(is_visible);
create index if not exists idx_cms_editorials_visible on cms_editorials(is_visible);
