import 'server-only'

import type { BlogCategorySummary, BlogPostWithMeta } from '@/lib/blog-store'

/**
 * Explicit, per-article SEO index policy.
 *
 * Every decision is made by listing the exact slug, not by category rules or
 * slug patterns. Add a slug to `demotedBlogPostSlugs` to keep the article
 * publicly accessible while removing it from the sitemap and adding `noindex`.
 *
 * Hand-written English static posts are always kept indexable.
 */

export const demotedBlogPostSlugs: string[] = [
  // Add English CMS article slugs to demote, for example:
  // 'some-weak-ai-article',
]

export const demotedBlogCategorySlugs: string[] = [
  'seo-blog',
  'urgent-updates',
]

const demotedPostSlugSet = new Set(demotedBlogPostSlugs)
const demotedCategorySlugSet = new Set(demotedBlogCategorySlugs)

export function shouldIndexBlogPost(post: BlogPostWithMeta) {
  if (post.source === 'static') return true
  return !demotedPostSlugSet.has(post.slug)
}

export function shouldIndexCategory(category: BlogCategorySummary) {
  return !demotedCategorySlugSet.has(category.slug)
}