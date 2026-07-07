'use client'

import { useMemo, useState } from 'react'
import AdminPageFrame from '@/components/admin/admin-page-frame'
import { useAdminAuth } from '@/components/admin/admin-auth'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { CheckCircle2, Copy, ExternalLink, SearchCheck, Send, XCircle } from 'lucide-react'

type SubmitResult = {
  count: number
  submitted: string[]
  bingStatus: number
  siteUrl: string
}

const productionHost = 'magic-headshot.com'
const productionSiteUrl = `https://${productionHost}`
const sitemapUrls = [
  `${productionSiteUrl}/sitemap.xml`,
  `${productionSiteUrl}/sitemap-es.xml`,
  `${productionSiteUrl}/sitemap-fr.xml`,
  `${productionSiteUrl}/sitemap-de.xml`,
  `${productionSiteUrl}/sitemap-ja.xml`,
]
const defaultSitemapText = sitemapUrls.join('\n')
const googleSitemapConsoleUrl = `https://search.google.com/search-console/sitemaps?resource_id=${encodeURIComponent(`sc-domain:${productionHost}`)}`
const bingSitemapConsoleUrl = 'https://www.bing.com/webmasters/sitemaps'

function parseUrlInput(value: string) {
  return value
    .split(/[\s,]+/)
    .map((url) => url.trim())
    .filter(Boolean)
}

function normalizeSiteUrls(urls: string[]) {
  const seen = new Set<string>()

  return urls.flatMap((url) => {
    try {
      const parsed = new URL(url, productionSiteUrl)
      if (parsed.origin !== productionSiteUrl) return []
      parsed.hash = ''
      const normalized = parsed.toString()
      if (seen.has(normalized)) return []
      seen.add(normalized)
      return [normalized]
    } catch {
      return []
    }
  })
}

export default function SearchSubmissionPageView() {
  const { accessToken, dashboardHref, isAuthorized, isCheckingAuth } = useAdminAuth('en')
  const [sitemapText, setSitemapText] = useState(defaultSitemapText)
  const [isSubmittingBing, setIsSubmittingBing] = useState(false)
  const [isCopyingGoogle, setIsCopyingGoogle] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState<SubmitResult | null>(null)

  const normalizedUrls = useMemo(() => normalizeSiteUrls(parseUrlInput(sitemapText)), [sitemapText])

  const resetSitemaps = () => {
    setSitemapText(defaultSitemapText)
    setError('')
    setMessage('Filled all sitemap URLs.')
  }

  const submitBingSitemaps = async () => {
    setError('')
    setMessage('')
    setResult(null)

    if (!accessToken) {
      window.location.href = dashboardHref
      return
    }

    if (normalizedUrls.length === 0) {
      setError('No valid magic-headshot.com sitemap URLs found.')
      return
    }

    setIsSubmittingBing(true)

    try {
      const response = await fetch('/api/admin/bing-url-submissions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          host: productionHost,
          urlList: normalizedUrls,
        }),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Bing sitemap submission failed.')
      }

      setResult(data as SubmitResult)
      setMessage(`Submitted ${normalizedUrls.length} sitemap URL${normalizedUrls.length === 1 ? '' : 's'} to Bing.`)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not submit sitemaps to Bing.')
    } finally {
      setIsSubmittingBing(false)
    }
  }

  const copyGoogleSitemaps = async () => {
    setError('')
    setMessage('')
    setIsCopyingGoogle(true)

    try {
      await navigator.clipboard.writeText(normalizedUrls.join('\n'))
      setMessage('Copied sitemap URLs for Google Search Console.')
    } catch {
      setError('Could not copy sitemap URLs.')
    } finally {
      setIsCopyingGoogle(false)
    }
  }

  return (
    <AdminPageFrame
      title="Search Submission"
      subtitle="Submit or copy the full sitemap set for search engines."
      isCheckingAuth={isCheckingAuth}
      isAuthorized={isAuthorized}
    >
      <div className="space-y-6">
        {error && <Notice tone="error" message={error} />}
        {message && <Notice tone="success" message={message} />}

        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <SearchCheck className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900">All Sitemaps</h2>
              </div>
              <p className="mt-2 text-sm text-slate-600">All sitemap URLs are filled by default. Edit only if needed.</p>
            </div>
            <Button variant="secondary" onClick={resetSitemaps}>
              Fill All Sitemaps
            </Button>
          </div>

          <textarea
            value={sitemapText}
            onChange={(event) => setSitemapText(event.target.value)}
            className="min-h-40 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-xs leading-5 text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />

          <div className="mt-3 text-sm font-semibold text-slate-500">
            {normalizedUrls.length} valid sitemap URL{normalizedUrls.length === 1 ? '' : 's'}
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="p-5 sm:p-6">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900">Bing</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Submit the sitemap URL list through the existing Bing IndexNow endpoint.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={submitBingSitemaps} isLoading={isSubmittingBing} disabled={isSubmittingBing || normalizedUrls.length === 0}>
                <Send className="mr-2 h-4 w-4" />
                Submit Bing
              </Button>
              <a
                href={bingSitemapConsoleUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              >
                Bing Sitemaps
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
            {result && (
              <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                Bing accepted {result.count} URL{result.count === 1 ? '' : 's'} with status {result.bingStatus}.
              </div>
            )}
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900">Google</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Copy the sitemap URLs, then paste them in Google Search Console Sitemaps.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={copyGoogleSitemaps} isLoading={isCopyingGoogle} disabled={isCopyingGoogle || normalizedUrls.length === 0}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Sitemaps
              </Button>
              <a
                href={googleSitemapConsoleUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-xl border-2 border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              >
                Google Sitemaps
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </Card>
        </div>
      </div>
    </AdminPageFrame>
  )
}

function Notice({ tone, message }: { tone: 'success' | 'error'; message: string }) {
  const Icon = tone === 'success' ? CheckCircle2 : XCircle
  const classes = tone === 'success'
    ? 'border-green-200 bg-green-50 text-green-700'
    : 'border-red-200 bg-red-50 text-red-700'

  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${classes}`}>
      <Icon className="mt-0.5 h-5 w-5 flex-none" />
      <div className="text-sm font-semibold">{message}</div>
    </div>
  )
}
