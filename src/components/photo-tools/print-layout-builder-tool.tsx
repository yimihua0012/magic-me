'use client'

import { useMemo, useState } from 'react'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { Download, ImagePlus, Printer, RefreshCw } from 'lucide-react'
import {
  calculatePrintLayout,
  downloadCanvas,
  loadImage,
  paperSpecs,
  photoSpecs,
  photoSpecToPixels,
  renderImageToPhotoCanvas,
  renderPrintSheet,
} from '@/components/photo-tools/photo-print-utils'

export default function PrintLayoutBuilderTool() {
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [sourceUrl, setSourceUrl] = useState('')
  const [sourceSize, setSourceSize] = useState<{ width: number; height: number } | null>(null)
  const [selectedSpecId, setSelectedSpecId] = useState(photoSpecs[1].id)
  const [selectedPaperId, setSelectedPaperId] = useState(paperSpecs[1].id)
  const [sheetUrl, setSheetUrl] = useState('')
  const [sheetCanvas, setSheetCanvas] = useState<HTMLCanvasElement | null>(null)
  const [layoutInfo, setLayoutInfo] = useState<{ copies: number; columns: number; rows: number } | null>(null)
  const [error, setError] = useState('')
  const [isRendering, setIsRendering] = useState(false)

  const selectedPaper = useMemo(
    () => paperSpecs.find((paper) => paper.id === selectedPaperId) || paperSpecs[1],
    [selectedPaperId],
  )
  const selectedSpec = useMemo(
    () => photoSpecs.find((spec) => spec.id === selectedSpecId) || photoSpecs[0],
    [selectedSpecId],
  )
  const outputSize = useMemo(() => photoSpecToPixels(selectedSpec), [selectedSpec])

  const handleFileChange = async (file?: File) => {
    cleanupUrl(sourceUrl)
    cleanupUrl(sheetUrl)
    setSourceFile(null)
    setSourceUrl('')
    setSourceSize(null)
    setSheetUrl('')
    setSheetCanvas(null)
    setLayoutInfo(null)
    setError('')

    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload a JPG, PNG, or WebP image.')
      return
    }

    const url = URL.createObjectURL(file)
    try {
      const image = await loadImage(url)
      setSourceFile(file)
      setSourceUrl(url)
      setSourceSize({ width: image.naturalWidth, height: image.naturalHeight })
    } catch {
      cleanupUrl(url)
      setError('Could not read this image. Try another JPG, PNG, or WebP file.')
    }
  }

  const generateLayout = async () => {
    if (!sourceUrl || !sourceSize) {
      setError('Upload an image first.')
      return
    }

    cleanupUrl(sheetUrl)
    setSheetUrl('')
    setSheetCanvas(null)
    setLayoutInfo(null)
    setError('')
    setIsRendering(true)

    try {
      const photoCanvas = await renderImageToPhotoCanvas({
        sourceUrl,
        spec: selectedSpec,
        backgroundColor: '#ffffff',
      })

      const layout = calculatePrintLayout(photoCanvas.width, photoCanvas.height, selectedSpec.dpi, selectedPaper)
      if (!layout.fits) {
        throw new Error('This photo size is too large for the selected paper. Choose a smaller photo size or a larger paper size.')
      }

      const sheet = renderPrintSheet(photoCanvas, selectedSpec.dpi, selectedPaper)
      setSheetCanvas(sheet)
      setSheetUrl(sheet.toDataURL('image/jpeg', 0.94))
      setLayoutInfo({ copies: layout.totalCopies, columns: layout.columns, rows: layout.rows })
    } catch (layoutError) {
      setError(layoutError instanceof Error ? layoutError.message : 'Could not create the print layout.')
    } finally {
      setIsRendering(false)
    }
  }

  const downloadSheet = async () => {
    if (!sheetCanvas) return
    const baseName = sourceFile?.name.replace(/\.[^.]+$/, '') || 'photo'
    await downloadCanvas(sheetCanvas, `${baseName}-${selectedPaper.id}-print-layout.jpg`, 0.96)
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Printer className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">Print Layout Builder</h2>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          Upload a finished photo, choose a photo size and paper size, generate a repeated print sheet, preview the
          layout, and download a JPG for home printing or a print shop.
        </p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="border-b border-slate-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <label className="flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition-colors hover:border-blue-300 hover:bg-blue-50/40">
            {sourceUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sourceUrl} alt="Uploaded photo preview" className="max-h-[320px] max-w-full rounded-lg object-contain shadow-sm" />
            ) : (
              <>
                <ImagePlus className="h-10 w-10 text-slate-400" />
                <span className="mt-3 text-sm font-bold text-slate-800">Upload finished photo</span>
                <span className="mt-1 text-xs text-slate-500">Use a cropped photo for best print layout results.</span>
              </>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => void handleFileChange(event.target.files?.[0])}
            />
          </label>

          {sourceSize && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <span className="font-semibold text-slate-900">Uploaded size:</span>{' '}
              <span className="text-slate-600">{sourceSize.width} x {sourceSize.height}px</span>
              <div className="mt-1">
                <span className="font-semibold text-slate-900">Prepared photo size:</span>{' '}
                <span className="text-slate-600">{outputSize.width} x {outputSize.height}px at {selectedSpec.dpi} DPI</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {sheetUrl && (
            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="font-bold text-slate-900">Preview</h3>
                {layoutInfo && (
                  <span className="text-sm font-semibold text-slate-500">
                    {layoutInfo.copies} copies ({layoutInfo.columns} x {layoutInfo.rows})
                  </span>
                )}
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-100 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sheetUrl} alt="Print sheet preview" className="mx-auto max-h-[520px] max-w-full rounded bg-white shadow-sm" />
              </div>
              <Button onClick={() => void downloadSheet()} className="mt-4 w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Download print layout JPG
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <label className="text-sm font-bold text-slate-900" htmlFor="print-photo-size">Photo size</label>
            <select
              id="print-photo-size"
              value={selectedSpecId}
              onChange={(event) => {
                cleanupUrl(sheetUrl)
                setSheetUrl('')
                setSheetCanvas(null)
                setLayoutInfo(null)
                setSelectedSpecId(event.target.value)
              }}
              className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800"
            >
              {photoSpecs.map((spec) => (
                <option key={spec.id} value={spec.id}>{spec.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-900" htmlFor="print-paper">Paper size</label>
            <select
              id="print-paper"
              value={selectedPaperId}
              onChange={(event) => {
                cleanupUrl(sheetUrl)
                setSheetUrl('')
                setSheetCanvas(null)
                setLayoutInfo(null)
                setSelectedPaperId(event.target.value)
              }}
              className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800"
            >
              {paperSpecs.map((paper) => (
                <option key={paper.id} value={paper.id}>{paper.label}</option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
            The uploaded image is fitted into the selected photo size before printing. For precise face placement, use
            the ID photo crop tool first.
          </div>

          <Button onClick={generateLayout} isLoading={isRendering} disabled={!sourceUrl || isRendering} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate print layout
          </Button>
        </div>
      </div>
    </Card>
  )
}

function cleanupUrl(url: string) {
  if (url) URL.revokeObjectURL(url)
}
