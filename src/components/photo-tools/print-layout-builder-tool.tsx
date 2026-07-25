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
import type { Locale } from '@/lib/i18n'

const printText: Record<Locale, {
  title: string
  description: string
  uploadTitle: string
  uploadHint: string
  uploadedSize: string
  preparedSize: string
  preview: string
  copies: string
  download: string
  photoSize: string
  paperSize: string
  note: string
  generate: string
  invalidFile: string
  readFailed: string
  uploadFirst: string
  tooLargeForPaper: string
  layoutFailed: string
}> = {
  en: {
    title: 'Print Layout Builder',
    description: 'Upload a finished photo, choose a photo size and paper size, generate a repeated print sheet, preview the layout, and download a JPG for home printing or a print shop.',
    uploadTitle: 'Upload finished photo',
    uploadHint: 'Use a cropped photo for best print layout results.',
    uploadedSize: 'Uploaded size',
    preparedSize: 'Prepared photo size',
    preview: 'Preview',
    copies: 'copies',
    download: 'Download print layout JPG',
    photoSize: 'Photo size',
    paperSize: 'Paper size',
    note: 'The uploaded image is fitted into the selected photo size before printing. For precise face placement, use the ID photo crop tool first.',
    generate: 'Generate print layout',
    invalidFile: 'Please upload a JPG, PNG, or WebP image.',
    readFailed: 'Could not read this image. Try another JPG, PNG, or WebP file.',
    uploadFirst: 'Upload an image first.',
    tooLargeForPaper: 'This photo size is too large for the selected paper. Choose a smaller photo size or a larger paper size.',
    layoutFailed: 'Could not create the print layout.',
  },
  zh: {
    title: '证件照打印排版工具',
    description: '上传已裁剪好的照片，选择照片尺寸和纸张尺寸，生成重复排版预览，并下载适合家用打印或照相馆打印的 JPG。',
    uploadTitle: '上传已完成照片',
    uploadHint: '建议先使用证件照裁剪工具处理头像位置，再生成打印排版。',
    uploadedSize: '上传尺寸',
    preparedSize: '处理后照片尺寸',
    preview: '预览',
    copies: '张',
    download: '下载排版 JPG',
    photoSize: '照片尺寸',
    paperSize: '纸张尺寸',
    note: '上传图片会先适配到所选照片尺寸再排版。若需要更精准的头部位置，请先使用证件照裁剪工具。',
    generate: '生成打印排版',
    invalidFile: '请上传 JPG、PNG 或 WebP 图片。',
    readFailed: '无法读取这张图片，请换一张 JPG、PNG 或 WebP。',
    uploadFirst: '请先上传图片。',
    tooLargeForPaper: '当前照片尺寸超过所选纸张，请选择更小照片尺寸或更大纸张。',
    layoutFailed: '无法生成打印排版。',
  },
  es: {
    title: 'Hoja de impresión',
    description: 'Sube una foto terminada, elige tamaño de foto y papel, genera varias copias en una hoja y descarga un JPG para imprimir.',
    uploadTitle: 'Subir foto terminada',
    uploadHint: 'Usa una foto recortada para un mejor resultado de impresión.',
    uploadedSize: 'Tamaño subido',
    preparedSize: 'Tamaño preparado',
    preview: 'Vista previa',
    copies: 'copias',
    download: 'Descargar JPG de impresión',
    photoSize: 'Tamaño de foto',
    paperSize: 'Tamaño de papel',
    note: 'La imagen se ajusta al tamaño de foto elegido antes de imprimir. Para ubicar el rostro con precisión, usa primero Recortar foto ID.',
    generate: 'Generar hoja de impresión',
    invalidFile: 'Sube una imagen JPG, PNG o WebP.',
    readFailed: 'No se pudo leer esta imagen. Prueba con otro JPG, PNG o WebP.',
    uploadFirst: 'Sube una imagen primero.',
    tooLargeForPaper: 'Este tamaño de foto es demasiado grande para el papel seleccionado. Elige una foto más pequeña o un papel más grande.',
    layoutFailed: 'No se pudo crear la hoja de impresión.',
  },
  fr: {
    title: 'Planche photo',
    description: 'Importez une photo finalisée, choisissez format photo et papier, générez plusieurs copies sur une page et téléchargez un JPG à imprimer.',
    uploadTitle: 'Importer photo finalisée',
    uploadHint: 'Utilisez une photo déjà recadrée pour un meilleur résultat.',
    uploadedSize: 'Taille importée',
    preparedSize: 'Format préparé',
    preview: 'Aperçu',
    copies: 'copies',
    download: 'Télécharger le JPG d’impression',
    photoSize: 'Format photo',
    paperSize: 'Format papier',
    note: 'L’image importée est adaptée au format photo choisi avant impression. Pour un placement précis du visage, utilisez d’abord Recadrer photo ID.',
    generate: 'Générer la planche',
    invalidFile: 'Importez une image JPG, PNG ou WebP.',
    readFailed: 'Impossible de lire cette image. Essayez un autre JPG, PNG ou WebP.',
    uploadFirst: 'Importez une image d’abord.',
    tooLargeForPaper: 'Ce format photo est trop grand pour le papier choisi. Sélectionnez une photo plus petite ou un papier plus grand.',
    layoutFailed: 'Impossible de créer la planche d’impression.',
  },
  de: {
    title: 'Druckbogen',
    description: 'Lade ein fertiges Foto hoch, waehle Foto- und Papiergroesse, erstelle mehrere Kopien auf einer Seite und lade ein JPG zum Drucken herunter.',
    uploadTitle: 'Fertiges Foto hochladen',
    uploadHint: 'Nutze ein zugeschnittenes Foto fuer bessere Drucklayouts.',
    uploadedSize: 'Hochgeladene Groesse',
    preparedSize: 'Vorbereitete Fotogroesse',
    preview: 'Vorschau',
    copies: 'Kopien',
    download: 'Drucklayout-JPG herunterladen',
    photoSize: 'Fotogroesse',
    paperSize: 'Papiergroesse',
    note: 'Das Bild wird vor dem Drucken in die gewaehlte Fotogroesse eingepasst. Fuer genaue Kopfposition nutze zuerst ID-Foto zuschneiden.',
    generate: 'Drucklayout erstellen',
    invalidFile: 'Bitte lade ein JPG, PNG oder WebP hoch.',
    readFailed: 'Dieses Bild konnte nicht gelesen werden. Versuche ein anderes JPG, PNG oder WebP.',
    uploadFirst: 'Lade zuerst ein Bild hoch.',
    tooLargeForPaper: 'Diese Fotogroesse ist zu gross fuer das Papier. Waehle eine kleinere Fotogroesse oder groesseres Papier.',
    layoutFailed: 'Drucklayout konnte nicht erstellt werden.',
  },
  ja: {
    title: '印刷レイアウト',
    description: '完成した写真をアップロードし、写真サイズと用紙サイズを選んで、複数枚配置した印刷用JPGを作成できます。',
    uploadTitle: '完成写真をアップロード',
    uploadHint: 'きれいに印刷するには、先にトリミングした写真を使ってください。',
    uploadedSize: 'アップロードサイズ',
    preparedSize: '準備後の写真サイズ',
    preview: 'プレビュー',
    copies: '枚',
    download: '印刷レイアウトJPGを保存',
    photoSize: '写真サイズ',
    paperSize: '用紙サイズ',
    note: 'アップロード画像は印刷前に選択した写真サイズへ合わせます。顔位置を正確にしたい場合は、先にID写真トリミングを使ってください。',
    generate: '印刷レイアウトを作成',
    invalidFile: 'JPG、PNG、WebP画像をアップロードしてください。',
    readFailed: '画像を読み込めませんでした。別のJPG、PNG、WebPを試してください。',
    uploadFirst: '先に画像をアップロードしてください。',
    tooLargeForPaper: 'この写真サイズは選択した用紙には大きすぎます。小さい写真サイズまたは大きい用紙を選んでください。',
    layoutFailed: '印刷レイアウトを作成できませんでした。',
  },
}

export default function PrintLayoutBuilderTool({ locale = 'en' }: { locale?: Locale }) {
  const text = printText[locale]
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
      setError(text.invalidFile)
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
      setError(text.readFailed)
    }
  }

  const generateLayout = async () => {
    if (!sourceUrl || !sourceSize) {
      setError(text.uploadFirst)
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
        throw new Error(text.tooLargeForPaper)
      }

      const sheet = renderPrintSheet(photoCanvas, selectedSpec.dpi, selectedPaper)
      setSheetCanvas(sheet)
      setSheetUrl(sheet.toDataURL('image/jpeg', 0.94))
      setLayoutInfo({ copies: layout.totalCopies, columns: layout.columns, rows: layout.rows })
    } catch (layoutError) {
      setError(layoutError instanceof Error ? layoutError.message : text.layoutFailed)
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
          <h2 className="text-xl font-bold text-slate-900">{text.title}</h2>
        </div>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          {text.description}
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
                <span className="mt-3 text-sm font-bold text-slate-800">{text.uploadTitle}</span>
                <span className="mt-1 text-xs text-slate-500">{text.uploadHint}</span>
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
              <span className="font-semibold text-slate-900">{text.uploadedSize}:</span>{' '}
              <span className="text-slate-600">{sourceSize.width} x {sourceSize.height}px</span>
              <div className="mt-1">
                <span className="font-semibold text-slate-900">{text.preparedSize}:</span>{' '}
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
                <h3 className="font-bold text-slate-900">{text.preview}</h3>
                {layoutInfo && (
                  <span className="text-sm font-semibold text-slate-500">
                    {layoutInfo.copies} {text.copies} ({layoutInfo.columns} x {layoutInfo.rows})
                  </span>
                )}
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-100 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sheetUrl} alt="Print sheet preview" className="mx-auto max-h-[520px] max-w-full rounded bg-white shadow-sm" />
              </div>
              <Button onClick={() => void downloadSheet()} className="mt-4 w-full sm:w-auto">
                <Download className="mr-2 h-4 w-4" />
                {text.download}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-5 bg-white p-5 sm:p-6">
          <div>
            <label className="text-sm font-bold text-slate-900" htmlFor="print-photo-size">{text.photoSize}</label>
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
            <label className="text-sm font-bold text-slate-900" htmlFor="print-paper">{text.paperSize}</label>
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
            {text.note}
          </div>

          <Button onClick={generateLayout} isLoading={isRendering} disabled={!sourceUrl || isRendering} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            {text.generate}
          </Button>
        </div>
      </div>
    </Card>
  )
}

function cleanupUrl(url: string) {
  if (url) URL.revokeObjectURL(url)
}
