import { NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'
import { LOCALES, type Locale } from '@/lib/i18n'
import { supabaseAdmin } from '@backend/config/supabase'

export const dynamic = 'force-dynamic'

const statuses = ['pending', 'generating', 'draft', 'failed', 'published'] as const

type FastContentStatus = typeof statuses[number]

type FastContentRow = {
  id: string
  locale: Locale
  keyword: string
  status: FastContentStatus
  blog_post_id: string | null
  blog_slug: string | null
  prompt: string | null
  error_message: string | null
  created_at: string
  updated_at: string
}

type FastContentBody = {
  locale?: unknown
  keywords?: unknown
  id?: unknown
  status?: unknown
  blogPostId?: unknown
  blogSlug?: unknown
  prompt?: unknown
  errorMessage?: unknown
}

const columns = [
  'id',
  'locale',
  'keyword',
  'status',
  'blog_post_id',
  'blog_slug',
  'prompt',
  'error_message',
  'created_at',
  'updated_at',
].join(',')

export async function GET(request: Request) {
  const user = await requireAdmin(request)
  if (user instanceof NextResponse) return user

  const { searchParams } = new URL(request.url)
  const locale = parseLocale(searchParams.get('locale'))
  const status = parseStatus(searchParams.get('status'))
  const generated = searchParams.get('generated')

  let query = supabaseAdmin
    .from('fast_content_keywords')
    .select(columns)
    .order('updated_at', { ascending: false })
    .limit(300)

  if (locale) query = query.eq('locale', locale)
  if (status) query = query.eq('status', status)
  if (!status && generated === 'false') query = query.in('status', ['pending', 'generating', 'failed'])
  if (!status && generated === 'true') query = query.in('status', ['draft', 'published'])

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ items: ((data || []) as unknown as FastContentRow[]).map(rowToItem) })
}

export async function POST(request: Request) {
  const user = await requireAdmin(request)
  if (user instanceof NextResponse) return user

  const body = await request.json().catch(() => null) as FastContentBody | null
  const locale = parseLocale(body?.locale) || 'en'
  const keywords = normalizeKeywordLines(body?.keywords)

  if (keywords.length === 0) {
    return NextResponse.json({ error: 'Enter at least one keyword.' }, { status: 400 })
  }

  const inserted: ReturnType<typeof rowToItem>[] = []
  const skipped: string[] = []
  const errors: { keyword: string; error: string }[] = []

  for (const keyword of keywords) {
    const { data, error } = await supabaseAdmin
      .from('fast_content_keywords')
      .insert({
        locale,
        keyword,
        status: 'pending',
        created_by: user.id,
        updated_by: user.id,
      })
      .select(columns)
      .maybeSingle()

    if (error) {
      if (error.code === '23505') {
        skipped.push(keyword)
      } else {
        errors.push({ keyword, error: error.message })
      }
      continue
    }

    if (!data) {
      errors.push({ keyword, error: 'Keyword was inserted but no row was returned. Refresh the list to confirm it.' })
      continue
    }

    inserted.push(rowToItem(data as unknown as FastContentRow))
  }

  return NextResponse.json({ inserted, skipped, errors })
}

export async function PATCH(request: Request) {
  const user = await requireAdmin(request)
  if (user instanceof NextResponse) return user

  const body = await request.json().catch(() => null) as FastContentBody | null
  const id = typeof body?.id === 'string' ? body.id.trim() : ''
  const status = parseStatus(body?.status)

  if (!id) {
    return NextResponse.json({ error: 'id is required.' }, { status: 400 })
  }

  const update: Record<string, unknown> = {
    updated_by: user.id,
  }
  if (status) update.status = status
  if (typeof body?.blogPostId === 'string') update.blog_post_id = body.blogPostId.trim() || null
  if (typeof body?.blogSlug === 'string') update.blog_slug = body.blogSlug.trim() || null
  if (typeof body?.prompt === 'string') update.prompt = body.prompt
  if (typeof body?.errorMessage === 'string') update.error_message = body.errorMessage.trim() || null

  const { data, error } = await supabaseAdmin
    .from('fast_content_keywords')
    .update(update)
    .eq('id', id)
    .select(columns)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ error: 'Fast content keyword was not found. Refresh the list and try again.' }, { status: 404 })
  }

  return NextResponse.json({ item: rowToItem(data as unknown as FastContentRow) })
}

async function requireAdmin(request: Request) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return user
}

function parseLocale(value: unknown): Locale | undefined {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
    ? value as Locale
    : undefined
}

function parseStatus(value: unknown): FastContentStatus | undefined {
  return typeof value === 'string' && (statuses as readonly string[]).includes(value)
    ? value as FastContentStatus
    : undefined
}

function normalizeKeywordLines(value: unknown) {
  const raw = Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string').join('\n')
    : typeof value === 'string'
      ? value
      : ''

  const seen = new Set<string>()
  const keywords: string[] = []

  for (const line of raw.split(/\r?\n/)) {
    const keyword = line.trim().replace(/\s+/g, ' ')
    const key = keyword.toLocaleLowerCase()
    if (!keyword || seen.has(key)) continue
    seen.add(key)
    keywords.push(keyword)
  }

  return keywords
}

function rowToItem(row: FastContentRow) {
  return {
    id: row.id,
    locale: row.locale,
    keyword: row.keyword,
    status: row.status,
    blogPostId: row.blog_post_id,
    blogSlug: row.blog_slug,
    prompt: row.prompt,
    errorMessage: row.error_message,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
