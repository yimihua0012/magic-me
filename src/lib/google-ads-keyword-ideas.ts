import 'server-only'

import type { Locale } from '@/lib/i18n'

const GOOGLE_OAUTH_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
const DEFAULT_GOOGLE_ADS_API_VERSION = 'v25'
const REQUEST_TIMEOUT_MS = 45_000

type GoogleAdsConfig = {
  apiVersion: string
  developerToken: string
  customerId: string
  loginCustomerId: string
  clientId: string
  clientSecret: string
  refreshToken: string
}

type GoogleAdsTokenResponse = {
  access_token?: string
  error?: string
  error_description?: string
}

type GoogleAdsKeywordIdeaResponse = {
  results?: {
    text?: string
    keywordIdeaMetrics?: {
      avgMonthlySearches?: string | number
      competition?: string
      competitionIndex?: string | number
    }
  }[]
  error?: {
    message?: string
    details?: {
      errors?: {
        message?: string
        errorCode?: Record<string, string>
      }[]
    }[]
  }
}

type GoogleAdsAccessibleCustomersResponse = {
  resourceNames?: string[]
  error?: {
    message?: string
    details?: {
      errors?: {
        message?: string
        errorCode?: Record<string, string>
      }[]
    }[]
  }
}

export type GoogleAdsKeywordIdea = {
  keyword: string
  avgMonthlySearches: number | null
  competition: string
  competitionIndex: number | null
}

const localeTargeting: Record<Locale, { languageId: string; geoTargetId: string }> = {
  en: { languageId: '1000', geoTargetId: '2840' },
  es: { languageId: '1003', geoTargetId: '2724' },
  fr: { languageId: '1002', geoTargetId: '2250' },
  de: { languageId: '1001', geoTargetId: '2276' },
  ja: { languageId: '1005', geoTargetId: '2392' },
  zh: { languageId: '1017', geoTargetId: '2156' },
}

export function isGoogleAdsKeywordIdeasConfigured() {
  return Boolean(readGoogleAdsConfig())
}

export async function generateGoogleAdsKeywordIdeas(keyword: string, locale: Locale) {
  const config = readGoogleAdsConfig()
  if (!config) {
    throw new Error(
      'Google Ads keyword data is not configured. Add GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_CUSTOMER_ID, GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, and GOOGLE_ADS_REFRESH_TOKEN.',
    )
  }

  const accessToken = await getAccessToken(config)
  const targeting = localeTargeting[locale]
  const accessibleCustomerIds = await getAccessibleCustomerIds(config, accessToken)
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    'developer-token': config.developerToken,
    'Content-Type': 'application/json',
  }
  const targetIsDirectlyAccessible = accessibleCustomerIds.has(config.customerId)
  const managerIsDirectlyAccessible = Boolean(
    config.loginCustomerId && accessibleCustomerIds.has(config.loginCustomerId),
  )

  if (!targetIsDirectlyAccessible && !managerIsDirectlyAccessible) {
    throw new Error(
      'The OAuth Google account cannot access the configured Google Ads customer or manager account. Add that Google account in Google Ads > Admin > Access and security, then create a new refresh token.',
    )
  }

  if (!targetIsDirectlyAccessible && config.loginCustomerId) {
    headers['login-customer-id'] = config.loginCustomerId
  }

  const response = await fetchGoogle(
    `https://googleads.googleapis.com/${config.apiVersion}/customers/${config.customerId}:generateKeywordIdeas`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        keywordSeed: { keywords: [keyword] },
        language: `languageConstants/${targeting.languageId}`,
        geoTargetConstants: [`geoTargetConstants/${targeting.geoTargetId}`],
        keywordPlanNetwork: 'GOOGLE_SEARCH',
        includeAdultKeywords: false,
        pageSize: 50,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: 'no-store',
    },
    'Google Ads Keyword Planner',
  )

  const raw = await response.text()
  const payload = parseJson<GoogleAdsKeywordIdeaResponse>(raw)
  if (!response.ok) {
    const requestId = response.headers.get('request-id')
    console.error('[Google Ads Keyword Ideas] Keyword Planner API error:', {
      status: response.status,
      requestId,
      message: payload?.error?.message || null,
      details: payload?.error?.details || [],
    })
    throw new Error(readGoogleAdsError(payload, `Google Ads request failed with status ${response.status}.`, requestId))
  }

  const seen = new Set<string>()
  const ideas: GoogleAdsKeywordIdea[] = []
  for (const result of payload?.results || []) {
    const keywordText = typeof result.text === 'string' ? result.text.replace(/\s+/g, ' ').trim() : ''
    const key = keywordText.toLocaleLowerCase()
    if (!keywordText || seen.has(key)) continue
    seen.add(key)

    ideas.push({
      keyword: keywordText,
      avgMonthlySearches: readNumber(result.keywordIdeaMetrics?.avgMonthlySearches),
      competition: normalizeCompetition(result.keywordIdeaMetrics?.competition),
      competitionIndex: readNumber(result.keywordIdeaMetrics?.competitionIndex),
    })
  }

  return ideas.sort((left, right) => {
    const competitionDifference = competitionRank(left.competition) - competitionRank(right.competition)
    if (competitionDifference !== 0) return competitionDifference
    return (right.avgMonthlySearches || 0) - (left.avgMonthlySearches || 0)
  })
}

async function getAccessibleCustomerIds(config: GoogleAdsConfig, accessToken: string) {
  const response = await fetchGoogle(
    `https://googleads.googleapis.com/${config.apiVersion}/customers:listAccessibleCustomers`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'developer-token': config.developerToken,
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      cache: 'no-store',
    },
    'Google Ads account access check',
  )
  const payload = parseJson<GoogleAdsAccessibleCustomersResponse>(await response.text())
  if (!response.ok) {
    const requestId = response.headers.get('request-id')
    console.error('[Google Ads Keyword Ideas] Account access check error:', {
      status: response.status,
      requestId,
      message: payload?.error?.message || null,
      details: payload?.error?.details || [],
    })
    throw new Error(readGoogleAdsError(payload, `Google Ads account access check failed with status ${response.status}.`, requestId))
  }

  return new Set(
    (payload?.resourceNames || [])
      .map((resourceName) => resourceName.match(/^customers\/(\d+)$/)?.[1] || '')
      .filter(Boolean),
  )
}

function readGoogleAdsConfig(): GoogleAdsConfig | null {
  const developerToken = readEnvironment('GOOGLE_ADS_DEVELOPER_TOKEN')
  const loginCustomerId = normalizeCustomerId(readEnvironment('GOOGLE_ADS_LOGIN_CUSTOMER_ID'))
  const customerId = normalizeCustomerId(readEnvironment('GOOGLE_ADS_CUSTOMER_ID')) || loginCustomerId
  const clientId = readEnvironment('GOOGLE_ADS_CLIENT_ID')
  const clientSecret = readEnvironment('GOOGLE_ADS_CLIENT_SECRET') || readEnvironment('GOOGLE_SERVICE_Client_SECRET')
  const refreshToken = readEnvironment('GOOGLE_ADS_REFRESH_TOKEN')

  if (!developerToken || !customerId || !clientId || !clientSecret || !refreshToken) return null

  return {
    apiVersion: readEnvironment('GOOGLE_ADS_API_VERSION') || DEFAULT_GOOGLE_ADS_API_VERSION,
    developerToken,
    customerId,
    loginCustomerId,
    clientId,
    clientSecret,
    refreshToken,
  }
}

async function getAccessToken(config: GoogleAdsConfig) {
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    refresh_token: config.refreshToken,
    grant_type: 'refresh_token',
  })
  const response = await fetchGoogle(GOOGLE_OAUTH_TOKEN_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    cache: 'no-store',
  }, 'Google OAuth')
  const payload = parseJson<GoogleAdsTokenResponse>(await response.text())
  if (!response.ok || !payload?.access_token) {
    console.error('[Google Ads Keyword Ideas] OAuth token refresh error:', {
      status: response.status,
      error: payload?.error || null,
      message: payload?.error_description || null,
    })
    throw new Error(payload?.error_description || payload?.error || 'Could not refresh the Google Ads access token.')
  }

  return payload.access_token
}

function normalizeCustomerId(value: string) {
  return value.replace(/\D/g, '')
}

function readEnvironment(key: string) {
  return (process.env[key] || '').trim()
}

function normalizeCompetition(value: string | undefined) {
  const normalized = value?.replace(/^COMPETITION_/, '').trim()
  return normalized || 'UNAVAILABLE'
}

function competitionRank(value: string) {
  if (value === 'LOW') return 0
  if (value === 'MEDIUM') return 1
  if (value === 'HIGH') return 2
  return 3
}

function readNumber(value: string | number | undefined) {
  const numberValue = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(numberValue) ? numberValue : null
}

function readGoogleAdsError(
  payload: GoogleAdsKeywordIdeaResponse | GoogleAdsAccessibleCustomersResponse | null,
  fallback: string,
  requestId?: string | null,
) {
  const error = payload?.error?.details?.flatMap((detail) => detail.errors || [])[0]
  const errorCode = error?.errorCode
    ? Object.entries(error.errorCode).find(([, value]) => Boolean(value))?.[1]
    : ''
  const message = error?.message || payload?.error?.message || fallback
  const requestIdSuffix = requestId ? ` Request ID: ${requestId}.` : ''

  return `${errorCode ? `${errorCode}: ` : ''}${message}${requestIdSuffix}`
}

async function fetchGoogle(url: string, init: RequestInit, serviceName: string) {
  try {
    return await fetch(url, init)
  } catch (error) {
    console.error(`[Google Ads Keyword Ideas] ${serviceName} network request failed:`, error)
    throw new Error(
      `Could not reach ${serviceName} from this server. Check outbound HTTPS access to Google; local testing requires a system/global proxy or VPN that also covers Node.js.`,
    )
  }
}

function parseJson<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}
