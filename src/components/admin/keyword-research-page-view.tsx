'use client'

import { useMemo, useState } from 'react'
import AdminPageFrame from '@/components/admin/admin-page-frame'
import { useAdminAuth } from '@/components/admin/admin-auth'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { LOCALES, type Locale } from '@/lib/i18n'
import { BarChart3, CheckCircle2, Copy, Search, Sparkles, XCircle } from 'lucide-react'

interface KeywordResearchPageViewProps {
  locale?: Locale
}

type GoogleAdsKeywordMetric = {
  keyword: string
  avgMonthlySearches: number | null
  competition: string
  competitionIndex: number | null
}

const localeLabels: Record<Locale, string> = {
  en: 'English / US',
  es: 'Spanish / Spain',
  fr: 'French / France',
  de: 'German / Germany',
  ja: 'Japanese / Japan',
  zh: 'Simplified Chinese',
}

export default function KeywordResearchPageView({ locale = 'en' }: KeywordResearchPageViewProps) {
  const { accessToken, dashboardHref, isAuthorized, isCheckingAuth } = useAdminAuth(locale)
  const [query, setQuery] = useState('')
  const [targetLocale, setTargetLocale] = useState<Locale>(locale)
  const [suggestionsText, setSuggestionsText] = useState('')
  const [googleAdsMetrics, setGoogleAdsMetrics] = useState<GoogleAdsKeywordMetric[]>([])
  const [loadingAction, setLoadingAction] = useState<'related' | 'google' | 'bing' | 'google-ads' | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const suggestionCount = useMemo(
    () => suggestionsText.split('\n').map((item) => item.trim()).filter(Boolean).length,
    [suggestionsText],
  )

  const loadSuggestions = async () => {
    setError('')
    setMessage('')

    if (!query.trim()) {
      setError('Enter a keyword first.')
      return
    }

    if (!accessToken) {
      window.location.href = dashboardHref
      return
    }

    setLoadingAction('related')

    try {
      const params = new URLSearchParams({
        q: query.trim(),
        locale: targetLocale,
      })
      const response = await fetch(`/api/admin/keyword-suggestions?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Could not load related keywords.')
      }

      const suggestions = Array.isArray(data.suggestions)
        ? data.suggestions.filter((item: unknown): item is string => typeof item === 'string')
        : []

      setSuggestionsText(suggestions.join('\n'))
      setGoogleAdsMetrics([])
      const source = typeof data.source === 'string' ? data.source : 'search autocomplete'
      setMessage(`Loaded ${suggestions.length} related keywords from ${source}.`)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load related keywords.')
    } finally {
      setLoadingAction(null)
    }
  }

  const researchWithAi = async (engine: 'google' | 'bing') => {
    setError('')
    setMessage('')

    if (!query.trim()) {
      setError('Enter a keyword first.')
      return
    }

    if (!accessToken) {
      window.location.href = dashboardHref
      return
    }

    setLoadingAction(engine)

    try {
      const response = await fetch('/api/admin/keyword-suggestions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: query.trim(),
          locale: targetLocale,
          engine,
        }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Could not generate keyword research suggestions.')
      }

      const suggestions = Array.isArray(data.suggestions)
        ? data.suggestions.filter((item: unknown): item is string => typeof item === 'string')
        : []

      setSuggestionsText(suggestions.join('\n'))
      setGoogleAdsMetrics([])
      const source = typeof data.source === 'string' ? data.source : `AI ${engine} long-tail research`
      setMessage(`Generated ${suggestions.length} keyword candidates from ${source}. Verify traffic and competition before publishing.`)
    } catch (researchError) {
      setError(researchError instanceof Error ? researchError.message : 'Could not generate keyword research suggestions.')
    } finally {
      setLoadingAction(null)
    }
  }

  const loadGoogleAdsData = async () => {
    setError('')
    setMessage('')

    if (!query.trim()) {
      setError('Enter a keyword first.')
      return
    }

    if (!accessToken) {
      window.location.href = dashboardHref
      return
    }

    setLoadingAction('google-ads')

    try {
      const response = await fetch('/api/admin/keyword-suggestions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: query.trim(),
          locale: targetLocale,
          engine: 'google-ads',
        }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Could not load Google Ads keyword data.')
      }

      const rawMetrics: unknown[] = Array.isArray(data.metrics) ? data.metrics : []
      const metrics = rawMetrics.filter(isGoogleAdsKeywordMetric)
      setGoogleAdsMetrics(metrics)
      setSuggestionsText(metrics.map((item) => item.keyword).join('\n'))
      setMessage(`Loaded ${metrics.length} keyword ideas with Google Ads search metrics.`)
    } catch (googleAdsError) {
      setError(googleAdsError instanceof Error ? googleAdsError.message : 'Could not load Google Ads keyword data.')
    } finally {
      setLoadingAction(null)
    }
  }

  const copySuggestions = async () => {
    if (!suggestionsText.trim()) {
      setError('No related keywords to copy.')
      return
    }

    await navigator.clipboard.writeText(suggestionsText)
    setError('')
    setMessage(`Copied ${suggestionCount} related keywords.`)
  }

  return (
    <AdminPageFrame
      locale={locale}
      title="Keyword Research"
      subtitle="Use live autocomplete or AI-assisted Google and Bing long-tail research, then copy the candidates into your content workflow."
      isCheckingAuth={isCheckingAuth}
      isAuthorized={isAuthorized}
    >
      <div className="space-y-6">
        <Card className="p-5 sm:p-6">
          <div className="grid gap-3 lg:grid-cols-[180px_minmax(0,1fr)] lg:items-end">
            <label className="block text-sm font-semibold text-slate-700">
              Locale
              <select
                value={targetLocale}
                onChange={(event) => setTargetLocale(event.target.value as Locale)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {LOCALES.map((item) => (
                  <option key={item} value={item}>{localeLabels[item]}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Seed keyword
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    void loadSuggestions()
                  }
                }}
                placeholder="ai headshot, linkedin photo, resume photo"
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </label>

            <div className="flex flex-wrap gap-2 lg:col-start-2">
              <Button
                onClick={loadSuggestions}
                isLoading={loadingAction === 'related'}
                disabled={loadingAction !== null || !query.trim()}
                className="flex-1 sm:flex-none"
              >
              <Search className="mr-2 h-4 w-4" />
              Find Related
              </Button>
              <Button
                variant="secondary"
                onClick={() => void researchWithAi('google')}
                isLoading={loadingAction === 'google'}
                disabled={loadingAction !== null || !query.trim()}
                className="flex-1 sm:flex-none"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                AI Google Long-tail
              </Button>
              <Button
                variant="secondary"
                onClick={() => void researchWithAi('bing')}
                isLoading={loadingAction === 'bing'}
                disabled={loadingAction !== null || !query.trim()}
                className="flex-1 sm:flex-none"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                AI Bing Long-tail
              </Button>
              <Button
                variant="secondary"
                onClick={loadGoogleAdsData}
                isLoading={loadingAction === 'google-ads'}
                disabled={loadingAction !== null || !query.trim()}
                className="flex-1 sm:flex-none"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Google Ads Data
              </Button>
            </div>
          </div>
        </Card>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <XCircle className="mt-0.5 h-5 w-5 flex-none" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {message && (
          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" />
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}

        <Card className="p-5 sm:p-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Related Keywords</h2>
              <p className="text-sm text-slate-500">{suggestionCount} keywords ready to copy. AI candidates should be checked in a keyword tool before publishing.</p>
            </div>
            <Button variant="secondary" onClick={copySuggestions} disabled={!suggestionsText.trim()}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>

          <textarea
            value={suggestionsText}
            onChange={(event) => setSuggestionsText(event.target.value)}
            rows={14}
            placeholder="Related keywords will appear here, one per line."
            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm leading-6 text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </Card>

        {googleAdsMetrics.length > 0 && (
          <Card className="overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="text-lg font-bold text-slate-900">Google Ads Keyword Data</h2>
              <p className="mt-1 text-sm text-slate-500">Keyword Planner ideas for the selected language and market.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-3 sm:px-6">Keyword</th>
                    <th className="px-5 py-3 sm:px-6">Avg. monthly searches</th>
                    <th className="px-5 py-3 sm:px-6">Competition</th>
                    <th className="px-5 py-3 text-right sm:px-6">Competition index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {googleAdsMetrics.map((item) => (
                    <tr key={item.keyword}>
                      <td className="px-5 py-3 font-semibold text-slate-900 sm:px-6">{item.keyword}</td>
                      <td className="px-5 py-3 text-slate-700 sm:px-6">{formatMetricNumber(item.avgMonthlySearches)}</td>
                      <td className="px-5 py-3 text-slate-700 sm:px-6">{formatCompetition(item.competition)}</td>
                      <td className="px-5 py-3 text-right text-slate-700 sm:px-6">{formatMetricNumber(item.competitionIndex)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </AdminPageFrame>
  )
}

function isGoogleAdsKeywordMetric(value: unknown): value is GoogleAdsKeywordMetric {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<GoogleAdsKeywordMetric>
  return (
    typeof item.keyword === 'string' &&
    typeof item.competition === 'string' &&
    (typeof item.avgMonthlySearches === 'number' || item.avgMonthlySearches === null) &&
    (typeof item.competitionIndex === 'number' || item.competitionIndex === null)
  )
}

function formatMetricNumber(value: number | null) {
  return value === null ? '—' : new Intl.NumberFormat().format(value)
}

function formatCompetition(value: string) {
  return value === 'UNAVAILABLE' ? '—' : value.charAt(0) + value.slice(1).toLowerCase()
}
