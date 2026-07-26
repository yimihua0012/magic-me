import { NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'
import { generateAiText, isAiTextGenerationConfigured } from '@/lib/ai/text-generation'

export const dynamic = 'force-dynamic'

const BING_SUGGEST_ENDPOINT = 'https://api.bing.com/osjson.aspx'
const GOOGLE_SUGGEST_ENDPOINT = 'https://suggestqueries.google.com/complete/search'
const SUGGEST_TIMEOUT_MS = 12000
const MAX_KEYWORD_LENGTH = 160

const localeOptions = {
  en: { hl: 'en', gl: 'us', mkt: 'en-US' },
  es: { hl: 'es', gl: 'es', mkt: 'es-ES' },
  fr: { hl: 'fr', gl: 'fr', mkt: 'fr-FR' },
  de: { hl: 'de', gl: 'de', mkt: 'de-DE' },
  ja: { hl: 'ja', gl: 'jp', mkt: 'ja-JP' },
  zh: { hl: 'zh-CN', gl: 'cn', mkt: 'zh-CN' },
} as const

type LocaleKey = keyof typeof localeOptions
type SearchEngine = 'google' | 'bing'

type KeywordResearchBody = {
  keyword?: unknown
  locale?: unknown
  engine?: unknown
}

export async function GET(request: Request) {
  try {
    const authorizationError = await requireAdmin(request)
    if (authorizationError) return authorizationError

    const requestUrl = new URL(request.url)
    const query = requestUrl.searchParams.get('q')?.trim() || ''
    const locale = normalizeLocale(requestUrl.searchParams.get('locale'))

    if (!query) {
      return NextResponse.json({ error: 'Enter a keyword first.' }, { status: 400 })
    }
    if (query.length > MAX_KEYWORD_LENGTH) {
      return NextResponse.json({ error: `Keyword must be ${MAX_KEYWORD_LENGTH} characters or fewer.` }, { status: 400 })
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

export async function POST(request: Request) {
  try {
    const authorizationError = await requireAdmin(request)
    if (authorizationError) return authorizationError

    if (!isAiTextGenerationConfigured()) {
      return NextResponse.json(
        { error: 'Missing AI text provider key. Configure DEEPSEEK_KEY or QIANWEN_KEY on the server.' },
        { status: 500 },
      )
    }

    const body = await request.json().catch(() => null) as KeywordResearchBody | null
    const keyword = typeof body?.keyword === 'string' ? body.keyword.trim() : ''
    const locale = normalizeLocale(typeof body?.locale === 'string' ? body.locale : null)
    const engine = normalizeEngine(body?.engine)

    if (!keyword) {
      return NextResponse.json({ error: 'Enter a keyword first.' }, { status: 400 })
    }
    if (keyword.length > MAX_KEYWORD_LENGTH) {
      return NextResponse.json({ error: `Keyword must be ${MAX_KEYWORD_LENGTH} characters or fewer.` }, { status: 400 })
    }

    const result = await generateAiText({
      system: [
        'You are a practical SEO keyword researcher.',
        'Return only valid JSON. Do not use markdown fences or commentary outside JSON.',
        'You do not have live keyword-volume, ranking, or SERP data. Never claim that any keyword has verified traffic, exact search volume, or confirmed competition.',
        'Suggest plausible long-tail candidates with specific search intent and comparatively attainable competition based on wording, topic specificity, and user need.',
      ].join('\n'),
      user: buildAiKeywordResearchPrompt(keyword, locale, engine),
      temperature: 0.45,
    })
    const suggestions = readAiSuggestions(result.content, keyword)

    if (suggestions.length === 0) {
      return NextResponse.json({ error: 'The AI provider did not return usable keyword suggestions.' }, { status: 502 })
    }

    return NextResponse.json({
      query: keyword,
      locale,
      source: `AI ${engine} long-tail research (${result.provider})`,
      count: suggestions.length,
      suggestions,
      note: 'AI-generated candidates are directional. Verify search volume and competition in your analytics or keyword tool before publishing.',
    })
  } catch (error) {
    console.error('[Keyword Research] Error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Could not generate keyword research suggestions.',
    }, { status: 500 })
  }
}

function normalizeLocale(value: string | null): LocaleKey {
  return value && value in localeOptions ? value as LocaleKey : 'en'
}

function normalizeEngine(value: unknown): SearchEngine {
  return value === 'bing' ? 'bing' : 'google'
}

async function requireAdmin(request: Request) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return null
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

function buildAiKeywordResearchPrompt(keyword: string, locale: LocaleKey, engine: SearchEngine) {
  const languageNames: Record<LocaleKey, string> = {
    en: 'English (United States)',
    es: 'Spanish (Spain)',
    fr: 'French (France)',
    de: 'German (Germany)',
    ja: 'Japanese (Japan)',
    zh: 'Simplified Chinese (China)',
  }
  const engineName = engine === 'google' ? 'Google' : 'Bing'

  return [
    `Seed keyword: ${keyword}`,
    `Target language and market: ${languageNames[locale]}.`,
    `Research perspective: ${engineName} search.`,
    '',
    `Generate 18-24 unique long-tail keyword candidates people in this market could plausibly search on ${engineName}.`,
    'Prioritize specific, useful phrases with clear informational, commercial, or transactional intent.',
    'Favor less broad, lower-competition opportunities: concrete use case, audience, format, problem, requirement, comparison, or workflow.',
    'Keep every result tightly related to the seed keyword. Do not include unrelated topics, brand-only terms, keyword stuffing, or duplicate variants.',
    'Write each keyword naturally in the target language. Do not translate word-for-word from English.',
    'Do not include search volumes, numeric traffic estimates, ranks, or claims that the keywords are verified low competition.',
    '',
    'Return exactly this JSON object:',
    '{"suggestions":["keyword one","keyword two"]}',
  ].join('\n')
}

function readAiSuggestions(content: string, seedKeyword: string) {
  const parsed = parseJson(stripJsonFence(content))
  const rawSuggestions = parsed && typeof parsed === 'object' && Array.isArray((parsed as { suggestions?: unknown }).suggestions)
    ? (parsed as { suggestions: unknown[] }).suggestions
    : []
  const seen = new Set<string>()
  const normalizedSeed = seedKeyword.trim().toLocaleLowerCase()
  const suggestions: string[] = []

  for (const value of rawSuggestions) {
    if (typeof value !== 'string') continue
    const suggestion = value.replace(/\s+/g, ' ').trim()
    const comparisonKey = suggestion.toLocaleLowerCase()
    if (
      !suggestion ||
      suggestion.length > MAX_KEYWORD_LENGTH ||
      comparisonKey === normalizedSeed ||
      seen.has(comparisonKey)
    ) continue

    seen.add(comparisonKey)
    suggestions.push(suggestion)
    if (suggestions.length >= 24) break
  }

  return suggestions
}

function stripJsonFence(value: string) {
  return value.trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()
}

function parseJson(value: string): unknown {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}
