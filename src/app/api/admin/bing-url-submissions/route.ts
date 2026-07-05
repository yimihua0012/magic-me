import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'
import { blogPath } from '@/lib/blog-store'
import { appConfig } from '@/lib/config'
import { LOCALES, type Locale } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/IndexNow'
const MAX_BING_BATCH_SIZE = 500
const BING_SUBMISSION_TIMEOUT_MS = 30000

type SubmissionBody = {
  urls?: unknown
  host?: unknown
  keyLocation?: unknown
  urlList?: unknown
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const requestUrl = new URL(request.url)
    if (requestUrl.searchParams.get('action') === 'blog-urls') {
      return NextResponse.json(await getPublishedBlogUrlsBefore(requestUrl.searchParams.get('before')))
    }

    const apiKey = resolveIndexNowKey()
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Missing IndexNow key. Please set INDEXNOW_KEY on the server.',
          missingConfig: 'INDEXNOW_KEY',
          help: 'Generate it in Bing IndexNow, host the key text file, then add INDEXNOW_KEY to Vercel environment variables.',
        },
        { status: 500 },
      )
    }

    const siteUrl = resolveSiteUrl([], requestUrl.searchParams.get('host'))
    const keyLocation = `${siteUrl}/${apiKey}.txt`

    const keyResponse = await fetch(keyLocation, {
      method: 'GET',
      cache: 'no-store',
      signal: AbortSignal.timeout(BING_SUBMISSION_TIMEOUT_MS),
    })
    const responseText = await keyResponse.text().catch(() => '')
    const keyMatches = responseText.trim() === apiKey

    if (!keyResponse.ok || !keyMatches) {
      return NextResponse.json(
        {
          error: 'IndexNow key file is not reachable or does not match the configured key.',
          status: keyResponse.status,
          keyLocation,
          keyMatches,
          siteUrl,
        },
        { status: 502 },
      )
    }

    return NextResponse.json({
      siteUrl,
      status: keyResponse.status,
      endpoint: keyLocation,
      keyLocation,
      keyMatches,
    })
  } catch (error) {
    console.error('[IndexNow Key Check] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!isAdminEmail(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json().catch(() => null) as SubmissionBody | null
    const apiKey = resolveIndexNowKey()

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Missing IndexNow key. Please set INDEXNOW_KEY on the server.',
          missingConfig: 'INDEXNOW_KEY',
          help: 'Generate it in Bing IndexNow, host the key text file, then add INDEXNOW_KEY to Vercel environment variables.',
        },
        { status: 500 },
      )
    }

    const rawUrls = extractUrlCandidates(body?.urlList ?? body?.urls)

    if (rawUrls.length === 0) {
      return NextResponse.json({ error: 'At least one URL is required.' }, { status: 400 })
    }

    const siteUrl = resolveSiteUrl(rawUrls, body?.host)
    const normalizedUrls = normalizeUrlsForSite(rawUrls, siteUrl)

    if (normalizedUrls.length === 0) {
      return NextResponse.json(
        { error: `No valid URLs were found for ${siteUrl}.` },
        { status: 400 },
      )
    }

    if (normalizedUrls.length > MAX_BING_BATCH_SIZE) {
      return NextResponse.json(
        { error: `Bing accepts up to ${MAX_BING_BATCH_SIZE} URLs per batch.` },
        { status: 400 },
      )
    }

    const host = new URL(siteUrl).host
    const keyLocation = resolveKeyLocation(body?.keyLocation, siteUrl, apiKey)
    const keyCheck = await checkIndexNowKeyFile(keyLocation, apiKey)

    const indexNowBody: IndexNowRequestBody = {
      host,
      key: apiKey,
      keyLocation,
      urlList: normalizedUrls,
    }

    const submissionUrl = new URL(process.env.INDEXNOW_ENDPOINT || INDEXNOW_ENDPOINT)
    let bingResponse: Response
    try {
      bingResponse = await fetch(submissionUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(indexNowBody),
        cache: 'no-store',
        signal: AbortSignal.timeout(BING_SUBMISSION_TIMEOUT_MS),
      })
    } catch (fetchError) {
      return NextResponse.json(
        {
          error: 'Could not connect to Bing Webmaster Tools. Check server network access and try again.',
          details: errorMessage(fetchError),
          endpoint: submissionUrl.origin + submissionUrl.pathname,
          siteUrl,
          indexNowRequestPreview: previewIndexNowRequest(indexNowBody),
          submitted: normalizedUrls,
          count: normalizedUrls.length,
        },
        { status: 503 },
      )
    }

    const responseText = await bingResponse.text()
    const parsedResponse = parseBingResponse(responseText)

    if (!bingResponse.ok) {
      return NextResponse.json(
        {
          error: readableBingError(parsedResponse, bingResponse.status),
          bingStatus: bingResponse.status,
          bingResponse: parsedResponse,
          endpoint: submissionUrl.origin + submissionUrl.pathname,
          submitted: normalizedUrls,
          count: normalizedUrls.length,
          siteUrl,
          keyLocation,
          keyCheck,
          indexNowRequestPreview: previewIndexNowRequest(indexNowBody),
        },
        { status: 502 },
      )
    }

    const markedBlogPosts = await markSubmittedBlogPosts(normalizedUrls, siteUrl)

    return NextResponse.json({
      count: normalizedUrls.length,
      submitted: normalizedUrls,
      markedBlogPosts,
      siteUrl,
      bingStatus: bingResponse.status,
      bingResponse: parsedResponse,
      endpoint: submissionUrl.origin + submissionUrl.pathname,
      indexNowRequestPreview: previewIndexNowRequest(indexNowBody),
      keyLocation,
      keyCheck,
    })
  } catch (error) {
    console.error('[Bing URL Submission] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function getPublishedBlogUrlsBefore(beforeInput: string | null) {
  const before = beforeInput ? new Date(beforeInput) : new Date()
  const cutoff = Number.isNaN(before.getTime()) ? new Date() : before
  const siteUrl = appConfig.url.replace(/\/$/, '')
  const urls: string[] = []
  const seen = new Set<string>()

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .select('id,locale,slug,published_at,updated_at')
    .eq('status', 'published')
    .eq('submitted_to_bing', false)
    .order('published_at', { ascending: true, nullsFirst: false })
    .order('updated_at', { ascending: true })
    .limit(MAX_BING_BATCH_SIZE)

  if (error) {
    throw new Error(`Could not load unsubmitted blog URLs: ${error.message}`)
  }

  for (const post of (data || []) as Array<{ locale: Locale; slug: string; published_at: string | null; updated_at: string | null }>) {
    const dateValue = post.published_at || post.updated_at
    const publishedTime = dateValue ? new Date(dateValue).getTime() : 0
    if (publishedTime > cutoff.getTime()) continue

    const url = `${siteUrl}${blogPath(post.locale, post.slug)}`
    if (!seen.has(url)) {
      seen.add(url)
      urls.push(url)
    }
  }

  urls.sort()

  return {
    before: cutoff.toISOString(),
    count: urls.length,
    urls,
    submittedToBing: false,
  }
}

async function markSubmittedBlogPosts(urls: string[], siteUrl: string) {
  const matches = urls
    .map((url) => parseBlogUrl(url, siteUrl))
    .filter((item): item is { locale: Locale; slug: string } => Boolean(item))

  const marked: string[] = []
  const errors: string[] = []
  const seen = new Set<string>()

  for (const match of matches) {
    const key = `${match.locale}:${match.slug}`
    if (seen.has(key)) continue
    seen.add(key)

    const { data, error } = await supabaseAdmin
      .from('blog_posts')
      .update({ submitted_to_bing: true })
      .eq('status', 'published')
      .eq('locale', match.locale)
      .eq('slug', match.slug)
      .select('id')

    if (error) {
      errors.push(`${key}: ${error.message}`)
    } else if ((data || []).length > 0) {
      marked.push(key)
    }
  }

  return {
    count: marked.length,
    marked,
    errors,
  }
}

function parseBlogUrl(rawUrl: string, siteUrl: string) {
  try {
    const site = new URL(siteUrl)
    const url = new URL(rawUrl, site.origin)
    if (url.origin !== site.origin) return null

    const parts = url.pathname.split('/').filter(Boolean)
    if (parts[0] === 'blog' && parts[1]) {
      return { locale: 'en' as Locale, slug: parts[1] }
    }

    if ((LOCALES as readonly string[]).includes(parts[0]) && parts[1] === 'blog' && parts[2]) {
      return { locale: parts[0] as Locale, slug: parts[2] }
    }

    return null
  } catch {
    return null
  }
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return typeof error === 'string' ? error : 'Unknown network error'
}

function resolveIndexNowKey() {
  const rawKey =
    process.env.INDEXNOW_KEY ||
    process.env.BING_INDEXNOW_KEY ||
    process.env.BING_WEBMASTER_API_KEY ||
    ''

  return sanitizeKey(rawKey)
}

function sanitizeKey(value: string) {
  return value.trim().replace(/^['"]|['"]$/g, '')
}

function extractUrlCandidates(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is string => typeof item === 'string')
      .flatMap((item) => item.split(/[\s,]+/))
      .map((item) => item.trim())
      .filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(/[\s,]+/)
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

function resolveSiteUrl(rawUrls: string[], hostInput?: unknown) {
  const configured = new URL(appConfig.url)

  if (configured.hostname !== 'localhost') {
    return configured.origin
  }

  if (typeof hostInput === 'string' && hostInput.trim()) {
    return `https://${hostInput.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '')}`
  }

  const firstAbsoluteUrl = rawUrls.find((rawUrl) => /^https?:\/\//i.test(rawUrl))
  if (firstAbsoluteUrl) {
    return new URL(firstAbsoluteUrl).origin
  }

  return configured.origin
}

function resolveKeyLocation(value: unknown, siteUrl: string, apiKey: string) {
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  return `${siteUrl}/${apiKey}.txt`
}

type IndexNowRequestBody = {
  host: string
  key: string
  keyLocation?: string
  urlList: string[]
}

async function checkIndexNowKeyFile(keyLocation: string, apiKey: string) {
  try {
    const response = await fetch(keyLocation, {
      method: 'GET',
      cache: 'no-store',
      signal: AbortSignal.timeout(BING_SUBMISSION_TIMEOUT_MS),
    })
    const text = await response.text().catch(() => '')
    const keyMatches = text.trim() === apiKey

    return {
      ok: response.ok && keyMatches,
      status: response.status,
      keyMatches,
    }
  } catch {
    return {
      ok: false,
      status: 0,
      keyMatches: false,
    }
  }
}

function normalizeUrlsForSite(rawUrls: string[], siteUrl: string) {
  const site = new URL(siteUrl)
  const seen = new Set<string>()
  const normalized: string[] = []

  for (const rawUrl of rawUrls) {
    try {
      const url = new URL(rawUrl, site.origin)
      if (!['http:', 'https:'].includes(url.protocol) || url.origin !== site.origin) {
        continue
      }

      url.hash = ''
      const href = url.toString()
      if (!seen.has(href)) {
        seen.add(href)
        normalized.push(href)
      }
    } catch {
    }
  }

  return normalized
}

function parseBingResponse(value: string) {
  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as unknown
  } catch {
    return value
  }
}

function readableBingError(value: unknown, status?: number) {
  if (status === 403) {
    return `IndexNow rejected the request with 403: ${extractBingMessage(value) || 'the key is not authorized for this site.'}`
  }

  if (
    value &&
    typeof value === 'object' &&
    'ErrorCode' in value &&
    Number((value as { ErrorCode?: unknown }).ErrorCode) === 3
  ) {
    return 'Invalid IndexNow key. Confirm the key matches the hosted key file and the submitted URLs belong to the same host.'
  }

  return 'IndexNow URL submission failed.'
}

function extractBingMessage(value: unknown) {
  if (!value || typeof value !== 'object') return ''

  const response = value as { errorCode?: unknown; message?: unknown }
  const code = typeof response.errorCode === 'string' ? response.errorCode : ''
  const message = typeof response.message === 'string' ? response.message : ''

  return [code, message].filter(Boolean).join(' - ')
}

function previewIndexNowRequest(body: IndexNowRequestBody) {
  return {
    host: body.host,
    keyConfigured: Boolean(body.key),
    keyLocation: body.keyLocation,
    urlList: body.urlList,
  }
}
