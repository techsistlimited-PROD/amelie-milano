# Amelie Milano — production image (Express API + React SPA)
# Multi-stage: pnpm build → Node runtime

FROM node:20-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Vite bakes these into the client bundle at build time
ARG VITE_PUBLIC_BUILDER_KEY
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_SUPABASE_PUBLISHABLE_KEY

ENV VITE_PUBLIC_BUILDER_KEY=$VITE_PUBLIC_BUILDER_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY

RUN pnpm run build

# ── Runtime ───────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN apk add --no-cache curl

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate \
  && pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/health || exit 1

CMD ["node", "dist/server/node-build.mjs"]
