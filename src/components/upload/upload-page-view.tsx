'use client'

import { Suspense, useState, useCallback, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/localized-navbar'
import Footer from '@/components/layout/localized-footer'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import Modal from '@/components/ui/modal'
import { loginPathForReturn } from '@/lib/auth-return'
import { localePath, type Locale } from '@/lib/i18n'
import { formatUploadText, localizedUploadContent } from '@/lib/localized-upload-content'
import { withSource } from '@/lib/navigation-source'
import { PLANS, PlanType } from '@backend/config/plans'
import {
  Upload,
  X,
  Check,
  AlertCircle,
  Camera,
  Lightbulb,
  Loader2,
  Sparkles,
  ChevronRight,
  Coins,
  CheckCircle2,
} from 'lucide-react'

const AuthModal = dynamic(() => import('@/components/auth/auth-modal'), {
  loading: () => null,
  ssr: false,
})

interface PhotoValidation {
  file: File
  preview: string
  status: 'pending' | 'validating' | 'valid' | 'invalid'
  error?: string
}

interface CreditPackageSummaryItem {
  id: string
  plan_type?: string
  total_credits?: number
  remaining_credits: number
  status: 'inactive' | 'active' | 'expired' | 'depleted'
  purchased_at?: string
  activated_at?: string
  expires_at?: string
  validity_days: number
  created_at?: string
}

interface HeadshotStyle {
  id: string
  name: string
  category: string
  prompt: string
  negative: string
  selection_count?: number
}

const CATEGORY_LABELS: Record<string, string> = {
  professional: 'Professional',
  lifestyle: 'Lifestyle',
  artistic: 'Creative',
  seasonal: 'Seasonal',
}

const CATEGORY_ORDER = ['professional', 'lifestyle', 'artistic', 'seasonal']

function isUsableCreditPackage(pkg: CreditPackageSummaryItem) {
  const expiresAt = pkg.expires_at ? new Date(pkg.expires_at).getTime() : null
  return (
    pkg.remaining_credits > 0 &&
    pkg.status !== 'expired' &&
    (pkg.status === 'inactive' || pkg.status === 'active') &&
    (!expiresAt || expiresAt > Date.now())
  )
}

function hasUsableCredits(availableCredits: number, packages: CreditPackageSummaryItem[]) {
  return availableCredits > 0 && packages.some(isUsableCreditPackage)
}

function UploadLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
    </div>
  )
}

interface UploadContentProps {
  locale?: Locale
}

function UploadContent({ locale = 'en' }: UploadContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const content = localizedUploadContent[locale]
  const [photos, setPhotos] = useState<PhotoValidation[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showAuthRequired, setShowAuthRequired] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [availableCredits, setAvailableCredits] = useState<number>(0)
  const [nearestExpiresAt, setNearestExpiresAt] = useState<string | null>(null)
  const [creditPackages, setCreditPackages] = useState<CreditPackageSummaryItem[]>([])
  const [styles, setStyles] = useState<HeadshotStyle[]>([])
  const [isLoadingStyles, setIsLoadingStyles] = useState(true)
  const [isLoadingCredits, setIsLoadingCredits] = useState(true)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [showNoCreditsModal, setShowNoCreditsModal] = useState(false)
  const [showStyleLimitModal, setShowStyleLimitModal] = useState(false)
  const [showStylePicker, setShowStylePicker] = useState(false)
  const [selectedStyleIds, setSelectedStyleIds] = useState<string[]>([])
  const [stylesLoadFailed, setStylesLoadFailed] = useState(false)
  const hasShownNoCreditsModalRef = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadSectionRef = useRef<HTMLDivElement>(null)
  const uploadHref = localePath(locale, '/upload')
  const pricingHref = (source: string) => withSource(localePath(locale, '/pricing'), source)
  const redirectToLogin = useCallback(() => {
    router.push(loginPathForReturn(uploadHref, localePath(locale)))
  }, [locale, router, uploadHref])
  const promptForAuth = useCallback((required = false) => {
    if (locale === 'en') {
      if (required) {
        setShowAuthRequired(true)
      } else {
        setShowAuthModal(true)
      }
      return
    }

    redirectToLogin()
  }, [locale, redirectToLogin])

  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      setShowPaymentSuccess(true)
    }
  }, [searchParams])

  const applyCreditsData = useCallback((data: {
    availableCredits?: number
    nearestExpiresAt?: string | null
    packages?: CreditPackageSummaryItem[]
  }) => {
    const nextAvailableCredits = data.availableCredits || 0
    const nextPackages = Array.isArray(data.packages) ? data.packages : []

    setAvailableCredits(nextAvailableCredits)
    setNearestExpiresAt(data.nearestExpiresAt || null)
    setCreditPackages(nextPackages)

    if (!hasUsableCredits(nextAvailableCredits, nextPackages) && !hasShownNoCreditsModalRef.current) {
      hasShownNoCreditsModalRef.current = true
      setShowNoCreditsModal(true)
    }
  }, [])

  const loadStyles = useCallback(async () => {
    try {
      setIsLoadingStyles(true)
      setStylesLoadFailed(false)

      const res = await fetch(`/api/styles?locale=${locale}`)
      if (res.ok) {
        const data = await res.json()
        setStyles(Array.isArray(data.styles) ? data.styles : [])
      } else {
        setStyles([])
        setStylesLoadFailed(true)
      }
    } catch (error) {
      console.error('Failed to load styles:', error)
      setStylesLoadFailed(true)
    } finally {
      setIsLoadingStyles(false)
    }
  }, [locale])

  const fetchCredits = useCallback(async (accessToken?: string) => {
    try {
      setIsLoadingCredits(true)
      let token = accessToken

      if (!token) {
        const { supabase } = await import('@/lib/supabase/client')
        const { data: { session } } = await supabase.auth.getSession()
        token = session?.access_token
      }

      if (!token) {
        return
      }

      const res = await fetch('/api/credits', {
        headers: { 'Authorization': `Bearer ${token}` },
      })

      if (res.ok) {
        const data = await res.json()
        applyCreditsData(data)
      }
    } catch (e) {
      console.error('Failed to fetch credits:', e)
    } finally {
      setIsLoadingCredits(false)
    }
  }, [applyCreditsData])

  useEffect(() => {
    if (!showPaymentSuccess || !isAuthenticated) {
      return
    }

    let attempts = 0
    const maxAttempts = 6
    const interval = window.setInterval(() => {
      attempts += 1
      void fetchCredits()

      if (attempts >= maxAttempts) {
        window.clearInterval(interval)
      }
    }, 2000)

    return () => window.clearInterval(interval)
  }, [fetchCredits, showPaymentSuccess, isAuthenticated])

  useEffect(() => {
    let isMounted = true
    let subscription: { unsubscribe: () => void } | undefined

    const initUpload = async () => {
      void loadStyles()

      try {
        const { supabase } = await import('@/lib/supabase/client')
        const { data: { session } } = await supabase.auth.getSession()

        if (!isMounted) {
          return
        }

        if (session?.user && session.access_token) {
          setIsAuthenticated(true)
          setShowAuthModal(false)
          setShowAuthRequired(false)
          void fetchCredits(session.access_token)
        } else {
          setIsLoadingCredits(false)
          promptForAuth()
        }

        const authState = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user && session.access_token) {
            setIsAuthenticated(true)
            setShowAuthModal(false)
            setShowAuthRequired(false)
            void fetchCredits(session.access_token)
          } else {
            setIsAuthenticated(false)
          }
        })

        subscription = authState.data.subscription
      } catch {
        if (isMounted) {
          setIsLoadingCredits(false)
          promptForAuth()
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false)
        }
      }
    }

    void initUpload()

    return () => {
      isMounted = false
      subscription?.unsubscribe()
    }
  }, [fetchCredits, loadStyles, promptForAuth])

  const hasActiveCredits = hasUsableCredits(availableCredits, creditPackages)

  const validateImage = useCallback(async (file: File): Promise<{ valid: boolean; error?: string }> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(img.src)

        if (img.width < 200 || img.height < 200) {
          resolve({ valid: false, error: content.errors.faceSmall })
          return
        }

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve({ valid: true })
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        let brightness = 0
        let pixelCount = 0
        for (let i = 0; i < data.length; i += 4) {
          brightness += (data[i] + data[i + 1] + data[i + 2]) / 3
          pixelCount++
        }
        brightness /= pixelCount

        if (brightness < 40) {
          resolve({ valid: false, error: content.errors.tooDark })
          return
        }

        resolve({ valid: true })
      }

      img.onerror = () => {
        URL.revokeObjectURL(img.src)
        resolve({ valid: false, error: content.errors.loadFailed })
      }

      img.src = URL.createObjectURL(file)
    })
  }, [content.errors.faceSmall, content.errors.loadFailed, content.errors.tooDark])

  const handleFiles = useCallback(async (files: FileList) => {
    const newPhotos: PhotoValidation[] = []

    for (let i = 0; i < files.length && photos.length + newPhotos.length < 3; i++) {
      const file = files[i]
      if (!file.type.startsWith('image/')) continue
      if (file.size > 10 * 1024 * 1024) {
        newPhotos.push({
          file,
          preview: URL.createObjectURL(file),
          status: 'invalid',
          error: content.errors.tooLarge,
        })
        continue
      }

      const preview = URL.createObjectURL(file)
      newPhotos.push({
        file,
        preview,
        status: 'pending',
      })
    }

    setPhotos(prev => [...prev, ...newPhotos])

    for (let i = 0; i < newPhotos.length; i++) {
      const index = photos.length + i
      if (newPhotos[i].status === 'invalid') {
        continue
      }

      setPhotos(prev => prev.map((p, idx) => (idx === index ? { ...p, status: 'validating' } : p)))

      const validation = await validateImage(newPhotos[i].file)

      setPhotos(prev => prev.map((p, idx) => (
        idx === index
          ? { ...p, status: validation.valid ? 'valid' : 'invalid', error: validation.error }
          : p
      )))
    }
  }, [content.errors.tooLarge, photos.length, validateImage])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      void handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removePhoto = (index: number) => {
    setPhotos(prev => {
      const newPhotos = [...prev]
      URL.revokeObjectURL(newPhotos[index].preview)
      newPhotos.splice(index, 1)
      return newPhotos
    })
  }

  const toggleStyle = (styleId: string) => {
    setSelectedStyleIds(prev => {
      if (prev.includes(styleId)) {
        return prev.filter(id => id !== styleId)
      }

      const limit = availableCredits || 0
      if (limit > 0 && prev.length >= limit) {
        setShowStyleLimitModal(true)
        return prev
      }
      return [...prev, styleId]
    })
  }

  const validPhotos = photos.filter(p => p.status === 'valid')
  const canProceed = validPhotos.length >= 1
  const selectedStyles = styles.filter(style => selectedStyleIds.includes(style.id))
  const selectedStyleCount = selectedStyleIds.length
  const canPickStyles = hasActiveCredits && canProceed
  const styleGroups = CATEGORY_ORDER
    .map(category => ({
      category,
      label: content.categories[category] || CATEGORY_LABELS[category] || category,
      items: styles.filter(style => style.category === category),
    }))
    .filter(group => group.items.length > 0)
  const canGenerate = isAuthenticated && canProceed && hasActiveCredits && selectedStyleCount > 0 && !isLoadingCredits
  const shouldShowBuyCredits = isAuthenticated && !hasActiveCredits && !isLoadingCredits
  const creditStatusTitle = isLoadingCredits
    ? content.credits.checkingTitle
    : hasActiveCredits
      ? formatUploadText(content.credits.readyTitle, { credits: availableCredits })
      : content.credits.emptyTitle
  const creditStatusLabel = isLoadingCredits
    ? content.credits.checkingLabel
    : hasActiveCredits
      ? formatUploadText(content.credits.readyLabel, { credits: availableCredits })
      : content.credits.emptyLabel
  const expirationLabel = nearestExpiresAt
    ? new Date(nearestExpiresAt).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })
    : content.credits.noPackage
  const daysUntilExpiration = nearestExpiresAt
    ? Math.max(0, Math.ceil((new Date(nearestExpiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : null
  const latestCreditPackage = creditPackages
    .slice()
    .sort((a, b) => {
      const aTime = new Date(a.purchased_at || a.created_at || 0).getTime()
      const bTime = new Date(b.purchased_at || b.created_at || 0).getTime()
      return bTime - aTime
    })[0]
  const successCreditCount = latestCreditPackage?.remaining_credits || availableCredits
  const successTotalCredits = latestCreditPackage?.total_credits || successCreditCount
  const successValidityDays = latestCreditPackage?.validity_days
  const successValidityLabel = successValidityDays
    ? `${successValidityDays} ${successValidityDays === 1 ? content.credits.dayLeft : content.credits.daysLeft}`
    : content.paymentSuccess.notStarted
  const successPlanType = latestCreditPackage?.plan_type as PlanType | undefined
  const successPlanName = successPlanType && PLANS[successPlanType] ? PLANS[successPlanType].name : content.paymentSuccess.planNameFallback
  const successTimerMessage = latestCreditPackage?.status === 'active' && latestCreditPackage.expires_at
    ? formatUploadText(content.paymentSuccess.activeTimer, { date: new Date(latestCreditPackage.expires_at).toLocaleDateString(locale) })
    : successValidityDays
      ? formatUploadText(content.paymentSuccess.inactiveTimer, { days: successValidityDays })
      : content.paymentSuccess.defaultTimer
  const handleStartExperience = () => {
    setShowPaymentSuccess(false)
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => fileInputRef.current?.focus(), 300)
  }

  const handleProceed = () => {
    if (!isAuthenticated) {
      promptForAuth(true)
      return
    }

    if (!hasActiveCredits) {
      router.push(pricingHref(`upload_no_credits_${locale}`))
      return
    }

    if (canProceed && selectedStyleCount > 0) {
      const generationId = `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

      const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
      }

      void Promise.all(validPhotos.map(p => convertToBase64(p.file))).then(base64Photos => {
        localStorage.setItem('pending_generation_photos', JSON.stringify(base64Photos))
        localStorage.setItem('pending_generation_id', generationId)
        localStorage.setItem('pending_generation_style_ids', JSON.stringify(selectedStyleIds))
        router.push(localePath(locale, `/generate/${generationId}`))
      })
    }
  }

  if (isCheckingAuth) {
    return <UploadLoading />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar locale={locale} />

      {locale === 'en' && (
        <>
          <AuthModal
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            onSuccess={() => {
              setShowAuthModal(false)
              setIsAuthenticated(true)
              void fetchCredits()
            }}
          />

          <AuthModal
            isOpen={showAuthRequired}
            onClose={() => setShowAuthRequired(false)}
            onSuccess={() => {
              setShowAuthRequired(false)
              setIsAuthenticated(true)
              void fetchCredits()
            }}
          />
        </>
      )}

      <Modal
        isOpen={showNoCreditsModal}
        onClose={() => setShowNoCreditsModal(false)}
        title={content.noCredits.title}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {content.noCredits.text}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="w-full"
              onClick={() => {
                setShowNoCreditsModal(false)
                router.push(pricingHref(`upload_no_credits_modal_${locale}`))
              }}
            >
              {content.noCredits.buy}
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setShowNoCreditsModal(false)}
            >
              {content.noCredits.later}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showStyleLimitModal}
        onClose={() => setShowStyleLimitModal(false)}
        title={content.styleLimit.title}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            {formatUploadText(content.styleLimit.text, { credits: availableCredits })}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="w-full"
              onClick={() => {
                setShowStyleLimitModal(false)
                router.push(pricingHref(`upload_style_limit_${locale}`))
              }}
            >
              {content.styleLimit.buy}
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setShowStyleLimitModal(false)}
            >
              {content.styleLimit.close}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showStylePicker}
        onClose={() => setShowStylePicker(false)}
        title={content.picker.title}
        className="max-w-5xl"
      >
        <div className="space-y-5">
          <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-blue-900">
                {content.picker.intro}
              </p>
              <p className="text-xs text-blue-700">
                {formatUploadText(content.picker.creditHint, { credits: availableCredits })}
              </p>
            </div>
            <p className="text-sm font-semibold text-blue-900">
              {formatUploadText(content.picker.selected, { count: selectedStyleCount })}
            </p>
          </div>

          {isLoadingStyles ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : styleGroups.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              {content.picker.unavailable}
            </div>
          ) : (
            <div className="space-y-5">
              {!canPickStyles && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                  {content.picker.uploadFirst}
                </div>
              )}
              {styleGroups.map((group) => (
                <div key={group.category}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-blue-900">{group.label}</h3>
                    <span className="text-xs text-blue-600">{group.items.length} {content.picker.styles}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {group.items.map((style) => {
                      const selected = selectedStyleIds.includes(style.id)
                      const disabled = !canPickStyles || (!selected && availableCredits > 0 && selectedStyleCount >= availableCredits)
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => {
                            const isSelected = selectedStyleIds.includes(style.id)
                            if (!hasActiveCredits || !canProceed) return
                            if (!isSelected && selectedStyleCount >= availableCredits) {
                              setShowStyleLimitModal(true)
                              return
                            }
                            toggleStyle(style.id)
                          }}
                          disabled={disabled}
                          className={`rounded-xl border p-3 text-left transition-all ${
                            selected
                              ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                              : !canPickStyles
                                ? 'border-slate-200 bg-slate-50 opacity-70'
                                : selectedStyleCount >= availableCredits
                                  ? 'border-amber-300 bg-amber-50 hover:border-amber-400 hover:bg-amber-50'
                                  : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40'
                          } ${disabled ? 'cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900 text-sm truncate">{style.name}</p>
                              <div className="mt-2 flex items-center gap-2">
                                <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-blue-600"
                                    style={{
                                      width: `${Math.min(100, Math.max(18, (style.selection_count || 0) / 1.5))}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-[11px] text-slate-500 tabular-nums">
                                  {style.selection_count || 0}
                                </span>
                              </div>
                            </div>
                            {selected ? <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="sticky bottom-0 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 border-t border-slate-100 bg-white px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-slate-600">
              {selectedStyleCount > 0
                ? formatUploadText(content.picker.deducted, { count: selectedStyleCount })
                : content.picker.selectOne}
            </p>
            <Button onClick={() => setShowStylePicker(false)} disabled={selectedStyleCount === 0}>
              {content.picker.done}
            </Button>
          </div>
        </div>
      </Modal>

      <main className="pt-24 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {showPaymentSuccess && (
            <div className="mb-6 overflow-hidden rounded-2xl border border-emerald-200 bg-emerald-50 shadow-sm">
              <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                      {content.paymentSuccess.label}
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-emerald-950 sm:text-2xl">
                      {successCreditCount > 0
                        ? formatUploadText(content.paymentSuccess.titleWithCredits, { credits: successCreditCount })
                        : content.paymentSuccess.syncingTitle}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-800">
                      {successCreditCount > 0
                        ? formatUploadText(content.paymentSuccess.textWithCredits, {
                            planName: successPlanName,
                            totalCredits: successTotalCredits,
                            credits: successCreditCount,
                            timerMessage: successTimerMessage,
                          })
                        : content.paymentSuccess.syncingText}
                    </p>
                    <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                      <div className="rounded-xl bg-white/70 px-3 py-2">
                        <p className="text-xs text-emerald-700">{content.paymentSuccess.credits}</p>
                        <p className="font-bold text-emerald-950">{successCreditCount || availableCredits}</p>
                      </div>
                      <div className="rounded-xl bg-white/70 px-3 py-2">
                        <p className="text-xs text-emerald-700">{content.paymentSuccess.validity}</p>
                        <p className="font-bold text-emerald-950">
                          {successValidityLabel}
                        </p>
                      </div>
                      <div className="rounded-xl bg-white/70 px-3 py-2">
                        <p className="text-xs text-emerald-700">{content.paymentSuccess.timerStatus}</p>
                        <p className="font-bold text-emerald-950">
                          {latestCreditPackage?.status === 'active' ? content.paymentSuccess.started : content.paymentSuccess.notStarted}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
                  <Button
                    className="w-full sm:w-auto"
                    onClick={handleStartExperience}
                  >
                    {content.paymentSuccess.start}
                  </Button>
                  <button
                    onClick={() => setShowPaymentSuccess(false)}
                    className="inline-flex min-h-[44px] items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100"
                  >
                    {content.paymentSuccess.close}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-6 lg:gap-8 pt-4 sm:pt-6">
            <Card className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                    <Coins className="w-4 h-4 text-blue-600" />
                    {content.credits.status}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-blue-950">
                    {creditStatusTitle}
                  </h1>
                  <p className="mt-2 text-sm sm:text-base text-slate-600">
                    {content.credits.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
                  <div className="rounded-xl bg-blue-50 p-3">
                    <p className="text-xs text-blue-600 mb-1">{content.credits.status}</p>
                    <p className="font-semibold text-blue-950">{creditStatusLabel}</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-3">
                    <p className="text-xs text-blue-600 mb-1">{content.credits.expires}</p>
                    <p className="font-semibold text-blue-950">{expirationLabel}</p>
                    {daysUntilExpiration !== null && (
                      <p className="mt-0.5 text-xs text-blue-600">
                      {daysUntilExpiration} {daysUntilExpiration === 1 ? content.credits.dayLeft : content.credits.daysLeft}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <div ref={uploadSectionRef}>
                <Card className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-semibold">1</span>
                    <h2 className="font-semibold text-slate-900">{content.upload.title}</h2>
                  </div>

                  <p className="text-sm text-slate-600 mb-4">
                    {content.upload.description}{' '}
                    <span className="font-medium text-blue-700">{content.upload.note}</span>
                  </p>

                  <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                      {isLoadingCredits ? (
                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center">
                          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{content.upload.loadingTitle}</h3>
                          <p className="text-slate-600">{content.upload.loadingText}</p>
                        </div>
                      ) : hasActiveCredits ? (
                        <div
                          className={`border-2 border-dashed rounded-2xl min-h-[360px] p-6 sm:p-8 text-center transition-all duration-200 flex items-center justify-center ${
                            isDragging
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'
                          }`}
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => e.target.files && void handleFiles(e.target.files)}
                          />

                          <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <Upload className="w-7 h-7 sm:w-8 sm:h-8 text-primary-600" />
                            </div>
                            <p className="text-slate-900 font-medium mb-1 text-sm sm:text-base">
                              {content.upload.dropTitle}
                            </p>
                            <p className="text-slate-500 text-xs sm:text-sm mb-4">
                              {content.upload.browse}
                            </p>
                            <p className="text-xs text-slate-400">
                              {content.upload.fileHint}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{content.upload.unavailableTitle}</h3>
                          <p className="text-slate-600 mb-4">{content.upload.unavailableText}</p>
                          <Button onClick={() => router.push(pricingHref(`upload_empty_credits_panel_${locale}`))}>
                            {content.upload.buy}
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-xl bg-yellow-50 p-4">
                        <h3 className="font-semibold text-yellow-800 mb-1 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-600" />
                          {content.upload.tipTitle}
                        </h3>
                        <p className="text-sm text-yellow-800">
                          {content.upload.tipText}{' '}
                          <span className="font-semibold text-red-700">{content.upload.tipWarning}</span>
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                          <span>{content.upload.preview}</span>
                          <span>{formatUploadText(content.upload.photoCount, { count: photos.length })}</span>
                        </div>
                        {photos.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-400 text-center">
                            {content.upload.emptyPreview}
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-3 sm:gap-4">
                            {photos.map((photo, index) => (
                              <div key={index} className="relative">
                                <div className="aspect-square rounded-xl overflow-hidden bg-slate-200">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={photo.preview}
                                    alt={`Upload ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>

                                {photo.status === 'validating' && (
                                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                                    <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                                  </div>
                                )}

                                {photo.status === 'valid' && (
                                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center shadow-lg animate-bounce-in">
                                    <Check className="w-4 h-4 text-white" />
                                  </div>
                                )}

                                {photo.status === 'invalid' && (
                                  <div className="absolute inset-0 bg-red-50/90 flex flex-col items-center justify-center p-2 rounded-xl">
                                    <AlertCircle className="w-6 h-6 text-red-500 mb-1" />
                                    <p className="text-xs text-red-600 text-center">{photo.error}</p>
                                  </div>
                                )}

                                <button
                                  onClick={() => removePhoto(index)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"
                                >
                                  <X className="w-4 h-4 text-white" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-semibold">2</span>
                    <h2 className="font-semibold text-slate-900">{content.styles.title}</h2>
                  <span className="text-sm text-slate-500">
                    {isLoadingStyles ? content.styles.loading : formatUploadText(content.styles.total, { count: styles.length })}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  {content.styles.description}
                </p>

                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    onClick={() => setShowStylePicker(true)}
                    disabled={isLoadingStyles}
                  >
                    {content.styles.select}
                  </Button>
                  {!canProceed && (
                    <p className="text-sm text-slate-500">
                      {content.styles.uploadFirst}
                    </p>
                  )}
                  {stylesLoadFailed && (
                    <p className="text-sm text-amber-600">
                      {content.styles.failed}
                    </p>
                  )}
                </div>

                <div className={`${canPickStyles ? '' : 'opacity-60'}`}>
                  <div className="mb-3 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 border border-blue-200">
                    <div>
                      <p className="text-sm font-semibold text-blue-900">{content.styles.selectedTitle}</p>
                      <p className="text-xs text-blue-700">{content.styles.selectedHint}</p>
                    </div>
                    <p className="text-sm font-semibold text-blue-900">{formatUploadText(content.styles.selected, { count: selectedStyleCount })}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    {selectedStyles.length === 0 ? (
                      <p className="text-sm text-slate-500">
                        {content.styles.none}
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedStyles.map((style) => (
                          <span
                            key={style.id}
                            className="inline-flex min-h-[36px] items-center gap-2 rounded-full bg-blue-50 py-1 pl-3 pr-1 text-xs font-medium text-blue-700"
                          >
                            {style.name}
                            <button
                              type="button"
                              onClick={() => setSelectedStyleIds((prev) => prev.filter((styleId) => styleId !== style.id))}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-blue-500 transition-colors hover:bg-blue-100 hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                              aria-label={`${content.upload.remove} ${style.name}`}
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                  <span className="text-slate-700">
                    {formatUploadText(content.styles.selectedCount, { selected: selectedStyleCount, available: availableCredits || 0 })}
                  </span>
                  <span className={selectedStyleCount > 0 ? 'text-blue-700 font-medium' : 'text-slate-500'}>
                    {selectedStyleCount > 0
                      ? formatUploadText(content.styles.willDeduct, { count: selectedStyleCount })
                      : content.styles.selectToContinue}
                  </span>
                </div>
                {availableCredits > 0 && (
                  <p className="mt-2 text-xs text-slate-500">
                    {formatUploadText(content.styles.left, { count: availableCredits - selectedStyleCount })}
                  </p>
                )}
              </Card>

              <Card className="p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-semibold">3</span>
                  <h2 className="font-semibold text-slate-900">{content.generate.title}</h2>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  {content.generate.description}
                </p>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{content.generate.photos}</span>
                    <span className="font-medium text-slate-900">{validPhotos.length}/3</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-slate-600">{content.generate.styles}</span>
                    <span className="font-medium text-slate-900">{selectedStyleCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-slate-600">{content.generate.creditsAfter}</span>
                    <span className="font-medium text-slate-900">{Math.max(0, availableCredits - selectedStyleCount)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    disabled={!canGenerate && !shouldShowBuyCredits}
                    onClick={handleProceed}
                    className="w-full sm:w-auto"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {shouldShowBuyCredits ? content.generate.buy : content.generate.generate}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  )
}

interface UploadPageViewProps {
  locale?: Locale
}

export function UploadPageView({ locale = 'en' }: UploadPageViewProps) {
  return (
    <Suspense fallback={<UploadLoading />}>
      <UploadContent locale={locale} />
    </Suspense>
  )
}
