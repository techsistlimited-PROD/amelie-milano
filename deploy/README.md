# Amelie Milano — ameliemilano.com @ Hostinger VPS

Express + React SPA with Builder.io CMS and Supabase.  
Caddy terminates TLS on the host; Docker serves the app on `127.0.0.1:3010`.

```
Internet → Caddy (:443) → 127.0.0.1:3010 → Docker (Express + SPA)
                              ↑
                    Builder.io CDN + Supabase Cloud (browser)
```

## Server layout

| Item | Value |
|------|-------|
| VPS | `srv852479.hstgr.cloud` (`82.25.110.116`) |
| App path | `/opt/amelie-milano` |
| Docker port | `127.0.0.1:3010` → container `:3000` |
| Domain | `ameliemilano.com`, `www.ameliemilano.com` |

## One-time VPS setup

```bash
sudo mkdir -p /opt/amelie-milano
sudo chown $USER:$USER /opt/amelie-milano
cd /opt/amelie-milano

# After GitHub repo exists:
git clone https://github.com/techsistlimited-PROD/amelie-milano.git .
cp .env.example .env
# Edit .env — see "Create .env without nano" below
```

**Create `.env` without nano** (paste your real keys, then press Enter, then `Ctrl+D`):

```bash
cat > .env << 'EOF'
VITE_PUBLIC_BUILDER_KEY=paste_your_builder_key_here
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=paste_your_anon_key_here
PORT=3000
PUBLIC_SITE_URL=https://ameliemilano.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=paste_your_service_role_key_here
SSLCOMMERZ_STORE_ID=
SSLCOMMERZ_STORE_PASSWORD=
SSLCOMMERZ_IS_LIVE=false
HOST_PORT=3010
EOF
```

Or copy `.env` from your Windows PC (if you already have one locally):

```powershell
# Run on Windows PowerShell (not on the VPS)
scp "D:\Amelie Milano with CMS\.env" root@82.25.110.116:/opt/amelie-milano/.env
```

### Caddy

Add the block from `deploy/caddy/Caddyfile` to the server’s `/etc/caddy/Caddyfile` (same file as NUB ERP), then:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

### DNS (Hostinger hPanel)

**Domains → ameliemilano.com → DNS**

| Type | Name | Points to |
|------|------|-----------|
| A | @ | 82.25.110.116 |
| A | www | 82.25.110.116 |

Remove conflicting Netlify A/CNAME records when cutting over.

## Deploy (manual)

```bash
cd /opt/amelie-milano
git pull origin main
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
docker image prune -f
curl -fsS http://127.0.0.1:3010/health
```

## Environment checklist

### Build-time (`VITE_*` — in `.env`, used by `docker compose build`)

- `VITE_PUBLIC_BUILDER_KEY` — Builder.io public API key
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (or `VITE_SUPABASE_PUBLISHABLE_KEY`)

### Runtime (server `.env`)

- `PUBLIC_SITE_URL=https://ameliemilano.com` — sitemap + SSLCommerz callbacks
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `SSLCOMMERZ_STORE_ID`, `SSLCOMMERZ_STORE_PASSWORD`, `SSLCOMMERZ_IS_LIVE`

### External services (after go-live)

**Supabase → Authentication → URL configuration**

- Site URL: `https://ameliemilano.com`
- Redirect URLs: `https://ameliemilano.com/auth/callback`, `https://www.ameliemilano.com/auth/callback`

**Builder.io → Project settings**

- Production URL / preview: `https://ameliemilano.com`
- Public API key → set as `VITE_PUBLIC_BUILDER_KEY` in VPS `.env` before Docker build

**SSLCommerz merchant panel**

- Success / fail / cancel / IPN URLs must use `https://ameliemilano.com/api/payments/sslcommerz/...`

## GitHub Actions secrets (CI/CD — same pattern as NUB ERP)

Repo: **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
|--------|-------|
| `SERVER_HOST` | `82.25.110.116` |
| `SERVER_USER` | `root` |
| `SSH_PRIVATE_KEY` | Full VPS private key (PEM contents) |
| `GIT_DEPLOY_TOKEN` | GitHub PAT with **repo read** access (for `git pull` on private repo) |

After secrets are set, every push to `main` runs tests then deploys automatically.

Manual deploy on VPS:

```bash
bash deploy/scripts/deploy.sh
```

## Builder.io CMS (must configure for production)

The CMS loads content at **runtime** from Builder CDN in the browser. No rebuild is needed when you publish in Builder — but the **API key must be baked into the Docker image** at build time.

### 1. `.env` on VPS (before `docker compose build`)

```bash
VITE_PUBLIC_BUILDER_KEY=your_real_builder_public_key   # NOT __BUILDER_PUBLIC_KEY__
```

Get the key: Builder.io → your space → **Account / Space settings → Public API Key**.

### 2. Builder.io project settings

In Builder.io for this project:

| Setting | Value |
|---------|-------|
| Site URL / Production URL | `https://ameliemilano.com` |
| Preview URL | `https://ameliemilano.com` |

Models used by the app: `page`, `amelie-product`, `amelie-collection`, `amelie-editorial`, `amelie-site-section`.

### 3. Verify CMS after deploy

```bash
# Builder key must NOT be placeholder in the built JS
curl -s http://127.0.0.1:3010/ | grep -o 'builder' | head -1

# Site should load; open homepage and a /product/* page in browser
curl -I https://ameliemilano.com
```

If CMS content is missing, rebuild after fixing `.env`:

```bash
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

## Health checks

```bash
curl -fsS http://127.0.0.1:3010/health
curl -fsS http://127.0.0.1:3010/api/ping
curl -fsS http://127.0.0.1:3010/sitemap.xml | head
curl -I https://ameliemilano.com
```

## Rollback

```bash
cd /opt/amelie-milano
git checkout <previous-commit>
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d
```

## Local development

No Docker required:

```bash
pnpm install
cp .env.example .env
pnpm dev
```

App runs at `http://localhost:8080` (Vite dev server + Express middleware).
