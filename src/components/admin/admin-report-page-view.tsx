'use client'

import { useCallback, useEffect, useState } from 'react'
import AdminPageFrame from '@/components/admin/admin-page-frame'
import { useAdminAuth } from '@/components/admin/admin-auth'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { type Locale } from '@/lib/i18n'
import { AlertCircle, CheckCircle2, Edit3, RefreshCw, RotateCw, Save, Search } from 'lucide-react'

export type AdminReport = 'generation-logs' | 'payment-audit' | 'conversion-events'

type TableColumn = {
  key: string
  label: string
}

type AdminRow = Record<string, string | number | boolean | null>

type Pagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

type ReportResponse = {
  type: AdminReport
  title: string
  subtitle: string
  columns: TableColumn[]
  rows: AdminRow[]
  notes?: string[]
  pagination?: Pagination
}

type PackageEditState = {
  id: string
  user: string
  plan_type: string
  total_credits: number
  remaining_credits: number
  status: string
  validity_days: number
  activated_at: string
  expires_at: string
}

interface AdminReportPageViewProps {
  locale?: Locale
  report: AdminReport
}

const reportFallback: Record<AdminReport, { title: string; subtitle: string }> = {
  'generation-logs': {
    title: 'Generation Records',
    subtitle: 'Review generation jobs, status, duration, errors, and credit usage.',
  },
  'payment-audit': {
    title: 'Payment Credit Audit',
    subtitle: 'Search, edit, renew, and audit purchases, credit packages, balances, and expiration.',
  },
  'conversion-events': {
    title: 'Conversion Event Records',
    subtitle: 'Review page views, CTA clicks, checkout intent, and related events.',
  },
}

const planOptions = ['basic', 'pro', 'premium']
const packageStatuses = ['inactive', 'active', 'expired', 'depleted']

export default function AdminReportPageView({ locale = 'en', report }: AdminReportPageViewProps) {
  const { accessToken, isAuthorized, isCheckingAuth } = useAdminAuth(locale)
  const [data, setData] = useState<ReportResponse | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [editingPackage, setEditingPackage] = useState<PackageEditState | null>(null)
  const fallback = reportFallback[report]

  const loadReport = useCallback(async (targetPage: number) => {
    if (!accessToken) return

    setIsLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        type: report,
        page: String(targetPage),
        pageSize: String(pageSize),
      })
      if (query.trim()) params.set('query', query.trim())

      const response = await fetch(`/api/admin/records?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const nextData = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(typeof nextData.error === 'string' ? nextData.error : 'Failed to load records.')
      }

      setData(nextData as ReportResponse)
      setPage(targetPage)
    } catch (reportError) {
      setError(reportError instanceof Error ? reportError.message : 'Failed to load records.')
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, pageSize, query, report])

  useEffect(() => {
    setPage(1)
    setEditingPackage(null)
  }, [report])

  useEffect(() => {
    if (isAuthorized && accessToken) {
      void loadReport(1)
    }
  }, [accessToken, isAuthorized, loadReport])

  const runMutation = async (request: Promise<Response>, successMessage: string) => {
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const response = await request
      const nextData = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(typeof nextData.error === 'string' ? nextData.error : 'Request failed.')
      }

      setSuccess(successMessage)
      await loadReport(page)
      return true
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : 'Request failed.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const startEditPackage = (row: AdminRow) => {
    setSuccess('')
    setError('')
    setEditingPackage({
      id: String(row.packageId || row.id || ''),
      user: String(row.user || row.userId || ''),
      plan_type: String(row.plan_type || row.plan || 'basic'),
      total_credits: Number(row.total_credits || 0),
      remaining_credits: Number(row.remaining_credits || 0),
      status: String(row.status || 'inactive'),
      validity_days: Number(row.validity_days || 0),
      activated_at: toDateTimeLocal(String(row.activated_at || '')),
      expires_at: toDateTimeLocal(String(row.expires_at || '')),
    })
  }

  const savePackage = async () => {
    if (!accessToken || !editingPackage) return

    const ok = await runMutation(fetch('/api/admin/maintenance/packages', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingPackage.id,
        updates: {
          plan_type: editingPackage.plan_type,
          total_credits: editingPackage.total_credits,
          remaining_credits: editingPackage.remaining_credits,
          status: editingPackage.status,
          validity_days: editingPackage.validity_days,
          activated_at: editingPackage.activated_at,
          expires_at: editingPackage.expires_at,
        },
      }),
    }), 'Package saved.')
    if (ok) setEditingPackage(null)
  }

  const renewPackage = async (packageId: string) => {
    if (!accessToken || !packageId) return

    await runMutation(fetch('/api/admin/maintenance/packages', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: packageId, action: 'renew' }),
    }), 'Package renewed.')
  }

  const pagination = data?.pagination

  return (
    <AdminPageFrame
      locale={locale}
      title={data?.title || fallback.title}
      subtitle={data?.subtitle || fallback.subtitle}
      isCheckingAuth={isCheckingAuth}
      isAuthorized={isAuthorized}
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex w-full flex-col gap-2 sm:max-w-2xl sm:flex-row">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search email, user ID, event, task ID, or payment ID"
              className="min-h-[40px] py-2"
            />
            <Button variant="secondary" size="sm" onClick={() => void loadReport(1)}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value))
                setPage(1)
              }}
              className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
              <option value={100}>100 / page</option>
            </select>
            <Button variant="secondary" size="sm" onClick={() => void loadReport(page)} disabled={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-none" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" />
            <p className="text-sm font-medium">{success}</p>
          </div>
        )}

        {editingPackage && (
          <Card className="p-5 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Edit Credit Package</h2>
                <p className="break-all text-sm text-slate-500">{editingPackage.user} / {editingPackage.id}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setEditingPackage(null)}>Cancel</Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <Select label="Plan Type" value={editingPackage.plan_type} options={planOptions} onChange={(value) => setEditingPackage((current) => current && { ...current, plan_type: value })} />
              <Input label="Total Credits" type="number" value={editingPackage.total_credits} onChange={(event) => setEditingPackage((current) => current && { ...current, total_credits: Number(event.target.value) })} />
              <Input label="Remaining Credits" type="number" value={editingPackage.remaining_credits} onChange={(event) => setEditingPackage((current) => current && { ...current, remaining_credits: Number(event.target.value) })} />
              <Input label="Validity Days" type="number" value={editingPackage.validity_days} onChange={(event) => setEditingPackage((current) => current && { ...current, validity_days: Number(event.target.value) })} />
              <Select label="Status" value={editingPackage.status} options={packageStatuses} onChange={(value) => setEditingPackage((current) => current && { ...current, status: value })} />
              <Input label="Activated At" type="datetime-local" value={editingPackage.activated_at} onChange={(event) => setEditingPackage((current) => current && { ...current, activated_at: event.target.value })} />
              <Input label="Expires At" type="datetime-local" value={editingPackage.expires_at} onChange={(event) => setEditingPackage((current) => current && { ...current, expires_at: event.target.value })} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => void savePackage()} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                Save Package
              </Button>
              <Button variant="secondary" onClick={() => void renewPackage(editingPackage.id)} disabled={isLoading}>
                <RotateCw className="mr-2 h-4 w-4" />
                Renew
              </Button>
            </div>
          </Card>
        )}

        {isLoading && !data ? (
          <Card className="p-8 text-center">
            <div className="mx-auto mb-4 h-8 w-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
            <p className="font-semibold text-slate-700">Loading records...</p>
          </Card>
        ) : data ? (
          <>
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              Showing {data.rows.length} records{pagination ? `, page ${pagination.page} / ${pagination.totalPages}, total ${pagination.total}` : ''}.
            </div>

            {data.notes && data.notes.length > 0 && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                {data.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            )}

            <Card className="overflow-hidden">
              <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
                <h2 className="font-bold text-slate-900">Recent Records</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {report === 'payment-audit' && <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-600">Action</th>}
                      {data.columns.map((column) => (
                        <th key={column.key} className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-600">
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {data.rows.length === 0 ? (
                      <tr>
                        <td colSpan={data.columns.length + (report === 'payment-audit' ? 1 : 0)} className="px-4 py-8 text-center text-slate-500">
                          No records yet
                        </td>
                      </tr>
                    ) : (
                      data.rows.map((row, index) => (
                        <tr key={`${row.eventId || row.generationId || row.packageId || 'row'}-${index}`} className="hover:bg-slate-50">
                          {report === 'payment-audit' && (
                            <td className="whitespace-nowrap px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="secondary" size="sm" onClick={() => startEditPackage(row)}>
                                  <Edit3 className="mr-2 h-4 w-4" />
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => void renewPackage(String(row.packageId || row.id || ''))}>
                                  <RotateCw className="mr-2 h-4 w-4" />
                                  Renew
                                </Button>
                              </div>
                            </td>
                          )}
                          {data.columns.map((column) => (
                            <td key={column.key} className="max-w-[280px] whitespace-nowrap px-4 py-3 text-slate-700">
                              <span className={column.key.includes('error') ? 'block max-w-[280px] truncate text-red-600' : 'block truncate'}>
                                {String(row[column.key] ?? '-')}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {pagination && (
                <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
                  <Button variant="secondary" size="sm" onClick={() => void loadReport(Math.max(1, page - 1))} disabled={isLoading || page <= 1}>
                    Previous
                  </Button>
                  <span className="text-sm font-semibold text-slate-600">{page}</span>
                  <Button variant="secondary" size="sm" onClick={() => void loadReport(Math.min(pagination.totalPages, page + 1))} disabled={isLoading || page >= pagination.totalPages}>
                    Next
                  </Button>
                </div>
              )}
            </Card>
          </>
        ) : null}
      </div>
    </AdminPageFrame>
  )
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  )
}

function toDateTimeLocal(value: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}
