'use client'

import { useMemo, useState } from 'react'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import type { Locale } from '@/lib/i18n'
import { Download, ImagePlus, RefreshCw, SlidersHorizontal } from 'lucide-react'

type ResizeResult = {
  url: string
  fileName: string
  sizeBytes: number
  width: number
  height: number
  quality: number
}

type ResizeMode = 'scale' | 'exact'

type ResizeImageKbToolProps = {
  title?: string
  description?: string
  actionLabel?: string
  targetKbOnly?: boolean
  locale?: Locale
}

const resizeText: Record<Locale, {
  title: string
  description: string
  action: string
  upload: string
  formatHint: string
  uploadedAlt: string
  originalSize: string
  dimensions: string
  outputTarget: string
  outputSize: string
  outputDimensions: string
  quality: string
  download: string
  resizeMode: string
  proportional: string
  exactSize: string
  scalePercentage: string
  exactDimensions: string
  width: string
  height: string
  keepAspectRatio: string
  targetFileSize: string
  outputFormat: string
  invalidFile: string
  readFailed: string
  uploadFirst: string
  resizeFailed: string
}> = {
  en: {
    title: 'Resize Image',
    description: 'Resize a JPG, PNG, or WebP image by proportional scaling, exact pixel dimensions, or target file size for online applications, school portals, job forms, profile uploads, and document-style photo requirements. Processing happens locally in your browser.',
    action: 'Resize image',
    upload: 'Upload image',
    formatHint: 'JPG, PNG, or WebP',
    uploadedAlt: 'Uploaded preview',
    originalSize: 'Original size',
    dimensions: 'Dimensions',
    outputTarget: 'Output target',
    outputSize: 'Output size',
    outputDimensions: 'Output dimensions',
    quality: 'Quality',
    download: 'Download resized image',
    resizeMode: 'Resize mode',
    proportional: 'Proportional',
    exactSize: 'Exact size',
    scalePercentage: 'Scale percentage',
    exactDimensions: 'Exact dimensions',
    width: 'Width px',
    height: 'Height px',
    keepAspectRatio: 'Keep aspect ratio',
    targetFileSize: 'Target file size',
    outputFormat: 'Output format',
    invalidFile: 'Please upload a JPG, PNG, or WebP image.',
    readFailed: 'Could not read this image. Try another JPG, PNG, or WebP file.',
    uploadFirst: 'Upload an image first.',
    resizeFailed: 'Could not resize this image.',
  },
  zh: {
    title: '调整图片尺寸',
    description: '按比例缩放、指定像素尺寸或目标文件大小调整 JPG、PNG、WebP 图片，适合报名表、学校系统、求职表单、头像上传和证件照要求。处理在浏览器本地完成。',
    action: '调整图片',
    upload: '上传图片',
    formatHint: '支持 JPG、PNG 或 WebP',
    uploadedAlt: '上传图片预览',
    originalSize: '原始大小',
    dimensions: '尺寸',
    outputTarget: '输出目标',
    outputSize: '输出大小',
    outputDimensions: '输出尺寸',
    quality: '质量',
    download: '下载调整后的图片',
    resizeMode: '调整方式',
    proportional: '按比例',
    exactSize: '指定尺寸',
    scalePercentage: '缩放比例',
    exactDimensions: '精确尺寸',
    width: '宽度 px',
    height: '高度 px',
    keepAspectRatio: '保持比例',
    targetFileSize: '目标文件大小',
    outputFormat: '输出格式',
    invalidFile: '请上传 JPG、PNG 或 WebP 图片。',
    readFailed: '无法读取这张图片，请换一张 JPG、PNG 或 WebP。',
    uploadFirst: '请先上传图片。',
    resizeFailed: '无法调整这张图片。',
  },
  es: {
    title: 'Redimensionar imagen',
    description: 'Cambia el tamaño de JPG, PNG o WebP por proporción, píxeles exactos o tamaño objetivo en KB. El procesamiento ocurre en tu navegador.',
    action: 'Redimensionar imagen',
    upload: 'Subir imagen',
    formatHint: 'JPG, PNG o WebP',
    uploadedAlt: 'Vista previa subida',
    originalSize: 'Tamaño original',
    dimensions: 'Dimensiones',
    outputTarget: 'Objetivo de salida',
    outputSize: 'Tamaño final',
    outputDimensions: 'Dimensiones finales',
    quality: 'Calidad',
    download: 'Descargar imagen',
    resizeMode: 'Modo de tamaño',
    proportional: 'Proporcional',
    exactSize: 'Tamaño exacto',
    scalePercentage: 'Porcentaje',
    exactDimensions: 'Dimensiones exactas',
    width: 'Ancho px',
    height: 'Alto px',
    keepAspectRatio: 'Mantener proporción',
    targetFileSize: 'Tamaño objetivo',
    outputFormat: 'Formato de salida',
    invalidFile: 'Sube una imagen JPG, PNG o WebP.',
    readFailed: 'No se pudo leer esta imagen. Prueba con otro JPG, PNG o WebP.',
    uploadFirst: 'Sube una imagen primero.',
    resizeFailed: 'No se pudo redimensionar esta imagen.',
  },
  fr: {
    title: 'Redimensionner image',
    description: 'Redimensionnez JPG, PNG ou WebP par proportion, pixels exacts ou taille cible en KB. Le traitement reste dans le navigateur.',
    action: 'Redimensionner',
    upload: 'Importer image',
    formatHint: 'JPG, PNG ou WebP',
    uploadedAlt: 'Aperçu importé',
    originalSize: 'Taille originale',
    dimensions: 'Dimensions',
    outputTarget: 'Cible de sortie',
    outputSize: 'Taille finale',
    outputDimensions: 'Dimensions finales',
    quality: 'Qualité',
    download: 'Télécharger l’image',
    resizeMode: 'Mode de taille',
    proportional: 'Proportionnel',
    exactSize: 'Taille exacte',
    scalePercentage: 'Pourcentage',
    exactDimensions: 'Dimensions exactes',
    width: 'Largeur px',
    height: 'Hauteur px',
    keepAspectRatio: 'Conserver les proportions',
    targetFileSize: 'Taille cible',
    outputFormat: 'Format de sortie',
    invalidFile: 'Importez une image JPG, PNG ou WebP.',
    readFailed: 'Impossible de lire cette image. Essayez un autre JPG, PNG ou WebP.',
    uploadFirst: 'Importez une image d’abord.',
    resizeFailed: 'Impossible de redimensionner cette image.',
  },
  de: {
    title: 'Bild skalieren',
    description: 'Skaliere JPG, PNG oder WebP proportional, mit exakten Pixelmassen oder Zielgroesse in KB. Die Verarbeitung bleibt im Browser.',
    action: 'Bild skalieren',
    upload: 'Bild hochladen',
    formatHint: 'JPG, PNG oder WebP',
    uploadedAlt: 'Hochgeladene Vorschau',
    originalSize: 'Originalgroesse',
    dimensions: 'Abmessungen',
    outputTarget: 'Ausgabeziel',
    outputSize: 'Ausgabegroesse',
    outputDimensions: 'Ausgabeabmessungen',
    quality: 'Qualitaet',
    download: 'Bild herunterladen',
    resizeMode: 'Skalierungsmodus',
    proportional: 'Proportional',
    exactSize: 'Exakte Groesse',
    scalePercentage: 'Prozentwert',
    exactDimensions: 'Exakte Abmessungen',
    width: 'Breite px',
    height: 'Hoehe px',
    keepAspectRatio: 'Seitenverhaeltnis behalten',
    targetFileSize: 'Zieldateigroesse',
    outputFormat: 'Ausgabeformat',
    invalidFile: 'Bitte lade ein JPG, PNG oder WebP hoch.',
    readFailed: 'Dieses Bild konnte nicht gelesen werden. Versuche ein anderes JPG, PNG oder WebP.',
    uploadFirst: 'Lade zuerst ein Bild hoch.',
    resizeFailed: 'Bild konnte nicht skaliert werden.',
  },
  ja: {
    title: '画像サイズ変更',
    description: 'JPG、PNG、WebPを比率、ピクセル指定、または目標KBサイズで調整できます。処理はブラウザ内で行われます。',
    action: '画像サイズを変更',
    upload: '画像をアップロード',
    formatHint: 'JPG、PNG、WebP',
    uploadedAlt: 'アップロード画像プレビュー',
    originalSize: '元サイズ',
    dimensions: '画像サイズ',
    outputTarget: '出力目標',
    outputSize: '出力サイズ',
    outputDimensions: '出力画像サイズ',
    quality: '画質',
    download: '画像を保存',
    resizeMode: 'サイズ変更モード',
    proportional: '比率指定',
    exactSize: 'サイズ指定',
    scalePercentage: '拡大縮小率',
    exactDimensions: '正確なサイズ',
    width: '幅 px',
    height: '高さ px',
    keepAspectRatio: '縦横比を維持',
    targetFileSize: '目標ファイルサイズ',
    outputFormat: '出力形式',
    invalidFile: 'JPG、PNG、WebP画像をアップロードしてください。',
    readFailed: '画像を読み込めませんでした。別のJPG、PNG、WebPを試してください。',
    uploadFirst: '先に画像をアップロードしてください。',
    resizeFailed: '画像サイズを変更できませんでした。',
  },
}

export default function ResizeImageKbTool({
  title,
  description,
  actionLabel,
  targetKbOnly = false,
  locale = 'en',
}: ResizeImageKbToolProps) {
  const text = resizeText[locale]
  const resolvedTitle = title || text.title
  const resolvedDescription = description || text.description
  const resolvedActionLabel = actionLabel || text.action
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [sourcePreview, setSourcePreview] = useState('')
  const [sourceInfo, setSourceInfo] = useState<{ width: number; height: number; sizeBytes: number } | null>(null)
  const [resizeMode, setResizeMode] = useState<ResizeMode>('scale')
  const [scalePercent, setScalePercent] = useState(50)
  const [targetWidth, setTargetWidth] = useState(1024)
  const [targetHeight, setTargetHeight] = useState(1024)
  const [keepAspectRatio, setKeepAspectRatio] = useState(true)
  const [limitFileSize, setLimitFileSize] = useState(true)
  const [targetKb, setTargetKb] = useState(200)
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg')
  const [result, setResult] = useState<ResizeResult | null>(null)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const sourceSizeLabel = sourceInfo ? formatBytes(sourceInfo.sizeBytes) : ''
  const resultSizeLabel = result ? formatBytes(result.sizeBytes) : ''
  const shouldLimitFileSize = targetKbOnly || limitFileSize
  const targetBytes = useMemo(() => Math.max(10, targetKb) * 1024, [targetKb])
  const outputDimensions = useMemo(() => {
    if (!sourceInfo) return { width: 0, height: 0 }
    if (targetKbOnly) {
      return {
        width: sourceInfo.width,
        height: sourceInfo.height,
      }
    }
    if (resizeMode === 'scale') {
      const scale = Math.max(1, scalePercent) / 100
      return {
        width: Math.max(1, Math.round(sourceInfo.width * scale)),
        height: Math.max(1, Math.round(sourceInfo.height * scale)),
      }
    }

    return {
      width: Math.max(1, Math.round(targetWidth)),
      height: Math.max(1, Math.round(targetHeight)),
    }
  }, [resizeMode, scalePercent, sourceInfo, targetHeight, targetKbOnly, targetWidth])

  const handleFileChange = async (file?: File) => {
    cleanupResult(result)
    if (sourcePreview) URL.revokeObjectURL(sourcePreview)
    setResult(null)
    setError('')

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
      setSourceInfo({ ...dimensions, sizeBytes: file.size })
      setTargetWidth(dimensions.width)
      setTargetHeight(dimensions.height)
    } catch {
      setError(text.readFailed)
    }
  }

  const updateTargetWidth = (width: number) => {
    const nextWidth = Math.max(1, Math.round(width || 1))
    setTargetWidth(nextWidth)
    if (keepAspectRatio && sourceInfo) {
      setTargetHeight(Math.max(1, Math.round(nextWidth * sourceInfo.height / sourceInfo.width)))
    }
  }

  const updateTargetHeight = (height: number) => {
    const nextHeight = Math.max(1, Math.round(height || 1))
    setTargetHeight(nextHeight)
    if (keepAspectRatio && sourceInfo) {
      setTargetWidth(Math.max(1, Math.round(nextHeight * sourceInfo.width / sourceInfo.height)))
    }
  }

  const resizeImage = async () => {
    if (!sourceFile) {
      setError(text.uploadFirst)
      return
    }

    cleanupResult(result)
    setResult(null)
    setError('')
    setIsProcessing(true)

    try {
      const output = await resizeImageFile(sourceFile, {
        width: outputDimensions.width,
        height: outputDimensions.height,
        targetBytes: shouldLimitFileSize ? targetBytes : undefined,
        format,
      })
      setResult(output)
    } catch (resizeError) {
      setError(resizeError instanceof Error ? resizeError.message : text.resizeFailed)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">{resolvedTitle}</h2>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          {resolvedDescription}
        </p>
      </div>

      <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="border-b border-slate-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <label className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition-colors hover:border-blue-300 hover:bg-blue-50/40">
            {sourcePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sourcePreview} alt={text.uploadedAlt} className="max-h-[360px] max-w-full rounded-lg object-contain shadow-sm" />
            ) : (
              <>
                <ImagePlus className="h-10 w-10 text-slate-400" />
                <span className="mt-3 text-sm font-bold text-slate-800">{text.upload}</span>
                <span className="mt-1 text-xs text-slate-500">{text.formatHint}</span>
              </>
            )}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => void handleFileChange(event.target.files?.[0])}
            />
          </label>

          {sourceInfo && (
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <Metric label={text.originalSize} value={sourceSizeLabel} />
              <Metric label={text.dimensions} value={`${sourceInfo.width} x ${sourceInfo.height}`} />
              <Metric label={text.outputTarget} value={`${outputDimensions.width} x ${outputDimensions.height}`} />
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
                <Metric label={text.outputSize} value={resultSizeLabel} />
                <Metric label={text.outputDimensions} value={`${result.width} x ${result.height}`} />
                <Metric label={text.quality} value={`${Math.round(result.quality * 100)}%`} />
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
          {!targetKbOnly && (
            <div>
              <div className="text-sm font-bold text-slate-900">{text.resizeMode}</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setResizeMode('scale')}
                  className={`rounded-lg border px-3 py-2 text-sm font-bold ${
                    resizeMode === 'scale' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {text.proportional}
                </button>
                <button
                  type="button"
                  onClick={() => setResizeMode('exact')}
                  className={`rounded-lg border px-3 py-2 text-sm font-bold ${
                    resizeMode === 'exact' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {text.exactSize}
                </button>
              </div>
            </div>
          )}

          {!targetKbOnly && resizeMode === 'scale' ? (
            <div>
              <label className="text-sm font-bold text-slate-900" htmlFor="scale-percent">{text.scalePercentage}</label>
              <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-center text-2xl font-bold text-blue-700">
                {scalePercent}%
              </div>
              <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>1%</span>
                <span>300%</span>
              </div>
              <input
                id="scale-percent"
                type="range"
                min={1}
                max={300}
                step={1}
                value={scalePercent}
                onChange={(event) => setScalePercent(Number(event.target.value) || 1)}
                className="mt-2 w-full"
              />
            </div>
          ) : !targetKbOnly ? (
            <div>
              <div className="text-sm font-bold text-slate-900">{text.exactDimensions}</div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-semibold text-slate-500">{text.width}</span>
                  <input
                    type="number"
                    min={1}
                    value={targetWidth}
                    onChange={(event) => updateTargetWidth(Number(event.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-500">{text.height}</span>
                  <input
                    type="number"
                    min={1}
                    value={targetHeight}
                    onChange={(event) => updateTargetHeight(Number(event.target.value))}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900"
                  />
                </label>
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={keepAspectRatio}
                  onChange={(event) => setKeepAspectRatio(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                {text.keepAspectRatio}
              </label>
            </div>
          ) : null}

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            {text.outputDimensions}: <span className="font-bold text-slate-900">{outputDimensions.width || '-'} x {outputDimensions.height || '-'}</span>
          </div>

          <div>
            {targetKbOnly ? (
              <label className="text-sm font-bold text-slate-900" htmlFor="target-kb">{text.targetFileSize}</label>
            ) : (
              <label className="flex items-center gap-2 text-sm font-bold text-slate-900" htmlFor="target-kb">
                <input
                  type="checkbox"
                  checked={limitFileSize}
                  onChange={(event) => setLimitFileSize(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                {text.targetFileSize}
              </label>
            )}
            <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-center text-2xl font-bold text-blue-700">
              {targetKb}KB
            </div>
            <div className="mt-2 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>10KB</span>
              <span>1000KB</span>
            </div>
            <input
              id="target-kb"
              type="range"
              min={10}
              max={1000}
              step={1}
              value={targetKb}
              onChange={(event) => setTargetKb(Number(event.target.value) || 10)}
              disabled={!shouldLimitFileSize}
              className="mt-2 w-full disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-900" htmlFor="output-format">{text.outputFormat}</label>
            <select
              id="output-format"
              value={format}
              onChange={(event) => setFormat(event.target.value as 'image/jpeg' | 'image/webp')}
              className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800"
            >
              <option value="image/jpeg">JPG</option>
              <option value="image/webp">WebP</option>
            </select>
          </div>

          <Button onClick={resizeImage} isLoading={isProcessing} disabled={!sourceFile || isProcessing} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            {resolvedActionLabel}
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

async function resizeImageFile(
  file: File,
  options: { width: number; height: number; targetBytes?: number; format: 'image/jpeg' | 'image/webp' },
): Promise<ResizeResult> {
  const image = await loadImage(file)
  let scale = 1
  let bestResult: { blob: Blob; width: number; height: number; quality: number } | null = null
  let smallestResult: { blob: Blob; width: number; height: number; quality: number } | null = null

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const width = Math.max(1, Math.round(options.width * scale))
    const height = Math.max(1, Math.round(options.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Canvas is not available in this browser.')

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)

    if (!options.targetBytes) {
      const blob = await canvasToBlob(canvas, options.format, 0.92)
      bestResult = { blob, width, height, quality: 0.92 }
      break
    }

    let low = 0.25
    let high = 0.95

    for (let i = 0; i < 9; i += 1) {
      const quality = (low + high) / 2
      const blob = await canvasToBlob(canvas, options.format, quality)
      const candidate = { blob, width, height, quality }

      if (!smallestResult || blob.size < smallestResult.blob.size) {
        smallestResult = candidate
      }

      if (blob.size <= options.targetBytes) {
        bestResult = candidate
        low = quality
      } else {
        high = quality
      }
    }

    if (bestResult) break
    if (width <= 240 || height <= 240) break
    scale *= 0.82
  }

  const output = bestResult || smallestResult
  if (!output) throw new Error('Could not create resized image.')
  if (options.targetBytes && output.blob.size > options.targetBytes * 1.12) {
    throw new Error('This target size is too small for the uploaded image. Try a larger target KB or smaller maximum width.')
  }
  const extension = options.format === 'image/webp' ? 'webp' : 'jpg'
  const sizeSuffix = options.targetBytes ? `-${Math.round(options.targetBytes / 1024)}kb` : ''
  return {
    url: URL.createObjectURL(output.blob),
    fileName: `${file.name.replace(/\.[^.]+$/, '') || 'resized'}-${output.width}x${output.height}${sizeSuffix}.${extension}`,
    sizeBytes: output.blob.size,
    width: output.width,
    height: output.height,
    quality: output.quality,
  }
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

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Could not export image.'))
    }, type, quality)
  })
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function cleanupResult(result: ResizeResult | null) {
  if (result?.url) URL.revokeObjectURL(result.url)
}
