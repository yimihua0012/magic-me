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
import type { Locale } from '@/lib/i18n'

const backgrounds = [
  { id: 'white', label: 'White', value: '#ffffff' },
  { id: 'blue', label: 'Blue', value: '#438edb' },
  { id: 'red', label: 'Red', value: '#d71920' },
  { id: 'gray', label: 'Light Gray', value: '#f1f5f9' },
]

const backgroundText: Record<Locale, {
  title: string
  description: string
  upload: string
  preview: string
  empty: string
  settings: string
  photoSize: string
  backgroundColor: string
  zoom: string
  horizontal: string
  vertical: string
  download: string
  invalidFile: string
  previewFailed: string
  downloadFailed: string
  colors: Record<string, string>
}> = {
  en: {
    title: 'Background Color Tool',
    description: 'Upload a transparent PNG portrait, choose a photo size, change the background color, then download a finished JPG.',
    upload: 'Upload PNG',
    preview: 'Preview',
    empty: 'Upload a transparent PNG image to change its background color.',
    settings: 'Photo Settings',
    photoSize: 'Photo size',
    backgroundColor: 'Background color',
    zoom: 'Zoom',
    horizontal: 'Horizontal position',
    vertical: 'Vertical position',
    download: 'Download JPG',
    invalidFile: 'Please upload a PNG image. This tool needs PNG transparency to change the background color.',
    previewFailed: 'Failed to render preview.',
    downloadFailed: 'Failed to download photo.',
    colors: { white: 'White', blue: 'Blue', red: 'Red', gray: 'Light Gray' },
  },
  zh: {
    title: '证件照背景色工具',
    description: '上传透明 PNG 人像，选择照片尺寸和背景颜色，生成白底、蓝底、红底或浅灰底 JPG。',
    upload: '上传 PNG',
    preview: '预览',
    empty: '上传透明 PNG 图片后即可更换背景色。',
    settings: '照片设置',
    photoSize: '照片尺寸',
    backgroundColor: '背景颜色',
    zoom: '缩放',
    horizontal: '水平位置',
    vertical: '垂直位置',
    download: '下载 JPG',
    invalidFile: '请上传 PNG 图片。这个工具需要 PNG 透明背景来更换底色。',
    previewFailed: '预览渲染失败。',
    downloadFailed: '照片下载失败。',
    colors: { white: '白底', blue: '蓝底', red: '红底', gray: '浅灰底' },
  },
  es: {
    title: 'Color de fondo',
    description: 'Sube un retrato PNG transparente, elige tamaño de foto, cambia el fondo y descarga un JPG terminado.',
    upload: 'Subir PNG',
    preview: 'Vista previa',
    empty: 'Sube un PNG transparente para cambiar el color de fondo.',
    settings: 'Ajustes de foto',
    photoSize: 'Tamaño de foto',
    backgroundColor: 'Color de fondo',
    zoom: 'Zoom',
    horizontal: 'Posición horizontal',
    vertical: 'Posición vertical',
    download: 'Descargar JPG',
    invalidFile: 'Sube una imagen PNG. Esta herramienta necesita transparencia PNG para cambiar el fondo.',
    previewFailed: 'No se pudo generar la vista previa.',
    downloadFailed: 'No se pudo descargar la foto.',
    colors: { white: 'Blanco', blue: 'Azul', red: 'Rojo', gray: 'Gris claro' },
  },
  fr: {
    title: 'Couleur de fond',
    description: 'Importez un portrait PNG transparent, choisissez le format, changez la couleur de fond puis téléchargez un JPG final.',
    upload: 'Importer PNG',
    preview: 'Aperçu',
    empty: 'Importez un PNG transparent pour changer la couleur de fond.',
    settings: 'Réglages photo',
    photoSize: 'Format photo',
    backgroundColor: 'Couleur de fond',
    zoom: 'Zoom',
    horizontal: 'Position horizontale',
    vertical: 'Position verticale',
    download: 'Télécharger JPG',
    invalidFile: 'Importez une image PNG. Cet outil utilise la transparence PNG pour changer le fond.',
    previewFailed: 'Impossible de générer l’aperçu.',
    downloadFailed: 'Impossible de télécharger la photo.',
    colors: { white: 'Blanc', blue: 'Bleu', red: 'Rouge', gray: 'Gris clair' },
  },
  de: {
    title: 'Hintergrundfarbe',
    description: 'Lade ein transparentes PNG-Portraet hoch, waehle Fotogroesse und Hintergrundfarbe und lade ein fertiges JPG herunter.',
    upload: 'PNG hochladen',
    preview: 'Vorschau',
    empty: 'Lade ein transparentes PNG hoch, um die Hintergrundfarbe zu aendern.',
    settings: 'Fotoeinstellungen',
    photoSize: 'Fotogroesse',
    backgroundColor: 'Hintergrundfarbe',
    zoom: 'Zoom',
    horizontal: 'Horizontale Position',
    vertical: 'Vertikale Position',
    download: 'JPG herunterladen',
    invalidFile: 'Bitte lade ein PNG hoch. Dieses Tool braucht PNG-Transparenz fuer die Hintergrundfarbe.',
    previewFailed: 'Vorschau konnte nicht erstellt werden.',
    downloadFailed: 'Foto konnte nicht heruntergeladen werden.',
    colors: { white: 'Weiss', blue: 'Blau', red: 'Rot', gray: 'Hellgrau' },
  },
  ja: {
    title: '背景色ツール',
    description: '透明PNGの人物画像をアップロードし、写真サイズと背景色を選んで、完成したJPGを保存できます。',
    upload: 'PNGをアップロード',
    preview: 'プレビュー',
    empty: '背景色を変更するには透明PNGをアップロードしてください。',
    settings: '写真設定',
    photoSize: '写真サイズ',
    backgroundColor: '背景色',
    zoom: 'ズーム',
    horizontal: '横位置',
    vertical: '縦位置',
    download: 'JPGを保存',
    invalidFile: 'PNG画像をアップロードしてください。このツールは背景色変更にPNG透明部分を使います。',
    previewFailed: 'プレビューを作成できませんでした。',
    downloadFailed: '写真を保存できませんでした。',
    colors: { white: '白', blue: '青', red: '赤', gray: 'ライトグレー' },
  },
}

export default function BackgroundColorTool({ locale = 'en' }: { locale?: Locale }) {
  const text = backgroundText[locale]
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
      setError(text.invalidFile)
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
      setError(previewError instanceof Error ? previewError.message : text.previewFailed)
    }
  }, [renderPhoto, sourceUrl, text.previewFailed])

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
      setError(downloadError instanceof Error ? downloadError.message : text.downloadFailed)
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
              {text.title}
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {text.description}
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
              {text.upload}
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
            <h2 className="font-bold text-slate-900">{text.preview}</h2>
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
                {text.empty}
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <SlidersHorizontal className="h-4 w-4" />
              {text.settings}
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">{text.photoSize}</span>
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
              <div className="mb-2 text-sm font-medium text-slate-700">{text.backgroundColor}</div>
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
                    {text.colors[preset.id] || preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4">
              <RangeControl label={text.zoom} min={0.8} max={1.8} step={0.01} value={zoom} onChange={setZoom} valueLabel={`${Math.round(zoom * 100)}%`} />
              <RangeControl label={text.horizontal} min={-35} max={35} step={1} value={offsetX} onChange={setOffsetX} valueLabel={`${offsetX}%`} />
              <RangeControl label={text.vertical} min={-35} max={35} step={1} value={offsetY} onChange={setOffsetY} valueLabel={`${offsetY}%`} />
            </div>

            <Button onClick={() => void downloadSingle()} disabled={!sourceUrl || isRendering} className="mt-5 w-full">
              <Download className="mr-2 h-4 w-4" />
              {text.download}
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
