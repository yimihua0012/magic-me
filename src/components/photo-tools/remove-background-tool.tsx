'use client'

import { useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { loginPathForReturn } from '@/lib/auth-return'
import { supabase } from '@/lib/supabase/client'
import { Download, ImagePlus, Sparkles, Upload } from 'lucide-react'

const MAX_FILE_SIZE = 10 * 1024 * 1024

export default function RemoveBackgroundTool() {
  const router = useRouter()
  const pathname = usePathname()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [sourceUrl, setSourceUrl] = useState('')
  const [sourceName, setSourceName] = useState('')
  const [resultUrl, setResultUrl] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [chargedCredits, setChargedCredits] = useState<number | null>(null)

  const handleUpload = (file?: File) => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl)
    setSourceUrl('')
    setSourceFile(null)
    setResultUrl('')
    setSourceName('')
    setChargedCredits(null)
    setError('')
    setStatus('')

    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('Image is too large. Use a file under 10MB.')
      return
    }

    setSourceUrl(URL.createObjectURL(file))
    setSourceFile(file)
    setSourceName(file.name)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeBackground = async () => {
    if (!sourceFile) {
      setError('Upload an image first.')
      return
    }

    setIsProcessing(true)
    setError('')
    setStatus('Removing the background...')
    setResultUrl('')
    setChargedCredits(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        router.push(loginPathForReturn(pathname || '/photo-tools/remove-background', '/photo-tools/remove-background'))
        return
      }

      const formData = new FormData()
      formData.append('image', sourceFile)
      const response = await fetch('/api/photo-tools/remove-background', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Failed to remove background.')
      }

      setResultUrl(data.outputUrl)
      setChargedCredits(typeof data.chargedCredits === 'number' ? data.chargedCredits : null)
      setStatus(data.chargedCredits === 0 ? 'Background removed. This used your free run.' : 'Background removed. 1 credit was used.')
    } catch (processError) {
      setError(processError instanceof Error ? processError.message : 'Failed to remove background.')
      setStatus('')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadPng = async () => {
    if (!resultUrl) return
    const baseName = sourceName.replace(/\.[^.]+$/, '') || 'image'
    try {
      const response = await fetch(resultUrl)
      if (!response.ok) throw new Error('Could not download PNG.')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      triggerDownload(url, `${baseName}-no-background.png`)
      URL.revokeObjectURL(url)
    } catch {
      triggerDownload(resultUrl, `${baseName}-no-background.png`)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
              <ImagePlus className="h-4 w-4" />
              Remove Background
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Upload a person, product, object, or document-style image and export a transparent PNG after the background is removed.
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              Registered users get 1 free remove-background run. After that, each successful PNG export uses 1 credit.
            </p>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleUpload(event.target.files?.[0])}
            />
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}
        {status && (
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
            {status}
          </div>
        )}
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
            <h2 className="font-bold text-slate-900">Preview</h2>
            <p className="mt-1 text-sm text-slate-500">Transparent PNG output for people, products, and objects.</p>
          </div>
          <div className="grid min-h-[420px] gap-4 bg-slate-100 p-4 md:grid-cols-2">
            <PreviewPanel title="Original" imageUrl={sourceUrl} emptyText="Upload an image to start." />
            <PreviewPanel title="PNG result" imageUrl={resultUrl} emptyText="Your transparent PNG appears here." checkerboard />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <Sparkles className="h-4 w-4" />
              Usage
            </div>
            <p className="text-sm leading-6 text-slate-600">
              Sign in to use your 1 free remove-background run. When the free run is used, each successful PNG export uses 1 credit.
            </p>
            {chargedCredits !== null && (
              <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                Credits used: {chargedCredits}
              </div>
            )}
            <Button onClick={() => void removeBackground()} disabled={!sourceUrl || isProcessing} className="mt-5 w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              {isProcessing ? 'Removing...' : 'Remove background'}
            </Button>
            <Button variant="secondary" onClick={() => void downloadPng()} disabled={!resultUrl} className="mt-3 w-full">
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

function PreviewPanel({
  title,
  imageUrl,
  emptyText,
  checkerboard = false,
}: {
  title: string
  imageUrl: string
  emptyText: string
  checkerboard?: boolean
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">{title}</div>
      <div
        className={`flex min-h-[320px] items-center justify-center p-3 ${checkerboard ? 'bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(-45deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e2e8f0_75%),linear-gradient(-45deg,transparent_75%,#e2e8f0_75%)] bg-[length:24px_24px] bg-[position:0_0,0_12px,12px_-12px,-12px_0px]' : 'bg-white'}`}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={title} className="max-h-[420px] max-w-full object-contain" />
        ) : (
          <div className="text-center text-sm text-slate-500">{emptyText}</div>
        )}
      </div>
    </div>
  )
}

function triggerDownload(url: string, filename: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
}
