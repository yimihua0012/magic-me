'use client'

import { useMemo, useRef, useState, type PointerEvent } from 'react'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import type { Locale } from '@/lib/i18n'
import { Download, ImagePlus, Move, RefreshCw, Scan } from 'lucide-react'

type OutputFormat = 'image/jpeg' | 'image/png'

type AspectPreset = {
  id: string
  label: string
  width?: number
  height?: number
  original?: boolean
}

type CropResult = {
  url: string
  fileName: string
  width: number
  height: number
  format: OutputFormat
}

const presets: AspectPreset[] = [
  { id: 'original', label: 'Original ratio', original: true },
  { id: '1-1', label: '1:1 Square', width: 1, height: 1 },
  { id: '2-3', label: '2:3 Portrait', width: 2, height: 3 },
  { id: '3-2', label: '3:2 Landscape', width: 3, height: 2 },
  { id: '3-4', label: '3:4 Portrait', width: 3, height: 4 },
  { id: '4-3', label: '4:3 Landscape', width: 4, height: 3 },
  { id: '4-5', label: '4:5 Portrait', width: 4, height: 5 },
  { id: '16-9', label: '16:9 Wide', width: 16, height: 9 },
  { id: '9-16', label: '9:16 Story', width: 9, height: 16 },
  { id: '191-100', label: '1.91:1 Social', width: 1.91, height: 1 },
]

const outputLongEdges = [256, 512, 768, 1024, 1200, 1600, 2048, 2400, 3000, 3840]

const cropText: Record<Locale, {
  title: string
  description: string
  upload: string
  formatHint: string
  uploadedAlt: string
  aspectRatio: string
  dragHint: string
  zoom: string
  outputSize: string
  outputFormat: string
  jpg: string
  png: string
  reset: string
  crop: string
  download: string
  original: string
  position: string
  result: string
  invalidFile: string
  readFailed: string
  uploadFirst: string
  cropFailed: string
}> = {
  en: {
    title: 'Crop Photo by Common Aspect Ratio',
    description: 'Upload a photo, choose original ratio or a common ratio like 3:2, 2:3, 4:3, 3:4, or 9:16, then drag the image inside the crop frame and export a clean JPG or PNG.',
    upload: 'Upload image',
    formatHint: 'JPG, PNG, or WebP',
    uploadedAlt: 'Uploaded photo preview',
    aspectRatio: 'Aspect ratio',
    dragHint: 'Drag the image inside the crop frame to adjust the preview.',
    zoom: 'Zoom',
    outputSize: 'Output size',
    outputFormat: 'Output format',
    jpg: 'JPG',
    png: 'PNG',
    reset: 'Reset position',
    crop: 'Crop photo',
    download: 'Download cropped photo',
    original: 'Original',
    position: 'Position',
    result: 'Cropped result',
    invalidFile: 'Please upload a JPG, PNG, or WebP image.',
    readFailed: 'Could not read this image. Try another JPG, PNG, or WebP file.',
    uploadFirst: 'Upload an image first.',
    cropFailed: 'Could not crop this image.',
  },
  zh: {
    title: '按常用比例裁剪照片',
    description: '上传照片，选择原比例或 3:2、2:3、4:3、3:4、9:16 等常用比例，拖动图片预览后导出 JPG 或 PNG。',
    upload: '上传图片',
    formatHint: '支持 JPG、PNG 或 WebP',
    uploadedAlt: '上传照片预览',
    aspectRatio: '裁剪比例',
    dragHint: '拖动图片调整裁剪框内的位置。',
    zoom: '缩放',
    outputSize: '输出尺寸',
    outputFormat: '输出格式',
    jpg: 'JPG',
    png: 'PNG',
    reset: '重置位置',
    crop: '裁剪照片',
    download: '下载裁剪照片',
    original: '原比例',
    position: '位置',
    result: '裁剪结果',
    invalidFile: '请上传 JPG、PNG 或 WebP 图片。',
    readFailed: '无法读取这张图片，请换一张 JPG、PNG 或 WebP。',
    uploadFirst: '请先上传图片。',
    cropFailed: '无法裁剪这张图片。',
  },
  es: {
    title: 'Recortar foto por proporcion comun',
    description: 'Sube una foto, elige proporcion original, 3:2, 2:3, 4:3, 3:4 o 9:16, arrastra la imagen dentro del marco y exporta JPG o PNG.',
    upload: 'Subir imagen',
    formatHint: 'JPG, PNG o WebP',
    uploadedAlt: 'Vista previa',
    aspectRatio: 'Proporcion',
    dragHint: 'Arrastra la imagen dentro del marco para ajustar la vista previa.',
    zoom: 'Zoom',
    outputSize: 'Tamano final',
    outputFormat: 'Formato',
    jpg: 'JPG',
    png: 'PNG',
    reset: 'Restablecer posicion',
    crop: 'Recortar foto',
    download: 'Descargar foto',
    original: 'Original',
    position: 'Posicion',
    result: 'Resultado',
    invalidFile: 'Sube una imagen JPG, PNG o WebP.',
    readFailed: 'No se pudo leer esta imagen. Prueba con otro archivo.',
    uploadFirst: 'Sube una imagen primero.',
    cropFailed: 'No se pudo recortar esta imagen.',
  },
  fr: {
    title: 'Recadrer une photo par ratio courant',
    description: 'Importez une photo, choisissez le ratio original, 3:2, 2:3, 4:3, 3:4 ou 9:16, deplacez l image dans le cadre et exportez en JPG ou PNG.',
    upload: 'Importer image',
    formatHint: 'JPG, PNG ou WebP',
    uploadedAlt: 'Apercu importe',
    aspectRatio: 'Ratio',
    dragHint: 'Deplacez l image dans le cadre pour ajuster le cadrage.',
    zoom: 'Zoom',
    outputSize: 'Taille de sortie',
    outputFormat: 'Format',
    jpg: 'JPG',
    png: 'PNG',
    reset: 'Reinitialiser',
    crop: 'Recadrer la photo',
    download: 'Telecharger la photo',
    original: 'Original',
    position: 'Position',
    result: 'Resultat',
    invalidFile: 'Importez une image JPG, PNG ou WebP.',
    readFailed: 'Impossible de lire cette image. Essayez un autre fichier.',
    uploadFirst: 'Importez une image d abord.',
    cropFailed: 'Impossible de recadrer cette image.',
  },
  de: {
    title: 'Foto nach gaengigem Seitenverhaeltnis zuschneiden',
    description: 'Lade ein Foto hoch, waehle Originalverhaeltnis, 3:2, 2:3, 4:3, 3:4 oder 9:16, verschiebe das Bild im Rahmen und exportiere JPG oder PNG.',
    upload: 'Bild hochladen',
    formatHint: 'JPG, PNG oder WebP',
    uploadedAlt: 'Bildvorschau',
    aspectRatio: 'Seitenverhaeltnis',
    dragHint: 'Ziehe das Bild im Rahmen, um den Ausschnitt anzupassen.',
    zoom: 'Zoom',
    outputSize: 'Ausgabegroesse',
    outputFormat: 'Format',
    jpg: 'JPG',
    png: 'PNG',
    reset: 'Position zuruecksetzen',
    crop: 'Foto zuschneiden',
    download: 'Foto herunterladen',
    original: 'Original',
    position: 'Position',
    result: 'Ergebnis',
    invalidFile: 'Bitte lade JPG, PNG oder WebP hoch.',
    readFailed: 'Dieses Bild konnte nicht gelesen werden.',
    uploadFirst: 'Lade zuerst ein Bild hoch.',
    cropFailed: 'Bild konnte nicht zugeschnitten werden.',
  },
  ja: {
    title: 'よく使う比率で写真を切り抜き',
    description: '写真をアップロードし、原比例、3:2、2:3、4:3、3:4、9:16などを選び、枠内で画像を動かしてJPGまたはPNGで保存できます。',
    upload: '画像をアップロード',
    formatHint: 'JPG、PNG、WebP',
    uploadedAlt: 'アップロード画像のプレビュー',
    aspectRatio: '比率',
    dragHint: '切り抜き枠の中で画像をドラッグして位置を調整できます。',
    zoom: 'ズーム',
    outputSize: '出力サイズ',
    outputFormat: '保存形式',
    jpg: 'JPG',
    png: 'PNG',
    reset: '位置をリセット',
    crop: '写真を切り抜く',
    download: '切り抜き画像を保存',
    original: '元画像',
    position: '位置',
    result: '切り抜き結果',
    invalidFile: 'JPG、PNG、WebP画像をアップロードしてください。',
    readFailed: 'この画像を読み込めませんでした。別の画像を試してください。',
    uploadFirst: '先に画像をアップロードしてください。',
    cropFailed: '画像を切り抜けませんでした。',
  },
}

export default function AspectRatioCropTool({ locale = 'en' }: { locale?: Locale }) {
  const text = cropText[locale]
  const previewRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<{ pointerId: number; x: number; y: number; startX: number; startY: number } | null>(null)
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [sourcePreview, setSourcePreview] = useState('')
  const [sourceInfo, setSourceInfo] = useState<{ width: number; height: number } | null>(null)
  const [presetId, setPresetId] = useState('original')
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [longEdge, setLongEdge] = useState(1024)
  const [format, setFormat] = useState<OutputFormat>('image/jpeg')
  const [result, setResult] = useState<CropResult | null>(null)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const preset = useMemo(() => presets.find((item) => item.id === presetId) || presets[0], [presetId])
  const activeRatio = useMemo(() => {
    if (preset.original && sourceInfo) {
      return {
        width: sourceInfo.width,
        height: sourceInfo.height,
      }
    }

    return {
      width: preset.width || 1,
      height: preset.height || 1,
    }
  }, [preset, sourceInfo])
  const outputSize = useMemo(() => {
    if (activeRatio.width >= activeRatio.height) {
      return {
        width: longEdge,
        height: Math.round(longEdge * activeRatio.height / activeRatio.width),
      }
    }

    return {
      width: Math.round(longEdge * activeRatio.width / activeRatio.height),
      height: longEdge,
    }
  }, [activeRatio, longEdge])

  const handleFileChange = async (file?: File) => {
    cleanupResult(result)
    if (sourcePreview) URL.revokeObjectURL(sourcePreview)
    setResult(null)
    setError('')
    setOffset({ x: 0, y: 0 })
    setZoom(1)

    if (!file) {
      setSourceFile(null)
      setSourcePreview('')
      setSourceInfo(null)
      return
    }

    if (!file.type.startsWith('image/')) {
      setError(text.invalidFile)
      return
    }

    try {
      const dimensions = await readImageDimensions(file)
      setSourceFile(file)
      setSourcePreview(URL.createObjectURL(file))
      setSourceInfo(dimensions)
    } catch {
      setError(text.readFailed)
    }
  }

  const resetPosition = () => {
    setOffset({ x: 0, y: 0 })
    setZoom(1)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!sourcePreview) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      startX: offset.x,
      startY: offset.y,
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const frame = previewRef.current
    if (!drag || drag.pointerId !== event.pointerId || !frame) return
    const rect = frame.getBoundingClientRect()
    const dxPercent = ((event.clientX - drag.x) / Math.max(1, rect.width)) * 100
    const dyPercent = ((event.clientY - drag.y) / Math.max(1, rect.height)) * 100
    setOffset({
      x: clamp(drag.startX + dxPercent, -70, 70),
      y: clamp(drag.startY + dyPercent, -70, 70),
    })
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null
    }
  }

  const cropImage = async () => {
    if (!sourceFile) {
      setError(text.uploadFirst)
      return
    }

    cleanupResult(result)
    setResult(null)
    setError('')
    setIsProcessing(true)

    try {
      const image = await loadImage(sourceFile)
      const canvas = document.createElement('canvas')
      canvas.width = outputSize.width
      canvas.height = outputSize.height
      const context = canvas.getContext('2d')
      if (!context) throw new Error(text.cropFailed)

      if (format === 'image/jpeg') {
        context.fillStyle = '#ffffff'
        context.fillRect(0, 0, canvas.width, canvas.height)
      } else {
        context.clearRect(0, 0, canvas.width, canvas.height)
      }

      const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight) * zoom
      const drawWidth = image.naturalWidth * scale
      const drawHeight = image.naturalHeight * scale
      const drawX = (canvas.width - drawWidth) / 2 + (offset.x / 100) * canvas.width
      const drawY = (canvas.height - drawHeight) / 2 + (offset.y / 100) * canvas.height
      context.drawImage(image, drawX, drawY, drawWidth, drawHeight)

      const blob = await canvasToBlob(canvas, format, 0.94)
      const extension = format === 'image/png' ? 'png' : 'jpg'
      setResult({
        url: URL.createObjectURL(blob),
        fileName: `${sourceFile.name.replace(/\.[^.]+$/, '') || 'aspect-crop'}-${preset.id}-${canvas.width}x${canvas.height}.${extension}`,
        width: canvas.width,
        height: canvas.height,
        format,
      })
    } catch (cropError) {
      setError(cropError instanceof Error ? cropError.message : text.cropFailed)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Scan className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">{text.title}</h2>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{text.description}</p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="border-b border-slate-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          {!sourcePreview ? (
            <label className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition-colors hover:border-blue-300 hover:bg-blue-50/40">
              <ImagePlus className="h-10 w-10 text-slate-400" />
              <span className="mt-3 text-sm font-bold text-slate-800">{text.upload}</span>
              <span className="mt-1 text-xs text-slate-500">{text.formatHint}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                onChange={(event) => void handleFileChange(event.target.files?.[0])}
              />
            </label>
          ) : (
            <div>
              <div
                ref={previewRef}
                role="img"
                aria-label={text.uploadedAlt}
                className="relative mx-auto w-full max-w-[480px] cursor-grab touch-none overflow-hidden rounded-xl bg-slate-900 shadow-xl shadow-slate-950/10 active:cursor-grabbing"
                style={{ aspectRatio: `${activeRatio.width} / ${activeRatio.height}` }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sourcePreview}
                  alt={text.uploadedAlt}
                  draggable={false}
                  className="pointer-events-none absolute left-1/2 top-1/2 h-full w-full select-none object-cover"
                  style={{
                    left: `calc(50% + ${offset.x}%)`,
                    top: `calc(50% + ${offset.y}%)`,
                    transform: `translate(-50%, -50%) scale(${zoom})`,
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.5)_2px,transparent_2px),linear-gradient(to_bottom,rgba(255,255,255,0.5)_2px,transparent_2px)] bg-[size:33.333%_33.333%]" />
                <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-slate-950/70 px-3 py-1 text-xs font-semibold text-white">
                  <Move className="mr-1 inline h-3.5 w-3.5" />
                  {text.dragHint}
                </div>
              </div>
              <label className="mt-4 inline-flex cursor-pointer text-sm font-semibold text-blue-600 hover:underline">
                {text.upload}
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => void handleFileChange(event.target.files?.[0])}
                />
              </label>
            </div>
          )}

          {sourceInfo && (
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <Metric label={text.original} value={`${sourceInfo.width} x ${sourceInfo.height}`} />
              <Metric label={text.aspectRatio} value={preset.label} />
              <Metric label={text.outputSize} value={`${outputSize.width} x ${outputSize.height}`} />
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="grid gap-3 text-sm sm:grid-cols-3">
                <Metric label={text.result} value={`${result.width} x ${result.height}`} />
                <Metric label={text.aspectRatio} value={preset.label} />
                <Metric label={text.outputFormat} value={result.format === 'image/png' ? 'PNG' : 'JPG'} />
              </div>
              <a href={result.url} download={result.fileName} className="mt-4 inline-flex w-full sm:w-auto">
                <Button className="w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  {text.download}
                </Button>
              </a>
            </div>
          )}
        </div>

        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <label className="text-sm font-bold text-slate-900" htmlFor="aspect-preset">{text.aspectRatio}</label>
            <select
              id="aspect-preset"
              value={presetId}
              onChange={(event) => {
                setPresetId(event.target.value)
                setOffset({ x: 0, y: 0 })
              }}
              className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800"
            >
              {presets.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-900" htmlFor="aspect-output-size">{text.outputSize}</label>
            <select
              id="aspect-output-size"
              value={longEdge}
              onChange={(event) => setLongEdge(Number(event.target.value) || 1024)}
              className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800"
            >
              {outputLongEdges.map((edge) => (
                <option key={edge} value={edge}>{edge}px</option>
              ))}
            </select>
            <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              {outputSize.width} x {outputSize.height}
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-900" htmlFor="aspect-zoom">{text.zoom}</label>
            <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-center text-2xl font-bold text-blue-700">
              {Math.round(zoom * 100)}%
            </div>
            <input
              id="aspect-zoom"
              type="range"
              min={100}
              max={300}
              step={1}
              value={Math.round(zoom * 100)}
              onChange={(event) => setZoom((Number(event.target.value) || 100) / 100)}
              className="mt-2 w-full"
            />
          </div>

          <div>
            <div className="text-sm font-bold text-slate-900">{text.outputFormat}</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormat('image/jpeg')}
                className={`rounded-lg border px-3 py-2 text-sm font-bold ${
                  format === 'image/jpeg' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {text.jpg}
              </button>
              <button
                type="button"
                onClick={() => setFormat('image/png')}
                className={`rounded-lg border px-3 py-2 text-sm font-bold ${
                  format === 'image/png' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {text.png}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={resetPosition}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            {text.reset}
          </button>

          <Button onClick={cropImage} isLoading={isProcessing} disabled={!sourceFile || isProcessing} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            {text.crop}
          </Button>
        </div>
      </div>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 font-bold text-slate-900">{value}</div>
    </div>
  )
}

function readImageDimensions(file: File) {
  return loadImage(file).then((image) => ({
    width: image.naturalWidth,
    height: image.naturalHeight,
  }))
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Could not load image.'))
    }
    image.src = url
  })
}

function canvasToBlob(canvas: HTMLCanvasElement, type: OutputFormat, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Could not export image.'))
    }, type, quality)
  })
}

function cleanupResult(result: CropResult | null) {
  if (result?.url) URL.revokeObjectURL(result.url)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
