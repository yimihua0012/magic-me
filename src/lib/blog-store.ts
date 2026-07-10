import 'server-only'

import { supabaseAdmin } from '@backend/config/supabase'
import { blogPosts as staticBlogPosts, type BlogPost } from '@/lib/seo-content'
import { blogEnhancements, type BlogEnhancement } from '@/lib/blog-enhancements'
import { DEFAULT_LOCALE, LOCALES, ROUTED_LOCALES, localePath, type Locale } from '@/lib/i18n'

export type BlogPostSource = 'static' | 'cms'

export type BlogPostWithMeta = BlogPost & {
  id?: string
  locale: Locale
  translationGroupId?: string
  sourcePostId?: string | null
  status: 'draft' | 'published' | 'archived'
  category?: string
  coverImage?: {
    url: string
    alt: string
  }
  enhancement?: BlogEnhancement
  publishedAt?: string
  updatedAt?: string
  localizedSlugs?: Partial<Record<Locale, string>>
  submittedToBing?: boolean
  source: BlogPostSource
}

type BlogPostRow = {
  id: string
  locale: Locale
  translation_group_id: string
  source_post_id: string | null
  slug: string
  status: 'draft' | 'published' | 'archived'
  title: string
  description: string
  keywords: string[] | null
  category: string | null
  cover_image_url: string | null
  cover_image_alt: string | null
  intro: string
  content: BlogContentJson | null
  seo_enhancement: Partial<BlogEnhancement> | null
  published_at: string | null
  updated_at: string | null
  localized_slugs: Partial<Record<Locale, string>> | null
  submitted_to_bing: boolean | null
}

type BlogContentJson = {
  sections?: { heading: string; body: string }[]
}

const publishedColumns = [
  'id',
  'locale',
  'translation_group_id',
  'source_post_id',
  'slug',
  'status',
  'title',
  'description',
  'keywords',
  'category',
  'cover_image_url',
  'cover_image_alt',
  'intro',
  'content',
  'seo_enhancement',
  'published_at',
  'updated_at',
  'localized_slugs',
  'submitted_to_bing',
].join(',')

function staticPostToMeta(post: BlogPost): BlogPostWithMeta {
  return {
    ...post,
    locale: 'en',
    localizedSlugs: { en: post.slug },
    status: 'published',
    enhancement: blogEnhancements[post.slug],
    source: 'static',
  }
}

function rowToPost(row: BlogPostRow): BlogPostWithMeta {
  const fallbackEnhancement = blogEnhancements[row.slug]
  const mergedEnhancement = normalizeEnhancement(fallbackEnhancement, row.seo_enhancement)
  const content = row.content || {}

  return {
    id: row.id,
    locale: row.locale,
    translationGroupId: row.translation_group_id,
    sourcePostId: row.source_post_id,
    slug: row.slug,
    status: row.status,
    title: row.title,
    description: row.description,
    keywords: row.keywords || [],
    category: row.category || mergedEnhancement?.category,
    coverImage: row.cover_image_url
      ? {
          url: row.cover_image_url,
          alt: row.cover_image_alt || row.title,
        }
      : undefined,
    intro: row.intro,
    sections: Array.isArray(content.sections) ? content.sections : [],
    enhancement: mergedEnhancement,
    publishedAt: row.published_at || undefined,
    updatedAt: row.updated_at || undefined,
    localizedSlugs: row.localized_slugs || { [row.locale]: row.slug },
    submittedToBing: Boolean(row.submitted_to_bing),
    source: 'cms',
  }
}

function normalizeEnhancement(
  fallback: BlogEnhancement | undefined,
  input: Partial<BlogEnhancement> | null | undefined,
) {
  const merged = {
    ...(fallback || {}),
    ...(input || {}),
  } as Partial<BlogEnhancement>

  if (Array.isArray(merged.internalLinks)) {
    merged.internalLinks = merged.internalLinks.filter(isPublicInternalLink)
  }

  if (isCompleteEnhancement(merged)) {
    return merged
  }

  return fallback
}

function isCompleteEnhancement(value: Partial<BlogEnhancement> | undefined): value is BlogEnhancement {
  return Boolean(
    value &&
    typeof value.category === 'string' &&
    typeof value.audience === 'string' &&
    typeof value.searchIntent === 'string' &&
    typeof value.uniqueAngle === 'string' &&
    Array.isArray(value.actionSteps) &&
    Array.isArray(value.qualityChecks) &&
    Array.isArray(value.avoid) &&
    Array.isArray(value.internalLinks) &&
    value.internalLinks.every(isPublicInternalLink) &&
    Array.isArray(value.relatedSlugs)
  )
}

function isPublicInternalLink(value: unknown): value is BlogEnhancement['internalLinks'][number] {
  if (!value || typeof value !== 'object') return false

  const link = value as Partial<BlogEnhancement['internalLinks'][number]>
  return Boolean(
    typeof link.href === 'string' &&
    /^\/(?!api(?:\/|$)|dashboard(?:\/|$)|upload(?:\/|$)|generate(?:\/|$)|generations(?:\/|$)|login(?:\/|$)|auth(?:\/|$))/.test(link.href) &&
    typeof link.label === 'string' &&
    typeof link.reason === 'string'
  )
}

function mergeWithStaticFallback(cmsPosts: BlogPostWithMeta[], locale: Locale) {
  if (locale !== 'en') {
    return cmsPosts
  }

  const cmsSlugs = new Set(cmsPosts.map((post) => post.slug))
  const fallbackPosts = staticBlogPosts
    .filter((post) => !cmsSlugs.has(post.slug))
    .map(staticPostToMeta)

  return [...cmsPosts, ...fallbackPosts]
}

export async function getPublishedBlogPosts(locale: Locale = 'en') {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select(publishedColumns)
      .eq('status', 'published')
      .eq('locale', locale)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('updated_at', { ascending: false })

    if (error) {
      console.warn('[Blog Store] Falling back to static blog posts:', error.message)
      return mergeWithStaticFallback([], locale)
    }

    return mergeWithStaticFallback(((data || []) as unknown as BlogPostRow[]).map(rowToPost), locale)
  } catch (error) {
    console.warn('[Blog Store] Could not read blog_posts table. Falling back to static blog posts.', error)
    return mergeWithStaticFallback([], locale)
  }
}

export async function getCmsPublishedBlogPosts(locale: Locale) {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select(publishedColumns)
      .eq('status', 'published')
      .eq('locale', locale)
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('updated_at', { ascending: false })

    if (error) {
      console.warn('[Blog Store] Could not read CMS blog posts:', error.message)
      return [] as BlogPostWithMeta[]
    }

    return ((data || []) as unknown as BlogPostRow[]).map(rowToPost)
  } catch (error) {
    console.warn('[Blog Store] Could not read CMS blog posts.', error)
    return [] as BlogPostWithMeta[]
  }
}

export async function getPublishedBlogPost(slug: string, locale: Locale = 'en') {
  const posts = await getPublishedBlogPosts(locale)
  return posts.find((post) => post.slug === slug)
}

export async function getAdminBlogPostById(id: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select(publishedColumns)
      .eq('id', id)
      .single()

    if (error) {
      console.warn('[Blog Store] Could not read admin blog post:', error.message)
      return null
    }

    return rowToPost(data as unknown as BlogPostRow)
  } catch (error) {
    console.warn('[Blog Store] Could not read admin blog post.', error)
    return null
  }
}

export async function getPublishedBlogSlugs(locale: Locale = 'en') {
  const posts = await getPublishedBlogPosts(locale)
  return posts.map((post) => post.slug)
}

export function blogPath(locale: Locale, slug?: string) {
  const path = slug ? `/blog/${slug}` : '/blog'
  return localePath(locale, path)
}

export async function getBlogLanguageAlternates(post: BlogPostWithMeta) {
  const alternates: Partial<Record<Locale | 'x-default', string>> = {}

  if (!post.translationGroupId || post.source === 'static') {
    alternates[post.locale] = blogPath(post.locale, post.slug)
    if (post.locale === DEFAULT_LOCALE) {
      alternates['x-default'] = blogPath(DEFAULT_LOCALE, post.slug)
    }
    return alternates
  }

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('locale,slug')
    .eq('translation_group_id', post.translationGroupId)
    .eq('status', 'published')

  if (error) {
    alternates[post.locale] = blogPath(post.locale, post.slug)
    return alternates
  }

  for (const item of (data || []) as { locale: Locale; slug: string }[]) {
    alternates[item.locale] = blogPath(item.locale, item.slug)
  }

  if (alternates.en) {
    alternates['x-default'] = alternates.en
  } else {
    alternates['x-default'] = blogPath(post.locale, post.slug)
  }

  return alternates
}

export async function getBlogIndexLanguageAlternates() {
  const alternates: Partial<Record<Locale | 'x-default', string>> = {
    en: blogPath(DEFAULT_LOCALE),
    'x-default': blogPath(DEFAULT_LOCALE),
  }

  await Promise.all(ROUTED_LOCALES.map(async (locale) => {
    if (await localeHasPublishedCmsBlogPosts(locale)) {
      alternates[locale] = blogPath(locale)
    }
  }))

  return alternates
}

export async function localeHasPublishedCmsBlogPosts(locale: Locale) {
  if (locale === DEFAULT_LOCALE) return true
  const posts = await getCmsPublishedBlogPosts(locale)
  return posts.length > 0
}

export type BlogPostInput = {
  id?: string
  locale: Locale
  translationGroupId?: string
  sourcePostId?: string | null
  slug: string
  status: 'draft' | 'published' | 'archived'
  title: string
  description: string
  keywords: string[]
  category?: string
  coverImageUrl?: string
  coverImageAlt?: string
  intro: string
  sections: { heading: string; body: string }[]
  enhancement?: Partial<BlogEnhancement>
  localizedSlugs?: Partial<Record<Locale, string>>
  submittedToBing?: boolean
}

const seoStopWords = new Set([
  'about',
  'after',
  'again',
  'also',
  'and',
  'article',
  'avec',
  'bei',
  'best',
  'but',
  'can',
  'como',
  'con',
  'das',
  'der',
  'des',
  'die',
  'ein',
  'eine',
  'for',
  'from',
  'fur',
  'guide',
  'how',
  'les',
  'los',
  'make',
  'mit',
  'para',
  'por',
  'que',
  'sur',
  'the',
  'this',
  'tips',
  'und',
  'une',
  'use',
  'vous',
  'what',
  'when',
  'with',
  'without',
  'your',
])

const shortSeoTokens = new Set(['ai', 'cv', 'hd', 'id', 'kb'])

export function validateBlogPostInput(input: BlogPostInput) {
  const errors: string[] = []

  if (!(LOCALES as readonly string[]).includes(input.locale)) errors.push('Invalid locale.')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) errors.push('Slug must use lowercase letters, numbers, and hyphens.')
  if (!input.title.trim()) errors.push('Title is required.')
  if (!input.description.trim()) errors.push('Description is required.')
  if (input.description.trim().length > 180) errors.push('Description should be 180 characters or fewer.')
  if (input.keywords.length !== 1) errors.push('Add exactly one keyword.')
  if (!input.intro.trim()) errors.push('Intro is required.')
  if (input.sections.length < 3) errors.push('Add at least three content sections.')

  input.sections.forEach((section, index) => {
    if (!section.heading.trim()) errors.push(`Section ${index + 1} heading is required.`)
    if (!section.body.trim()) errors.push(`Section ${index + 1} body is required.`)
  })

  if (input.coverImageUrl && !input.coverImageAlt?.trim()) {
    errors.push('Cover image alt text is required when a cover image is set.')
  }

  validateBlogSeoTopicConsistency(input, errors)

  const links = input.enhancement?.internalLinks || []
  for (const link of links) {
    if (/^\/(?:api|dashboard|upload|generate|generations|login|auth)(?:\/|$)/.test(link.href)) {
      errors.push(`Internal link ${link.href} points to a private or operational page.`)
    }
  }

  return errors
}

function validateBlogSeoTopicConsistency(input: BlogPostInput, errors: string[]) {
  const description = input.description.trim()
  const title = input.title.trim()
  const keywords = input.keywords.map((keyword) => keyword.trim()).filter(Boolean)

  if (!description) return

  if (title && !hasSeoTopicOverlap(title, description, 2)) {
    errors.push('Title/H1 should match the meta description topic.')
  }

  const mismatchedKeywords = keywords.filter((keyword) => !hasSeoTopicOverlap(keyword, description, keywordOverlapMinimum(keyword)))
  if (mismatchedKeywords.length > 0) {
    errors.push(`Keyword(s) should match the meta description topic: ${mismatchedKeywords.join(', ')}.`)
  }
}

function keywordOverlapMinimum(keyword: string) {
  const tokenCount = tokenizeSeoText(keyword).length
  if (tokenCount >= 3) return 2
  return 1
}

function hasSeoTopicOverlap(candidate: string, description: string, minimum: number) {
  const candidateCompact = compactSeoText(candidate)
  const descriptionCompact = compactSeoText(description)

  if (candidateCompact.length >= 4 && descriptionCompact.includes(candidateCompact)) {
    return true
  }

  const candidateTokens = tokenizeSeoText(candidate)
  if (candidateTokens.length === 0) return false

  const descriptionTokens = new Set(tokenizeSeoText(description))
  const required = Math.min(minimum, candidateTokens.length)
  return candidateTokens.filter((token) => descriptionTokens.has(token)).length >= required
}

function tokenizeSeoText(value: string) {
  const tokens = normalizeSeoText(value).match(/[a-z0-9\u00c0-\u024f\u0370-\u03ff\u0400-\u04ff\u3040-\u30ff\u3400-\u9fff]+/g) || []
  return Array.from(
    new Set(
      tokens
        .map(stemSeoToken)
        .filter((token) => (token.length > 2 || shortSeoTokens.has(token)) && !seoStopWords.has(token))
    )
  )
}

function compactSeoText(value: string) {
  return normalizeSeoText(value).replace(/[^a-z0-9\u00c0-\u024f\u0370-\u03ff\u0400-\u04ff\u3040-\u30ff\u3400-\u9fff]+/g, '')
}

function normalizeSeoText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
}

function stemSeoToken(token: string) {
  if (token.length > 6 && token.endsWith('able')) return token.slice(0, -4)
  if (token.length > 5 && token.endsWith('ing')) return token.slice(0, -3)
  if (token.length > 5 && token.endsWith('ies')) return `${token.slice(0, -3)}y`
  if (token.length > 4 && /(ches|shes|sses|xes|zes)$/.test(token)) return token.slice(0, -2)
  if (token.length > 4 && token.endsWith('s')) return token.slice(0, -1)
  return token
}

export async function listAdminBlogPosts(options: { locale?: Locale; status?: string; query?: string }) {
  let queryBuilder = supabaseAdmin
    .from('blog_posts')
    .select(publishedColumns)
    .order('updated_at', { ascending: false })
    .limit(200)

  if (options.locale) queryBuilder = queryBuilder.eq('locale', options.locale)
  if (options.status && ['draft', 'published', 'archived'].includes(options.status)) {
    queryBuilder = queryBuilder.eq('status', options.status)
  }
  if (options.query) {
    const escaped = options.query.replaceAll('%', '\\%').replaceAll('_', '\\_')
    queryBuilder = queryBuilder.or(`title.ilike.%${escaped}%,slug.ilike.%${escaped}%,description.ilike.%${escaped}%`)
  }

  const { data, error } = await queryBuilder
  if (error) throw error
  return ((data || []) as unknown as BlogPostRow[]).map(rowToPost)
}

export async function upsertAdminBlogPost(input: BlogPostInput, userId: string) {
  const slug = normalizeAdminBlogSlug(input.slug, input.title, input.keywords)
  const normalizedInput = {
    ...input,
    slug,
    localizedSlugs: {
      ...(input.localizedSlugs || {}),
      [input.locale]: slug,
    },
  }
  const errors = validateBlogPostInput(normalizedInput)
  if (errors.length > 0) {
    return { ok: false as const, errors }
  }

  const publishedAt = normalizedInput.status === 'published'
    ? await getNextManualPublishTime(normalizedInput.id)
    : null

  const payload = {
    locale: normalizedInput.locale,
    translation_group_id: normalizedInput.translationGroupId || undefined,
    source_post_id: normalizedInput.sourcePostId || null,
    slug: normalizedInput.slug,
    status: normalizedInput.status,
    title: normalizedInput.title.trim(),
    description: normalizedInput.description.trim(),
    keywords: normalizedInput.keywords.map((keyword) => keyword.trim()).filter(Boolean).slice(0, 1),
    category: normalizedInput.category?.trim() || null,
    cover_image_url: normalizedInput.coverImageUrl?.trim() || null,
    cover_image_alt: normalizedInput.coverImageAlt?.trim() || null,
    intro: normalizedInput.intro.trim(),
    content: { sections: normalizedInput.sections },
    seo_enhancement: normalizedInput.enhancement || {},
    localized_slugs: {
      ...(normalizedInput.localizedSlugs || {}),
      [normalizedInput.locale]: normalizedInput.slug,
    },
    submitted_to_bing: Boolean(normalizedInput.submittedToBing),
    published_at: publishedAt,
    updated_by: userId,
    created_by: userId,
  }

  const { created_by: _createdBy, ...updatePayload } = payload
  const request = normalizedInput.id
    ? supabaseAdmin.from('blog_posts').update(updatePayload).eq('id', normalizedInput.id).select(publishedColumns).single()
    : supabaseAdmin.from('blog_posts').insert(payload).select(publishedColumns).single()

  const { data, error } = await request
  if (error) {
    return { ok: false as const, errors: [error.message] }
  }

  return { ok: true as const, post: rowToPost(data as unknown as BlogPostRow) }
}

async function getNextManualPublishTime(id?: string) {
  if (id) {
    const { data: currentPost } = await supabaseAdmin
      .from('blog_posts')
      .select('status,published_at')
      .eq('id', id)
      .maybeSingle()

    const currentPublishedAt = typeof currentPost?.published_at === 'string' ? currentPost.published_at : ''
    if (currentPost?.status === 'published' && currentPublishedAt) {
      return currentPublishedAt
    }
  }

  let query = supabaseAdmin
    .from('blog_posts')
    .select('published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(1)

  if (id) {
    query = query.neq('id', id)
  }

  const { data, error } = await query.maybeSingle()
  if (error) {
    return new Date().toISOString()
  }

  const lastPublishedAt = typeof data?.published_at === 'string' ? data.published_at : ''
  const lastDate = lastPublishedAt ? new Date(lastPublishedAt) : null
  if (!lastDate || Number.isNaN(lastDate.getTime())) {
    return new Date().toISOString()
  }

  return new Date(lastDate.getTime() + 60 * 60 * 1000).toISOString()
}

function normalizeAdminBlogSlug(slug: string, title: string, keywords: string[]) {
  const candidate = slugifySlug(slug || title || keywords[0] || '')
  if (candidate && candidate.length <= 56) return candidate

  const shortCandidate = candidate
    .split('-')
    .filter(Boolean)
    .slice(0, 6)
    .join('-')

  if (shortCandidate && shortCandidate.length <= 56) return shortCandidate

  return `post-${randomShortId()}`
}

function slugifySlug(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

function randomShortId() {
  return Math.random().toString(36).slice(2, 10)
}
