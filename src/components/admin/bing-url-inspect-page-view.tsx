'use client'

import { useState } from 'react'
import AdminPageFrame from '@/components/admin/admin-page-frame'
import { useAdminAuth } from '@/components/admin/admin-auth'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { type Locale } from '@/lib/i18n'
import { AlertTriangle, CheckCircle2, ExternalLink, SearchCheck, XCircle } from 'lucide-react'

type InspectResult = {
  url: string
  finalUrl: string
  status: number
  ok: boolean
  responseTimeMs: number
  contentType: string
  title: string
  description: string
  keywords: string
  canonical: string
  robotsMeta: string
  bingbotMeta: string
  xRobotsTag: string
  sitemapIncluded: boolean
  requestedUrlSitemapIncluded?: boolean
  finalUrlSitemapIncluded?: boolean
  redirected?: boolean
  htmlBytes: number
  indexable: boolean
  issues: string[]
  bingInspectionUrl: string
}

interface BingUrlInspectPageViewProps {
  locale?: Locale
}

export default function BingUrlInspectPageView({ locale = 'en' }: BingUrlInspectPageViewProps) {
  const { accessToken, dashboardHref, isAuthorized, isCheckingAuth } = useAdminAuth(locale)
  const [url, setUrl] = useState('')
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<InspectResult | null>(null)

  const handleCheck = async () => {
    setError('')
    setResult(null)

    if (!url.trim()) {
      setError('Enter one URL to inspect.')
      return
    }

    if (!accessToken) {
      window.location.href = dashboardHref
      return
    }

    setIsChecking(true)
    try {
      const response = await fetch('/api/admin/bing-url-inspection', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'URL inspection failed.')
      }

      setResult(data as InspectResult)
    } catch (inspectError) {
      setError(inspectError instanceof Error ? inspectError.message : 'URL inspection failed.')
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <AdminPageFrame
      locale={locale}
      title="Bing URL Inspect"
      subtitle="Run a server-side crawl precheck before opening Bing Webmaster Tools URL Inspection."
      isCheckingAuth={isCheckingAuth}
      isAuthorized={isAuthorized}
    >
      <div className="space-y-6">
        <Card className="p-5 sm:p-6">
          <label htmlFor="bing-inspect-url" className="mb-2 block text-sm font-semibold text-slate-700">
            URL
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="bing-inspect-url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://magic-headshot.com/free-id-photo-tool"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Button onClick={handleCheck} isLoading={isChecking} disabled={isChecking || !url.trim()} className="sm:w-auto">
              <SearchCheck className="mr-2 h-4 w-4" />
              Check URL
            </Button>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            This checks crawl basics from our server. Use the Bing button in the result for the official Live URL Inspection.
          </p>
        </Card>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <XCircle className="mt-0.5 h-5 w-5 flex-none" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {result && (
          <Card className="p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                {result.indexable ? (
                  <CheckCircle2 className="mt-1 h-6 w-6 flex-none text-green-600" />
                ) : (
                  <AlertTriangle className="mt-1 h-6 w-6 flex-none text-amber-600" />
                )}
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {result.indexable ? 'Precheck Passed' : 'Review Needed'}
                  </h2>
                  <p className="mt-1 break-all text-sm text-slate-500">{result.finalUrl}</p>
                </div>
              </div>

              <a
                href={result.bingInspectionUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                Open Bing Inspection
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Metric label="HTTP" value={`${result.status}`} tone={result.ok ? 'good' : 'bad'} />
              <Metric label="Response" value={`${result.responseTimeMs} ms`} />
              <Metric label="Requested URL Sitemap" value={result.sitemapIncluded ? 'Included' : 'Missing'} tone={result.sitemapIncluded ? 'good' : 'bad'} />
              <Metric label="Redirect" value={result.redirected ? 'Changed' : 'No'} tone={result.redirected ? 'bad' : 'good'} />
              <Metric label="HTML" value={`${result.htmlBytes} bytes`} />
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              <Detail label="Requested URL" value={result.url} />
              <Detail label="Final URL" value={result.finalUrl} />
              <Detail label="Title" value={result.title || 'Not found'} />
              <Detail label="Description" value={result.description || 'Not found'} />
              <Detail label="Keywords" value={result.keywords || 'Not found'} />
              <Detail label="Canonical" value={result.canonical || 'Not found'} />
              <Detail label="Final URL sitemap" value={result.finalUrlSitemapIncluded ? 'Included' : 'Missing'} />
              <Detail label="Robots meta" value={result.robotsMeta || 'Not found'} />
              <Detail label="Bingbot meta" value={result.bingbotMeta || 'Not found'} />
              <Detail label="X-Robots-Tag" value={result.xRobotsTag || 'Not found'} />
              <Detail label="Content-Type" value={result.contentType || 'Not found'} />
            </dl>

            {result.issues.length > 0 && (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <h3 className="font-semibold text-amber-950">Issues</h3>
                <ul className="mt-2 space-y-2 text-sm text-amber-900">
                  {result.issues.map((issue) => (
                    <li key={issue}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}
      </div>
    </AdminPageFrame>
  )
}

function Metric({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: 'good' | 'bad' | 'neutral' }) {
  const toneClass = tone === 'good' ? 'text-green-700' : tone === 'bad' ? 'text-red-700' : 'text-slate-900'

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="text-xs font-semibold uppercase text-slate-500">{label}</div>
      <div className={`mt-1 text-lg font-bold ${toneClass}`}>{value}</div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <dt className="text-xs font-semibold uppercase text-slate-500">{label}</dt>
      <dd className="mt-1 break-all font-medium text-slate-800">{value}</dd>
    </div>
  )
}
