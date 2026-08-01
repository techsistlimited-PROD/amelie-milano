# Amelie Milano — Custom CMS (local setup)

Builder.io is replaced by a **built-in CMS** using your existing **Supabase** database and an admin panel at **`/admin`**.

No git push yet — test everything locally first.

---

## Step 1b — Enable image uploads (one-time)

Run `supabase/migrations/002_cms_storage.sql` in Supabase SQL Editor.
This creates the `cms-media` bucket so admins can upload images from their computer.

---

## Step 1 — Create CMS tables in Supabase

1. Open Supabase → **SQL Editor** → **New query**
2. Paste the full contents of `supabase/migrations/001_cms_schema.sql`
3. Click **Run**

---

## Step 2 — Update local `.env`

Add your admin email (same account you use to sign in on the site):

```env
CMS_ADMIN_EMAILS=techsistlimited@gmail.com

SUPABASE_URL=https://kcaqrqyggshkroghxexc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_SUPABASE_URL=https://kcaqrqyggshkroghxexc.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

You can remove `VITE_PUBLIC_BUILDER_KEY` — Builder is no longer used.

---

## Step 3 — Seed sample content (optional)

```powershell
cd "D:\Amelie Milano with CMS"
node scripts/seed-cms.mjs
```

---

## Step 4 — Run locally

```powershell
pnpm install
pnpm dev
```

- Website: http://localhost:8080
- CMS admin: http://localhost:8080/admin

Sign in with your **admin email** + password (must be in `CMS_ADMIN_EMAILS`).

---

## What you can edit in `/admin`

| Section | Content |
|---------|---------|
| **Products** | Shop items, prices, images |
| **Collections** | Collection pages |
| **Journal** | Editorial articles |
| **Homepage sections** | Hero, categories, featured blocks |
| **Pages** | SEO for static routes |
| **FAQ** | Questions & answers |

Changes appear on the live site after save (no rebuild needed for content).

---

## Architecture

```
Browser → React site → /api/cms/* (public read)
Admin   → /admin     → /api/admin/cms/* (CRUD, admin only)
                        ↓
                   Supabase tables (cms_*)
```

---

## When ready for production

1. Run the same SQL migration on production Supabase (if not already)
2. Add `CMS_ADMIN_EMAILS` to VPS `.env`
3. Rebuild Docker (`pnpm dev uses Vite; production still needs build for client env)
4. Then push to GitHub and deploy

---

## Not in MVP yet (can add next)

- Rich text editor for journal body / policy pages
- Image upload to Supabase Storage (currently paste image URLs)
- FAQ page wired to `cms_faq_items` on frontend
- Category landing pages (Occasionwear, Bags, etc.) reading from CMS

The site **design and routes are unchanged** — only the content source moved from Builder.io to Supabase.
