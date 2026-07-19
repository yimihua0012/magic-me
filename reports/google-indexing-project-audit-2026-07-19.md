# Google Indexing Audit For Current Project

Created: 2026-07-19  
Project: Magic-Headshot / ai-avatar  
Reference rules: `reports/google-page-indexing-report-rules-2026-07-19.md`

## Executive Summary

The project has a solid crawl foundation: public sitemap routes exist, robots.txt points to all sitemap files, CMS blog/category pages are included dynamically, canonical/hreflang signals are present, and private app routes are blocked from indexing.

The main current indexing risk is content quality/compliance after changing the meta description rule from `120-160` to `100-140` characters. The SEO checker now reports many descriptions as too long. This can weaken Search Console validation and contribute to `Crawled - currently not indexed` for CMS blog pages.

## Commands Run

```powershell
npx tsc --noEmit
```

Result: passed.

```powershell
C:\Users\Lenovo\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe scripts\check-seo-consistency.mjs
```

Result: failed with SEO issues, mostly meta description length after the new `100-140` rule.

## Sitemap And Robots

### Passed

- XML sitemap routes exist:
  - `/sitemap.xml`
  - `/sitemap-es.xml`
  - `/sitemap-fr.xml`
  - `/sitemap-de.xml`
  - `/sitemap-ja.xml`
- `src/app/robots.ts` lists sitemap index entries through `getSitemapIndexEntries()`.
- `robots.ts` blocks private or low-value app paths:
  - `/dashboard`
  - `/upload`
  - `/generate`
  - `/generations`
  - `/login`
  - localized equivalents
  - `/api`
- `robots.ts` explicitly allows crawler assets:
  - `/api/og`
  - `/api/icon`
- Middleware excludes sitemap XML and static files from locale middleware matching.

### Risk

`public/sitemap-urls.txt` currently has 131 URLs, while recent live XML sitemap totals were higher because dynamic CMS blog URLs are included in rendered sitemap routes.

Risk level: low if `sitemap-urls.txt` is only a helper file.  
Risk level: medium if this file is used for manual submission or external tooling.

Recommended action:

- Keep `public/sitemap-urls.txt` generated from the same source as `src/lib/sitemap.ts`, or stop treating it as authoritative.

## Canonical And Hreflang

### Passed

The following page families include canonical and/or language alternates:

- English blog articles: `src/app/blog/[slug]/page.tsx`
- Localized blog articles: `src/app/[locale]/blog/[slug]/page.tsx`
- English blog categories: `src/app/blog/category/[category]/page.tsx`
- Localized blog categories: `src/app/[locale]/blog/category/[category]/page.tsx`
- localized static pages through shared metadata helpers
- sitemap entries include language alternates through `src/lib/sitemap.ts`

### Watch

Search Console duplicate/canonical issues should be triaged before changing code:

- `Alternate page with proper canonical tag`: usually OK.
- `Duplicate, Google chose different canonical`: inspect canonical consistency.
- redirected URLs should not be in sitemap.

## Blog And Category Page Crawl Quality

### Passed

Blog detail pages output important SEO content near the top:

1. title
2. date
3. description
4. keywords
5. cover image
6. intro
7. sections

Category pages also output top SEO content early:

1. article count
2. H1
3. intro
4. keywords
5. post list
6. FAQ

This is good for the “first visible content supports the query” rule.

### Risk

Localized Japanese labels in `src/app/[locale]/blog/[slug]/page.tsx` appear garbled in source for the `ja` UI labels block. If this is truly persisted as mojibake, it hurts user quality and may weaken Japanese indexing quality signals.

Risk level: high for Japanese blog pages.

Recommended action:

- Reopen and repair the Japanese labels with UTF-8-safe tooling.
- Do not edit multilingual text through a PowerShell path that causes encoding corruption.
- Verify the rendered `/ja/blog/...` page visually and inspect source.

## SEO Consistency Failures

### Static Pages

These static page descriptions now exceed the new `100-140` non-Japanese limit:

- `src/app/blog/page.tsx`: 149
- `src/app/contact/page.tsx`: 151
- `src/app/landing/page.tsx`: 151
- `src/app/privacy/page.tsx`: 147
- `src/app/questions/page.tsx`: 149
- `src/app/refund/page.tsx`: 153
- `src/app/sample/page.tsx`: 160
- `src/app/terms/page.tsx`: 149

Recommended action:

- Shorten each to `100-140` Unicode characters.
- Keep title/H1/description/keywords aligned to one intent.
- Avoid generic boilerplate.

### Photo Tool Pages

These English photo tool descriptions exceed the new rule:

- `/photo-tools/id-photo-crop`: 157
- `/photo-tools/resize-image`: 147
- `/photo-tools/resize-image-to-kb`: 142

Recommended action:

- Shorten English descriptions in `src/lib/photo-tool-page-content.ts`.
- Keep localized Japanese rules unchanged.

### CMS Blog Posts

SEO checker scanned 195 published CMS rows and found many non-Japanese descriptions above 140 characters.

High-volume affected locales:

- `en`: many descriptions between 141 and 180 characters
- `de`: many descriptions between 141 and 180 characters
- `es`: many descriptions between 141 and 177 characters
- `fr`: multiple descriptions between 143 and 171 characters
- `ja`: one row is too short under the Japanese rule:
  - `ja/free-document-photo-maker`: 49 characters, expected 55-90

Recommended action:

1. Batch update non-Japanese CMS descriptions to `100-140`.
2. Keep Japanese rule at `55-90`.
3. For each updated row, preserve keyword/topic alignment.
4. Re-run `scripts/check-seo-consistency.mjs`.

## `Crawled - Currently Not Indexed` Risk Assessment

Most likely risk factors for this project:

1. CMS descriptions out of policy after rule change.
2. Repeated/generic Magic-Headshot boilerplate across blog descriptions.
3. Similar blog articles around closely related phrases:
   - `exam headshot`
   - `resume photo editor`
   - `resize image to kb`
   - `free document photo editor`
4. Some categories may be thin if they contain few posts or similar excerpts.
5. Potential Japanese mojibake on localized blog detail labels.

Lower-risk areas:

- Sitemap discovery.
- Canonical presence.
- Robots blocking of private pages.
- Blog/category internal linking structure.

## Priority Fix Plan

### P0

Fix Japanese mojibake in localized blog detail labels if confirmed in rendered output.

Files:

- `src/app/[locale]/blog/[slug]/page.tsx`

### P1

Bring static and photo tool descriptions into the new `100-140` rule.

Files:

- `src/app/blog/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/landing/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/questions/page.tsx`
- `src/app/refund/page.tsx`
- `src/app/sample/page.tsx`
- `src/app/terms/page.tsx`
- `src/lib/photo-tool-page-content.ts`

### P1

Batch update CMS blog descriptions.

Rules:

- Non-Japanese: 100-140 characters.
- Japanese: 55-90 Japanese characters.
- Description must match title and keyword.
- Description should mention one concrete use case or workflow.

### P2

Review high-overlap blog clusters for uniqueness.

Clusters:

- exam headshot
- resume photo editor
- resize image to KB
- document photo editor
- ID photo print sheet

Checks:

- unique title/H1
- unique meta description
- unique intro
- distinct search intent
- meaningful internal links between related pages

### P2

Regenerate or refresh `public/sitemap-urls.txt` if it is used for external submission.

## Validation Checklist After Fixes

Run:

```powershell
npx tsc --noEmit
```

Run with bundled Node if system `node` is unavailable:

```powershell
C:\Users\Lenovo\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe scripts\check-seo-consistency.mjs
```

Then verify:

- zero static description length failures
- zero CMS description length failures
- no keyword/description mismatch
- sitemap URLs return `200 OK`
- canonical URL equals sitemap URL
- no public SEO pages contain `noindex`

## Search Console Handling

For `Crawled - currently not indexed`:

1. Do not repeatedly resubmit unchanged URLs.
2. Improve content and internal links first.
3. Validate only after representative pages are fixed.
4. Prioritize pages with business value:
   - exam headshot pages
   - resume photo pages
   - free ID photo tool pages
   - photo tools pages
   - localized pages with real search demand

For `Discovered - currently not indexed`:

1. Confirm sitemap inclusion.
2. Add internal links from indexed blog/category/tool pages.
3. Wait several days for new pages.
4. Use URL Inspection request indexing only for important pages.
