import { NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'
import { appConfig } from '@/lib/config'

export const dynamic = 'force-dynamic'

const BING_SUBMISSION_ENDPOINT = 'https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch'
const MAX_BING_BATCH_SIZE = 500
const BING_SUBMISSION_TIMEOUT_MS = 30000

type SubmissionBody = {
  urls?: unknown
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

    const apiKey =
      process.env.BING_WEBMASTER_API_KEY ||
      process.env.BING_URL_SUBMISSION_API_KEY ||
      process.env.BING_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Missing Bing API key. Please set BING_WEBMASTER_API_KEY on the server.',
          missingConfig: 'BING_WEBMASTER_API_KEY',
        },
        { status: 500 },
      )
    }

    const body = await request.json().catch(() => null) as SubmissionBody | null
    const rawUrls = extractUrlCandidates(body?.urls)

    if (rawUrls.length === 0) {
      return NextResponse.json({ error: 'At least one URL is required.' }, { status: 400 })
    }

    const siteUrl = resolveSiteUrl(rawUrls)
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

    const submissionUrl = new URL(process.env.BING_URL_SUBMISSION_ENDPOINT || BING_SUBMISSION_ENDPOINT)
    submissionUrl.searchParams.set('apikey', apiKey)

    let bingResponse: Response
    try {
      bingResponse = await fetch(submissionUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          siteUrl,
          urlList: normalizedUrls,
        }),
        cache: 'no-store',
        signal: AbortSignal.timeout(BING_SUBMISSION_TIMEOUT_MS),
      })
    } catch (fetchError) {
      console.error('[Bing URL Submission] Network error:', fetchError)
      return NextResponse.json(
        {
          error: 'Could not connect to Bing Webmaster Tools. Check server network access and try again.',
          details: errorMessage(fetchError),
          siteUrl,
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
          error: 'Bing URL submission failed.',
          bingStatus: bingResponse.status,
          bingResponse: parsedResponse,
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
    })
  } catch (error) {
    console.error('[Bing URL Submission] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return typeof error === 'string' ? error : 'Unknown network error'
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

function resolveSiteUrl(rawUrls: string[]) {
  const configured = new URL(appConfig.url)

  if (configured.hostname === 'localhost') {
    const firstAbsoluteUrl = rawUrls.find((rawUrl) => /^https?:\/\//i.test(rawUrl))
    if (firstAbsoluteUrl) {
      return new URL(firstAbsoluteUrl).origin
    }
  }

  return configured.origin
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
