import { NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'
import { appConfig } from '@/lib/config'
import { getAllSitemaps } from '@/lib/sitemap'

export const dynamic = 'force-dynamic'

const INSPECTION_TIMEOUT_MS = 20000

type InspectionBody = {
  url?: unknown
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

    const body = await request.json().catch(() => null) as InspectionBody | null
    const rawUrl = typeof body?.url === 'string' ? body.url.trim() : ''

    if (!rawUrl) {
      return NextResponse.json({ error: 'URL is required.' }, { status: 400 })
    }

    const target = resolveTargetUrl(rawUrl)
    if (!target.ok) {
      return NextResponse.json({ error: target.error }, { status: 400 })
    }

    const startedAt = Date.now()
    let response: Response
    try {
      response = await fetch(target.url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Magic-Headshot-Bing-Precheck/1.0 (+https://magic-headshot.com)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        cache: 'no-store',
        redirect: 'follow',
        signal: AbortSignal.timeout(INSPECTION_TIMEOUT_MS),
      })
    } catch (error) {
      return NextResponse.json(
        {
          error: 'Could not fetch the URL from the server.',
          details: errorMessage(error),
          url: target.url,
        },
        { status: 502 },
      )
    }

    const responseTimeMs = Date.now() - startedAt
    const html = await response.text().catch(() => '')
    const finalUrl = response.url || target.url
    const xRobotsTag = response.headers.get('x-robots-tag') || ''
    const robotsMeta = findMetaContent(html, 'robots')
    const bingbotMeta = findMetaContent(html, 'bingbot')
    const description = findMetaContent(html, 'description')
    const keywords = findMetaContent(html, 'keywords')
    const canonical = findCanonical(html)
    const title = findTitle(html)
    const normalizedTargetUrl = normalizeComparableUrl(target.url)
    const normalizedFinalUrl = normalizeComparableUrl(finalUrl)
    const sitemapEntries = await getAllSitemaps()
    const requestedUrlSitemapIncluded = sitemapEntries.some((entry) => normalizeComparableUrl(entry.url) === normalizedTargetUrl)
    const finalUrlSitemapIncluded = sitemapEntries.some((entry) => normalizeComparableUrl(entry.url) === normalizedFinalUrl)
    const redirected = normalizedTargetUrl !== normalizedFinalUrl
    const issues = buildIssues({
      status: response.status,
      xRobotsTag,
      robotsMeta,
      bingbotMeta,
      canonical,
      targetUrl: target.url,
      finalUrl,
      requestedUrlSitemapIncluded,
      finalUrlSitemapIncluded,
      redirected,
      html,
    })

    return NextResponse.json({
      url: target.url,
      finalUrl,
      status: response.status,
      ok: response.ok,
      responseTimeMs,
      contentType: response.headers.get('content-type') || '',
      title,
      description,
      keywords,
      canonical,
      robotsMeta,
      bingbotMeta,
      xRobotsTag,
      sitemapIncluded: requestedUrlSitemapIncluded,
      requestedUrlSitemapIncluded,
      finalUrlSitemapIncluded,
      redirected,
      htmlBytes: html.length,
      indexable: response.ok && issues.length === 0,
      issues,
      bingInspectionUrl: 'https://www.bing.com/webmasters/urlinspection',
    })
  } catch (error) {
    console.error('[Bing URL Inspection] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function resolveTargetUrl(rawUrl: string): { ok: true; url: string } | { ok: false; error: string } {
  try {
    const configured = new URL(appConfig.url)
    const target = new URL(rawUrl, configured.origin)

    if (!['http:', 'https:'].includes(target.protocol)) {
      return { ok: false, error: 'Only HTTP and HTTPS URLs are supported.' }
    }

    if (configured.hostname !== 'localhost' && target.origin !== configured.origin) {
      return { ok: false, error: `URL must belong to ${configured.origin}.` }
    }

    target.hash = ''
    return { ok: true, url: target.toString() }
  } catch {
    return { ok: false, error: 'Enter a valid absolute or site-relative URL.' }
  }
}

function findMetaContent(html: string, name: string) {
  const tag = html.match(new RegExp(`<meta[^>]+name=["']${escapeRegExp(name)}["'][^>]*>`, 'i'))?.[0]
    || html.match(new RegExp(`<meta[^>]+content=["'][^"']*["'][^>]+name=["']${escapeRegExp(name)}["'][^>]*>`, 'i'))?.[0]

  return tag?.match(/content=["']([^"']*)["']/i)?.[1]?.trim() || ''
}

function findCanonical(html: string) {
  const tag = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0]
    || html.match(/<link[^>]+href=["'][^"']*["'][^>]+rel=["']canonical["'][^>]*>/i)?.[0]

  return tag?.match(/href=["']([^"']*)["']/i)?.[1]?.trim() || ''
}

function findTitle(html: string) {
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() || ''
}

function buildIssues(input: {
  status: number
  xRobotsTag: string
  robotsMeta: string
  bingbotMeta: string
  canonical: string
  targetUrl: string
  finalUrl: string
  requestedUrlSitemapIncluded: boolean
  finalUrlSitemapIncluded: boolean
  redirected: boolean
  html: string
}) {
  const issues: string[] = []
  const robots = `${input.xRobotsTag},${input.robotsMeta},${input.bingbotMeta}`.toLowerCase()

  if (input.status < 200 || input.status >= 300) {
    issues.push(`HTTP status is ${input.status}; Bing needs a stable 200 response for indexing.`)
  }

  if (robots.includes('noindex')) {
    issues.push('The page sends noindex through meta robots, bingbot meta, or x-robots-tag.')
  }

  if (input.redirected) {
    issues.push(`The requested URL redirects or resolves to another URL: ${input.finalUrl}`)
  }

  if (input.canonical && normalizeComparableUrl(input.canonical) !== normalizeComparableUrl(input.targetUrl)) {
    issues.push(`Canonical does not match the requested URL: ${input.canonical}`)
  }

  if (!input.requestedUrlSitemapIncluded) {
    issues.push('The requested URL is not present in the generated sitemap entries.')
  }

  if (input.redirected && input.finalUrlSitemapIncluded) {
    issues.push('The final URL is in the sitemap, but the requested URL is not the sitemap URL.')
  }

  if (!input.html || input.html.length < 1500) {
    issues.push('The HTML response is very small, which may look thin to crawlers.')
  }

  return issues
}

function normalizeComparableUrl(value: string) {
  try {
    const url = new URL(value, appConfig.url)
    url.hash = ''
    url.search = ''
    return url.toString().replace(/\/$/, '')
  } catch {
    return value.replace(/\/$/, '')
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return typeof error === 'string' ? error : 'Unknown fetch error'
}
