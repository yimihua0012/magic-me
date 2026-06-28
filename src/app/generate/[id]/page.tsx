'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { PLANS } from '@backend/config/plans'
import dynamic from 'next/dynamic'
import { 
  Sparkles, 
  Download, 
  CheckCircle2,
  Loader2,
  Grid3X3,
  AlertCircle
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

const Modal = dynamic(() => import('@/components/ui/modal'), {
  ssr: false,
})

type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed'

interface GenerationState {
  id: string
  status: GenerationStatus
  progress: number
  currentStep: string
  outputPhotos: string[]
  styleCount: number
}

interface HeadshotStyle {
  id: string
  name: string
}

export default function GenerationPage() {
  const params = useParams()
  const router = useRouter()
  const generationId = params?.id as string
  
  const [generation, setGeneration] = useState<GenerationState>({
    id: generationId || '',
    status: generationId ? 'processing' : 'failed',
    progress: generationId ? 0 : 100,
    currentStep: generationId ? 'Initializing...' : 'Invalid generation ID',
    outputPhotos: [],
    styleCount: 0,
  })
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set())
  const [selectedStyleIds, setSelectedStyleIds] = useState<string[]>([])
  const [styles, setStyles] = useState<HeadshotStyle[]>([])
  const [showLightbox, setShowLightbox] = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState<number | null>(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [pendingCompletion, setPendingCompletion] = useState<{ progress: number; outputUrls: string[] } | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasStartedRef = useRef(false)

  useEffect(() => {
    let cleanupPolling: (() => void) | undefined
    let mounted = true

    const getAuthHeaders = async (): Promise<Record<string, string>> => {
      const { data } = await supabase.auth.getSession()
      if (data.session?.access_token) {
        return { 'Authorization': `Bearer ${data.session.access_token}` }
      }
      return {}
    }

    const startGeneration = async () => {
      if (hasStartedRef.current) return
      hasStartedRef.current = true

      const photosBase64 = localStorage.getItem('pending_generation_photos')
      const storedStyleIds = localStorage.getItem('pending_generation_style_ids')
      
      if (photosBase64) {
        try {
          const photos = JSON.parse(photosBase64)
          const inputPhotos = Array.isArray(photos)
            ? photos.filter((photo): photo is string => typeof photo === 'string' && photo.trim().length > 0).slice(0, 3)
            : []

          if (!inputPhotos.length) {
            setGeneration(prev => ({ ...prev, status: 'failed', currentStep: 'No photos uploaded' }))
            return
          }

          const styleIds = storedStyleIds ? JSON.parse(storedStyleIds) : []
          setSelectedStyleIds(Array.isArray(styleIds) ? styleIds : [])

          localStorage.removeItem('pending_generation_photos')
          localStorage.removeItem('pending_generation_id')
          localStorage.removeItem('pending_generation_style_ids')

          setGeneration(prev => ({ ...prev, currentStep: 'Preparing your reference photos...', progress: 5, styleCount: styleIds.length }))
          
          const authHeaders = await getAuthHeaders()
          const response = await fetch('/api/generate-headshots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
            body: JSON.stringify({ 
              faceImageUrls: inputPhotos,
              styleIds,
              clientGenerationId: generationId,
            })
          })

          if (response.status === 401) {
            router.push('/login?returnTo=/generate/' + generationId)
            return
          }

          if (response.status === 402) {
            router.push('/pricing')
            return
          }

          const data = await response.json()
          
          if (data.taskId) {
            cleanupPolling = pollGenerationStatus(data.taskId)
          } else {
            setGeneration(prev => ({ ...prev, status: 'failed', currentStep: data.error || 'Failed to start generation' }))
          }
        } catch (error) {
          console.error('[Generation] Error starting new generation:', error)
          setGeneration(prev => ({ ...prev, status: 'failed', currentStep: 'Failed to start generation' }))
        }
      } else if (generationId) {
        try {
            const authHeaders = await getAuthHeaders()
            const response = await fetch(`/api/generate-headshots?taskId=${generationId}`, {
              headers: authHeaders,
            })
          const data = await response.json()
          
          if (data.error || !data.taskId) {
            setGeneration(prev => ({ ...prev, status: 'failed', currentStep: 'Task not found, please restart' }))
            return
          }
          
          if (data.status === 'completed') {
            setPendingCompletion({ progress: data.progress, outputUrls: data.outputUrls })
            setShowCompletionModal(true)
          } else {
            cleanupPolling = pollGenerationStatus(generationId)
          }
        } catch (error) {
          console.error('[Generation] Error checking task status:', error)
          setGeneration(prev => ({ ...prev, status: 'failed', currentStep: 'Failed to check task status' }))
        }
      } else {
        setGeneration(prev => ({ ...prev, status: 'failed', currentStep: 'Invalid generation ID' }))
      }
    }

    const pollGenerationStatus = (taskId: string) => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
      
      const intervalId = setInterval(async () => {
        try {
            const authHeaders = await getAuthHeaders()
            const response = await fetch(`/api/generate-headshots?taskId=${taskId}`, {
              headers: authHeaders,
            })
          const data = await response.json()

          if (response.status === 401) {
            clearInterval(intervalId)
            pollIntervalRef.current = null
            router.push('/login?returnTo=/generate/' + generationId)
            return
          }

          if (data.status === 'completed') {
            clearInterval(intervalId)
            pollIntervalRef.current = null
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current)
              progressIntervalRef.current = null
            }
            setGeneration(prev => ({
              ...prev,
              progress: 100,
              currentStep: 'Generation complete. Review your results.',
            }))
            setPendingCompletion({ progress: data.progress, outputUrls: data.outputUrls || [] })
            setShowCompletionModal(true)
          } else if (data.status === 'failed') {
            clearInterval(intervalId)
            pollIntervalRef.current = null
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current)
              progressIntervalRef.current = null
            }
            setGeneration(prev => ({
              ...prev,
              status: 'failed',
              currentStep: 'Generation failed. Please try again.',
            }))
          } else {
            setGeneration(prev => ({
              ...prev,
              progress: Math.max(prev.progress, data.progress || 0),
              currentStep: data.currentStep || prev.currentStep || 'Rendering your portrait styles...',
            }))
          }
        } catch (error) {
          console.error('[Polling] Error:', error)
        }
      }, 5000)

      pollIntervalRef.current = intervalId

      if (!progressIntervalRef.current) {
        progressIntervalRef.current = setInterval(() => {
          setGeneration(prev => {
            if (prev.status !== 'processing') return prev
            const nextProgress = Math.min(95, Math.max(prev.progress + 1, Math.ceil(prev.progress * 1.04)))
            const currentStep = nextProgress >= 85
              ? 'Finalizing detail and preparing your results...'
              : nextProgress >= 65
                ? 'Polishing lighting, expression, and portrait detail...'
                : nextProgress >= 45
                  ? 'Rendering your selected portrait styles...'
                  : nextProgress >= 25
                    ? 'Matching your reference photos to each style...'
                    : 'Analyzing your reference photos...'
            return { ...prev, progress: nextProgress, currentStep }
          })
        }, 2500)
      }

      return () => {
        clearInterval(intervalId)
        pollIntervalRef.current = null
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current)
          progressIntervalRef.current = null
        }
      }
    }

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token) {
          const res = await fetch('/api/styles', {
            headers: { Authorization: `Bearer ${session.access_token}` },
          })
          const data = await res.json()
          setStyles(Array.isArray(data.styles) ? data.styles : [])
        }
      } catch {
      }

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!mounted) return
      
      if (!user) {
        router.push('/login?returnTo=/generate/' + generationId)
        return
      }
      
      setIsCheckingAuth(false)
      startGeneration()
    }
    
    init()

    return () => {
      mounted = false
      if (typeof cleanupPolling === 'function') {
        cleanupPolling()
      }
    }
  }, [generationId, router])

  useEffect(() => {
    if (generation.status !== 'processing') return

    window.history.pushState(null, '', window.location.href)
    const handleBack = () => {
      window.history.pushState(null, '', window.location.href)
    }

    window.addEventListener('popstate', handleBack)
    return () => window.removeEventListener('popstate', handleBack)
  }, [generation.status])

  const confirmCompletion = () => {
    if (!pendingCompletion) return
    setGeneration(prev => ({
      ...prev,
      status: 'completed',
      progress: 100,
      currentStep: 'Your headshots are ready!',
      outputPhotos: pendingCompletion.outputUrls,
    }))
    setShowCompletionModal(false)
    setPendingCompletion(null)
  }

  const togglePhotoSelection = (index: number) => {
    setSelectedPhotos(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const handleDownload = async (index: number) => {
    const photoUrl = generation.outputPhotos[index]
    if (!photoUrl) return
    const link = document.createElement('a')
    const styleName = styles[index]?.name || `Style ${index + 1}`
    const filename = `headshot-${styleName.toLowerCase().replace(/\s+/g, '-')}.jpg`

    try {
      const response = await fetch(photoUrl)
      if (!response.ok) throw new Error('Failed to fetch original image')
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      link.href = objectUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(objectUrl)
    } catch {
      link.href = photoUrl
      link.download = filename
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      link.click()
    }
  }

  const handleDownloadAll = () => {
    selectedPhotos.forEach(index => {
      setTimeout(() => handleDownload(index), index * 200)
    })
  }

  const openLightbox = (index: number) => {
    setLightboxPhoto(index)
    setShowLightbox(true)
  }

  const styleNameForIndex = (index: number) => {
    const styleId = selectedStyleIds[index]
    return styles.find(style => style.id === styleId)?.name || `Style ${index + 1}`
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {isCheckingAuth ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
              <p className="text-slate-600">Checking authentication...</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {generation.status === 'completed' ? 'Your Headshots Are Ready!' : 'Generating Your Headshots'}
            </h1>
            <p className="text-slate-600">
              {generation.status === 'completed' 
                ? 'Review and download your favorite professional headshots'
                : 'This usually takes about 3 minutes'}
            </p>
          </div>

          {generation.status !== 'completed' && generation.status !== 'failed' && (
            <Card className="p-8 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                  {generation.progress < 100 ? (
                    <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-10 h-10 text-accent-500" />
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-slate-600 mb-2">
                  <span>{generation.currentStep}</span>
                  <span>{generation.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out"
                    style={{ width: `${generation.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Sparkles className="w-4 h-4" />
                <span>Creating {generation.styleCount || PLANS.basic.credits} unique headshots for you</span>
              </div>
            </Card>
          )}

          {generation.status === 'failed' && (
            <Card className="p-8 mb-8 max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Oops! Something went wrong</h3>
              <p className="text-slate-600 mb-6">{generation.currentStep}</p>
              <div className="flex gap-4 justify-center">
                <Link href="/upload">
                  <Button>Try Again</Button>
                </Link>
                <Link href="/">
                  <Button variant="secondary">Go Home</Button>
                </Link>
              </div>
            </Card>
          )}

          {generation.status === 'completed' && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                      const total = generation.styleCount || generation.outputPhotos.length
                      setSelectedPhotos(prev => prev.size === total ? new Set() : new Set(Array.from({ length: total }, (_, i) => i)))
                    }}
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    {selectedPhotos.size === (generation.styleCount || generation.outputPhotos.length) ? 'Deselect All' : 'Select All'}
                  </Button>
                  <span className="text-sm text-slate-500">
                    {selectedPhotos.size} selected
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    disabled={selectedPhotos.size === 0}
                    onClick={handleDownloadAll}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Selected ({selectedPhotos.size})
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {generation.outputPhotos.map((photo, index) => (
                  <div 
                    key={index} 
                    className="relative group cursor-pointer"
                    onClick={() => openLightbox(index)}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-slate-200">
                      <img 
                        src={photo}
                        alt={styleNameForIndex(index)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium truncate">{styleNameForIndex(index)}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        togglePhotoSelection(index)
                      }}
                      className={`absolute top-2 left-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedPhotos.has(index)
                          ? 'bg-primary-500 border-primary-500 text-white'
                          : 'bg-white/80 border-white text-transparent hover:bg-white hover:text-slate-700'
                      }`}
                    >
                      {selectedPhotos.has(index) && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(index)
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    >
                      <Download className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <Card className="p-6 max-w-4xl mx-auto">
                  <h3 className="font-semibold text-slate-900 mb-2">Love your headshots?</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Add Pro credits to generate more selected styles whenever you need them.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Link href="/pricing?plan=pro" className="w-full sm:w-auto">
                      <Button className="w-full">Buy {PLANS.pro.name} Credits - ${PLANS.pro.price}</Button>
                    </Link>
                    <Link href="/upload" className="w-full sm:w-auto">
                      <Button variant="secondary" className="w-full">Create New Headshot Generation</Button>
                    </Link>
                    <Link href="/" className="w-full sm:w-auto">
                      <Button variant="secondary" className="w-full">Back to Home</Button>
                    </Link>
                  </div>
                </Card>
              </div>
            </>
          )}
            </>
          )}
        </div>
      </main>

      <Modal 
        isOpen={showCompletionModal} 
        onClose={confirmCompletion}
        title="Generation complete"
        className="max-w-md"
      >
        <div className="space-y-5">
          <div className="flex items-center gap-3 rounded-lg border border-primary-100 bg-primary-50 p-4">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-primary-600" />
            <div>
              <p className="font-medium text-slate-900">Your selected headshots are ready.</p>
              <p className="mt-1 text-sm text-slate-600">
                Confirm to view, select, and download your results.
              </p>
            </div>
          </div>
          <Button className="w-full" onClick={confirmCompletion}>
            View Headshots
          </Button>
        </div>
      </Modal>

      <Modal 
        isOpen={showLightbox} 
        onClose={() => setShowLightbox(false)}
        className="max-w-2xl"
      >
        {lightboxPhoto !== null && (
          <div>
            <div className="aspect-square rounded-xl overflow-hidden bg-slate-200 mb-4">
              <img 
                src={generation.outputPhotos[lightboxPhoto]}
                alt={styleNameForIndex(lightboxPhoto)}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="font-semibold text-slate-900 mb-4">{styleNameForIndex(lightboxPhoto)}</h3>
            <div className="flex gap-2">
              <Button 
                className="flex-1"
                onClick={() => handleDownload(lightboxPhoto)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button 
                variant="secondary"
                onClick={() => togglePhotoSelection(lightboxPhoto)}
              >
                {selectedPhotos.has(lightboxPhoto) ? 'Deselect' : 'Select'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  )
}
