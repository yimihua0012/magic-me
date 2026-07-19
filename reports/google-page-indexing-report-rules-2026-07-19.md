# Google Page Indexing Report Rules

Source: https://support.google.com/webmasters/answer/7440203#crawled  
Created: 2026-07-19

## Core Principles

1. The Page indexing report shows URLs Google knows about and whether Google indexed them.
2. A URL being `Not indexed` is not automatically a problem.
3. The goal is not 100% indexing. The goal is to have every important canonical page indexed.
4. Duplicate, alternate, redirected, blocked, removed, or low-value URLs often should not be indexed.
5. Use URL Inspection for a specific page. Use Page indexing report for grouped patterns and issue trends.
6. Search Console report totals do not need to match your own exact URL count.
7. Indexed does not guarantee ranking or visibility for every query.

## What To Check First

### For Small Sites

If the site has fewer than about 500 pages, first check key URLs manually:

```text
site:example.com
site:example.com important topic
site:https://example.com/exact-url
```

Use the Page indexing report only when key pages are missing or when there is a pattern that needs diagnosis.

### For Important Pages

Important pages should be:

- linked from known pages
- present in sitemap when appropriate
- reachable without login
- not blocked by `robots.txt`
- not marked `noindex`
- canonicalized to themselves or to the correct preferred URL
- returning `200 OK`
- content-rich enough to deserve indexing

## Sitemap And Discovery Rules

1. Google needs a way to find a page before it can crawl it.
2. A page can be discovered through internal links, external links, or sitemap.
3. If Google knows far fewer URLs than expected, check whether pages are linked properly and included in sitemap.
4. A sitemap must be publicly accessible, valid, and not blocked by `robots.txt`.
5. Sitemap inclusion does not guarantee indexing.
6. A URL is considered submitted by sitemap even if Google also found it through crawling.
7. For validation work, a sitemap containing only important fixed URLs can make validation faster.

## Status Rules

### Indexed

The page was successfully indexed.

Action:

- No indexing fix needed.
- Ranking, query matching, and personalization are separate issues.

### Not Indexed

The page is not indexed. This can be either expected or problematic.

Action:

- Read the exact reason.
- Fix only issues where the URL should be indexed.
- Prioritize `Source = Website` issues, because those are usually under our control.

## Common Not Indexed Reasons

### Crawled - Currently Not Indexed

Meaning:

- Google crawled the page but chose not to index it yet.
- Google may or may not index it later.
- Resubmitting the URL for crawling is not usually necessary.

Likely causes to review:

- thin or generic content
- duplicate or near-duplicate content
- weak internal links
- weak search intent match
- missing or poor title/description/H1 alignment
- low uniqueness compared with other pages
- page discovered but not considered important enough

Action checklist:

- Improve visible page content, not only metadata.
- Make the title, H1, description, intro, and main sections match one search intent.
- Ensure the first 400 visible characters clearly mention the topic and primary keyword.
- Add useful internal links from related pages.
- Confirm canonical is correct.
- Confirm page returns `200 OK`.
- Avoid immediately resubmitting repeatedly.

### Discovered - Currently Not Indexed

Meaning:

- Google found the URL but has not crawled it yet.
- The last crawl date is empty.
- Google may postpone crawling if it expects crawling to overload the site or if crawl priority is low.

Action checklist:

- Ensure the URL is in sitemap.
- Add internal links from indexed pages.
- Make the page reachable from navigation or category pages.
- Check server performance and response reliability.
- Wait a few days for new pages.
- For urgent important pages, use URL Inspection request indexing.

### Alternate Page With Proper Canonical Tag

Meaning:

- The URL is an alternate version of another canonical page.
- The canonical page is indexed.
- This is usually correct.

Action:

- No fix needed if the canonical target is intentional.
- Check hreflang separately; Search Console does not treat alternate language pages as this issue type.

### Duplicate Without User-Selected Canonical

Meaning:

- Google found this page to be a duplicate.
- The page does not declare a preferred canonical.
- Google selected another canonical URL.

Action checklist:

- Inspect the URL to see Google's selected canonical.
- Add or fix canonical tags if the preferred URL is clear.
- If the page should be indexed separately, make the content substantially different.
- Do not expect duplicate pages to be served in Search.

### Duplicate, Google Chose Different Canonical Than User

Meaning:

- The page declares a canonical, but Google chose another URL.
- Google indexed its selected canonical instead.

Action checklist:

- Compare the current URL, user-declared canonical, and Google-selected canonical.
- Make sure the declared canonical is actually similar and appropriate.
- Strengthen canonical signals: internal links, sitemap URL, redirects, and canonical tag consistency.
- If the page is meant to be unique, improve content differentiation.

### Page With Redirect

Meaning:

- The URL redirects to another URL.
- The redirecting URL is not indexed.
- The target URL may or may not be indexed.

Action checklist:

- Keep redirected URLs out of sitemap.
- Put only final canonical URLs in sitemap.
- Confirm redirect target returns `200 OK`.

### URL Blocked By Robots.txt

Meaning:

- Google cannot crawl the page because of `robots.txt`.
- Blocking crawl does not fully guarantee non-indexing if Google discovers the URL elsewhere.

Action checklist:

- If the page should be indexed, remove the robots block.
- If the page should not be indexed, allow crawl and use `noindex`, or remove the page.

### URL Marked Noindex

Meaning:

- Google saw `noindex` and did not index the page.

Action:

- If intentional, no fix needed.
- If the page should be indexed, remove `noindex`.

### Server Error 5xx

Meaning:

- Server returned a 500-level error to Google.

Action checklist:

- Fix server/runtime errors.
- Check deploy logs.
- Confirm stable `200 OK` for Googlebot-accessible pages.
- Validate after the issue is fixed.

### 401 / 403 / Other 4xx

Meaning:

- Google cannot access the page because of auth, forbidden access, or another client error.

Action checklist:

- Public SEO pages must not require login.
- Do not block Googlebot unless intentional.
- For deleted pages, `404` is acceptable if there is no replacement.
- For moved pages, use `301` to the replacement URL.

## Validation Rules

1. Fix all known instances of an issue before clicking `Validate fix`.
2. Do not click validation repeatedly while one validation cycle is running.
3. Validation can take up to about two weeks or longer.
4. If validation fails, fix the failing URL and restart validation.
5. Google can also detect fixes during normal crawling without manual validation.
6. An issue can remain in the report history for up to 90 days after the last affected URL is fixed.

## Practical Workflow For This Project

### For New Blog Or Category Pages

1. Confirm page returns `200 OK`.
2. Confirm canonical points to the exact public URL.
3. Confirm sitemap includes the URL.
4. Confirm the page is internally linked from:
   - `/blog`
   - relevant blog category page
   - related article blocks where applicable
5. Confirm title, description, keywords, intro, and first section align with one search intent.
6. Confirm visible top content includes the primary topic in the first 400 characters.
7. Avoid publishing thin category pages with no useful intro or no listed posts.

### For `Crawled - Currently Not Indexed`

Priority fixes:

1. Improve content uniqueness.
2. Strengthen internal linking.
3. Make SEO intent tighter:
   - one clear title/H1
   - one primary keyword
   - description matches title and content
   - intro directly answers the search intent
4. Add concrete workflow, examples, comparisons, or FAQ content.
5. Do not rely on sitemap resubmission alone.

### For `Discovered - Currently Not Indexed`

Priority fixes:

1. Add internal links from indexed pages.
2. Ensure sitemap is submitted and accessible.
3. Confirm page is not accidentally blocked.
4. Wait several days for new pages.
5. Use URL Inspection request indexing for important pages.

## Do Not Chase These As Bugs

- duplicate URLs intentionally canonicalized elsewhere
- redirecting URLs
- removed URLs returning 404 with no replacement
- noindex pages that are intentionally private or low-value
- alternate canonical pages where canonical is correct
- every low-value parameter/filter URL being indexed

## SEO Acceptance Checklist

Before requesting indexing or validation for a page, confirm:

- [ ] URL returns `200 OK`
- [ ] URL is public and does not require auth
- [ ] URL is not blocked by `robots.txt`
- [ ] URL does not have `noindex`
- [ ] canonical URL is correct
- [ ] sitemap contains only the canonical URL
- [ ] title/H1 matches description topic
- [ ] keywords match description topic
- [ ] intro and first section support the same search intent
- [ ] first 400 visible characters include the core topic
- [ ] page has meaningful internal links
- [ ] page content is not a near-duplicate of another page
