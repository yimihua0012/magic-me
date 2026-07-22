'use client'

import { useMemo, useRef, useState, type PointerEvent } from 'react'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import type { Locale } from '@/lib/i18n'
import { Circle, Download, Heart, ImagePlus, RefreshCw, Shapes } from 'lucide-react'

type CropShape = 'circle' | 'heart' | 'square' | 'rounded-square' | 'rounded-rectangle'

type ShapeCropResult = {
  url: string
  fileName: string
  width: number
  height: number
}

const shapeText: Record<Locale, {
  title: string
  description: string
  upload: string
  formatHint: string
  uploadedAlt: string
  shape: string
  outputSize: string
  size: string
  zoom: string
  outputFormat: string
  download: string
  crop: string
  invalidFile: string
  readFailed: string
  uploadFirst: string
  cropFailed: string
  result: string
  circle: string
  heart: string
  square: string
  roundedSquare: string
  roundedRectangle: string
}> = {
  en: {
    title: 'Shape Crop Photo',
    description: 'Crop a photo into a clean circle, heart, square, rounded square, or rounded rectangle for avatars, profile pictures, badges, app icons, and social images. PNG exports keep transparent corners.',
    upload: 'Upload image',
    formatHint: 'JPG, PNG, or WebP',
    uploadedAlt: 'Uploaded photo preview',
    shape: 'Shape',
    outputSize: 'Output size',
    size: 'Size',
    zoom: 'Zoom',
    outputFormat: 'Transparent PNG',
    download: 'Download cropped photo',
    crop: 'Crop photo',
    invalidFile: 'Please upload a JPG, PNG, or WebP image.',
    readFailed: 'Could not read this image. Try another JPG, PNG, or WebP file.',
    uploadFirst: 'Upload an image first.',
    cropFailed: 'Could not crop this image.',
    result: 'Cropped result',
    circle: 'Circle',
    heart: 'Heart',
    square: 'Square',
    roundedSquare: 'Rounded square',
    roundedRectangle: 'Rounded rectangle',
  },
  es: {
    title: 'Recortar foto por forma',
    description: 'Recorta una foto en circulo, corazon, cuadrado, cuadrado redondeado o rectangulo redondeado para avatar, perfil, credencial, icono o redes sociales.',
    upload: 'Subir imagen',
    formatHint: 'JPG, PNG o WebP',
    uploadedAlt: 'Vista previa',
    shape: 'Forma de recorte',
    outputSize: 'Tamano final',
    size: 'Tamano',
    zoom: 'Zoom',
    outputFormat: 'PNG transparente',
    download: 'Descargar foto recortada',
    crop: 'Recortar forma',
    invalidFile: 'Sube una imagen JPG, PNG o WebP.',
    readFailed: 'No se pudo leer esta imagen. Prueba con otro archivo.',
    uploadFirst: 'Sube una imagen primero.',
    cropFailed: 'No se pudo recortar esta imagen.',
    result: 'Resultado recortado',
    circle: 'Circulo',
    heart: 'Heart',
    square: 'Cuadrado',
    roundedSquare: 'Cuadrado redondeado',
    roundedRectangle: 'Rectangulo redondeado',
  },
  fr: {
    title: 'Recadrer une photo par forme',
    description: 'Recadrez une photo en cercle, coeur, carre, carre arrondi ou rectangle arrondi pour avatar, profil, badge, icone ou image sociale.',
    upload: 'Importer image',
    formatHint: 'JPG, PNG ou WebP',
    uploadedAlt: 'Apercu importe',
    shape: 'Forme de recadrage',
    outputSize: 'Taille de sortie',
    size: 'Taille',
    zoom: 'Zoom',
    outputFormat: 'PNG transparent',
    download: 'Telecharger la photo',
    crop: 'Recadrer la forme',
    invalidFile: 'Importez une image JPG, PNG ou WebP.',
    readFailed: 'Impossible de lire cette image. Essayez un autre fichier.',
    uploadFirst: 'Importez une image d abord.',
    cropFailed: 'Impossible de recadrer cette image.',
    result: 'Resultat recadre',
    circle: 'Cercle',
    heart: 'Heart',
    square: 'Carre',
    roundedSquare: 'Carre arrondi',
    roundedRectangle: 'Rectangle arrondi',
  },
  de: {
    title: 'Foto in Form zuschneiden',
    description: 'Schneide ein Foto als Kreis, Herz, Quadrat, abgerundetes Quadrat oder abgerundetes Rechteck fuer Avatar, Profilbild, Badge, Icon oder Social Media zu.',
    upload: 'Bild hochladen',
    formatHint: 'JPG, PNG oder WebP',
    uploadedAlt: 'Bildvorschau',
    shape: 'Form',
    outputSize: 'Ausgabegroesse',
    size: 'Groesse',
    zoom: 'Zoom',
    outputFormat: 'Transparentes PNG',
    download: 'Zugeschnittenes Foto laden',
    crop: 'Fotoform zuschneiden',
    invalidFile: 'Bitte lade JPG, PNG oder WebP hoch.',
    readFailed: 'Dieses Bild konnte nicht gelesen werden.',
    uploadFirst: 'Lade zuerst ein Bild hoch.',
    cropFailed: 'Bild konnte nicht zugeschnitten werden.',
    result: 'Zugeschnittenes Ergebnis',
    circle: 'Kreis',
    heart: 'Heart',
    square: 'Quadrat',
    roundedSquare: 'Abgerundetes Quadrat',
    roundedRectangle: 'Abgerundetes Rechteck',
  },
  ja: {
    title: '写真を形に合わせて切り抜き',
    description: '写真を円形、正方形、角丸、角丸長方形に切り抜き、プロフィール画像、バッジ、SNS用画像として保存できます。',
    upload: '画像をアップロード',
    formatHint: 'JPG、PNG、WebP',
    uploadedAlt: 'アップロード画像のプレビュー',
    shape: '切り抜き形状',
    outputSize: '出力サイズ',
    size: 'サイズ',
    zoom: 'ズーム',
    outputFormat: '透過PNG',
    download: '切り抜き画像を保存',
    crop: '形に合わせて切り抜く',
    invalidFile: 'JPG、PNG、WebP画像をアップロードしてください。',
    readFailed: 'この画像を読み込めませんでした。別の画像を試してください。',
    uploadFirst: '先に画像をアップロードしてください。',
    cropFailed: '画像を切り抜けませんでした。',
    result: '切り抜き結果',
    circle: '円形',
    heart: 'Heart',
    square: '正方形',
    roundedSquare: '角丸正方形',
    roundedRectangle: '角丸長方形',
  },
}

const outputSizes = [
  { label: '256 x 256', width: 256, height: 256 },
  { label: '512 x 512', width: 512, height: 512 },
  { label: '768 x 768', width: 768, height: 768 },
  { label: '800 x 800', width: 800, height: 800 },
  { label: '1024 x 1024', width: 1024, height: 1024 },
  { label: '1080 x 1080', width: 1080, height: 1080 },
  { label: '1200 x 1200', width: 1200, height: 1200 },
  { label: '1200 x 630', width: 1200, height: 630 },
  { label: '1600 x 900', width: 1600, height: 900 },
  { label: '1080 x 1920', width: 1080, height: 1920 },
]

export default function ShapeCropTool({ locale = 'en' }: { locale?: Locale }) {
  const text = shapeText[locale]
  const previewRef = useRef<HTMLDivElement | null>(null)
  const previewImageRef = useRef<HTMLImageElement | null>(null)
  const offsetRef = useRef({ x: 0, y: 0 })
  const dragRef = useRef<{ pointerId: number; x: number; y: number; startX: number; startY: number } | null>(null)
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [sourcePreview, setSourcePreview] = useState('')
  const [sourceInfo, setSourceInfo] = useState<{ width: number; height: number } | null>(null)
  const [shape, setShape] = useState<CropShape>('circle')
  const [outputIndex, setOutputIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [result, setResult] = useState<ShapeCropResult | null>(null)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const output = outputSizes[outputIndex] || outputSizes[0]
  const shapeOptions = useMemo(() => [
    { id: 'circle' as const, label: text.circle, icon: Circle },
    { id: 'heart' as const, label: text.heart, icon: Heart },
    { id: 'square' as const, label: text.square, icon: Shapes },
    { id: 'rounded-square' as const, label: text.roundedSquare, icon: Shapes },
    { id: 'rounded-rectangle' as const, label: text.roundedRectangle, icon: Shapes },
  ], [text])

  const resetPosition = () => {
    const nextOffset = { x: 0, y: 0 }
    offsetRef.current = nextOffset
    setOffset(nextOffset)
    setZoom(1)
    if (previewImageRef.current) {
      previewImageRef.current.style.left = '50%'
      previewImageRef.current.style.top = '50%'
    }
  }

  const handleFileChange = async (file?: File) => {
    cleanupResult(result)
    if (sourcePreview) URL.revokeObjectURL(sourcePreview)
    setResult(null)
    setError('')
    resetPosition()

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

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!sourcePreview) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      startX: offsetRef.current.x,
      startY: offsetRef.current.y,
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const frame = previewRef.current
    if (!drag || drag.pointerId !== event.pointerId || !frame) return
    const rect = frame.getBoundingClientRect()
    const dxPercent = ((event.clientX - drag.x) / Math.max(1, rect.width)) * 100
    const dyPercent = ((event.clientY - drag.y) / Math.max(1, rect.height)) * 100
    const nextOffset = {
      x: clamp(drag.startX + dxPercent, -70, 70),
      y: clamp(drag.startY + dyPercent, -70, 70),
    }
    offsetRef.current = nextOffset
    if (previewImageRef.current) {
      previewImageRef.current.style.left = `calc(50% + ${nextOffset.x}%)`
      previewImageRef.current.style.top = `calc(50% + ${nextOffset.y}%)`
    }
  }

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null
      setOffset(offsetRef.current)
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
      canvas.width = output.width
      canvas.height = output.height
      const context = canvas.getContext('2d')
      if (!context) throw new Error(text.cropFailed)

      context.clearRect(0, 0, canvas.width, canvas.height)

      context.save()
      drawClipPath(context, shape, canvas.width, canvas.height)
      context.clip()

      const coverScale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight) * zoom
      const drawWidth = image.naturalWidth * coverScale
      const drawHeight = image.naturalHeight * coverScale
      const drawX = (canvas.width - drawWidth) / 2 + (offset.x / 100) * canvas.width
      const drawY = (canvas.height - drawHeight) / 2 + (offset.y / 100) * canvas.height
      context.drawImage(image, drawX, drawY, drawWidth, drawHeight)
      context.restore()

      const blob = await canvasToBlob(canvas, 'image/png')
      setResult({
        url: URL.createObjectURL(blob),
        fileName: `${sourceFile.name.replace(/\.[^.]+$/, '') || 'shape-crop'}-${shape}-${output.width}x${output.height}.png`,
        width: output.width,
        height: output.height,
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
          <Shapes className="h-5 w-5 text-blue-600" />
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
                className="relative mx-auto w-full max-w-[420px] cursor-grab touch-none overflow-hidden rounded-xl bg-slate-900 shadow-xl shadow-slate-950/10 active:cursor-grabbing"
                style={{ aspectRatio: `${output.width} / ${output.height}` }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(-45deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#e2e8f0_75%),linear-gradient(-45deg,transparent_75%,#e2e8f0_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] opacity-80" />
                <div className="absolute inset-0 bg-slate-950/45" />
                <div
                  className="absolute inset-0 overflow-hidden bg-white"
                  style={{ clipPath: cssClipPathForShape(shape) }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={previewImageRef}
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
              <Metric label="Original" value={`${sourceInfo.width} x ${sourceInfo.height}`} />
              <Metric label={text.shape} value={shapeOptions.find((item) => item.id === shape)?.label || text.circle} />
              <Metric label={text.outputSize} value={`${output.width} x ${output.height}`} />
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
                <Metric label={text.outputFormat} value={text.outputFormat} />
                <Metric label={text.shape} value={shapeOptions.find((item) => item.id === shape)?.label || text.circle} />
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
            <div className="text-sm font-bold text-slate-900">{text.shape}</div>
            <div className="mt-3 grid gap-2">
              {shapeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setShape(option.id)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold ${
                    shape === option.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <option.icon className="h-4 w-4" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-900" htmlFor="shape-output-size">{text.outputSize}</label>
            <select
              id="shape-output-size"
              value={outputIndex}
              onChange={(event) => setOutputIndex(Number(event.target.value) || 0)}
              className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800"
            >
              {outputSizes.map((size, index) => (
                <option key={size.label} value={index}>{size.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-900" htmlFor="shape-zoom">{text.zoom}</label>
            <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-center text-2xl font-bold text-blue-700">
              {Math.round(zoom * 100)}%
            </div>
            <input
              id="shape-zoom"
              type="range"
              min={100}
              max={300}
              step={1}
              value={Math.round(zoom * 100)}
              onChange={(event) => setZoom((Number(event.target.value) || 100) / 100)}
              className="mt-2 w-full"
            />
            <button
              type="button"
              onClick={resetPosition}
              className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              Reset position
            </button>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Format</div>
            <div className="mt-1 text-sm font-bold text-slate-900">{text.outputFormat}</div>
          </div>

          <Button onClick={cropImage} isLoading={isProcessing} disabled={!sourceFile || isProcessing} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            {text.crop}
          </Button>
        </div>
      </div>
    </Card>
  )
}

function cssClipPathForShape(shape: CropShape) {
  if (shape === 'circle') return 'circle(50% at 50% 50%)'
  if (shape === 'heart') {
    return 'path("M 50 90 C 24 68 9 53 9 34 C 9 19 20 10 34 10 C 42 10 48 15 50 23 C 52 15 58 10 66 10 C 80 10 91 19 91 34 C 91 53 76 68 50 90 Z")'
  }
  if (shape === 'rounded-square' || shape === 'rounded-rectangle') return 'inset(0 round 12%)'
  return 'inset(0)'
}

function drawClipPath(context: CanvasRenderingContext2D, shape: CropShape, width: number, height: number) {
  context.beginPath()
  if (shape === 'circle') {
    const radius = Math.min(width, height) / 2
    context.arc(width / 2, height / 2, radius, 0, Math.PI * 2)
    return
  }
  if (shape === 'heart') {
    heartPath(context, width, height)
    return
  }
  if (shape === 'rounded-square' || shape === 'rounded-rectangle') {
    const radius = Math.min(width, height) * 0.12
    roundedRectPath(context, 0, 0, width, height, radius)
    return
  }
  context.rect(0, 0, width, height)
}

function heartPath(context: CanvasRenderingContext2D, width: number, height: number) {
  context.moveTo(width * 0.5, height * 0.9)
  context.bezierCurveTo(width * 0.24, height * 0.68, width * 0.09, height * 0.53, width * 0.09, height * 0.34)
  context.bezierCurveTo(width * 0.09, height * 0.19, width * 0.2, height * 0.1, width * 0.34, height * 0.1)
  context.bezierCurveTo(width * 0.42, height * 0.1, width * 0.48, height * 0.15, width * 0.5, height * 0.23)
  context.bezierCurveTo(width * 0.52, height * 0.15, width * 0.58, height * 0.1, width * 0.66, height * 0.1)
  context.bezierCurveTo(width * 0.8, height * 0.1, width * 0.91, height * 0.19, width * 0.91, height * 0.34)
  context.bezierCurveTo(width * 0.91, height * 0.53, width * 0.76, height * 0.68, width * 0.5, height * 0.9)
  context.closePath()
}

function roundedRectPath(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2)
  context.moveTo(x + r, y)
  context.lineTo(x + width - r, y)
  context.quadraticCurveTo(x + width, y, x + width, y + r)
  context.lineTo(x + width, y + height - r)
  context.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  context.lineTo(x + r, y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - r)
  context.lineTo(x, y + r)
  context.quadraticCurveTo(x, y, x + r, y)
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

function canvasToBlob(canvas: HTMLCanvasElement, type: 'image/png') {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Could not export image.'))
    }, type)
  })
}

function cleanupResult(result: ShapeCropResult | null) {
  if (result?.url) URL.revokeObjectURL(result.url)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
