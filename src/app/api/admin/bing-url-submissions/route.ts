import { NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'
import { blogPath, getPublishedBlogPosts } from '@/lib/blog-store'
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

    const submissionUrl = new URL(process.env.INDEXNOW_ENDPOINT || INDEXNOW_ENDPOINT)
    const host = new URL(siteUrl).host
    const keyLocation = resolveKeyLocation(body?.keyLocation, siteUrl, apiKey)
    const indexNowBody = {
      host,
      key: apiKey,
      keyLocation,
      urlList: normalizedUrls,
    }

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
      console.error('[Bing URL Submission] Network error:', fetchError)
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
      console.error('[Bing URL Submission] Failed:', {
        status: bingResponse.status,
        siteUrl,
        body: parsedResponse,
      })

      return NextResponse.json(
        {
          error: readableBingError(parsedResponse),
          bingStatus: bingResponse.status,
          bingResponse: parsedResponse,
          endpoint: submissionUrl.origin + submissionUrl.pathname,
          indexNowRequestPreview: previewIndexNowRequest(indexNowBody),
        },
        { status: 502 },
      )
    }

    return NextResponse.json({
      count: normalizedUrls.length,
      submitted: normalizedUrls,
      siteUrl,
      bingStatus: bingResponse.status,
      bingResponse: parsedResponse,
      endpoint: submissionUrl.origin + submissionUrl.pathname,
      indexNowRequestPreview: previewIndexNowRequest(indexNowBody),
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

  for (const locale of LOCALES) {
    const posts = await getPublishedBlogPosts(locale as Locale)
    for (const post of posts) {
      const dateValue = post.publishedAt || post.updatedAt
      const publishedTime = dateValue ? new Date(dateValue).getTime() : 0
      if (publishedTime > cutoff.getTime()) continue

      const url = `${siteUrl}${blogPath(post.locale, post.slug)}`
      if (!seen.has(url)) {
        seen.add(url)
        urls.push(url)
      }
    }
  }

  urls.sort()

  return {
    before: cutoff.toISOString(),
    count: urls.length,
    urls,
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
  if (typeof hostInput === 'string' && hostInput.trim()) {
    return `https://${hostInput.trim().replace(/^https?:\/\//i, '').replace(/\/.*$/, '')}`
  }

  const configured = new URL(appConfig.url)

  if (configured.hostname === 'localhost') {
    const firstAbsoluteUrl = rawUrls.find((rawUrl) => /^https?:\/\//i.test(rawUrl))
    if (firstAbsoluteUrl) {
      return new URL(firstAbsoluteUrl).origin
    }
  }

  return configured.origin
}

function resolveKeyLocation(value: unknown, siteUrl: string, apiKey: string) {
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }

  return `${siteUrl}/${apiKey}.txt`
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

function readableBingError(value: unknown) {
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

function previewIndexNowRequest(body: { host: string; key: string; keyLocation: string; urlList: string[] }) {
  return {
    host: body.host,
    keyConfigured: Boolean(body.key),
    keyLocation: body.keyLocation,
    urlList: body.urlList,
  }
}
