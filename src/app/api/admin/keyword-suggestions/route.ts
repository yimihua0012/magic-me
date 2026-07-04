import { NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

const BING_SUGGEST_ENDPOINT = 'https://api.bing.com/osjson.aspx'
const GOOGLE_SUGGEST_ENDPOINT = 'https://suggestqueries.google.com/complete/search'
const SUGGEST_TIMEOUT_MS = 12000

const localeOptions = {
  en: { hl: 'en', gl: 'us', mkt: 'en-US' },
  es: { hl: 'es', gl: 'es', mkt: 'es-ES' },
  fr: { hl: 'fr', gl: 'fr', mkt: 'fr-FR' },
  de: { hl: 'de', gl: 'de', mkt: 'de-DE' },
  ja: { hl: 'ja', gl: 'jp', mkt: 'ja-JP' },
} as const

type LocaleKey = keyof typeof localeOptions

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
    const query = requestUrl.searchParams.get('q')?.trim() || ''
    const locale = normalizeLocale(requestUrl.searchParams.get('locale'))

    if (!query) {
      return NextResponse.json({ error: 'Enter a keyword first.' }, { status: 400 })
    }

    const result = await getSearchSuggestions(query, locale)

    return NextResponse.json({
      query,
      locale,
      source: result.source,
      count: result.suggestions.length,
      suggestions: result.suggestions,
    })
  } catch (error) {
    console.error('[Keyword Suggestions] Error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Could not load keyword suggestions.',
    }, { status: 500 })
  }
}

function normalizeLocale(value: string | null): LocaleKey {
  return value && value in localeOptions ? value as LocaleKey : 'en'
}

async function getSearchSuggestions(query: string, locale: LocaleKey) {
  const errors: string[] = []

  try {
    const suggestions = await getBingSuggestions(query, locale)
    if (suggestions.length > 0) return { source: 'bing', suggestions }
  } catch (error) {
    errors.push(errorMessage(error))
  }

  try {
    const suggestions = await getGoogleSuggestions(query, locale)
    if (suggestions.length > 0) return { source: 'google', suggestions }
  } catch (error) {
    errors.push(errorMessage(error))
  }

  throw new Error(errors.length > 0 ? `Could not load keyword suggestions: ${errors.join('; ')}` : 'No keyword suggestions found.')
}

async function getBingSuggestions(query: string, locale: LocaleKey) {
  const params = new URLSearchParams({
    query,
    mkt: localeOptions[locale].mkt,
  })

  const response = await fetch(`${BING_SUGGEST_ENDPOINT}?${params.toString()}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 Magic-Headshot-Admin-Keyword-Research/1.0',
      Accept: 'application/json,text/plain,*/*',
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(SUGGEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new Error(`Bing Suggest returned ${response.status}`)
  }

  return parseSuggestionResponse(await response.json().catch(() => null))
}

async function getGoogleSuggestions(query: string, locale: LocaleKey) {
  const params = new URLSearchParams({
    client: 'firefox',
    q: query,
    hl: localeOptions[locale].hl,
    gl: localeOptions[locale].gl,
  })

  const response = await fetch(`${GOOGLE_SUGGEST_ENDPOINT}?${params.toString()}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 Magic-Headshot-Admin-Keyword-Research/1.0',
      Accept: 'application/json,text/plain,*/*',
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(SUGGEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    throw new Error(`Google Suggest returned ${response.status}`)
  }

  return parseSuggestionResponse(await response.json().catch(() => null))
}

function parseSuggestionResponse(data: unknown) {
  const rawSuggestions = Array.isArray(data) && Array.isArray(data[1]) ? data[1] : []
  const seen = new Set<string>()
  const suggestions: string[] = []

  for (const item of rawSuggestions) {
    if (typeof item !== 'string') continue
    const suggestion = item.trim()
    if (!suggestion || seen.has(suggestion.toLowerCase())) continue
    seen.add(suggestion.toLowerCase())
    suggestions.push(suggestion)
  }

  return suggestions
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return typeof error === 'string' ? error : 'Unknown error'
}
