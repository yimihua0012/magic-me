'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { Download, ImagePlus, SlidersHorizontal, Upload } from 'lucide-react'
import { downloadCanvas, photoSpecs, photoSpecToPixels, renderImageToPhotoCanvas } from '@/components/photo-tools/photo-print-utils'

interface IdPhotoCropPrintToolProps {
  sourceDescription: string
  uploadLabel: string
  emptyText: string
}

export default function IdPhotoCropPrintTool({
  sourceDescription,
  uploadLabel,
  emptyText,
}: IdPhotoCropPrintToolProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const previewRef = useRef<HTMLCanvasElement | null>(null)
  const [sourceUrl, setSourceUrl] = useState('')
  const [sourceName, setSourceName] = useState('')
  const [selectedSpecId, setSelectedSpecId] = useState(photoSpecs[1].id)
  const [zoom, setZoom] = useState(1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [error, setError] = useState('')
  const [isRendering, setIsRendering] = useState(false)

  const selectedSpec = useMemo(
    () => photoSpecs.find((spec) => spec.id === selectedSpecId) || photoSpecs[0],
    [selectedSpecId],
  )
  const outputSize = useMemo(() => photoSpecToPixels(selectedSpec), [selectedSpec])

  const handleUpload = (file?: File) => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl)
    setError('')

    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload a JPG, PNG, or WebP image.')
      return
    }

    setSourceUrl(URL.createObjectURL(file))
    setSourceName(file.name)
    setZoom(1)
    setOffsetX(0)
    setOffsetY(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  useEffect(() => () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl)
  }, [sourceUrl])

  const renderCrop = useCallback(async () => {
    if (!sourceUrl) return null

    return renderImageToPhotoCanvas({
      sourceUrl,
      spec: selectedSpec,
      backgroundColor: '#ffffff',
      zoom,
      offsetX,
      offsetY,
    })
  }, [offsetX, offsetY, selectedSpec, sourceUrl, zoom])

  const drawPreview = useCallback(async () => {
    const preview = previewRef.current
    if (!preview || !sourceUrl) return

    try {
      const canvas = await renderCrop()
      if (!canvas) return
      preview.width = canvas.width
      preview.height = canvas.height
      const context = preview.getContext('2d')
      context?.clearRect(0, 0, preview.width, preview.height)
      context?.drawImage(canvas, 0, 0)
    } catch (previewError) {
      setError(previewError instanceof Error ? previewError.message : 'Failed to render preview.')
    }
  }, [renderCrop, sourceUrl])

  useEffect(() => {
    void drawPreview()
  }, [drawPreview])

  const downloadCrop = async () => {
    if (!sourceUrl) return
    setIsRendering(true)
    setError('')

    try {
      const canvas = await renderCrop()
      if (!canvas) return
      const baseName = sourceName.replace(/\.[^.]+$/, '') || selectedSpec.id
      await downloadCanvas(canvas, `${baseName}-${selectedSpec.id}.jpg`, 0.94)
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : 'Failed to download cropped photo.')
    } finally {
      setIsRendering(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
              <ImagePlus className="h-4 w-4" />
              Source Photo
            </div>
            <p className="mt-1 text-sm text-slate-600">{sourceDescription}</p>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(event) => handleUpload(event.target.files?.[0])}
            />
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              {uploadLabel}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {error}
          </div>
        )}
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
            <h2 className="font-bold text-slate-900">Preview</h2>
            <p className="mt-1 text-sm text-slate-500">
              {selectedSpec.label} - {outputSize.width} x {outputSize.height}px at {selectedSpec.dpi} DPI
            </p>
          </div>
          <div className="flex min-h-[420px] items-center justify-center bg-slate-100 p-4">
            {sourceUrl ? (
              <canvas
                ref={previewRef}
                className="max-h-[620px] max-w-full rounded-lg bg-white shadow-sm"
                style={{ aspectRatio: `${outputSize.width} / ${outputSize.height}` }}
              />
            ) : (
              <div className="text-center text-sm text-slate-500">{emptyText}</div>
            )}
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-600">
            <SlidersHorizontal className="h-4 w-4" />
            Crop Settings
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Photo size</span>
            <select
              value={selectedSpecId}
              onChange={(event) => setSelectedSpecId(event.target.value)}
              className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {photoSpecs.map((spec) => (
                <option key={spec.id} value={spec.id}>{spec.label}</option>
              ))}
            </select>
          </label>

          <div className="mt-4 grid gap-4">
            <RangeControl label="Zoom" min={0.8} max={1.8} step={0.01} value={zoom} onChange={setZoom} valueLabel={`${Math.round(zoom * 100)}%`} />
            <RangeControl label="Horizontal position" min={-35} max={35} step={1} value={offsetX} onChange={setOffsetX} valueLabel={`${offsetX}%`} />
            <RangeControl label="Vertical position" min={-35} max={35} step={1} value={offsetY} onChange={setOffsetY} valueLabel={`${offsetY}%`} />
          </div>

          <Button onClick={() => void downloadCrop()} disabled={!sourceUrl || isRendering} className="mt-5 w-full">
            <Download className="mr-2 h-4 w-4" />
            Download cropped JPG
          </Button>
        </Card>
      </div>
    </div>
  )
}

function RangeControl({
  label,
  min,
  max,
  step,
  value,
  onChange,
  valueLabel,
}: {
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  valueLabel: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
        <span>{label}</span>
        <span className="text-xs text-slate-500">{valueLabel}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full"
      />
    </label>
  )
}
