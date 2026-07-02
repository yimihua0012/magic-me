'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import LocalizedNavbar from '@/components/layout/localized-navbar'
import LocalizedFooter from '@/components/layout/localized-footer'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import Input from '@/components/ui/input'
import { loginPathForReturn } from '@/lib/auth-return'
import { localePath, type Locale } from '@/lib/i18n'
import { AlertCircle, Boxes, Coins, CreditCard, ExternalLink, FileClock, Home, ImagePlus, RefreshCw, Search, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const PhotoToolsPanel = dynamic(() => import('@/components/dashboard/photo-tools-panel'), {
  ssr: false,
  loading: () => (
    <Card className="p-6 text-sm text-slate-500">
      Loading photo tools...
    </Card>
  ),
})

type UserRecordType = 'ledger' | 'orders' | 'generations' | 'packages'
type MyCenterSection = UserRecordType | 'photo-tools'

type TableColumn = {
  key: string
  label: string
}

type Pagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

type RecordsResponse = {
  type: UserRecordType
  title: string
  subtitle: string
  columns: TableColumn[]
  rows: Record<string, string | number | null>[]
  pagination: Pagination
}

interface UserRecordsPageViewProps {
  locale?: Locale
}

const recordTypes: UserRecordType[] = ['ledger', 'orders', 'generations', 'packages']

const menuItems: { type: MyCenterSection; label: string; icon: typeof Coins }[] = [
  { type: 'photo-tools', label: 'Photo Tools', icon: ImagePlus },
  { type: 'ledger', label: 'Credit Ledger', icon: Coins },
  { type: 'orders', label: 'Orders', icon: CreditCard },
  { type: 'generations', label: 'Generations', icon: Sparkles },
  { type: 'packages', label: 'Credit Packages', icon: Boxes },
]

function currentReturnTo() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

export default function UserRecordsPageView({ locale = 'en' }: UserRecordsPageViewProps) {
  const router = useRouter()
  const [activeType, setActiveType] = useState<MyCenterSection>('photo-tools')
  const [accessToken, setAccessToken] = useState('')
  const [data, setData] = useState<RecordsResponse | null>(null)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isDesktop, setIsDesktop] = useState(false)

  const dashboardHref = localePath(locale, '/dashboard')
  const generationHref = (id: string) => localePath(locale, `/generations/${id}`)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const updateDesktop = () => setIsDesktop(mediaQuery.matches)
    updateDesktop()
    mediaQuery.addEventListener('change', updateDesktop)
    return () => mediaQuery.removeEventListener('change', updateDesktop)
  }, [])

  useEffect(() => {
    if (!isDesktop) {
      setIsLoading(false)
      return
    }

    const initAuth = async () => {
      const { supabase } = await import('@/lib/supabase/client')
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.access_token) {
        router.push(loginPathForReturn(currentReturnTo(), dashboardHref))
        return
      }

      setAccessToken(session.access_token)
    }

    void initAuth()
  }, [dashboardHref, isDesktop, router])

  const loadRecords = useCallback(async (targetPage: number) => {
    if (!accessToken || !isRecordType(activeType)) return

    setIsLoading(true)
    setError('')

    try {
      const params = new URLSearchParams({
        type: activeType,
        page: String(targetPage),
        pageSize: String(pageSize),
      })
      if (query.trim()) params.set('query', query.trim())

      const response = await fetch(`/api/user/records?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      const nextData = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(typeof nextData.error === 'string' ? nextData.error : 'Failed to load records.')
      }

      setData(nextData as RecordsResponse)
      setPage(targetPage)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load records.')
    } finally {
      setIsLoading(false)
    }
  }, [accessToken, activeType, pageSize, query])

  useEffect(() => {
    setPage(1)
  }, [activeType, pageSize])

  useEffect(() => {
    if (accessToken && isRecordType(activeType)) {
      void loadRecords(1)
    } else if (accessToken) {
      setIsLoading(false)
    }
  }, [accessToken, activeType, loadRecords])

  const activeItem = useMemo(() => menuItems.find((item) => item.type === activeType) || menuItems[0], [activeType])
  const ActiveIcon = activeItem.icon
  const pagination = data?.pagination
  const isPhotoTools = activeType === 'photo-tools'

  return (
    <div className="min-h-screen bg-slate-50">
      {locale === 'en' ? <Navbar /> : <LocalizedNavbar locale={locale} />}

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-4 text-sm text-blue-900 lg:hidden">
            My Center is best viewed on desktop. Please use a computer to manage records, downloads, credit history, and print layouts.
          </div>

          {isDesktop && (
          <div className="hidden gap-6 lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <Card className="overflow-hidden">
                <div className="border-b border-slate-100 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <FileClock className="h-4 w-4 text-blue-600" />
                    My Center
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-500">Account records</p>
                </div>

                <nav className="flex gap-1 overflow-x-auto p-2 lg:block lg:space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    const active = item.type === activeType
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => {
                          setActiveType(item.type)
                          setData(null)
                          setError('')
                        }}
                        className={cn(
                          'flex min-w-max items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors lg:min-w-0 lg:w-full',
                          active ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                        )}
                      >
                        <Icon className="h-4 w-4 flex-none" />
                        {item.label}
                      </button>
                    )
                  })}
                </nav>

                <div className="border-t border-slate-100 p-2">
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Home className="h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </div>
              </Card>
            </aside>

            <section className="min-w-0">
              <div className="mb-6">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
                  <ActiveIcon className="h-4 w-4" />
                  My Center
                </div>
                <h1 className="text-3xl font-bold text-slate-900">{data?.title || activeItem.label}</h1>
                <p className="mt-2 max-w-3xl text-slate-600">
                  {isPhotoTools
                    ? 'Create downloadable ID photo sizes, background colors, and print sheets from your generated images.'
                    : data?.subtitle || 'Review your credits, orders, generation tasks, and package status.'}
                </p>
              </div>

              {isPhotoTools ? (
                <PhotoToolsPanel accessToken={accessToken} locale={locale} />
              ) : (
                <div className="space-y-6">
                <Card className="p-4 sm:p-5">
              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                    <ActiveIcon className="h-4 w-4" />
                    {data?.title || activeItem.label}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{data?.subtitle || 'Loading records...'}</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row xl:min-w-[560px]">
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search status, reference, task ID, or package ID"
                    className="min-h-[40px] py-2"
                  />
                  <Button variant="secondary" size="sm" onClick={() => void loadRecords(1)} disabled={!accessToken || isLoading}>
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => void loadRecords(page)} disabled={!accessToken || isLoading}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>
                </Card>

                {error && (
                  <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-none" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                <Card className="overflow-hidden">
              <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <h2 className="font-bold text-slate-900">Records</h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  {pagination && <span>Page {pagination.page} / {pagination.totalPages}, total {pagination.total}</span>}
                  <select
                    value={pageSize}
                    onChange={(event) => setPageSize(Number(event.target.value))}
                    className="min-h-[36px] rounded-lg border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-700"
                  >
                    <option value={10}>10 / page</option>
                    <option value={20}>20 / page</option>
                    <option value={50}>50 / page</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {activeType === 'generations' && <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-600">Action</th>}
                      {data?.columns.map((column) => (
                        <th key={column.key} className="whitespace-nowrap px-4 py-3 text-left font-semibold text-slate-600">
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {isLoading && !data ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-10 text-center text-slate-500">Loading...</td>
                      </tr>
                    ) : !data || data.rows.length === 0 ? (
                      <tr>
                        <td colSpan={(data?.columns.length || 1) + (activeType === 'generations' ? 1 : 0)} className="px-4 py-10 text-center text-slate-500">
                          No records
                        </td>
                      </tr>
                    ) : (
                      data.rows.map((row, index) => (
                        <tr key={`${row.reference || row.packageId || row.generationId || 'row'}-${index}`} className="hover:bg-slate-50">
                          {activeType === 'generations' && (
                            <td className="whitespace-nowrap px-4 py-3">
                              <Link href={generationHref(String(row.generationId || ''))}>
                                <Button variant="secondary" size="sm">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View
                                </Button>
                              </Link>
                            </td>
                          )}
                          {data.columns.map((column) => (
                            <td key={column.key} className="max-w-[320px] whitespace-nowrap px-4 py-3 text-slate-700">
                              <span className={column.key.includes('error') ? 'block truncate text-red-600' : 'block truncate'}>
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
                  <Button variant="secondary" size="sm" onClick={() => void loadRecords(Math.max(1, page - 1))} disabled={isLoading || page <= 1}>
                    Previous
                  </Button>
                  <span className="text-sm font-semibold text-slate-600">{page}</span>
                  <Button variant="secondary" size="sm" onClick={() => void loadRecords(Math.min(pagination.totalPages, page + 1))} disabled={isLoading || page >= pagination.totalPages}>
                    Next
                  </Button>
                </div>
              )}
                </Card>
                </div>
              )}
            </section>
          </div>
          )}
        </div>
      </main>

      {locale === 'en' ? <Footer /> : <LocalizedFooter locale={locale} />}
    </div>
  )
}

function isRecordType(value: MyCenterSection): value is UserRecordType {
  return recordTypes.includes(value as UserRecordType)
}
