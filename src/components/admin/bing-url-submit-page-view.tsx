'use client'

import { useMemo, useState } from 'react'
import AdminPageFrame from '@/components/admin/admin-page-frame'
import { useAdminAuth } from '@/components/admin/admin-auth'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { type Locale } from '@/lib/i18n'
import { CheckCircle2, Clock3, ExternalLink, KeyRound, Send, XCircle } from 'lucide-react'

type SubmitResult = {
  count: number
  submitted: string[]
  markedBlogPosts?: {
    count: number
    marked: string[]
    errors: string[]
  }
  siteUrl: string
  bingStatus: number
  bingResponse: unknown
}

const DEFAULT_INDEXNOW_HOST = 'magic-headshot.com'

type KeyCheckResult = {
  siteUrl: string
  status: number
  endpoint: string
  keyLocation: string
  keyMatches: boolean
}

type BlogUrlResult = {
  before: string
  count: number
  urls: string[]
  submittedToBing?: boolean
}

interface BingUrlSubmitPageViewProps {
  locale?: Locale
}

function parseUrlInput(value: string) {
  return value
    .split(/[\s,]+/)
    .map((url) => url.trim())
    .filter(Boolean)
}

function defaultBeforeValue() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

export default function BingUrlSubmitPageView({ locale = 'en' }: BingUrlSubmitPageViewProps) {
  const { accessToken, dashboardHref, isAuthorized, isCheckingAuth } = useAdminAuth(locale)
  const [urlsText, setUrlsText] = useState('')
  const [blogBefore, setBlogBefore] = useState(defaultBeforeValue)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingKey, setIsCheckingKey] = useState(false)
  const [isLoadingBlogUrls, setIsLoadingBlogUrls] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<SubmitResult | null>(null)
  const [keyCheckResult, setKeyCheckResult] = useState<KeyCheckResult | null>(null)
  const [blogUrlResult, setBlogUrlResult] = useState<BlogUrlResult | null>(null)

  const candidateCount = useMemo(() => new Set(parseUrlInput(urlsText)).size, [urlsText])

  const handleCheckKey = async () => {
    setError('')
    setKeyCheckResult(null)

    if (!accessToken) {
      window.location.href = dashboardHref
      return
    }

    setIsCheckingKey(true)
    try {
      const params = new URLSearchParams()
      params.set('host', DEFAULT_INDEXNOW_HOST)

      const response = await fetch(`/api/admin/bing-url-submissions?${params.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Bing API key check failed.')
      }

      setKeyCheckResult(data as KeyCheckResult)
    } catch (keyError) {
      setError(readableSubmitError(keyError))
    } finally {
      setIsCheckingKey(false)
    }
  }

  const handleFillBlogUrls = async () => {
    setError('')
    setResult(null)
    setBlogUrlResult(null)

    if (!accessToken) {
      window.location.href = dashboardHref
      return
    }

    setIsLoadingBlogUrls(true)

    try {
      const params = new URLSearchParams()
      params.set('action', 'blog-urls')
      if (blogBefore) params.set('before', new Date(blogBefore).toISOString())

      const response = await fetch(`/api/admin/bing-url-submissions?${params.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Could not load blog URLs.')
      }

      const urls = Array.isArray(data.urls)
        ? data.urls.filter((url: unknown): url is string => typeof url === 'string')
        : []

      setUrlsText(urls.join('\n'))
      setBlogUrlResult({
        before: typeof data.before === 'string' ? data.before : new Date().toISOString(),
        count: urls.length,
        urls,
      })
    } catch (blogUrlError) {
      setError(readableSubmitError(blogUrlError))
    } finally {
      setIsLoadingBlogUrls(false)
    }
  }

  const handleSubmit = async () => {
    setError('')
    setResult(null)

    const urls = parseUrlInput(urlsText)
    if (urls.length === 0) {
      setError('Enter at least one URL.')
      return
    }

    if (!accessToken) {
      window.location.href = dashboardHref
      return
    }

    setIsSubmitting(true)

    try {
      const host = DEFAULT_INDEXNOW_HOST
      const urlList = normalizeIndexNowUrls(urls, host)
      const indexNowRequest = {
        host,
        urlList,
      }

      const response = await fetch('/api/admin/bing-url-submissions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(indexNowRequest),
      })
      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Bing URL submission failed.')
      }

      setResult(data as SubmitResult)
    } catch (submitError) {
      setError(readableSubmitError(submitError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminPageFrame
      locale={locale}
      title="Bing URL Submit"
      subtitle="Submit one or many URLs to Bing Webmaster Tools from the admin area."
      isCheckingAuth={isCheckingAuth}
      isAuthorized={isAuthorized}
    >
      <div className="space-y-6">
        <Card className="p-5 sm:p-6">
          <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <label className="block text-sm font-semibold text-slate-700">
                Fill published blog URLs before
                <input
                  type="datetime-local"
                  value={blogBefore}
                  onChange={(event) => setBlogBefore(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </label>
              <Button
                variant="secondary"
                onClick={handleFillBlogUrls}
                isLoading={isLoadingBlogUrls}
                disabled={isLoadingBlogUrls}
                className="w-full lg:w-auto"
              >
                <Clock3 className="mr-2 h-4 w-4" />
                Fill Blog URLs
              </Button>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Loads published CMS blog URLs whose publish/update time is before the selected time and whose Bing submitted flag is still false.
            </p>
            {blogUrlResult && (
              <p className="mt-2 text-sm font-semibold text-green-700">
                Filled {blogUrlResult.count} unsubmitted blog URLs before {new Date(blogUrlResult.before).toLocaleString()}.
              </p>
            )}
          </div>

          <label htmlFor="bing-urls" className="mb-2 block text-sm font-semibold text-slate-700">
            URLs
          </label>
          <textarea
            id="bing-urls"
            value={urlsText}
            onChange={(event) => setUrlsText(event.target.value)}
            rows={12}
            placeholder={'https://www.example.com/page-1\nhttps://www.example.com/page-2'}
            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">Detected {candidateCount} URLs. Bing accepts up to 500 per batch.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="secondary"
                onClick={handleCheckKey}
                isLoading={isCheckingKey}
                disabled={isCheckingKey}
                className="w-full sm:w-auto"
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Check IndexNow Key
              </Button>
              <Button
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={candidateCount === 0 || isSubmitting}
                className="w-full sm:w-auto"
              >
                <Send className="mr-2 h-4 w-4" />
                Submit
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

        {result && (
          <Card className="p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">Submission Complete</h2>
                <p className="text-sm text-slate-500">
                  Bing returned {result.bingStatus}. Submitted {result.count} URLs.
                  {result.markedBlogPosts ? ` Marked ${result.markedBlogPosts.count} blog posts as submitted.` : ''}
                </p>
              </div>
            </div>

            <div className="mb-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
              Site: <span className="font-semibold text-slate-900">{result.siteUrl}</span>
            </div>

            <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {result.submitted.map((url) => (
                <li key={url}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    <span className="min-w-0 truncate">{url}</span>
                    <ExternalLink className="h-4 w-4 flex-none text-slate-400" />
                  </a>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {keyCheckResult && (
          <Card className="p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <div>
                <h2 className="text-xl font-bold text-slate-900">IndexNow Key Valid</h2>
                <p className="text-sm text-slate-500">
                  Key file returned {keyCheckResult.status} for {keyCheckResult.siteUrl}.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <ResultMetric label="Key file" value={keyCheckResult.keyMatches ? 'Matched' : 'Mismatch'} />
              <ResultMetric label="Status" value={String(keyCheckResult.status)} />
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-xs font-semibold uppercase text-slate-500">Key location</div>
                <div className="mt-1 break-all text-sm font-semibold text-slate-900">{keyCheckResult.keyLocation}</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AdminPageFrame>
  )
}

function normalizeIndexNowUrls(urls: string[], host: string) {
  const baseUrl = `https://${host}`
  const seen = new Set<string>()
  const normalized: string[] = []

  for (const rawUrl of urls) {
    try {
      const url = new URL(rawUrl, baseUrl)
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

function ResultMetric({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="text-xs font-semibold uppercase text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-bold text-slate-900">{value || 'Unknown'}</div>
    </div>
  )
}

function readableSubmitError(error: unknown) {
  if (!(error instanceof Error)) {
    return 'Bing URL submission failed.'
  }

  if (/failed to fetch|networkerror|internet_disconnected|load failed/i.test(error.message)) {
    return 'Could not reach the submission API. Check your network connection and make sure the local server is running.'
  }

  return error.message
}
