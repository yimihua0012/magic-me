'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import Modal from '@/components/ui/modal'
import { PLANS } from '@backend/config/plans'
import { 
  Sparkles, 
  Download, 
  CheckCircle2,
  Loader2,
  X,
  Grid3X3,
  Smartphone,
  Share2,
  Home,
  AlertCircle
} from 'lucide-react'

const styleNames = [
  'LinkedIn Professional', 'Corporate Office', 'Business Casual', 'Executive Portrait',
  'Doctor Whitecoat', 'Modern Tech', 'Creative Agency', 'Oil Painting',
  'Watercolor Art', 'Anime Illustration', 'Cyberpunk Neon', 'Pixel Art Retro',
  'Pop Art Comic', 'Coffee Shop', 'Beach Golden Hour', 'Autumn Park',
  'City Street', 'Library Study', 'Garden Spring', 'Spring Blossom',
  'Summer Sunshine', 'Autumn Foliage', 'Winter Snow', 'Black & White Classic',
  'Vintage Film', 'Rembrandt Lighting', 'Soft Glamour', 'Superhero',
  'Royal Portrait', 'Astronaut Space'
]

type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed'

interface GenerationState {
  id: string
  status: GenerationStatus
  progress: number
  currentStep: string
  outputPhotos: string[]
  styleCount: number
}

export default function GenerationPage() {
  const params = useParams()
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
  const [showLightbox, setShowLightbox] = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState<number | null>(null)
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let cleanupPolling: (() => void) | undefined
    
    const startGeneration = async () => {
      const photosBase64 = localStorage.getItem('pending_generation_photos')
      
      if (photosBase64) {
        console.log('[Generation] Found pending photos, starting new generation')
        try {
          const photos = JSON.parse(photosBase64)
          if (!photos.length) {
            setGeneration(prev => ({ ...prev, status: 'failed', currentStep: 'No photos uploaded' }))
            return
          }

          const styleIds = [
            'linkedin_professional', 'corporate_office', 'business_casual', 'executive_portrait',
            'doctor_whitecoat', 'modern_tech', 'creative_agency', 'oil_painting',
            'watercolor_art', 'anime_illustration', 'cyberpunk_neon', 'pixel_art_retro',
            'pop_art_comic', 'coffee_shop', 'beach_golden_hour', 'autumn_park',
            'city_street', 'library_study', 'garden_spring', 'spring_blossom',
            'summer_sunshine', 'autumn_foliage', 'winter_snow', 'black_white_classic',
            'vintage_film', 'rembrandt_lighting', 'soft_glamour', 'superhero_style',
            'royal_portrait', 'astronaut_space'
          ]

          setGeneration(prev => ({ ...prev, currentStep: 'Uploading your photo...', styleCount: styleIds.length }))
          
          const response = await fetch('/api/generate-headshots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              faceImageUrl: photos[0],
              styleIds: [
                'linkedin_professional', 'corporate_office', 'business_casual', 'executive_portrait',
                'doctor_whitecoat', 'modern_tech', 'creative_agency', 'oil_painting',
                'watercolor_art', 'anime_illustration', 'cyberpunk_neon', 'pixel_art_retro',
                'pop_art_comic', 'coffee_shop', 'beach_golden_hour', 'autumn_park',
                'city_street', 'library_study', 'garden_spring', 'spring_blossom',
                'summer_sunshine', 'autumn_foliage', 'winter_snow', 'black_white_classic',
                'vintage_film', 'rembrandt_lighting', 'soft_glamour', 'superhero_style',
                'royal_portrait', 'astronaut_space'
              ]
            })
          })

          const data = await response.json()
          
          if (data.taskId) {
            localStorage.removeItem('pending_generation_photos')
            localStorage.removeItem('pending_generation_id')
            
            const configResponse = await fetch('/api/generate-headshots')
            const config = await configResponse.json()
            
            if (config.generationMode === 'mock') {
              simulateMockGeneration()
            } else {
              cleanupPolling = pollGenerationStatus(data.taskId)
            }
          } else {
            setGeneration(prev => ({ ...prev, status: 'failed', currentStep: data.error || 'Failed to start generation' }))
          }
        } catch (error) {
          console.error('[Generation] Error starting new generation:', error)
          simulateMockGeneration()
        }
      } else if (generationId) {
        console.log('[Generation] No pending photos, checking existing task:', generationId)
        try {
          const response = await fetch(`/api/generate-headshots?taskId=${generationId}`)
          const data = await response.json()
          
          if (data.error || !data.taskId) {
            console.log('[Generation] Task not found on server, restarting generation')
            setGeneration(prev => ({ ...prev, status: 'failed', currentStep: 'Task not found, please restart' }))
            return
          }
          
          if (data.status === 'completed') {
            setGeneration(prev => ({
              ...prev,
              status: 'completed',
              progress: data.progress,
              currentStep: 'Your headshots are ready!',
              outputPhotos: data.outputUrls,
            }))
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
        console.log('[Polling] Clearing existing poll before starting new one')
        clearInterval(pollIntervalRef.current)
      }
      
      console.log(`[Polling] Starting poll for taskId: ${taskId}`)
      const intervalId = setInterval(async () => {
        try {
          console.log(`[Polling] Fetching status for taskId: ${taskId}`)
          const response = await fetch(`/api/generate-headshots?taskId=${taskId}`)
          console.log(`[Polling] Response status: ${response.status}`)
          const data = await response.json()
          console.log(`[Polling] Response data:`, JSON.stringify(data))

          if (data.status === 'completed') {
            console.log(`[Polling] Task completed! outputUrls count: ${data.outputUrls?.length || 0}`)
            clearInterval(intervalId)
            pollIntervalRef.current = null
            setGeneration(prev => ({
              ...prev,
              status: 'completed',
              progress: data.progress,
              currentStep: 'Your headshots are ready!',
              outputPhotos: data.outputUrls,
            }))
          } else if (data.status === 'failed') {
            console.log(`[Polling] Task failed`)
            clearInterval(intervalId)
            pollIntervalRef.current = null
            setGeneration(prev => ({
              ...prev,
              status: 'failed',
              currentStep: 'Generation failed. Please try again.',
            }))
          } else {
            console.log(`[Polling] Task in progress - status: ${data.status}, progress: ${data.progress}`)
            setGeneration(prev => ({
              ...prev,
              progress: data.progress,
            }))
          }
        } catch (error) {
          console.error('[Polling] Error:', error)
        }
      }, 3000)

      pollIntervalRef.current = intervalId

      return () => {
        console.log('[Polling] Cleaning up poll')
        clearInterval(intervalId)
        pollIntervalRef.current = null
      }
    }

    const simulateMockGeneration = () => {
      const steps = [
        { progress: 10, message: 'Analyzing your photos...' },
        { progress: 25, message: 'Detecting facial features...' },
        { progress: 40, message: 'Generating base model...' },
        { progress: 55, message: 'Applying professional lighting...' },
        { progress: 70, message: 'Creating style variations...' },
        { progress: 85, message: 'Applying finishing touches...' },
        { progress: 95, message: 'Finalizing your headshots...' },
        { progress: 100, message: 'Complete!' },
      ]

      let currentStepIndex = 0
      const interval = setInterval(() => {
        if (currentStepIndex >= steps.length) {
          clearInterval(interval)
          const outputPhotos = Array(30).fill(null).map((_, i) => `https://picsum.photos/seed/${generationId}-${i}/1024/1024`)
          setGeneration(prev => ({
            ...prev,
            status: 'completed',
            progress: 100,
            currentStep: 'Your headshots are ready!',
            outputPhotos,
          }))
          
          // Save to localStorage
          const newRecord = {
            id: generationId,
            status: 'completed' as const,
            plan_type: 'basic',
            style_count: 30,
            created_at: new Date().toISOString(),
            thumbnail: outputPhotos[0],
            output_photos: outputPhotos,
          }
          
          const existingRecords = localStorage.getItem('generation_records')
          const records = existingRecords ? JSON.parse(existingRecords) : []
          records.unshift(newRecord)
          localStorage.setItem('generation_records', JSON.stringify(records))
          
          return
        }

        const step = steps[currentStepIndex]
        setGeneration(prev => ({
          ...prev,
          progress: step.progress,
          currentStep: step.message,
        }))
        currentStepIndex++
      }, 2000)

      return () => clearInterval(interval)
    }

    startGeneration()

    return () => {
      if (typeof cleanupPolling === 'function') {
        console.log('[Polling] Cleaning up polling on component unmount')
        cleanupPolling()
      }
    }
  }, [generationId])

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

  const handleDownload = (index: number) => {
    const link = document.createElement('a')
    link.href = generation.outputPhotos[index]
    link.download = `headshot-${styleNames[index].toLowerCase().replace(/\s+/g, '-')}.jpg`
    link.target = '_blank'
    window.open(link.href, '_blank')
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {generation.status === 'completed' ? 'Your Headshots Are Ready!' : 'Generating Your Headshots'}
            </h1>
            <p className="text-slate-600">
              {generation.status === 'completed' 
                ? 'Download your favorites and share your new professional look'
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
                <span>Creating {generation.styleCount || PLANS.basic.styleCount} unique styles for you</span>
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
                    onClick={() => setSelectedPhotos(prev => 
                      prev.size === 30 ? new Set() : new Set(Array.from({ length: 30 }, (_, i) => i))
                    )}
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    {selectedPhotos.size === 30 ? 'Deselect All' : 'Select All'}
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
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
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
                        alt={styleNames[index]}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium truncate">{styleNames[index]}</p>
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
                <Card className="p-6 max-w-lg mx-auto">
                  <h3 className="font-semibold text-slate-900 mb-2">Love your headshots?</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Get the Pro version for 100 styles and 2048x2048 resolution!
                  </p>
                  <Link href="/pricing?plan=pro">
                    <Button>Upgrade to Pro - $19.90</Button>
                  </Link>
                </Card>

                <div className="mt-6 flex justify-center gap-4 text-sm">
                  <Link href="/dashboard" className="text-slate-600 hover:text-slate-900">
                    View Dashboard
                  </Link>
                  <Link href="/upload" className="text-slate-600 hover:text-slate-900">
                    Create New
                  </Link>
                  <Link href="/" className="text-slate-600 hover:text-slate-900">
                    Back to Home
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

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
                alt={styleNames[lightboxPhoto]}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="font-semibold text-slate-900 mb-4">{styleNames[lightboxPhoto]}</h3>
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