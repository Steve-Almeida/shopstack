# ShopStack — Next.js 16 full-stack marketplace

One project that covers all 10 lab experiments.
**Catalog → MongoDB (Mongoose)** · **Users / orders → Postgres (Prisma)** · **Auth → Better Auth** · **Access control → `proxy.ts`**

## Run it

```bash
npm install                 # postinstall runs `prisma generate`
cp .env.example .env        # fill in the values
npm run db:push             # create Postgres tables (user, session, order, ...)
npm run seed                # seed 8 products into MongoDB
npm run dev                 # http://localhost:3000
```

Quick DBs: Postgres → a free Supabase project (use the connection string); MongoDB → free Atlas cluster, or local `mongod`.

OAuth callback URLs (set in Google / GitHub consoles):
- `http://localhost:3000/api/auth/callback/google`
- `http://localhost:3000/api/auth/callback/github`

Set `ADMIN_EMAIL` in `.env`, then sign up with that email → you become **ADMIN**.

## Experiment → where it lives

| # | Experiment | Files |
|---|-----------|-------|
| 1 | App Router, nested dirs, `[id]`, multi-layout | `app/(shop)/products/[id]`, `app/(auth)`, `app/(dashboard)`, `template.tsx` |
| 2 | Tailwind + CSS Modules, responsive UI | everywhere (Tailwind), `components/ProductCard.module.css` |
| 3 | Root + sub layouts keeping state | `app/layout.tsx` (CartProvider survives navigation), `app/(shop)/layout.tsx`, `app/(dashboard)/layout.tsx` |
| 4 | Route Handlers + Server Actions | `app/api/products/**`, `app/api/admin/products/**` (GET/POST/PUT/DELETE), `actions/products.ts`, `actions/orders.ts` |
| 5 | Prisma + Postgres, relations, transactions | `prisma/schema.prisma`, `lib/prisma.ts`, `checkout()` in `actions/orders.ts` (`$transaction`) |
| 6 | Mongoose + MongoDB catalog | `models/Product.ts`, `lib/mongo.ts`, `scripts/seed.ts` |
| 7 | Better Auth, Google + GitHub + email | `lib/auth.ts`, `lib/auth-client.ts`, `app/api/auth/[...all]/route.ts`, `components/AuthForm.tsx` |
| 8 | Admin / User / Guest via `proxy.ts` | `proxy.ts`, `lib/session.ts` (`requireUser`, `requireAdmin`) |
| 9 | Metadata API + `next/image` | `app/layout.tsx` (metadata template), `generateMetadata` in `products/[id]`, `sitemap.ts`, `robots.ts`, `ProductCard.tsx` |
| 10 | Deploy (Vercel + Supabase + Atlas) | see below |

Syllabus extras: RSC vs Client Components, `loading.tsx`, `<Suspense>` streaming, `"use cache"` + `cacheTag` + `revalidateTag` (`lib/products.ts`), native `fetch` with `next.tags` (`app/(shop)/products/page.tsx`).

## Roles

| Role | Can |
|------|-----|
| Guest | browse, cart, view API reads |
| User | + checkout, `/dashboard` (own orders only) |
| Admin | + `/admin/*`, `/api/admin/*` (manage products, see all orders) |

## Deploy (Exp 10)

1. Push to GitHub, import into Vercel.
2. Supabase → Project Settings → Database → copy connection string → `DATABASE_URL`. Run `npx prisma db push` once from your machine against it.
3. MongoDB Atlas → connection string → `MONGODB_URI` (allow `0.0.0.0/0` for Vercel). Run `npm run seed` once locally with the Atlas URI.
4. In Vercel → Environment Variables: add everything from `.env.example`. Set `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` to your Vercel URL.
5. Add the production callback URLs (`https://<app>.vercel.app/api/auth/callback/google|github`) in the OAuth consoles.
