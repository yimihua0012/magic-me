import { NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'
import {
  blogPostCategoryLabel,
  getAdminBlogPostById,
  listAdminBlogPosts,
  slugifyBlogCategory,
  upsertAdminBlogPost,
  validateBlogPostInput,
  type BlogPostInput,
} from '@/lib/blog-store'
import { revalidateBlogPaths } from '@/lib/blog-revalidate'
import { LOCALES, type Locale } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

const statuses = ['draft', 'published', 'archived'] as const

type BlogPostRequestBody = Partial<BlogPostInput> & {
  keywords?: unknown
  sections?: unknown
  enhancement?: unknown
  localizedSlugs?: unknown
}

export async function GET(request: Request) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const locale = searchParams.get('locale') || undefined
  const status = searchParams.get('status') || undefined
  const query = searchParams.get('query')?.trim() || undefined

  if (locale && !(LOCALES as readonly string[]).includes(locale)) {
    return NextResponse.json({ error: 'Invalid locale.' }, { status: 400 })
  }

  const posts = await listAdminBlogPosts({ locale: locale as Locale | undefined, status, query })
  return NextResponse.json({ posts })
}

export async function POST(request: Request) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null) as BlogPostRequestBody | null
  const input = normalizeBlogPostInput(body)
  const validationErrors = validateBlogPostInput(input)

  if (validationErrors.length > 0) {
    return NextResponse.json({ errors: validationErrors }, { status: 400 })
  }

  const previousPost = input.id ? await getAdminBlogPostById(input.id) : null
  const result = await upsertAdminBlogPost(input, user.id)
  if (!result.ok) {
    return NextResponse.json({ errors: result.errors }, { status: 400 })
  }

  if (previousPost?.status === 'published' || result.post.status === 'published') {
    const categorySlugs = [previousPost, result.post]
      .filter((post): post is NonNullable<typeof post> => Boolean(post))
      .map((post) => slugifyBlogCategory(blogPostCategoryLabel(post)))

    revalidateBlogPaths(
      result.post.locale,
      result.post.slug,
      categorySlugs
    )

    if (previousPost && previousPost.locale === result.post.locale && previousPost.slug !== result.post.slug) {
      revalidateBlogPaths(previousPost.locale, previousPost.slug, categorySlugs)
    }
  }

  return NextResponse.json({ post: result.post })
}

function normalizeBlogPostInput(body: BlogPostRequestBody | null): BlogPostInput {
  const locale = typeof body?.locale === 'string' && (LOCALES as readonly string[]).includes(body.locale)
    ? body.locale as Locale
    : 'en'
  const status = typeof body?.status === 'string' && (statuses as readonly string[]).includes(body.status)
    ? body.status
    : 'draft'

  return {
    id: typeof body?.id === 'string' ? body.id : undefined,
    locale,
    translationGroupId: typeof body?.translationGroupId === 'string' ? body.translationGroupId.trim() || undefined : undefined,
    sourcePostId: typeof body?.sourcePostId === 'string' ? body.sourcePostId.trim() || null : null,
    slug: typeof body?.slug === 'string' ? body.slug.trim() : '',
    status,
    title: typeof body?.title === 'string' ? body.title : '',
    description: typeof body?.description === 'string' ? body.description : '',
    keywords: normalizeKeywords(body?.keywords),
    category: typeof body?.category === 'string' ? body.category : undefined,
    coverImageUrl: typeof body?.coverImageUrl === 'string' ? body.coverImageUrl : undefined,
    coverImageAlt: typeof body?.coverImageAlt === 'string' ? body.coverImageAlt : undefined,
    intro: typeof body?.intro === 'string' ? body.intro : '',
    sections: normalizeSections(body?.sections),
    enhancement: isRecord(body?.enhancement) ? body.enhancement : undefined,
    localizedSlugs: isRecord(body?.localizedSlugs) ? body.localizedSlugs as Partial<Record<Locale, string>> : undefined,
    submittedToBing: typeof body?.submittedToBing === 'boolean' ? body.submittedToBing : false,
  }
}

function normalizeKeywords(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
  }

  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean)
  }

  return []
}

function normalizeSections(value: unknown) {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is { heading?: unknown; body?: unknown } => isRecord(item))
    .map((section) => ({
      heading: typeof section.heading === 'string' ? section.heading : '',
      body: typeof section.body === 'string' ? section.body : '',
    }))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}
