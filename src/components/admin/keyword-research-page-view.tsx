'use client'

import { useMemo, useState } from 'react'
import AdminPageFrame from '@/components/admin/admin-page-frame'
import { useAdminAuth } from '@/components/admin/admin-auth'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { LOCALES, type Locale } from '@/lib/i18n'
import { CheckCircle2, Copy, Search, XCircle } from 'lucide-react'

interface KeywordResearchPageViewProps {
  locale?: Locale
}

const localeLabels: Record<Locale, string> = {
  en: 'English / US',
  es: 'Spanish / Spain',
  fr: 'French / France',
  de: 'German / Germany',
  ja: 'Japanese / Japan',
}

export default function KeywordResearchPageView({ locale = 'en' }: KeywordResearchPageViewProps) {
  const { accessToken, dashboardHref, isAuthorized, isCheckingAuth } = useAdminAuth(locale)
  const [query, setQuery] = useState('')
  const [targetLocale, setTargetLocale] = useState<Locale>(locale)
  const [suggestionsText, setSuggestionsText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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

    setIsLoading(true)

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
      const source = typeof data.source === 'string' ? data.source : 'search autocomplete'
      setMessage(`Loaded ${suggestions.length} related keywords from ${source}.`)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load related keywords.')
    } finally {
      setIsLoading(false)
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
      subtitle="Enter a seed keyword and pull Google-style related search suggestions into a copyable box."
      isCheckingAuth={isCheckingAuth}
      isAuthorized={isAuthorized}
    >
      <div className="space-y-6">
        <Card className="p-5 sm:p-6">
          <div className="grid gap-3 lg:grid-cols-[180px_minmax(0,1fr)_auto] lg:items-end">
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

            <Button onClick={loadSuggestions} isLoading={isLoading} disabled={isLoading || !query.trim()} className="w-full lg:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Find Related
            </Button>
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
              <p className="text-sm text-slate-500">{suggestionCount} keywords ready to copy.</p>
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
      </div>
    </AdminPageFrame>
  )
}
