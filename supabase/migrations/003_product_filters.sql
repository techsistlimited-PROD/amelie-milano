-- Product filter fields for category pages (run in Supabase SQL Editor)

alter table cms_products add column if not exists sizes jsonb not null default '[]'::jsonb;
alter table cms_products add column if not exists occasions jsonb not null default '[]'::jsonb;
alter table cms_products add column if not exists length text;
alter table cms_products add column if not exists availability text not null default 'In Stock';
alter table cms_products add column if not exists sale_price_bdt numeric;
alter table cms_products add column if not exists badge text;
