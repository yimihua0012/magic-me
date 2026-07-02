'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import AdminPageFrame from '@/components/admin/admin-page-frame'
import { useAdminAuth } from '@/components/admin/admin-auth'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import Input from '@/components/ui/input'
import { type Locale } from '@/lib/i18n'
import { AlertCircle, CheckCircle2, Edit3, PackagePlus, Plus, RefreshCw, RotateCw, Save, Search } from 'lucide-react'

export type AdminMaintenanceSection = 'styles' | 'users' | 'generations' | 'orders'

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

type MaintenanceResponse = {
  type: AdminMaintenanceSection
  title: string
  subtitle: string
  columns: TableColumn[]
  rows: AdminRow[]
  notes?: string[]
  pagination?: Pagination
}

type StyleEditState = {
  id: string
  name: string
  category: string
  prompt: string
  negative: string
  is_active: boolean
  category_order: number
  style_order: number
  localized_names: string
  localized_category_labels: string
}

type UserEditState = {
  id: string
  email: string
  full_name: string
  plan_type: string
  email_verified: boolean
  grant_plan_type: string
  grant_credits: number
  grant_validity_days: number
  grant_status: string
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

interface AdminMaintenancePageViewProps {
  locale?: Locale
  section: AdminMaintenanceSection
}

const fallback: Record<AdminMaintenanceSection, { title: string; subtitle: string }> = {
  styles: {
    title: 'Style Maintenance',
    subtitle: 'Create and edit style names, prompts, ordering, localization JSON, and active status.',
  },
  users: {
    title: 'User Credits',
    subtitle: 'Search users, edit profile fields, and grant manual credit packages.',
  },
  generations: {
    title: 'Generation Tasks',
    subtitle: 'Review generation tasks, progress, errors, and credit usage.',
  },
  orders: {
    title: 'Orders Payments',
    subtitle: 'Review and maintain payment-linked credit packages.',
  },
}

const planOptions = ['basic', 'pro', 'premium']
const packageStatuses = ['inactive', 'active', 'expired', 'depleted']

export default function AdminMaintenancePageView({ locale = 'en', section }: AdminMaintenancePageViewProps) {
  const { accessToken, isAuthorized, isCheckingAuth } = useAdminAuth(locale)
  const [data, setData] = useState<MaintenanceResponse | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [styleMode, setStyleMode] = useState<'create' | 'edit'>('edit')
  const [editingStyle, setEditingStyle] = useState<StyleEditState | null>(null)
  const [editingUser, setEditingUser] = useState<UserEditState | null>(null)
  const [editingPackage, setEditingPackage] = useState<PackageEditState | null>(null)
  const titles = fallback[section]

  const canSearch = section === 'users' || section === 'generations' || section === 'orders'
  const canPaginate = section !== 'styles'

  const loadData = useCallback(async (targetPage: number) => {
    if (!accessToken) return

    setIsLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({ type: section })
      if (query.trim()) params.set('query', query.trim())
      if (canPaginate) {
        params.set('page', String(targetPage))
        params.set('pageSize', String(pageSize))
      }

      const response = await fetch(`/api/admin/maintenance?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const nextData = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(typeof nextData.error === 'string' ? nextData.error : 'Failed to load maintenance data.')
      }

      setData(nextData as MaintenanceResponse)
      setPage(targetPage)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load maintenance data.')
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, canPaginate, pageSize, query, section])

  useEffect(() => {
    setPage(1)
    setEditingStyle(null)
    setEditingUser(null)
    setEditingPackage(null)
  }, [section])

  useEffect(() => {
    if (isAuthorized && accessToken) {
      void loadData(1)
    }
  }, [accessToken, isAuthorized, loadData])

  const selectedStyleRecord = useMemo(() => {
    if (!editingStyle || !data) return null
    return data.rows.find((row) => row.id === editingStyle.id) || null
  }, [data, editingStyle])

  const startCreateStyle = () => {
    setSuccess('')
    setError('')
    setStyleMode('create')
    setEditingStyle({
      id: '',
      name: '',
      category: '',
      prompt: '',
      negative: '',
      is_active: true,
      category_order: 0,
      style_order: 0,
      localized_names: '{}',
      localized_category_labels: '{}',
    })
  }

  const startEditStyle = (row: AdminRow) => {
    setSuccess('')
    setError('')
    setStyleMode('edit')
    setEditingStyle({
      id: String(row.id || ''),
      name: String(row.name || ''),
      category: String(row.category || ''),
      prompt: String(row.prompt || ''),
      negative: String(row.negative || ''),
      is_active: Boolean(row.is_active),
      category_order: Number(row.category_order || 0),
      style_order: Number(row.style_order || 0),
      localized_names: String(row.localized_names || '{}'),
      localized_category_labels: String(row.localized_category_labels || '{}'),
    })
  }

  const startEditUser = (row: AdminRow) => {
    setSuccess('')
    setError('')
    setEditingUser({
      id: String(row.userId || row.id || ''),
      email: String(row.email || ''),
      full_name: String(row.full_name || row.name || ''),
      plan_type: planOptions.includes(String(row.planType)) ? String(row.planType) : 'basic',
      email_verified: Boolean(row.email_verified),
      grant_plan_type: 'basic',
      grant_credits: 20,
      grant_validity_days: 30,
      grant_status: 'inactive',
    })
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
      await loadData(page)
      return true
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : 'Request failed.')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const saveStyle = async () => {
    if (!accessToken || !editingStyle) return

    let payload: Record<string, unknown>
    try {
      payload = {
        id: editingStyle.id.trim() || undefined,
        name: editingStyle.name,
        category: editingStyle.category,
        prompt: editingStyle.prompt,
        negative: editingStyle.negative,
        is_active: editingStyle.is_active,
        category_order: editingStyle.category_order,
        style_order: editingStyle.style_order,
        localized_names: parseJsonField(editingStyle.localized_names, 'localized_names'),
        localized_category_labels: parseJsonField(editingStyle.localized_category_labels, 'localized_category_labels'),
      }
    } catch (validationError) {
      setError(validationError instanceof Error ? validationError.message : 'Invalid style data.')
      return
    }

    const request = styleMode === 'create'
      ? fetch('/api/admin/maintenance/styles', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      : fetch('/api/admin/maintenance/styles', {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingStyle.id, updates: payload }),
      })

    const ok = await runMutation(request, styleMode === 'create' ? 'Style created.' : 'Style saved.')
    if (ok) setEditingStyle(null)
  }

  const saveUser = async () => {
    if (!accessToken || !editingUser) return

    const ok = await runMutation(fetch('/api/admin/maintenance/users', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingUser.id,
        updates: {
          full_name: editingUser.full_name,
          plan_type: editingUser.plan_type,
          email_verified: editingUser.email_verified,
        },
      }),
    }), 'User saved.')
    if (ok) setEditingUser(null)
  }

  const grantCredits = async () => {
    if (!accessToken || !editingUser) return

    await runMutation(fetch('/api/admin/maintenance/users', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: editingUser.id,
        planType: editingUser.grant_plan_type,
        credits: editingUser.grant_credits,
        validityDays: editingUser.grant_validity_days,
        status: editingUser.grant_status,
      }),
    }), 'Credit package granted.')
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
    if (!accessToken) return

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
      title={data?.title || titles.title}
      subtitle={data?.subtitle || titles.subtitle}
      isCheckingAuth={isCheckingAuth}
      isAuthorized={isAuthorized}
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          {canSearch ? (
            <div className="flex w-full flex-col gap-2 sm:max-w-2xl sm:flex-row">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search email, user ID, task ID, or payment ID"
                className="min-h-[40px] py-2"
              />
              <Button variant="secondary" size="sm" onClick={() => void loadData(1)}>
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={startCreateStyle}>
              <Plus className="mr-2 h-4 w-4" />
              New Style
            </Button>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {canPaginate && (
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
            )}
            <Button variant="secondary" size="sm" onClick={() => void loadData(page)} disabled={isLoading}>
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

        {editingStyle && (
          <Card className="p-5 sm:p-6">
            <FormHeader title={styleMode === 'create' ? 'New Style' : 'Edit Style'} description={styleMode === 'create' ? 'Create a new selectable headshot style.' : editingStyle.id} onCancel={() => setEditingStyle(null)} />

            {selectedStyleRecord && styleMode === 'edit' && (
              <div className="mb-4 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500">
                Current selection count: {selectedStyleRecord.selection_count ?? 0}
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <Input label="ID" value={editingStyle.id} onChange={(event) => setEditingStyle((current) => current && { ...current, id: event.target.value })} disabled={styleMode === 'edit'} placeholder="Optional for new styles" />
              <Input label="Name" value={editingStyle.name} onChange={(event) => setEditingStyle((current) => current && { ...current, name: event.target.value })} />
              <Input label="Category" value={editingStyle.category} onChange={(event) => setEditingStyle((current) => current && { ...current, category: event.target.value })} />
              <Input label="Category Order" type="number" value={editingStyle.category_order} onChange={(event) => setEditingStyle((current) => current && { ...current, category_order: Number(event.target.value) })} />
              <Input label="Style Order" type="number" value={editingStyle.style_order} onChange={(event) => setEditingStyle((current) => current && { ...current, style_order: Number(event.target.value) })} />
            </div>

            <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={editingStyle.is_active} onChange={(event) => setEditingStyle((current) => current && { ...current, is_active: event.target.checked })} className="h-4 w-4 rounded border-slate-300" />
              Active
            </label>

            <div className="mt-4 grid gap-4">
              <Textarea label="Prompt" value={editingStyle.prompt} onChange={(value) => setEditingStyle((current) => current && { ...current, prompt: value })} rows={4} />
              <Textarea label="Negative Prompt" value={editingStyle.negative} onChange={(value) => setEditingStyle((current) => current && { ...current, negative: value })} rows={3} />
              <Textarea label="Localized Names JSON" value={editingStyle.localized_names} onChange={(value) => setEditingStyle((current) => current && { ...current, localized_names: value })} rows={3} />
              <Textarea label="Localized Category Labels JSON" value={editingStyle.localized_category_labels} onChange={(value) => setEditingStyle((current) => current && { ...current, localized_category_labels: value })} rows={3} />
            </div>

            <div className="mt-4">
              <Button onClick={() => void saveStyle()} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {styleMode === 'create' ? 'Create Style' : 'Save Style'}
              </Button>
            </div>
          </Card>
        )}

        {editingUser && (
          <Card className="p-5 sm:p-6">
            <FormHeader title="Edit User" description={`${editingUser.email} / ${editingUser.id}`} onCancel={() => setEditingUser(null)} />
            <div className="grid gap-4 md:grid-cols-3">
              <Input label="Full Name" value={editingUser.full_name} onChange={(event) => setEditingUser((current) => current && { ...current, full_name: event.target.value })} />
              <Select label="Plan Type" value={editingUser.plan_type} options={planOptions} onChange={(value) => setEditingUser((current) => current && { ...current, plan_type: value })} />
              <label className="flex items-end gap-2 pb-3 text-sm font-semibold text-slate-700">
                <input type="checkbox" checked={editingUser.email_verified} onChange={(event) => setEditingUser((current) => current && { ...current, email_verified: event.target.checked })} className="h-4 w-4 rounded border-slate-300" />
                Email Verified
              </label>
            </div>
            <div className="mt-4">
              <Button onClick={() => void saveUser()} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                Save User
              </Button>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <h3 className="mb-3 text-sm font-bold text-slate-900">Grant Credit Package</h3>
              <div className="grid gap-4 md:grid-cols-4">
                <Select label="Plan" value={editingUser.grant_plan_type} options={planOptions} onChange={(value) => setEditingUser((current) => current && { ...current, grant_plan_type: value })} />
                <Input label="Credits" type="number" value={editingUser.grant_credits} onChange={(event) => setEditingUser((current) => current && { ...current, grant_credits: Number(event.target.value) })} />
                <Input label="Validity Days" type="number" value={editingUser.grant_validity_days} onChange={(event) => setEditingUser((current) => current && { ...current, grant_validity_days: Number(event.target.value) })} />
                <Select label="Status" value={editingUser.grant_status} options={['inactive', 'active']} onChange={(value) => setEditingUser((current) => current && { ...current, grant_status: value })} />
              </div>
              <div className="mt-4">
                <Button variant="secondary" onClick={() => void grantCredits()} disabled={isLoading}>
                  <PackagePlus className="mr-2 h-4 w-4" />
                  Grant Package
                </Button>
              </div>
            </div>
          </Card>
        )}

        {editingPackage && (
          <Card className="p-5 sm:p-6">
            <FormHeader title="Edit Credit Package" description={`${editingPackage.user} / ${editingPackage.id}`} onCancel={() => setEditingPackage(null)} />
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

        <Card className="overflow-hidden">
          <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <h2 className="font-bold text-slate-900">Records</h2>
            {pagination && (
              <div className="text-sm text-slate-500">
                Page {pagination.page} / {pagination.totalPages}, total {pagination.total}
              </div>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  {(section === 'styles' || section === 'users' || section === 'orders') && <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-600">Action</th>}
                  {data?.columns.map((column) => (
                    <th key={column.key} className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-600">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {!data || data.rows.length === 0 ? (
                  <tr>
                    <td colSpan={(data?.columns.length || 1) + (section === 'styles' || section === 'users' || section === 'orders' ? 1 : 0)} className="px-4 py-8 text-center text-slate-500">
                      {isLoading ? 'Loading...' : 'No records'}
                    </td>
                  </tr>
                ) : (
                  data.rows.map((row, index) => (
                    <tr key={`${row.id || row.packageId || row.generationId || row.userId || 'row'}-${index}`} className="hover:bg-slate-50">
                      {(section === 'styles' || section === 'users' || section === 'orders') && (
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex gap-2">
                            {section === 'styles' && (
                              <Button variant="secondary" size="sm" onClick={() => startEditStyle(row)}>
                                <Edit3 className="mr-2 h-4 w-4" />
                                Edit
                              </Button>
                            )}
                            {section === 'users' && (
                              <Button variant="secondary" size="sm" onClick={() => startEditUser(row)}>
                                <Edit3 className="mr-2 h-4 w-4" />
                                Edit
                              </Button>
                            )}
                            {section === 'orders' && (
                              <>
                                <Button variant="secondary" size="sm" onClick={() => startEditPackage(row)}>
                                  <Edit3 className="mr-2 h-4 w-4" />
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => void renewPackage(String(row.packageId || row.id || ''))}>
                                  <RotateCw className="mr-2 h-4 w-4" />
                                  Renew
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      )}
                      {data.columns.map((column) => (
                        <td key={column.key} className="max-w-[300px] whitespace-nowrap px-4 py-3 text-slate-700">
                          <span className="block truncate">{String(row[column.key] ?? '-')}</span>
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
              <Button variant="secondary" size="sm" onClick={() => void loadData(Math.max(1, page - 1))} disabled={isLoading || page <= 1}>
                Previous
              </Button>
              <span className="text-sm font-semibold text-slate-600">{page}</span>
              <Button variant="secondary" size="sm" onClick={() => void loadData(Math.min(pagination.totalPages, page + 1))} disabled={isLoading || page >= pagination.totalPages}>
                Next
              </Button>
            </div>
          )}
        </Card>
      </div>
    </AdminPageFrame>
  )
}

function FormHeader({ title, description, onCancel }: { title: string; description: string; onCancel: () => void }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="break-all text-sm text-slate-500">{description}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
    </div>
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

function Textarea({
  label,
  value,
  onChange,
  rows,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rows: number
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 transition-all duration-200 placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </label>
  )
}

function parseJsonField(value: string, fieldName: string) {
  try {
    const parsed = JSON.parse(value || '{}')
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error(`${fieldName} must be a JSON object.`)
    }

    return parsed as Record<string, string>
  } catch {
    throw new Error(`${fieldName} must be valid JSON.`)
  }
}

function toDateTimeLocal(value: string) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}
