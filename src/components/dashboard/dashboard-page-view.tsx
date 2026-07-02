'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import NextImage from 'next/image'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import LocalizedNavbar from '@/components/layout/localized-navbar'
import LocalizedFooter from '@/components/layout/localized-footer'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { loginPathForReturn } from '@/lib/auth-return'
import { localePath, type Locale } from '@/lib/i18n'
import { formatDashboardText, localizedDashboardContent } from '@/lib/localized-dashboard-content'
import {
  Camera,
  Clock,
  Download,
  Trash2,
  Plus,
  Image as ImageIcon,
  ExternalLink,
  Coins,
  AlertCircle,
} from 'lucide-react'

interface Generation {
  id: string
  status: 'completed' | 'processing' | 'failed'
  plan_type: string
  style_count: number
  created_at: string
  thumbnail?: string
  output_photos?: string[]
}

interface CreditPackageSummaryItem {
  id: string
  remaining_credits: number
  status: 'inactive' | 'active' | 'expired' | 'depleted'
  expires_at?: string
  validity_days?: number
}

function isUsableCreditPackage(pkg: CreditPackageSummaryItem) {
  const expiresAt = pkg.expires_at ? new Date(pkg.expires_at).getTime() : null
  return (
    pkg.remaining_credits > 0 &&
    pkg.status !== 'expired' &&
    (pkg.status === 'inactive' || pkg.status === 'active') &&
    (!expiresAt || expiresAt > Date.now())
  )
}

function currentReturnTo() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

interface DashboardPageViewProps {
  locale?: Locale
}

export default function DashboardPageView({ locale = 'en' }: DashboardPageViewProps) {
  const router = useRouter()
  const content = localizedDashboardContent[locale]
  const [generations, setGenerations] = useState<Generation[]>([])
  const [availableCredits, setAvailableCredits] = useState(0)
  const [nearestExpiresAt, setNearestExpiresAt] = useState<string | null>(null)
  const [creditPackages, setCreditPackages] = useState<CreditPackageSummaryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hydratedLocalRecords, setHydratedLocalRecords] = useState(false)

  const uploadHref = localePath(locale, '/upload')
  const dashboardHref = localePath(locale, '/dashboard')
  const generationHref = (id: string) => localePath(locale, `/generations/${id}`)

  useEffect(() => {
    const initDashboard = async () => {
      const { supabase } = await import('@/lib/supabase/client')
      const sessionPromise = supabase.auth.getSession()

      let localRecords: Generation[] = []
      try {
        const stored = localStorage.getItem('generation_records')
        if (stored) {
          localRecords = JSON.parse(stored)
          if (localRecords.length > 0) {
            setGenerations(localRecords)
          }
        }
      } catch {
      } finally {
        setHydratedLocalRecords(true)
      }

      const { data: { session } } = await sessionPromise

      if (!session?.user) {
        router.push(loginPathForReturn(currentReturnTo(), dashboardHref))
        return
      }

      try {
        const [generationsRes, creditsRes] = await Promise.all([
          fetch('/api/generations?limit=20', {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }),
          fetch('/api/credits', {
            headers: { Authorization: `Bearer ${session.access_token}` },
          }),
        ])

        if (generationsRes.ok) {
          const data = await generationsRes.json()
          const apiRecords: Generation[] = data.generations || []
          const apiIds = new Set(apiRecords.map((record) => record.id))
          const merged = [...apiRecords]

          localRecords.forEach((record) => {
            if (!apiIds.has(record.id)) {
              merged.push(record)
            }
          })

          merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          setGenerations(merged)
        }

        if (creditsRes.ok) {
          const creditData = await creditsRes.json()
          setAvailableCredits(creditData.availableCredits || 0)
          setNearestExpiresAt(creditData.nearestExpiresAt || null)
          setCreditPackages(Array.isArray(creditData.packages) ? creditData.packages : [])
        }
      } catch {
      } finally {
        setIsLoading(false)
      }
    }

    void initDashboard()
  }, [dashboardHref, router])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleDelete = async (id: string) => {
    if (confirm(content.deleteConfirm)) {
      const { supabase } = await import('@/lib/supabase/client')
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        router.push(loginPathForReturn(currentReturnTo(), dashboardHref))
        return
      }

      const res = await fetch(`/api/generations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (!res.ok) {
        alert(content.deleteFailed)
        return
      }

      const localStorageRecords = localStorage.getItem('generation_records')
      if (localStorageRecords) {
        try {
          const records = JSON.parse(localStorageRecords) as Generation[]
          const filteredRecords = records.filter((record) => record.id !== id)
          localStorage.setItem('generation_records', JSON.stringify(filteredRecords))
        } catch {
        }
      }

      setGenerations((prev) => prev.filter((generation) => generation.id !== id))
    }
  }

  const hasActiveCredits = availableCredits > 0 && creditPackages.some(isUsableCreditPackage)

  const expirationLabel = nearestExpiresAt
    ? new Date(nearestExpiresAt).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })
    : content.noActivePackage
  const daysUntilExpiration = nearestExpiresAt
    ? Math.max(0, Math.ceil((new Date(nearestExpiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : null
  const statusLabel = (status: Generation['status']) => {
    if (status === 'completed') return content.completed
    if (status === 'processing') return content.processing
    return content.failed
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {locale === 'en' ? <Navbar /> : <LocalizedNavbar locale={locale} />}

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{content.title}</h1>
              <p className="text-slate-600 mt-1">{content.subtitle}</p>
            </div>
            <Link href={uploadHref}>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {content.newGeneration}
              </Button>
            </Link>
          </div>

          <Card className="p-5 sm:p-6 mb-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                  <Coins className="w-4 h-4 text-blue-600" />
                  {content.creditStatus}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-950">
                  {hasActiveCredits ? formatDashboardText(content.creditsReady, { credits: availableCredits }) : content.noActiveCredits}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-slate-600">
                  {content.creditDescription}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
                <div className="rounded-xl bg-blue-50 p-3">
                  <p className="text-xs text-blue-600 mb-1">{content.status}</p>
                  <p className="font-semibold text-blue-950">
                    {hasActiveCredits ? formatDashboardText(content.imagesAvailable, { credits: availableCredits }) : content.needCredits}
                  </p>
                </div>
                <div className="rounded-xl bg-blue-50 p-3">
                  <p className="text-xs text-blue-600 mb-1">{content.expires}</p>
                  <p className="font-semibold text-blue-950">{expirationLabel}</p>
                  {daysUntilExpiration !== null && (
                    <p className="mt-0.5 text-xs text-blue-600">
                      {daysUntilExpiration} {daysUntilExpiration === 1 ? content.dayLeft : content.daysLeft}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {!hasActiveCredits && (
              <div className="mt-4 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-xl">
                <AlertCircle className="w-4 h-4" />
                <span>{content.generationDisabled}</span>
              </div>
            )}
          </Card>

          {isLoading && !hydratedLocalRecords ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="p-4 animate-pulse">
                  <div className="aspect-square bg-slate-200 rounded-xl mb-4" />
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </Card>
              ))}
            </div>
          ) : generations.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-slate-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">{content.noHeadshotsTitle}</h2>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                {content.noHeadshotsText}
              </p>
              <Link href={uploadHref}>
                <Button>
                  <Camera className="w-4 h-4 mr-2" />
                  {content.generateFirst}
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generations.map((gen) => (
                <Card key={gen.id} className="overflow-hidden group">
                  <div className="aspect-square bg-slate-200 relative">
                    {gen.thumbnail ? (
                      <NextImage
                        src={gen.thumbnail}
                        alt="Headshot"
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                        unoptimized
                      />
                    ) : gen.output_photos && gen.output_photos.length > 0 ? (
                      <NextImage
                        src={gen.output_photos[0]}
                        alt="Headshot"
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Camera className="w-12 h-12 text-slate-400" />
                      </div>
                    )}

                    {gen.status === 'processing' && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
                          <span className="text-sm">{content.processing}</span>
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <Link href={generationHref(gen.id)} aria-label={content.viewAll}>
                        <Button size="sm" className="bg-white text-slate-900 hover:bg-white">
                          <ExternalLink className="w-4 h-4" />
                          <span className="sr-only">{content.viewDetails}</span>
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                          gen.status === 'completed'
                            ? 'bg-accent-100 text-accent-700'
                            : gen.status === 'processing'
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {gen.status === 'completed' && <><span className="w-1.5 h-1.5 bg-accent-500 rounded-full" /> {statusLabel(gen.status)}</>}
                        {gen.status === 'processing' && <><span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" /> {statusLabel(gen.status)}</>}
                        {gen.status === 'failed' && <><span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> {statusLabel(gen.status)}</>}
                      </span>
                      <span className="text-xs text-slate-500">{gen.style_count} {content.styles}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(gen.created_at)}
                      </span>
                      <div className="flex gap-1">
                        <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-slate-600" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          onClick={() => handleDelete(gen.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {generations.length > 0 && (
            <div className="mt-8 text-center">
              <Link href={uploadHref}>
                <Button variant="secondary">
                  <Plus className="w-4 h-4 mr-2" />
                  {content.createNew}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      {locale === 'en' ? <Footer /> : <LocalizedFooter locale={locale} />}
    </div>
  )
}
