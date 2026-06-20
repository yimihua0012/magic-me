'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import Modal from '@/components/ui/modal'
import { 
  Sparkles, 
  Download, 
  CheckCircle2,
  Loader2,
  X,
  Grid3X3,
  Smartphone,
  Share2,
  Home
} from 'lucide-react'

const styleNames = [
  'Corporate Professional', 'Creative Studio', 'Warm Natural', 'Bold & Modern',
  'Classic Portrait', 'Urban Edge', 'Executive Suite', 'Artistic Expression',
  'Casual Friday', 'Tech Startup', 'Legal Professional', 'Medical Expert',
  'Financial Advisor', 'Marketing Guru', 'Consultant Elite', 'HR Champion',
  'Sales Superstar', 'Engineering Lead', 'Design Director', 'Product Manager',
  'Entrepreneur Pro', 'Freelancer Plus', 'Consultant Premium', 'Executive Presence',
  'Modern Creative', 'Timeless Classic', 'Dynamic Professional', 'Confident Leader',
  'Approachable Expert', 'Trusted Authority'
]

type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed'

interface GenerationState {
  id: string
  status: GenerationStatus
  progress: number
  currentStep: string
  outputPhotos: string[]
}

export default function GenerationPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [generation, setGeneration] = useState<GenerationState>({
    id: resolvedParams.id,
    status: 'processing',
    progress: 0,
    currentStep: 'Analyzing your photos...',
    outputPhotos: [],
  })
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set())
  const [showLightbox, setShowLightbox] = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState<number | null>(null)

  useEffect(() => {
    const simulateProgress = () => {
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
          setGeneration(prev => ({
            ...prev,
            status: 'completed',
            progress: 100,
            currentStep: 'Your headshots are ready!',
            outputPhotos: Array(30).fill(null).map((_, i) => `https://picsum.photos/seed/${resolvedParams.id}-${i}/1024/1024`),
          }))
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

    simulateProgress()
  }, [resolvedParams.id])

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
          {/* Header */}
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

          {/* Progress Section */}
          {generation.status !== 'completed' && (
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
                <span>Creating 30 unique styles for you</span>
              </div>
            </Card>
          )}

          {/* Completed Section */}
          {generation.status === 'completed' && (
            <>
              {/* Selection Actions */}
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

              {/* Style Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {generation.outputPhotos.map((photo, index) => (
                  <div 
                    key={index} 
                    className="relative group cursor-pointer"
                    onClick={() => openLightbox(index)}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
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

              {/* CTA */}
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

      {/* Lightbox Modal */}
      <Modal 
        isOpen={showLightbox} 
        onClose={() => setShowLightbox(false)}
        className="max-w-2xl"
      >
        {lightboxPhoto !== null && (
          <div>
            <div className="aspect-square rounded-xl overflow-hidden bg-slate-200 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
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
