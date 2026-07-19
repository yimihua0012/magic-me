# Crawled - currently not indexed URL audit

Date: 2026-07-19

Scope: 120 unique URLs reported from Google Search Console as `Crawled - currently not indexed`.

## Executive summary

The checked URLs are technically reachable and discoverable:

- Total checked: 120
- HTTP 200: 120
- In sitemap: 120
- Self canonical: 120
- `noindex`: 0
- Missing title / description / H1: 0

The current visible issues are quality and snippet-rule issues rather than crawl-access issues:

- URLs with issues before fixes: 79
- Description length outside project rule before fixes: 66
- Category pages with thin body text before fixes: 39

This matches a common `Crawled - currently not indexed` pattern: Google can crawl the URLs, but may choose not to index when pages look too template-like, too thin, or too close to other indexed pages.

## URL type breakdown

- Blog posts: 30
- Blog category pages: 60
- Photo tool pages: 29
- Other pages: 1

## Fixes applied

### Code-level fixes

- Tightened blog category meta description generation to the project rule.
- Removed the duplicated English `Blog Guides` category H1 pattern.
- Added a source-order category overview block so category pages expose title, description, keywords, intro, and topic context before the post grid.
- Added runtime description bounding for photo tool detail pages.
- Updated localized `/photo-tools` index descriptions for FR, DE, and JA.
- Shortened English static page descriptions for blog, landing, privacy, questions, refund, sample, terms, and contact.
- Split `/contact` into a server metadata page plus a client form component, so the page has real metadata while keeping the existing client interaction.
- Updated `scripts/check-seo-consistency.mjs` to recognize the new `ContactPageClient` structure.

### CMS data fixes

- Updated 105 published CMS blog descriptions that were outside the new length rule.
- Then explicitly fixed 19 CMS blog rows where title, description, and keywords did not match tightly enough after length cleanup.
- Keywords were reduced to 1-2 directly relevant terms for those 19 rows.

### Verification

```bash
npx tsc --noEmit
node scripts/check-seo-consistency.mjs
```

Result:

- TypeScript: passed
- SEO consistency: passed
- Public pages checked: 33
- Private/admin pages skipped: 41
- Published CMS blog rows checked: 195
- Warnings: 0

## Main findings

### 1. Technical indexing signals are clean

All 59 pages returned `200`, are present in the sitemap, use self-referencing canonical URLs, and do not contain `noindex`.

This means the first priority is not robots, canonical, sitemap, or server errors.

### 2. Many descriptions exceed the new project rule

The project rule is now:

- Default languages: 100-140 Unicode characters
- Japanese: 55-90 Japanese characters

31 URLs exceed or miss this range. The most affected groups are:

- English blog category pages
- DE/FR/ES photo tool pages
- Some English blog posts
- 1 Japanese photo tool page is short by 1 character

Examples:

- `/fr/photo-tools/remove-background`: 185
- `/es/photo-tools/remove-background`: 186
- `/de/photo-tools/id-photo-crop`: 174
- `/blog/category/platform-comparison`: 157
- `/blog/compress-photo-to-kb-for-exam-application`: 151
- `/ja/photo-tools/print-layout-builder`: 54

### 3. Blog category pages are the biggest risk

30 checked URLs are category pages. 23 category pages are likely thin based on visible body text length.

High-risk examples:

- `/ja/blog/category/ai-3snjij`: 1183 chars
- `/ja/blog/category/category-1jsojar`: 1186 chars
- `/ja/blog/category/ai-headshot-generator`: 1287 chars
- `/ja/blog/category/blog`: 1317 chars
- `/blog/category/urgent-updates`: 2270 chars
- `/blog/category/likeness`: 2223 chars
- `/blog/category/wardrobe`: 2231 chars

Some category slugs and H1s look low-quality or auto-generated:

- `/ja/blog/category/ai-3snjij`
- `/ja/blog/category/ai-18ez9n`
- `/ja/blog/category/category-1jsojar`
- `/ja/blog/category/blog`
- `/blog/category/seo-blog`
- `/blog/category/urgent-updates`

These are likely weaker indexing candidates unless they are converted into useful hub pages with clear topical value.

### 4. Several English category H1s are still templated

Examples:

- `Likeness Blog Guides`
- `Wardrobe Blog Guides`
- `SEO Blog Blog Guides`
- `Remote teams Blog Guides`
- `document photos Blog Guides`
- `resume tips Blog Guides`

These H1s are understandable, but they read as generated category labels rather than user-facing search pages. They should be rewritten as useful topic hub titles.

## Recommended priority

1. Fix category quality first.
   - Rename weak category names/slugs where possible.
   - Merge low-value or near-duplicate categories.
   - Add unique intro, H2 sections, and internal links to related tools/posts.
   - Avoid indexing categories that cannot become useful hub pages.

2. Fix meta descriptions against the new rule.
   - Default: 100-140 characters.
   - Japanese: 55-90 characters.
   - Descriptions should directly match title, H1, and primary keywords.

3. Strengthen photo tool localized pages.
   - DE/FR/ES remove-background and crop pages are technically fine but have long descriptions.
   - Add/verify visible above-the-fold text that includes the tool purpose, target user, and supported outputs.

4. Review closely overlapping blog posts.
   - Multiple English posts target similar compression/document-photo/A4-print concepts.
   - If content overlaps, add stronger differentiation or consolidate internal links.

## Checked with

Script:

```bash
node scripts/audit-indexing-urls.mjs --summary
```

Live sources fetched:

- `https://magic-headshot.com/sitemap.xml`
- `https://magic-headshot.com/sitemap-es.xml`
- `https://magic-headshot.com/sitemap-fr.xml`
- `https://magic-headshot.com/sitemap-de.xml`
- `https://magic-headshot.com/sitemap-ja.xml`
- The 59 supplied page URLs
