'use client'

import { useMemo, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import PhotoToolsAiWorkflowCard from '@/components/photo-tools/photo-tools-ai-workflow-card'
import {
  downloadPngCanvas,
  photoSpecs,
  photoSpecToPixels,
  renderImageToPhotoCanvas,
} from '@/components/photo-tools/photo-print-utils'
import { loginPathForReturn } from '@/lib/auth-return'
import { localePath, type Locale } from '@/lib/i18n'
import { supabase } from '@/lib/supabase/client'
import { Download, ImagePlus, SlidersHorizontal, Sparkles, Upload } from 'lucide-react'

const MAX_FILE_SIZE = 10 * 1024 * 1024

const removeBackgroundText: Record<Locale, {
  title: string
  description: string
  caution: string
  freeUse: string
  upload: string
  preview: string
  previewDescription: string
  original: string
  result: string
  emptyOriginal: string
  emptyResult: string
  usage: string
  usageDescription: string
  photoSize: string
  pngSize: string
  creditsUsed: string
  remove: string
  removing: string
  download: string
  invalidFile: string
  tooLarge: string
  uploadFirst: string
  processing: string
  failed: string
  freeRunUsed: string
  creditUsed: string
  downloadFailed: string
}> = {
  en: {
    title: 'Remove Background',
    description: 'Upload a person, product, object, or document-style image and export a transparent PNG after the background is removed.',
    caution: 'Automatic cutout may be less precise with complex hair, shadows, busy backgrounds, transparent objects, or low-resolution images.',
    freeUse: 'Registered users get 1 free remove-background run. After that, each successful PNG export uses 1 credit.',
    upload: 'Upload Image',
    preview: 'Preview',
    previewDescription: 'Transparent PNG output for people, products, and objects.',
    original: 'Original',
    result: 'PNG result',
    emptyOriginal: 'Upload an image to start.',
    emptyResult: 'Your transparent PNG appears here.',
    usage: 'Usage',
    usageDescription: 'Sign in to use your 1 free remove-background run. When the free run is used, each successful PNG export uses 1 credit.',
    photoSize: 'Photo size',
    pngSize: 'PNG download size',
    creditsUsed: 'Credits used',
    remove: 'Remove background',
    removing: 'Removing...',
    download: 'Download PNG',
    invalidFile: 'Please upload an image file.',
    tooLarge: 'Image is too large. Use a file under 10MB.',
    uploadFirst: 'Upload an image first.',
    processing: 'Removing the background...',
    failed: 'Failed to remove background.',
    freeRunUsed: 'Background removed. This used your free run.',
    creditUsed: 'Background removed. 1 credit was used.',
    downloadFailed: 'Could not download PNG.',
  },
  zh: {
    title: 'Remove Background',
    description: '上传人物、产品、物品或证件照风格图片，自动移除背景后导出透明 PNG。',
    caution: '复杂发丝、阴影、杂乱背景、透明物体或低清晰度图片，自动抠图结果可能不够理想。',
    freeUse: '注册用户有 1 次免费 Remove Background 机会。免费机会用完后，每次成功导出 PNG 使用 1 个点数。',
    upload: '上传图片',
    preview: '预览',
    previewDescription: '适合人物、产品和物品的透明 PNG 输出。',
    original: '原图',
    result: 'PNG 结果',
    emptyOriginal: '上传图片开始处理。',
    emptyResult: '透明 PNG 会显示在这里。',
    usage: '使用规则',
    usageDescription: '登录后可使用 1 次免费 Remove Background。免费机会用完后，每次成功导出 PNG 使用 1 个点数。',
    photoSize: '照片尺寸',
    pngSize: 'PNG 下载尺寸',
    creditsUsed: '使用点数',
    remove: '移除背景',
    removing: '处理中...',
    download: '下载 PNG',
    invalidFile: '请上传图片文件。',
    tooLarge: '图片太大，请使用 10MB 以下文件。',
    uploadFirst: '请先上传图片。',
    processing: '正在移除背景...',
    failed: '移除背景失败。',
    freeRunUsed: '背景已移除，本次使用了免费机会。',
    creditUsed: '背景已移除，本次使用了 1 个点数。',
    downloadFailed: '无法下载 PNG。',
  },
  es: {
    title: 'Remove Background',
    description: 'Sube una persona, producto u objeto y descarga un PNG transparente después de eliminar el fondo.',
    caution: 'El recorte automático puede ser menos preciso con cabello complejo, sombras, fondos cargados, objetos transparentes o baja resolución.',
    freeUse: 'Los usuarios registrados tienen 1 uso gratis. Después, cada PNG correcto usa 1 crédito.',
    upload: 'Subir imagen',
    preview: 'Vista previa',
    previewDescription: 'PNG transparente para personas, productos y objetos.',
    original: 'Original',
    result: 'PNG resultado',
    emptyOriginal: 'Sube una imagen para empezar.',
    emptyResult: 'Tu PNG transparente aparecerá aquí.',
    usage: 'Uso',
    usageDescription: 'Inicia sesión para usar tu 1 uso gratis. Después, cada PNG correcto usa 1 crédito.',
    photoSize: 'Tamaño de foto',
    pngSize: 'Tamaño de descarga PNG',
    creditsUsed: 'Créditos usados',
    remove: 'Remove background',
    removing: 'Procesando...',
    download: 'Descargar PNG',
    invalidFile: 'Sube un archivo de imagen.',
    tooLarge: 'La imagen es demasiado grande. Usa un archivo menor de 10 MB.',
    uploadFirst: 'Sube una imagen primero.',
    processing: 'Eliminando el fondo...',
    failed: 'No se pudo eliminar el fondo.',
    freeRunUsed: 'Fondo eliminado. Se usó tu oportunidad gratis.',
    creditUsed: 'Fondo eliminado. Se usó 1 crédito.',
    downloadFailed: 'No se pudo descargar el PNG.',
  },
  fr: {
    title: 'Remove Background',
    description: 'Importez une personne, un produit ou un objet et téléchargez un PNG transparent après retrait du fond.',
    caution: 'Le détourage automatique peut être moins précis avec cheveux complexes, ombres, fonds chargés, objets transparents ou basse résolution.',
    freeUse: 'Chaque utilisateur inscrit dispose d’un essai gratuit. Ensuite chaque PNG réussi utilise 1 crédit.',
    upload: 'Importer image',
    preview: 'Aperçu',
    previewDescription: 'PNG transparent pour personnes, produits et objets.',
    original: 'Original',
    result: 'Résultat PNG',
    emptyOriginal: 'Importez une image pour commencer.',
    emptyResult: 'Votre PNG transparent apparaîtra ici.',
    usage: 'Utilisation',
    usageDescription: 'Connectez-vous pour utiliser votre essai gratuit. Ensuite chaque PNG réussi utilise 1 crédit.',
    photoSize: 'Format photo',
    pngSize: 'Taille de téléchargement PNG',
    creditsUsed: 'Crédits utilisés',
    remove: 'Remove background',
    removing: 'Traitement...',
    download: 'Télécharger PNG',
    invalidFile: 'Importez un fichier image.',
    tooLarge: 'L’image est trop grande. Utilisez un fichier de moins de 10 Mo.',
    uploadFirst: 'Importez une image d’abord.',
    processing: 'Retrait de l’arrière-plan...',
    failed: 'Impossible de retirer l’arrière-plan.',
    freeRunUsed: 'Fond retiré. Votre essai gratuit a été utilisé.',
    creditUsed: 'Fond retiré. 1 crédit a été utilisé.',
    downloadFailed: 'Impossible de télécharger le PNG.',
  },
  de: {
    title: 'Remove Background',
    description: 'Lade eine Person, ein Produkt oder Objekt hoch und exportiere nach dem Entfernen des Hintergrunds ein transparentes PNG.',
    caution: 'Automatisches Freistellen kann bei Haaren, Schatten, unruhigen Hintergruenden, transparenten Objekten oder niedriger Aufloesung ungenauer sein.',
    freeUse: 'Registrierte Nutzer erhalten 1 kostenlosen Lauf. Danach kostet jeder erfolgreiche PNG-Export 1 Credit.',
    upload: 'Bild hochladen',
    preview: 'Vorschau',
    previewDescription: 'Transparentes PNG fuer Personen, Produkte und Objekte.',
    original: 'Original',
    result: 'PNG-Ergebnis',
    emptyOriginal: 'Lade ein Bild hoch, um zu starten.',
    emptyResult: 'Dein transparentes PNG erscheint hier.',
    usage: 'Nutzung',
    usageDescription: 'Melde dich an, um deinen kostenlosen Lauf zu nutzen. Danach kostet jeder erfolgreiche PNG-Export 1 Credit.',
    photoSize: 'Fotogroesse',
    pngSize: 'PNG-Downloadgroesse',
    creditsUsed: 'Credits genutzt',
    remove: 'Remove background',
    removing: 'Wird verarbeitet...',
    download: 'PNG herunterladen',
    invalidFile: 'Bitte lade eine Bilddatei hoch.',
    tooLarge: 'Das Bild ist zu gross. Nutze eine Datei unter 10 MB.',
    uploadFirst: 'Lade zuerst ein Bild hoch.',
    processing: 'Hintergrund wird entfernt...',
    failed: 'Hintergrund konnte nicht entfernt werden.',
    freeRunUsed: 'Hintergrund entfernt. Dein kostenloser Lauf wurde genutzt.',
    creditUsed: 'Hintergrund entfernt. 1 Credit wurde genutzt.',
    downloadFailed: 'PNG konnte nicht heruntergeladen werden.',
  },
  ja: {
    title: 'Remove Background',
    description: '人物、商品、物体の画像をアップロードし、背景を削除して透明PNGを保存できます。',
    caution: '髪、影、複雑な背景、透明な物体、低解像度画像では自動切り抜きが不十分な場合があります。',
    freeUse: '登録ユーザーは1回無料です。その後は成功したPNG出力ごとに1クレジットを使用します。',
    upload: '画像をアップロード',
    preview: 'プレビュー',
    previewDescription: '人物、商品、物体向けの透明PNG出力です。',
    original: '元画像',
    result: 'PNG結果',
    emptyOriginal: '画像をアップロードしてください。',
    emptyResult: '透明PNGがここに表示されます。',
    usage: '利用条件',
    usageDescription: 'ログインすると1回無料で使えます。その後は成功したPNG出力ごとに1クレジットを使用します。',
    photoSize: '写真サイズ',
    pngSize: 'PNG保存サイズ',
    creditsUsed: '使用クレジット',
    remove: 'Remove background',
    removing: '処理中...',
    download: 'PNGを保存',
    invalidFile: '画像ファイルをアップロードしてください。',
    tooLarge: '画像が大きすぎます。10MB未満のファイルを使ってください。',
    uploadFirst: '先に画像をアップロードしてください。',
    processing: '背景を削除しています...',
    failed: '背景を削除できませんでした。',
    freeRunUsed: '背景を削除しました。無料分を使用しました。',
    creditUsed: '背景を削除しました。1クレジットを使用しました。',
    downloadFailed: 'PNGを保存できませんでした。',
  },
}

export default function RemoveBackgroundTool({ locale = 'en' }: { locale?: Locale }) {
  const text = removeBackgroundText[locale]
  const router = useRouter()
  const pathname = usePathname()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [sourceFile, setSourceFile] = useState<File | null>(null)
  const [sourceUrl, setSourceUrl] = useState('')
  const [sourceName, setSourceName] = useState('')
  const [resultUrl, setResultUrl] = useState('')
  const [selectedSpecId, setSelectedSpecId] = useState(photoSpecs[1].id)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [chargedCredits, setChargedCredits] = useState<number | null>(null)
  const selectedSpec = useMemo(
    () => photoSpecs.find((spec) => spec.id === selectedSpecId) || photoSpecs[0],
    [selectedSpecId],
  )
  const outputSize = useMemo(() => photoSpecToPixels(selectedSpec), [selectedSpec])

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
      setError(text.invalidFile)
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError(text.tooLarge)
      return
    }

    setSourceUrl(URL.createObjectURL(file))
    setSourceFile(file)
    setSourceName(file.name)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeBackground = async () => {
    if (!sourceFile) {
      setError(text.uploadFirst)
      return
    }

    setIsProcessing(true)
    setError('')
    setStatus(text.processing)
    setResultUrl('')
    setChargedCredits(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        router.push(loginPathForReturn(pathname || localePath(locale, '/photo-tools/remove-background'), localePath(locale, '/photo-tools/remove-background')))
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
        throw new Error(typeof data.error === 'string' ? data.error : text.failed)
      }

      setResultUrl(data.outputUrl)
      setChargedCredits(typeof data.chargedCredits === 'number' ? data.chargedCredits : null)
      setStatus(data.chargedCredits === 0 ? text.freeRunUsed : text.creditUsed)
    } catch (processError) {
      setError(processError instanceof Error ? processError.message : text.failed)
      setStatus('')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadPng = async () => {
    if (!resultUrl) return
    const baseName = sourceName.replace(/\.[^.]+$/, '') || 'image'
    try {
      const canvas = await renderImageToPhotoCanvas({
        sourceUrl: resultUrl,
        spec: selectedSpec,
        backgroundColor: null,
      })
      await downloadPngCanvas(canvas, `${baseName}-${selectedSpec.id}-no-background.png`)
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : text.downloadFailed)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
              <ImagePlus className="h-4 w-4" />
              {text.title}
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {text.description}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {text.caution}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-800">
              {text.freeUse}
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
              {text.upload}
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
            <h2 className="font-bold text-slate-900">{text.preview}</h2>
            <p className="mt-1 text-sm text-slate-500">{text.previewDescription}</p>
          </div>
          <div className="grid min-h-[420px] gap-4 bg-slate-100 p-4 md:grid-cols-2">
            <PreviewPanel title={text.original} imageUrl={sourceUrl} emptyText={text.emptyOriginal} />
            <PreviewPanel title={text.result} imageUrl={resultUrl} emptyText={text.emptyResult} checkerboard />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-4 sm:p-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <Sparkles className="h-4 w-4" />
              {text.usage}
            </div>
            <p className="text-sm leading-6 text-slate-600">
              {text.usageDescription}
            </p>
            <div className="mt-4">
              <label className="block">
                <span className="mb-1.5 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <SlidersHorizontal className="h-4 w-4 text-blue-600" />
                  {text.photoSize}
                </span>
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
              <p className="mt-2 text-xs font-medium text-slate-500">
                {text.pngSize}: {outputSize.width} x {outputSize.height}px at {selectedSpec.dpi} DPI
              </p>
            </div>
            {chargedCredits !== null && (
              <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
                {text.creditsUsed}: {chargedCredits}
              </div>
            )}
            <Button onClick={() => void removeBackground()} disabled={!sourceUrl || isProcessing} className="mt-5 w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              {isProcessing ? text.removing : text.remove}
            </Button>
            <Button variant="secondary" onClick={() => void downloadPng()} disabled={!resultUrl} className="mt-3 w-full">
              <Download className="mr-2 h-4 w-4" />
              {text.download}
            </Button>
          </Card>

          <PhotoToolsAiWorkflowCard locale={locale} />
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
