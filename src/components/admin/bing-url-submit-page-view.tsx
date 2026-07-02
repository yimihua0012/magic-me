'use client'

import { useMemo, useState } from 'react'
import AdminPageFrame from '@/components/admin/admin-page-frame'
import { useAdminAuth } from '@/components/admin/admin-auth'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { type Locale } from '@/lib/i18n'
import { CheckCircle2, ExternalLink, Send, XCircle } from 'lucide-react'

type SubmitResult = {
  count: number
  submitted: string[]
  siteUrl: string
  bingStatus: number
  bingResponse: unknown
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

export default function BingUrlSubmitPageView({ locale = 'en' }: BingUrlSubmitPageViewProps) {
  const { accessToken, dashboardHref, isAuthorized, isCheckingAuth } = useAdminAuth(locale)
  const [urlsText, setUrlsText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<SubmitResult | null>(null)

  const candidateCount = useMemo(() => new Set(parseUrlInput(urlsText)).size, [urlsText])

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
      const response = await fetch('/api/admin/bing-url-submissions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls }),
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
      </div>
    </AdminPageFrame>
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
