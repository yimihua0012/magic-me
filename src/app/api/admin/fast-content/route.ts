import { NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'
import { LOCALES, type Locale } from '@/lib/i18n'
import { supabaseAdmin } from '@backend/config/supabase'

export const dynamic = 'force-dynamic'

const statuses = ['pending', 'generating', 'draft', 'failed', 'published'] as const
const PUBLISHED_STATS_DAY_COUNT = 10
const SHANGHAI_TIME_ZONE = 'Asia/Shanghai'
const CMS_KEYWORD_PAGE_SIZE = 1000

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

type PublishedFastContentRow = {
  locale: Locale
  published_at: string | null
}

type CmsKeywordRow = {
  keywords: string[] | null
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

  const publishedLast10Days = await getPublishedLast10Days()

  return NextResponse.json({
    items: ((data || []) as unknown as FastContentRow[]).map(rowToItem),
    publishedLast10Days,
  })
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

  let cmsKeywordKeys: Set<string>
  try {
    cmsKeywordKeys = await getCmsKeywordKeys(locale)
  } catch (error) {
    return NextResponse.json(
      { error: `Could not check CMS keyword duplicates: ${errorMessage(error)}` },
      { status: 500 },
    )
  }

  const inserted: ReturnType<typeof rowToItem>[] = []
  const skipped: string[] = []
  const skippedCms: string[] = []
  const errors: { keyword: string; error: string }[] = []

  for (const keyword of keywords) {
    if (cmsKeywordKeys.has(normalizeKeywordKey(keyword))) {
      skippedCms.push(keyword)
      continue
    }

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

  return NextResponse.json({ inserted, skipped, skippedCms, errors })
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
    const keyword = line.normalize('NFKC').trim().replace(/\s+/g, ' ')
    const key = normalizeKeywordKey(keyword)
    if (!keyword || seen.has(key)) continue
    seen.add(key)
    keywords.push(keyword)
  }

  return keywords
}

async function getCmsKeywordKeys(locale: Locale) {
  const keywordKeys = new Set<string>()
  let offset = 0

  while (true) {
    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .select('keywords')
      .eq('locale', locale)
      .in('status', ['draft', 'published'])
      .range(offset, offset + CMS_KEYWORD_PAGE_SIZE - 1)

    if (error) throw error

    const rows = (data || []) as unknown as CmsKeywordRow[]
    for (const row of rows) {
      for (const keyword of row.keywords || []) {
        const key = normalizeKeywordKey(keyword)
        if (key) keywordKeys.add(key)
      }
    }

    if (rows.length < CMS_KEYWORD_PAGE_SIZE) break
    offset += CMS_KEYWORD_PAGE_SIZE
  }

  return keywordKeys
}

function normalizeKeywordKey(value: string) {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase()
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

async function getPublishedLast10Days() {
  const days = recentShanghaiDays(PUBLISHED_STATS_DAY_COUNT)
  const daysByKey = new Map(days.map((date) => [date, { date, count: 0, locales: {} as Partial<Record<Locale, number>> }]))
  const earliestDay = days[0]
  const cutoff = new Date(`${earliestDay}T00:00:00+08:00`).toISOString()

  const { data, error } = await supabaseAdmin
    .from('fast_content_keywords')
    .select('locale,published_at')
    .eq('status', 'published')
    .gte('published_at', cutoff)

  if (error) throw error

  for (const row of (data || []) as unknown as PublishedFastContentRow[]) {
    if (!row.published_at || !(LOCALES as readonly string[]).includes(row.locale)) continue
    const day = shanghaiDateKey(new Date(row.published_at))
    const summary = daysByKey.get(day)
    if (!summary) continue

    summary.count += 1
    summary.locales[row.locale] = (summary.locales[row.locale] || 0) + 1
  }

  const daySummaries = days.map((date) => daysByKey.get(date)!)
  return {
    timeZone: SHANGHAI_TIME_ZONE,
    total: daySummaries.reduce((total, day) => total + day.count, 0),
    days: daySummaries.reverse(),
  }
}

function recentShanghaiDays(dayCount: number) {
  const today = shanghaiDateKey(new Date())
  const [year, month, day] = today.split('-').map(Number)
  const dates: string[] = []

  for (let offset = dayCount - 1; offset >= 0; offset -= 1) {
    const date = new Date(Date.UTC(year, month - 1, day - offset, -8))
    dates.push(shanghaiDateKey(date))
  }

  return dates
}

function shanghaiDateKey(value: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SHANGHAI_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(value)
  const readPart = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || ''

  return `${readPart('year')}-${readPart('month')}-${readPart('day')}`
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error'
}
