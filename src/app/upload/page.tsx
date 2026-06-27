'use client'

import { Suspense, useState, useCallback, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import Modal from '@/components/ui/modal'
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
import { supabase } from '@/lib/supabase/client'

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
  remaining_credits: number
  status: 'inactive' | 'active' | 'expired' | 'depleted'
  expires_at?: string
  validity_days: number
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

function UploadLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
    </div>
  )
}

function UploadContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [photos, setPhotos] = useState<PhotoValidation[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [showAuthRequired, setShowAuthRequired] = useState(false)
  const [availableCredits, setAvailableCredits] = useState<number>(0)
  const [nearestExpiresAt, setNearestExpiresAt] = useState<string | null>(null)
  const [creditPackages, setCreditPackages] = useState<CreditPackageSummaryItem[]>([])
  const [styles, setStyles] = useState<HeadshotStyle[]>([])
  const [isLoadingStyles, setIsLoadingStyles] = useState(true)
  const [isLoadingCredits, setIsLoadingCredits] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false)
  const [showNoCreditsModal, setShowNoCreditsModal] = useState(false)
  const [showStyleLimitModal, setShowStyleLimitModal] = useState(false)
  const [showStylePicker, setShowStylePicker] = useState(false)
  const [selectedStyleIds, setSelectedStyleIds] = useState<string[]>([])
  const [stylesLoadFailed, setStylesLoadFailed] = useState(false)
  const hasShownNoCreditsModalRef = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      setShowPaymentSuccess(true)
      setTimeout(() => setShowPaymentSuccess(false), 5000)
    }
  }, [searchParams])

  useEffect(() => {
    const loadStyles = async () => {
      try {
        setIsLoadingStyles(true)
        setStylesLoadFailed(false)
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.access_token) {
          setStyles([])
          setStylesLoadFailed(true)
          return
        }

        const res = await fetch('/api/styles', {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setStyles(Array.isArray(data.styles) ? data.styles : [])
        } else if (res.status === 401) {
          setStyles([])
          setStylesLoadFailed(true)
        }
      } catch (error) {
        console.error('Failed to load styles:', error)
        setStylesLoadFailed(true)
      } finally {
        setIsLoadingStyles(false)
      }
    }

    void loadStyles()
  }, [])

  const hasActiveCredits = availableCredits > 0 && creditPackages.some((pkg) => {
    const expiresAt = pkg.expires_at ? new Date(pkg.expires_at).getTime() : null
    return pkg.remaining_credits > 0 && pkg.status !== 'expired' && (pkg.status === 'inactive' || pkg.status === 'active') && (!expiresAt || expiresAt > Date.now())
  })

  const fetchCredits = async () => {
    try {
      setIsLoadingCredits(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) return

      const res = await fetch('/api/credits', {
        headers: { 'Authorization': `Bearer ${session.access_token}` },
      })

      if (res.ok) {
        const data = await res.json()
        setAvailableCredits(data.availableCredits || 0)
        setNearestExpiresAt(data.nearestExpiresAt || null)
        setCreditPackages(Array.isArray(data.packages) ? data.packages : [])

        const active = (data.availableCredits || 0) > 0 && (Array.isArray(data.packages) ? data.packages : []).some((pkg: CreditPackageSummaryItem) => {
          const expiresAt = pkg.expires_at ? new Date(pkg.expires_at).getTime() : null
          return pkg.remaining_credits > 0 && pkg.status !== 'expired' && (pkg.status === 'inactive' || pkg.status === 'active') && (!expiresAt || expiresAt > Date.now())
        })

        if (!active && !hasShownNoCreditsModalRef.current) {
          hasShownNoCreditsModalRef.current = true
          setShowNoCreditsModal(true)
        }
      }
    } catch (e) {
      console.error('Failed to fetch credits:', e)
    } finally {
      setIsLoadingCredits(false)
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setIsAuthenticated(true)
          setShowAuthModal(false)
          setShowAuthRequired(false)
          void fetchCredits()
        } else {
          setShowAuthModal(true)
        }
      } catch {
        setShowAuthModal(true)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    void checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true)
        setShowAuthModal(false)
        setShowAuthRequired(false)
        void fetchCredits()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const validateImage = async (file: File): Promise<{ valid: boolean; error?: string }> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(img.src)

        if (img.width < 200 || img.height < 200) {
          resolve({ valid: false, error: 'Face appears too small. Try moving closer or cropping the image.' })
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
          resolve({ valid: false, error: 'Image is too dark. Try taking your selfie near a window during daytime.' })
          return
        }

        resolve({ valid: true })
      }

      img.onerror = () => {
        URL.revokeObjectURL(img.src)
        resolve({ valid: false, error: 'Failed to load image' })
      }

      img.src = URL.createObjectURL(file)
    })
  }

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
          error: 'Image is too large. Use a photo under 10MB.',
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
  }, [photos.length])

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
  const selectedStyleCount = selectedStyles.length
  const canPickStyles = hasActiveCredits && canProceed
  const styleGroups = CATEGORY_ORDER
    .map(category => ({
      category,
      label: CATEGORY_LABELS[category] || category,
      items: styles.filter(style => style.category === category),
    }))
    .filter(group => group.items.length > 0)
  const canGenerate = isAuthenticated && canProceed && hasActiveCredits && selectedStyleCount > 0 && !isLoadingCredits
  const shouldShowBuyCredits = isAuthenticated && !hasActiveCredits && !isLoadingCredits
  const expirationLabel = nearestExpiresAt
    ? new Date(nearestExpiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'No active package'
  const daysUntilExpiration = nearestExpiresAt
    ? Math.max(0, Math.ceil((new Date(nearestExpiresAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
    : null

  const handleProceed = () => {
    if (!isAuthenticated) {
      setShowAuthRequired(true)
      return
    }

    if (!hasActiveCredits) {
      router.push('/pricing')
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
        router.push(`/generate/${generationId}`)
      })
    }
  }

  if (isCheckingAuth) {
    return <UploadLoading />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

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

      <Modal
        isOpen={showNoCreditsModal}
        onClose={() => setShowNoCreditsModal(false)}
        title="No credits remaining"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            You don&apos;t have any active credits. Buy credits to generate your professional headshots.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="w-full"
              onClick={() => {
                setShowNoCreditsModal(false)
                router.push('/pricing')
              }}
            >
              Buy Credits
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setShowNoCreditsModal(false)}
            >
              Later
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showStyleLimitModal}
        onClose={() => setShowStyleLimitModal(false)}
        title="Selection limit reached"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            You can only select up to {availableCredits} styles with your current credits.
            Buy more credits to add more styles.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              className="w-full"
              onClick={() => {
                setShowStyleLimitModal(false)
                router.push('/pricing')
              }}
            >
              Buy More Credits
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setShowStyleLimitModal(false)}
            >
              Got it
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showStylePicker}
        onClose={() => setShowStylePicker(false)}
        title="Select styles"
        className="max-w-5xl"
      >
        <div className="space-y-5">
          <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-blue-900">
                Select at least 1 style you want to continue.
              </p>
              <p className="text-xs text-blue-700">
                Each selected style uses 1 credit. You have {availableCredits} credits available.
              </p>
            </div>
            <p className="text-sm font-semibold text-blue-900">
              {selectedStyleCount} selected
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
              Styles are not available yet. Please refresh or log in again.
            </div>
          ) : (
            <div className="space-y-5">
              {!canPickStyles && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                  Upload one photo first. You can preview the styles now, then select after upload.
                </div>
              )}
              {styleGroups.map((group) => (
                <div key={group.category}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-blue-900">{group.label}</h3>
                    <span className="text-xs text-blue-600">{group.items.length} styles</span>
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
                ? `${selectedStyleCount} credits will be deducted.`
                : 'Select at least 1 style to continue.'}
            </p>
            <Button onClick={() => setShowStylePicker(false)} disabled={selectedStyleCount === 0}>
              Done
            </Button>
          </div>
        </div>
      </Modal>

      <main className="pt-24 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {showPaymentSuccess && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-emerald-700 font-medium">Payment successful!</p>
                <p className="text-emerald-600 text-sm">Your credits are now available.</p>
              </div>
              <button
                onClick={() => setShowPaymentSuccess(false)}
                className="ml-auto text-emerald-400 hover:text-emerald-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="grid gap-6 lg:gap-8 pt-4 sm:pt-6">
            <Card className="p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 text-sm text-blue-600 mb-2">
                    <Coins className="w-4 h-4 text-blue-600" />
                    Credit status
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-blue-950">
                    {hasActiveCredits ? `${availableCredits} credits ready` : 'No active credits'}
                  </h1>
                  <p className="mt-2 text-sm sm:text-base text-slate-600">
                    Upload a photo, choose styles, then generate and deduct by selection.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
                  <div className="rounded-xl bg-blue-50 p-3">
                    <p className="text-xs text-blue-600 mb-1">Status</p>
                    <p className="font-semibold text-blue-950">{hasActiveCredits ? `${availableCredits} images available` : 'Need credits'}</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-3">
                    <p className="text-xs text-blue-600 mb-1">Expires</p>
                    <p className="font-semibold text-blue-950">{expirationLabel}</p>
                    {daysUntilExpiration !== null && (
                      <p className="mt-0.5 text-xs text-blue-600">
                        {daysUntilExpiration} day{daysUntilExpiration === 1 ? '' : 's'} left
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-semibold">1</span>
                  <h2 className="font-semibold text-slate-900">Upload your photos</h2>
                </div>

                <p className="text-sm text-slate-600 mb-4">
                  Upload 1-3 clear selfies of the same person for better likeness.{' '}
                  <span className="font-medium text-blue-700">Works best for profile pics, but other uses may vary.</span>{' '}
                  More photos can improve consistency, but analysis and generation may take longer.
                </p>

                <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                  <div>
                    {hasActiveCredits ? (
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
                            Drag & drop your selfies here
                          </p>
                          <p className="text-slate-500 text-xs sm:text-sm mb-4">
                            or click to browse
                          </p>
                          <p className="text-xs text-slate-400">
                            JPG, PNG, or WebP. Up to 3 photos, 10MB each.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Generation is unavailable</h3>
                        <p className="text-slate-600 mb-4">Your credits are empty or expired. Please purchase a new package to continue.</p>
                        <Button onClick={() => router.push('/pricing')}>
                          Buy Credits
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-xl bg-yellow-50 p-4">
                      <h3 className="font-semibold text-yellow-800 mb-1 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-600" />
                        Pro Tip
                      </h3>
                      <p className="text-sm text-yellow-800">
                        Use the same person in every photo with clear lighting and a fully visible face.{' '}
                        <span className="font-semibold text-red-700">Avoid side angles, sunglasses, masks, or group photos.</span>{' '}
                        Take your selfies near a window during daytime for the best lighting.
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                        <span>Preview</span>
                        <span>{photos.length}/3 photos</span>
                      </div>
                      {photos.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-400 text-center">
                          Your uploaded photos will appear here.
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

              <Card className="p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-semibold">2</span>
                  <h2 className="font-semibold text-slate-900">Choose styles</h2>
                  <span className="text-sm text-slate-500">
                    {isLoadingStyles ? '(loading...)' : `(${styles.length} total)`}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Select at least 1 style you want to continue. Each selected style uses 1 credit.
                </p>

                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    onClick={() => setShowStylePicker(true)}
                    disabled={isLoadingStyles}
                  >
                    Select styles
                  </Button>
                  {!canProceed && (
                    <p className="text-sm text-slate-500">
                      Upload a photo first to unlock style selection.
                    </p>
                  )}
                  {stylesLoadFailed && (
                    <p className="text-sm text-amber-600">
                      Styles failed to load. Please refresh or log in again.
                    </p>
                  )}
                </div>

                {isLoadingStyles ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="h-20 rounded-xl bg-slate-100 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className={`${canPickStyles ? '' : 'opacity-60'}`}>
                    <div className="mb-3 flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3 border border-blue-200">
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Selected styles</p>
                        <p className="text-xs text-blue-700">Use the Select styles button to choose or change styles.</p>
                      </div>
                      <p className="text-sm font-semibold text-blue-900">{selectedStyleCount} selected</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      {selectedStyles.length === 0 ? (
                        <p className="text-sm text-slate-500">
                          No styles selected yet.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {selectedStyles.slice(0, 8).map((style) => (
                            <span
                              key={style.id}
                              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                            >
                              {style.name}
                            </span>
                          ))}
                          {selectedStyles.length > 8 && (
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                              +{selectedStyles.length - 8} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                  <span className="text-slate-700">
                    Selected {selectedStyleCount} / {availableCredits || 0} styles
                  </span>
                  <span className={selectedStyleCount > 0 ? 'text-blue-700 font-medium' : 'text-slate-500'}>
                    {selectedStyleCount > 0
                      ? `${selectedStyleCount} credits will be deducted`
                      : 'Select at least 1 style to continue'}
                  </span>
                </div>
                {availableCredits > 0 && (
                  <p className="mt-2 text-xs text-slate-500">
                    {availableCredits - selectedStyleCount} selections left with current credits. Buy more credits to add more styles.
                  </p>
                )}
              </Card>

              <Card className="p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-semibold">3</span>
                  <h2 className="font-semibold text-slate-900">Generate</h2>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Review your photos and style count, then generate. Credits are deducted only for the styles you selected.
                </p>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Photos</span>
                    <span className="font-medium text-slate-900">{validPhotos.length}/3</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-slate-600">Styles selected</span>
                    <span className="font-medium text-slate-900">{selectedStyleCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-slate-600">Credits after generate</span>
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
                    {shouldShowBuyCredits ? 'Buy Credits' : 'Generate Headshots'}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function UploadPage() {
  return (
    <Suspense fallback={<UploadLoading />}>
      <UploadContent />
    </Suspense>
  )
}
