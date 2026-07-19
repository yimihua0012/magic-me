# Discovered - currently not indexed URL audit

Date: 2026-07-19

Scope: 54 URLs reported from Google Search Console as `Discovered - currently not indexed`.

## Executive summary

The checked URLs are technically reachable and discoverable:

- Total checked: 54
- HTTP 200: 54
- In sitemap: 54
- Self canonical: 54
- `noindex`: 0
- Missing title / description / H1: 0

The visible issues are not crawl-blocking. They are mostly:

- description length outside the current project rule
- some use-case pages with thin body content

## URL type breakdown

- Blog posts: 24
- Use-case pages: 14
- Static pages: 15
- Photo tool pages: 1

## Main findings

### 1. Technical signals are clean

All checked URLs return `200`, are in the sitemap, and self-canonicalize correctly.

### 2. Remaining visible issues are mostly localized static pages

The URLs still showing description length issues are mostly:

- localized contact pages
- localized sample pages
- localized landing pages
- localized questions pages
- 2 localized use-case pages
- 1 localized blog page
- 1 localized refund page

These are fixed in source now, but the live site needs redeployment before Google sees the updated metadata.

### 3. Use-case pages are not blocked, but several look thin

The use-case pages returned clean crawl signals, but some still show smaller body text totals on the live site. That points to template thickness rather than indexing blockage.

## Fixes applied

### Code-level fixes

- Added a thicker visible content block to use-case pages before the details sections.
- Updated the SEO guard to recognize the contact page client split.
- Cleaned up localized marketing descriptions for contact, sample, questions, landing, and refund pages.
- Tightened localized use-case descriptions for resume and studio-style pages.
- Updated the Japanese refund description to fit the Japanese length rule.

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

## Notes

The live audit output was taken before redeployment, so some URLs still show old metadata on the public site. The source is now aligned; the next deployment should update the live pages.
