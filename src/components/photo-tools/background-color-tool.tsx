'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { Download, ImagePlus, Palette, SlidersHorizontal, Upload } from 'lucide-react'
import {
  downloadCanvas,
  photoSpecs,
  photoSpecToPixels,
  renderImageToPhotoCanvas,
} from '@/components/photo-tools/photo-print-utils'

const backgrounds = [
  { label: 'White', value: '#ffffff' },
  { label: 'Blue', value: '#438edb' },
  { label: 'Red', value: '#d71920' },
  { label: 'Light Gray', value: '#f1f5f9' },
]

export default function BackgroundColorTool() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const previewRef = useRef<HTMLCanvasElement | null>(null)
  const [sourceUrl, setSourceUrl] = useState('')
  const [sourceName, setSourceName] = useState('')
  const [selectedSpecId, setSelectedSpecId] = useState(photoSpecs[1].id)
  const [backgroundColor, setBackgroundColor] = useState(backgrounds[0].value)
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
    setSourceUrl('')
    setSourceName('')
    setError('')

    if (!file) return
    if (file.type !== 'image/png') {
      setError('Please upload a PNG image. This tool needs PNG transparency to change the background color.')
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

  const renderPhoto = useCallback(async () => {
    if (!sourceUrl) return null

    return renderImageToPhotoCanvas({
      sourceUrl,
      spec: selectedSpec,
      backgroundColor,
      zoom,
      offsetX,
      offsetY,
    })
  }, [backgroundColor, offsetX, offsetY, selectedSpec, sourceUrl, zoom])

  const drawPreview = useCallback(async () => {
    const preview = previewRef.current
    if (!preview || !sourceUrl) return

    try {
      const canvas = await renderPhoto()
      if (!canvas) return
      preview.width = canvas.width
      preview.height = canvas.height
      const context = preview.getContext('2d')
      context?.clearRect(0, 0, preview.width, preview.height)
      context?.drawImage(canvas, 0, 0)
    } catch (previewError) {
      setError(previewError instanceof Error ? previewError.message : 'Failed to render preview.')
    }
  }, [renderPhoto, sourceUrl])

  useEffect(() => {
    void drawPreview()
  }, [drawPreview])

  const downloadSingle = async () => {
    if (!sourceUrl) return
    setIsRendering(true)
    setError('')

    try {
      const canvas = await renderPhoto()
      if (!canvas) return
      const baseName = sourceName.replace(/\.[^.]+$/, '') || selectedSpec.id
      await downloadCanvas(canvas, `${baseName}-${selectedSpec.id}-background.jpg`, 0.94)
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : 'Failed to download photo.')
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
              <Palette className="h-4 w-4" />
              Background Color Tool
            </div>
            <p className="mt-1 text-sm text-slate-600">
              Upload a transparent PNG portrait, choose a photo size, change the background color, then download a finished JPG.
            </p>
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png"
              className="hidden"
              onChange={(event) => handleUpload(event.target.files?.[0])}
            />
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload PNG
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
              <div className="text-center text-sm text-slate-500">
                Upload a transparent PNG image to change its background color.
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <SlidersHorizontal className="h-4 w-4" />
              Photo Settings
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

            <div className="mt-4">
              <div className="mb-2 text-sm font-medium text-slate-700">Background color</div>
              <div className="grid grid-cols-4 gap-2">
                {backgrounds.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setBackgroundColor(preset.value)}
                    className={`h-10 rounded-lg border text-xs font-semibold transition-all ${
                      backgroundColor.toLowerCase() === preset.value ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'
                    }`}
                    style={{
                      backgroundColor: preset.value,
                      color: preset.value === '#ffffff' || preset.value === '#f1f5f9' ? '#0f172a' : '#ffffff',
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4">
              <RangeControl label="Zoom" min={0.8} max={1.8} step={0.01} value={zoom} onChange={setZoom} valueLabel={`${Math.round(zoom * 100)}%`} />
              <RangeControl label="Horizontal position" min={-35} max={35} step={1} value={offsetX} onChange={setOffsetX} valueLabel={`${offsetX}%`} />
              <RangeControl label="Vertical position" min={-35} max={35} step={1} value={offsetY} onChange={setOffsetY} valueLabel={`${offsetY}%`} />
            </div>

            <Button onClick={() => void downloadSingle()} disabled={!sourceUrl || isRendering} className="mt-5 w-full">
              <Download className="mr-2 h-4 w-4" />
              Download JPG
            </Button>
          </Card>
        </div>
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
