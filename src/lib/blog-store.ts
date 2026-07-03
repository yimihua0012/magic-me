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
  const mergedEnhancement = {
    ...fallbackEnhancement,
    ...(row.seo_enhancement || {}),
  } as BlogEnhancement | undefined
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
    source: 'cms',
  }
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
}

export function validateBlogPostInput(input: BlogPostInput) {
  const errors: string[] = []

  if (!(LOCALES as readonly string[]).includes(input.locale)) errors.push('Invalid locale.')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) errors.push('Slug must use lowercase letters, numbers, and hyphens.')
  if (!input.title.trim()) errors.push('Title is required.')
  if (!input.description.trim()) errors.push('Description is required.')
  if (input.description.trim().length > 180) errors.push('Description should be 180 characters or fewer.')
  if (input.keywords.length < 2) errors.push('Add at least two keywords.')
  if (!input.intro.trim()) errors.push('Intro is required.')
  if (input.sections.length < 3) errors.push('Add at least three content sections.')

  input.sections.forEach((section, index) => {
    if (!section.heading.trim()) errors.push(`Section ${index + 1} heading is required.`)
    if (!section.body.trim()) errors.push(`Section ${index + 1} body is required.`)
  })

  if (input.coverImageUrl && !input.coverImageAlt?.trim()) {
    errors.push('Cover image alt text is required when a cover image is set.')
  }

  const links = input.enhancement?.internalLinks || []
  for (const link of links) {
    if (/^\/(?:api|dashboard|upload|generate|generations|login|auth)(?:\/|$)/.test(link.href)) {
      errors.push(`Internal link ${link.href} points to a private or operational page.`)
    }
  }

  return errors
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
  const errors = validateBlogPostInput(input)
  if (errors.length > 0) {
    return { ok: false as const, errors }
  }

  const payload = {
    locale: input.locale,
    translation_group_id: input.translationGroupId || undefined,
    source_post_id: input.sourcePostId || null,
    slug: input.slug,
    status: input.status,
    title: input.title.trim(),
    description: input.description.trim(),
    keywords: input.keywords.map((keyword) => keyword.trim()).filter(Boolean),
    category: input.category?.trim() || null,
    cover_image_url: input.coverImageUrl?.trim() || null,
    cover_image_alt: input.coverImageAlt?.trim() || null,
    intro: input.intro.trim(),
    content: { sections: input.sections },
    seo_enhancement: input.enhancement || {},
    localized_slugs: {
      ...(input.localizedSlugs || {}),
      [input.locale]: input.slug,
    },
    published_at: input.status === 'published' ? new Date().toISOString() : null,
    updated_by: userId,
    created_by: userId,
  }

  const { created_by: _createdBy, ...updatePayload } = payload
  const request = input.id
    ? supabaseAdmin.from('blog_posts').update(updatePayload).eq('id', input.id).select(publishedColumns).single()
    : supabaseAdmin.from('blog_posts').insert(payload).select(publishedColumns).single()

  const { data, error } = await request
  if (error) {
    return { ok: false as const, errors: [error.message] }
  }

  return { ok: true as const, post: rowToPost(data as unknown as BlogPostRow) }
}
