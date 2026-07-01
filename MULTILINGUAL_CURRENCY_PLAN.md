# Multilingual SEO and Multi-Currency Plan

## Current Decisions

- English uses root paths. Do not create `/en`.
- Non-English languages use subdirectories: `/es`, `/fr`, `/de`, and `/ja`.
- SEO takes priority: the server renders the matching `<html lang>` for the requested path.
- Localized Blog is intentionally disabled and excluded from localized sitemaps.
- Currency no longer has a front-end switcher. It follows the URL locale:
  - `/` and `/es` use USD
  - `/fr` and `/de` use EUR
  - `/ja` uses JPY
- Prices are fixed configuration values, not exchange-rate conversions.
- PayPal is the only multi-currency payment channel in scope. Stripe and Lemon stay unchanged and currently have no exposed localized payment entry.
- JPY displays as `JPY ￥2,900`, EUR as `€16.60`, and USD as `$19.00`.
- Locale surfaces can be maintained independently, but product facts such as credits, refunds, privacy commitments, and payment behavior must stay consistent.

## Completed Scope

- Localized routes exist for home, pricing, contact, questions, sample, landing, upload, Terms, Privacy, and Refund.
- English keeps the original Navbar/Footer to reduce merge risk.
- Localized pages use `localized-navbar` and `localized-footer`.
- Sitemaps are split by language:
  - `/sitemap.xml`
  - `/sitemap-es.xml`
  - `/sitemap-fr.xml`
  - `/sitemap-de.xml`
  - `/sitemap-ja.xml`
- Robots points to the sitemap set and excludes upload operation pages.
- Unknown localized paths redirect to the matching locale home. Unknown English paths redirect to `/`.
- PayPal supports the fixed `plan + currency` matrix and validates amount/currency during capture.
- PayPal success redirects preserve locale, for example `/ja/upload?payment=success`.
- CTA navigation includes lightweight `source` parameters for attribution. Canonical, sitemap, and hreflang URLs remain clean.
- Pricing JSON-LD emits the locale default currency.
- Root JSON-LD no longer emits one global USD offer.
- Localized public pages now use localized SEO keywords.
- Localized home pages have been expanded closer to the English home page and keep localized CTA source attribution.
- Localized login routes now exist. Non-English auth-required flows redirect to the matching `/login` route with `returnTo`.
- Localized Navbar sign-in routes to the locale login page, and logout returns to the locale home. The original English Navbar/Footer remain unchanged.
- Upload now uses a shared view: localized `/upload` pages use localized navigation, copy, login return, pricing redirects, and PayPal success messaging. English `/upload` keeps the existing Auth modal behavior.
- Home gallery labels, upload aria labels, and payment-success validity display are localized.
- Dashboard now uses a shared view, with `/es|fr|de|ja/dashboard` routes. Localized navigation, login return, upload links, and detail links preserve the locale path.
- Generate / Generations now use shared views, with `/es|fr|de|ja/generate/[id]` and `/es|fr|de|ja/generations/[id]`. Localized upload pages enter the matching localized generate route.
- Robots excludes localized dashboard, generate, generations, and login operation pages.
- Generation `currentStep` is read-only display information and is localized in the front end through a status mapping.
- Style names are content assets and should live in the database. `headshot_styles.localized_names` and `localized_category_labels` are planned as JSONB display fields. `/api/styles?locale=ja` returns localized names when present and falls back to English.
- `013_headshot_style_localized_text.sql` now provides the first localized display-name set for Spanish, French, German, and Japanese. Prompts remain unchanged.

## SEO Keyword Strategy

Keywords live in code content configuration for now, not in the database. This keeps them versioned, reviewable, and easy to roll back with page changes.

Each non-English locale starts with four core candidate keywords and page-specific extensions across home, landing, pricing, contact, questions, sample, and upload.

- Spanish:
  - `generador de headshots IA`
  - `fotos profesionales IA`
  - `foto LinkedIn IA`
  - `foto CV profesional`
- French:
  - `generateur portrait professionnel IA`
  - `photo LinkedIn IA`
  - `photo CV professionnelle`
  - `portrait professionnel LinkedIn`
- German:
  - `KI Headshot Generator`
  - `KI Bewerbungsfoto`
  - `LinkedIn Profilbild KI`
  - `professionelles Profilbild`
- Japanese:
  - `AIヘッドショットジェネレーター`
  - `AI証明写真`
  - `LinkedInプロフィール写真`
  - `プロフィール写真 AI`

Without Google Search Console or Keyword Planner access, these should be treated as search-intent candidates, not confirmed traffic numbers. Iterate after launch using Search Console data.

## Database Decision

No database expansion is required for the current release.

Why:

- Language is determined by URL.
- Currency is determined by the locale mapping.
- PayPal capture already stores `amount_paid` and `currency`.
- Package benefits come from shared server config in `backend/config/plans.ts`.
- SEO title, description, and keywords are better kept in versioned content files for now.

Consider database changes later only if:

- Receipts, email, or support tooling need the purchase-time locale. Add `locale` to `credit_packages`.
- Marketing wants to edit localized SEO/content in an admin UI. Add a `localized_pages` or `seo_pages` table.
- Regions get different credit amounts or package benefits. Add server-side package version or region strategy.
- Localized email receipts need auditability. Store `receipt_language` or `locale`.

## Remaining Major Work

1. Dashboard, Generate, and Generations now preserve locale routing and localize key visible UI plus generation status text.
2. Deep error messages are intentionally left in English for now.
3. Style names require running the database migration and gradually filling localized display values. Missing translations fall back to English.
3. Terms, Privacy, and Refund exist in localized form but need legal/human review.
4. Marketing copy and SEO keywords are configured as candidates. Refine them after launch with Search Console or Keyword Planner data.
5. Existing Generate / Generations pages still have `<img>` lint performance warnings. This does not block the multilingual release, but can be cleaned up later with `next/image`.
6. Final manual QA is still needed for language switching, login return, logout return, PayPal success return, 404, sitemap, and robots.
7. Final release checks:
   - `npm run check:i18n`
   - `npx tsc --noEmit`
   - `npm run build`

## Recommended Next Order

1. Manually test the authenticated `/ja/upload -> /ja/generate/[id] -> /ja/generations/[id] -> /ja/dashboard` flow.
2. Run `012_headshot_styles_localization.sql` and `013_headshot_style_localized_text.sql`, then human-review style display names.
3. Human-review Terms, Privacy, Refund, and marketing copy.
4. Refine localized keywords, titles, and descriptions after Search Console data is available.
5. Reconsider storing purchase-time locale in the database only if receipts, email, or support workflows need it.
6. Run final build and full-path manual QA.

## Current Verification

- `npm run check:i18n` passed.
- `npx tsc --noEmit` passed.
- `npm run build` passed.
- Production preview is running at `http://localhost:3000`.
- Verified `/ja` renders `lang="ja"` and Japanese home gallery text.
- Verified `/de/pricing` renders EUR and `/ja/pricing` renders `JPY ￥`.
- Verified `/ja/login?returnTo=%2Fja%2Fupload` renders Japanese login copy.
- Verified `/ja/dashboard`, `/ja/generate/test-id`, and `/ja/generations/test-id` render `lang="ja"` and Japanese key copy.
- Verified `/sitemap-ja.xml` and `/robots.txt` include the expected sitemap references.
- Verified robots excludes `/ja/dashboard` and `/ja/generate`.
- Verified unknown path redirects: `/ja/unknown-page -> /ja`, `/de/blog/foo -> /de`, `/ja/dashboard/extra -> /ja`, and `/missing-page -> /`.
