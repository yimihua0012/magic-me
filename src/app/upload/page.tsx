'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import AuthModal from '@/components/auth/auth-modal'
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Check, 
  AlertCircle,
  Camera,
  Lightbulb,
  Loader2
} from 'lucide-react'

interface PhotoValidation {
  file: File
  preview: string
  status: 'pending' | 'validating' | 'valid' | 'invalid'
  error?: string
}

const faceDetectionMessages = {
  'no-face': 'No face detected. Please ensure your face is clearly visible.',
  'multiple-faces': 'Multiple faces detected. Please upload a photo with only you.',
  'side-profile': 'Please look directly at the camera. Side profiles don\'t work well.',
  'face-too-small': 'Face appears too small. Try moving closer or cropping the image.',
  'blurry': 'Image appears blurry. Please upload a clearer photo.',
  'occluded': 'Face appears obstructed. Please remove sunglasses, hats, or masks.',
  'lighting': 'Image is too dark. Try taking your selfie near a window during daytime.',
}

export default function UploadPage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<PhotoValidation[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          setIsAuthenticated(true)
        } else {
          setShowAuthModal(true)
        }
      } catch {
        setShowAuthModal(true)
      } finally {
        setIsCheckingAuth(false)
      }
    }
    checkAuth()
  }, [])

  const validateImage = async (file: File): Promise<{ valid: boolean; error?: string }> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(img.src)
        
        if (img.width < 200 || img.height < 200) {
          resolve({ valid: false, error: faceDetectionMessages['face-too-small'] })
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
          resolve({ valid: false, error: faceDetectionMessages['lighting'] })
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
      setPhotos(prev => prev.map((p, idx) => 
        idx === index ? { ...p, status: 'validating' } : p
      ))
      
      const validation = await validateImage(newPhotos[i].file)
      
      setPhotos(prev => prev.map((p, idx) => 
        idx === index ? { 
          ...p, 
          status: validation.valid ? 'valid' : 'invalid',
          error: validation.error
        } : p
      ))
    }
  }, [photos.length])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
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

  const validPhotos = photos.filter(p => p.status === 'valid')
  const canProceed = validPhotos.length >= 1

  const handleProceed = () => {
    if (canProceed) {
      router.push('/pricing')
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false)
          setIsAuthenticated(true)
        }} 
      />

      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Upload Your Best Selfie
            </h1>
            <p className="text-slate-600">
              For best results, follow these guidelines
            </p>
          </div>

          {/* Guidelines */}
          <Card className="p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-accent-500" />
                  For Best Results
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>Front-facing selfie looking directly at camera</li>
                  <li>Good natural lighting, preferably near a window</li>
                  <li>Face clearly visible without obstructions</li>
                  <li>Neutral or slight smile expression</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <X className="w-5 h-5 text-red-500" />
                  Please Avoid
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>Side profiles or extreme angles</li>
                  <li>Sunglasses, hats, or face masks</li>
                  <li>Group photos with multiple people</li>
                  <li>Heavy filters or excessive makeup</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg flex items-start gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                <strong>Pro Tip:</strong> Take your selfie near a window during daytime for the best lighting!
              </p>
            </div>
          </Card>

          {/* Upload Zone */}
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
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
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
            
            <div className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary-600" />
              </div>
              <p className="text-slate-900 font-medium mb-1">
                Drag & drop your selfies here
              </p>
              <p className="text-slate-500 text-sm mb-4">
                or click to browse
              </p>
              <p className="text-xs text-slate-400">
                Upload 1-3 photos • JPG, PNG up to 10MB each
              </p>
            </div>
          </div>

          {/* Photo Counter */}
          <div className="mt-4 text-center text-sm text-slate-500">
            {photos.length === 0 && 'Add up to 3 photos for best variety'}
            {photos.length > 0 && `${photos.length}/3 photos • Add ${3 - photos.length} more for variety`}
          </div>

          {/* Photo Grid */}
          {photos.length > 0 && (
            <div className="mt-8 grid grid-cols-3 gap-4">
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

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center gap-4">
            <Button 
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              disabled={photos.length >= 3}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Add More Photos
            </Button>
            <Button
              disabled={!canProceed}
              onClick={handleProceed}
            >
              <Camera className="w-4 h-4 mr-2" />
              Continue to Pricing
            </Button>
          </div>

          {photos.length > 0 && !canProceed && (
            <p className="mt-4 text-center text-sm text-slate-500">
              Upload at least 1 valid photo to continue
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
