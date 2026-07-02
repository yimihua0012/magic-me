'use client'

import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import { AlertCircle, Download, Image as ImageIcon, Palette, Printer, RefreshCw, SlidersHorizontal, Upload } from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export type PhotoToolSource = {
  id: string
  url: string
  label: string
  caption?: string
  mimeType?: string
}

type PhotoSpec = {
  id: string
  label: LocalizedText
  widthMm: number
  heightMm: number
  dpi: number
  note: string
}

type LocalizedText = {
  en: string
  es?: string
  fr?: string
  de?: string
  ja?: string
}

type PaperSpec = {
  id: string
  label: string
  widthMm: number
  heightMm: number
}

type BackgroundPreset = {
  label: LocalizedText
  value: string
}

interface PhotoToolsWorkbenchProps {
  sources?: PhotoToolSource[]
  allowUpload?: boolean
  sourceTitle?: string
  sourceDescription?: string
  uploadLabel?: string
  sourceActions?: ReactNode
  emptyState?: ReactNode
  onRefresh?: () => void
  isRefreshing?: boolean
  locale?: Locale
}

const photoSpecs: PhotoSpec[] = [
  countrySpec('cn-1-inch', 'China 1 inch', 'China 1 pulgada', 'Chine 1 pouce', 'China 1 Zoll', '中国 1寸', 25, 35, 'Common small print size for resumes, forms, and applications.'),
  countrySpec('cn-2-inch', 'China 2 inch', 'China 2 pulgadas', 'Chine 2 pouces', 'China 2 Zoll', '中国 2寸', 35, 49, 'Common larger print size for forms, badges, and applications.'),
  countrySpec('cn-small-2-inch', 'China small 2 inch', 'China 2 pulgadas pequena', 'Chine petit 2 pouces', 'China kleines 2 Zoll', '中国 小2寸', 35, 45, 'Common compact ID print ratio.'),
  countrySpec('cn-passport-reference', 'China passport reference', 'China pasaporte referencia', 'Chine passeport reference', 'China Pass Referenz', '中国 パスポート参考', 33, 48, 'Reference print size only. Not recommended for official submission.'),
  countrySpec('us-2x2', 'United States 2 x 2 inch', 'Estados Unidos 2 x 2 pulgadas', 'Etats-Unis 2 x 2 pouces', 'USA 2 x 2 Zoll', '米国 2 x 2インチ', 50.8, 50.8, 'Common square 2 inch print preset.'),
  countrySpec('india-2x2', 'India 2 x 2 inch', 'India 2 x 2 pulgadas', 'Inde 2 x 2 pouces', 'Indien 2 x 2 Zoll', 'インド 2 x 2インチ', 50.8, 50.8, 'Common square print preset.'),
  countrySpec('canada-50x70', 'Canada style', 'Canada comun', 'Canada courant', 'Kanada Standard', 'カナダ 一般', 50, 70, 'Tall portrait print preset.'),
  countrySpec('uk-35x45', 'United Kingdom common', 'Reino Unido comun', 'Royaume-Uni courant', 'Vereinigtes Konigreich Standard', '英国 一般', 35, 45, 'Common UK-style print size.'),
  countrySpec('eu-schengen-35x45', 'EU / Schengen common', 'UE / Schengen comun', 'UE / Schengen courant', 'EU / Schengen Standard', 'EU / シェンゲン 一般', 35, 45, 'Common European-style print size.'),
  countrySpec('japan-35x45', 'Japan common', 'Japon comun', 'Japon courant', 'Japan Standard', '日本 一般', 35, 45, 'Common Japan-style print size.'),
  countrySpec('korea-35x45', 'South Korea common', 'Corea del Sur comun', 'Coree du Sud courant', 'Sudkorea Standard', '韓国 一般', 35, 45, 'Common Korea-style print size.'),
  countrySpec('taiwan-35x45', 'Taiwan common', 'Taiwan comun', 'Taiwan courant', 'Taiwan Standard', '台湾 一般', 35, 45, 'Common Taiwan-style print size.'),
  countrySpec('hong-kong-40x50', 'Hong Kong common', 'Hong Kong comun', 'Hong Kong courant', 'Hongkong Standard', '香港 一般', 40, 50, 'Common Hong Kong-style print size.'),
  countrySpec('singapore-35x45', 'Singapore common', 'Singapur comun', 'Singapour courant', 'Singapur Standard', 'シンガポール 一般', 35, 45, 'Common Singapore-style print size.'),
  countrySpec('malaysia-35x50', 'Malaysia common', 'Malasia comun', 'Malaisie courant', 'Malaysia Standard', 'マレーシア 一般', 35, 50, 'Common Malaysia-style print size.'),
  countrySpec('philippines-35x45', 'Philippines common', 'Filipinas comun', 'Philippines courant', 'Philippinen Standard', 'フィリピン 一般', 35, 45, 'Common Philippines-style print size.'),
  countrySpec('indonesia-40x60', 'Indonesia common', 'Indonesia comun', 'Indonesie courant', 'Indonesien Standard', 'インドネシア 一般', 40, 60, 'Common larger portrait print preset.'),
  countrySpec('vietnam-40x60', 'Vietnam common', 'Vietnam comun', 'Vietnam courant', 'Vietnam Standard', 'ベトナム 一般', 40, 60, 'Common larger portrait print preset.'),
  countrySpec('australia-nz-35x45', 'Australia / New Zealand common', 'Australia / Nueva Zelanda comun', 'Australie / Nouvelle-Zelande courant', 'Australien / Neuseeland Standard', 'オーストラリア / ニュージーランド 一般', 35, 45, 'Common Australia and New Zealand-style print preset.'),
  countrySpec('mexico-35x45', 'Mexico common', 'Mexico comun', 'Mexique courant', 'Mexiko Standard', 'メキシコ 一般', 35, 45, 'Common Mexico-style print size.'),
  countrySpec('brazil-30x40', 'Brazil 3 x 4 cm', 'Brasil 3 x 4 cm', 'Bresil 3 x 4 cm', 'Brasilien 3 x 4 cm', 'ブラジル 3 x 4 cm', 30, 40, 'Common 3 x 4 cm print preset.'),
  countrySpec('turkey-50x60', 'Turkey biometric style', 'Turquia biometrica', 'Turquie biometrique', 'Turkei biometrisch', 'トルコ 生体認証風', 50, 60, 'Common tall biometric-style print preset.'),
  countrySpec('gulf-40x60', 'Gulf countries common', 'Paises del Golfo comun', 'Pays du Golfe courant', 'Golfstaaten Standard', '湾岸諸国 一般', 40, 60, 'Common Gulf-region portrait print preset.'),
  countrySpec('square-avatar-50x50', 'Square badge / avatar', 'Credencial / avatar cuadrado', 'Badge / avatar carre', 'Quadratischer Ausweis / Avatar', '正方形 バッジ / アバター', 50, 50, 'Useful for staff cards, badges, and internal systems.'),
]

const paperSpecs: PaperSpec[] = [
  { id: '3r', label: '3R photo paper - 3.5 x 5 inch', widthMm: 88.9, heightMm: 127 },
  { id: '4x6', label: '4 x 6 inch photo paper', widthMm: 101.6, heightMm: 152.4 },
  { id: '5x7', label: '5 x 7 inch photo paper', widthMm: 127, heightMm: 177.8 },
  { id: '6x8', label: '6 x 8 inch photo paper', widthMm: 152.4, heightMm: 203.2 },
  { id: '8x10', label: '8 x 10 inch photo paper', widthMm: 203.2, heightMm: 254 },
  { id: 'a6', label: 'A6 paper - 105 x 148 mm', widthMm: 105, heightMm: 148 },
  { id: 'a5', label: 'A5 paper - 148 x 210 mm', widthMm: 148, heightMm: 210 },
  { id: 'a4', label: 'A4 paper', widthMm: 210, heightMm: 297 },
  { id: 'letter', label: 'US Letter', widthMm: 215.9, heightMm: 279.4 },
  { id: 'legal', label: 'US Legal', widthMm: 215.9, heightMm: 355.6 },
]

const backgrounds: BackgroundPreset[] = [
  { label: { en: 'White', es: 'Blanco', fr: 'Blanc', de: 'Weiss', ja: '白' }, value: '#ffffff' },
  { label: { en: 'Blue', es: 'Azul', fr: 'Bleu', de: 'Blau', ja: '青' }, value: '#438edb' },
  { label: { en: 'Red', es: 'Rojo', fr: 'Rouge', de: 'Rot', ja: '赤' }, value: '#d71920' },
  { label: { en: 'Light Gray', es: 'Gris claro', fr: 'Gris clair', de: 'Hellgrau', ja: '薄いグレー' }, value: '#f1f5f9' },
]

const workbenchText: Record<Locale, {
  warningTitle: string
  warningText: string
  sourcePhoto: string
  refresh: string
  localUpload: string
  empty: string
  preview: string
  noPreview: string
  exportSettings: string
  photoSize: string
  background: string
  backgroundPngOnly: string
  zoom: string
  horizontalPosition: string
  verticalPosition: string
  printLayout: string
  paper: string
  fits: (copies: number, columns: number, rows: number) => string
  doesNotFit: string
  downloadSingle: string
  downloadSheet: string
}> = {
  en: {
    warningTitle: 'Best for resumes, school or job applications, exams, employee badges, student cards, and personal print layouts.',
    warningText: 'Not recommended for passport, visa, national ID, immigration, or other official photo submissions. For official documents, follow the latest authority instructions or use a professional photo service.',
    sourcePhoto: 'Source Photo',
    refresh: 'Refresh',
    localUpload: 'Local upload',
    empty: 'Upload or choose a portrait to start.',
    preview: 'Preview',
    noPreview: 'Select or upload a portrait to preview exports.',
    exportSettings: 'Export Settings',
    photoSize: 'Photo Size',
    background: 'Background',
    backgroundPngOnly: 'Background color is available for PNG images with transparency.',
    zoom: 'Zoom',
    horizontalPosition: 'Horizontal Position',
    verticalPosition: 'Vertical Position',
    printLayout: 'Print Layout',
    paper: 'Paper',
    fits: (copies, columns, rows) => `Fits ${copies} copies per sheet (${columns} x ${rows}), centered with 5 mm margins and 3 mm gaps.`,
    doesNotFit: 'This photo size does not fit the selected paper with print margins.',
    downloadSingle: 'Download Single JPG',
    downloadSheet: 'Download Print Sheet JPG',
  },
  es: {
    warningTitle: 'Ideal para CV, solicitudes escolares o laborales, examenes, credenciales de empleado, tarjetas de estudiante e impresiones personales.',
    warningText: 'No se recomienda para pasaporte, visa, documento nacional, inmigracion u otras presentaciones oficiales. Para documentos oficiales, sigue las instrucciones vigentes de la autoridad o usa un servicio profesional.',
    sourcePhoto: 'Foto de origen',
    refresh: 'Actualizar',
    localUpload: 'Subida local',
    empty: 'Sube o elige un retrato para empezar.',
    preview: 'Vista previa',
    noPreview: 'Selecciona o sube un retrato para previsualizar la exportacion.',
    exportSettings: 'Ajustes de exportacion',
    photoSize: 'Tamano de foto',
    background: 'Fondo',
    backgroundPngOnly: 'El color de fondo esta disponible para imagenes PNG con transparencia.',
    zoom: 'Zoom',
    horizontalPosition: 'Posicion horizontal',
    verticalPosition: 'Posicion vertical',
    printLayout: 'Diseno de impresion',
    paper: 'Papel',
    fits: (copies, columns, rows) => `Caben ${copies} copias por hoja (${columns} x ${rows}), centradas con margenes de 5 mm y espacios de 3 mm.`,
    doesNotFit: 'Este tamano no cabe en el papel seleccionado con margenes de impresion.',
    downloadSingle: 'Descargar JPG individual',
    downloadSheet: 'Descargar hoja JPG',
  },
  fr: {
    warningTitle: 'Ideal pour CV, candidatures scolaires ou professionnelles, examens, badges employe, cartes etudiant et impressions personnelles.',
    warningText: 'Non recommande pour passeport, visa, carte nationale, immigration ou autres depots officiels. Pour les documents officiels, suivez les consignes recentes de l autorite ou utilisez un service professionnel.',
    sourcePhoto: 'Photo source',
    refresh: 'Actualiser',
    localUpload: 'Import local',
    empty: 'Importez ou choisissez un portrait pour commencer.',
    preview: 'Apercu',
    noPreview: 'Selectionnez ou importez un portrait pour previsualiser l export.',
    exportSettings: 'Parametres d export',
    photoSize: 'Format photo',
    background: 'Fond',
    backgroundPngOnly: 'La couleur de fond est disponible pour les images PNG avec transparence.',
    zoom: 'Zoom',
    horizontalPosition: 'Position horizontale',
    verticalPosition: 'Position verticale',
    printLayout: 'Mise en page',
    paper: 'Papier',
    fits: (copies, columns, rows) => `${copies} copies par feuille (${columns} x ${rows}), centrees avec marges de 5 mm et espaces de 3 mm.`,
    doesNotFit: 'Ce format photo ne tient pas sur le papier selectionne avec les marges.',
    downloadSingle: 'Telecharger un JPG',
    downloadSheet: 'Telecharger la planche JPG',
  },
  de: {
    warningTitle: 'Gut geeignet fur Lebenslauf, Schul- oder Bewerbungsunterlagen, Prufungen, Mitarbeiterausweise, Studentenkarten und private Drucklayouts.',
    warningText: 'Nicht empfohlen fur Pass, Visum, Personalausweis, Einwanderung oder andere offizielle Einreichungen. Fur offizielle Dokumente bitte die aktuellen Vorgaben der Behorde beachten oder einen professionellen Fotoservice nutzen.',
    sourcePhoto: 'Quellfoto',
    refresh: 'Aktualisieren',
    localUpload: 'Lokaler Upload',
    empty: 'Lade ein Portrat hoch oder wahle eines aus.',
    preview: 'Vorschau',
    noPreview: 'Wahle ein Portrat aus oder lade es hoch, um den Export zu sehen.',
    exportSettings: 'Export-Einstellungen',
    photoSize: 'Fotogroesse',
    background: 'Hintergrund',
    backgroundPngOnly: 'Hintergrundfarbe ist fur PNG-Bilder mit Transparenz verfugbar.',
    zoom: 'Zoom',
    horizontalPosition: 'Horizontale Position',
    verticalPosition: 'Vertikale Position',
    printLayout: 'Drucklayout',
    paper: 'Papier',
    fits: (copies, columns, rows) => `${copies} Kopien pro Blatt (${columns} x ${rows}), zentriert mit 5 mm Rand und 3 mm Abstand.`,
    doesNotFit: 'Diese Fotogroesse passt mit Druckrand nicht auf das gewahlte Papier.',
    downloadSingle: 'Einzelnes JPG herunterladen',
    downloadSheet: 'Druckbogen JPG herunterladen',
  },
  ja: {
    warningTitle: '履歴書、学校・仕事の申請、試験、社員証、学生証、個人用の印刷レイアウトに適しています。',
    warningText: 'パスポート、ビザ、国民ID、入国管理などの公式提出写真には推奨しません。公式書類では最新の提出要件を確認するか、専門サービスを利用してください。',
    sourcePhoto: '元画像',
    refresh: '更新',
    localUpload: 'ローカルアップロード',
    empty: 'ポートレートをアップロードまたは選択してください。',
    preview: 'プレビュー',
    noPreview: 'ポートレートを選択またはアップロードするとプレビューできます。',
    exportSettings: '出力設定',
    photoSize: '写真サイズ',
    background: '背景',
    backgroundPngOnly: '背景色の変更は、透明部分のあるPNG画像で利用できます。',
    zoom: 'ズーム',
    horizontalPosition: '水平位置',
    verticalPosition: '垂直位置',
    printLayout: '印刷レイアウト',
    paper: '用紙',
    fits: (copies, columns, rows) => `1枚に${copies}枚配置できます（${columns} x ${rows}）。5 mm余白、3 mm間隔で中央配置します。`,
    doesNotFit: '選択した写真サイズは、印刷余白を含めるとこの用紙に収まりません。',
    downloadSingle: '単体JPGをダウンロード',
    downloadSheet: '印刷シートJPGをダウンロード',
  },
}

const noteTranslations: Record<string, LocalizedText> = {
  'Common small print size for resumes, forms, and applications.': {
    en: 'Common small print size for resumes, forms, and applications.',
    es: 'Tamano pequeno comun para CV, formularios y solicitudes.',
    fr: 'Petit format courant pour CV, formulaires et candidatures.',
    de: 'Kleines Standardformat fur Lebenslauf, Formulare und Antrage.',
    ja: '履歴書、フォーム、申請用によく使われる小さめの印刷サイズです。',
  },
  'Common larger print size for forms, badges, and applications.': {
    en: 'Common larger print size for forms, badges, and applications.',
    es: 'Tamano mas grande para formularios, credenciales y solicitudes.',
    fr: 'Format plus grand pour formulaires, badges et candidatures.',
    de: 'Groesseres Format fur Formulare, Ausweise und Antrage.',
    ja: 'フォーム、バッジ、申請用によく使われる大きめの印刷サイズです。',
  },
  'Common compact ID print ratio.': {
    en: 'Common compact ID print ratio.',
    es: 'Proporcion compacta comun para foto de identificacion.',
    fr: 'Ratio compact courant pour photo d identite.',
    de: 'Kompaktes Standardverhaltnis fur Ausweisfotos.',
    ja: 'コンパクトな証明写真比率としてよく使われます。',
  },
  'Reference print size only. Not recommended for official submission.': {
    en: 'Reference print size only. Not recommended for official submission.',
    es: 'Solo tamano de referencia. No recomendado para envio oficial.',
    fr: 'Format de reference uniquement. Non recommande pour une soumission officielle.',
    de: 'Nur Referenzformat. Nicht fur offizielle Einreichungen empfohlen.',
    ja: '参考用サイズです。公式提出用には推奨しません。',
  },
  'Common square 2 inch print preset.': {
    en: 'Common square 2 inch print preset.',
    es: 'Formato cuadrado comun de 2 pulgadas.',
    fr: 'Format carre courant de 2 pouces.',
    de: 'Quadratisches Standardformat mit 2 Zoll.',
    ja: '2インチ正方形の一般的な印刷プリセットです。',
  },
  'Common square print preset.': {
    en: 'Common square print preset.',
    es: 'Formato cuadrado comun.',
    fr: 'Format carre courant.',
    de: 'Quadratisches Standardformat.',
    ja: '一般的な正方形の印刷プリセットです。',
  },
  'Tall portrait print preset.': {
    en: 'Tall portrait print preset.',
    es: 'Formato vertical alto para retrato.',
    fr: 'Format portrait vertical haut.',
    de: 'Hohes Hochformat fur Portrats.',
    ja: '縦長のポートレート印刷プリセットです。',
  },
  'Common UK-style print size.': {
    en: 'Common UK-style print size.',
    es: 'Tamano comun de estilo Reino Unido.',
    fr: 'Format courant de style Royaume-Uni.',
    de: 'Standardformat nach britischem Stil.',
    ja: '英国スタイルの一般的な印刷サイズです。',
  },
  'Common European-style print size.': {
    en: 'Common European-style print size.',
    es: 'Tamano comun de estilo europeo.',
    fr: 'Format courant de style europeen.',
    de: 'Standardformat nach europaischem Stil.',
    ja: 'ヨーロッパスタイルの一般的な印刷サイズです。',
  },
  'Common 3 x 4 cm print preset.': {
    en: 'Common 3 x 4 cm print preset.',
    es: 'Formato comun de 3 x 4 cm.',
    fr: 'Format courant 3 x 4 cm.',
    de: 'Standardformat 3 x 4 cm.',
    ja: '3 x 4 cm の一般的な印刷プリセットです。',
  },
  'Common tall biometric-style print preset.': {
    en: 'Common tall biometric-style print preset.',
    es: 'Formato vertical comun de estilo biometrico.',
    fr: 'Format vertical courant de style biometrique.',
    de: 'Hohes Standardformat im biometrischen Stil.',
    ja: '縦長の生体認証風印刷プリセットです。',
  },
  'Useful for staff cards, badges, and internal systems.': {
    en: 'Useful for staff cards, badges, and internal systems.',
    es: 'Util para tarjetas de personal, credenciales y sistemas internos.',
    fr: 'Utile pour cartes du personnel, badges et systemes internes.',
    de: 'Nuetzlich fur Mitarbeiterausweise, Badges und interne Systeme.',
    ja: '社員証、バッジ、社内システム用に便利です。',
  },
}

function countrySpec(
  id: string,
  en: string,
  es: string,
  fr: string,
  de: string,
  ja: string,
  widthMm: number,
  heightMm: number,
  note: string,
): PhotoSpec {
  const sizeLabel = `${formatMm(widthMm)} x ${formatMm(heightMm)} mm`

  return {
    id,
    label: {
      en: `${en} - ${sizeLabel}`,
      es: `${es} - ${sizeLabel}`,
      fr: `${fr} - ${sizeLabel}`,
      de: `${de} - ${sizeLabel}`,
      ja: `${ja} - ${sizeLabel}`,
    },
    widthMm,
    heightMm,
    dpi: 300,
    note,
  }
}

function localizedText(text: LocalizedText, locale: Locale) {
  return text[locale] || text.en
}

function localizedNote(note: string): LocalizedText {
  if (noteTranslations[note]) return noteTranslations[note]

  if (note.startsWith('Common ') && (note.includes('-style print size') || note.includes('-style print preset'))) {
    return {
      en: note,
      es: 'Tamano comun para impresion de foto de identificacion.',
      fr: 'Format courant pour impression de photo d identite.',
      de: 'Standardformat fur den Ausweisfoto-Druck.',
      ja: '証明写真の印刷によく使われるサイズです。',
    }
  }

  if (note === 'Common larger portrait print preset.' || note === 'Common Gulf-region portrait print preset.') {
    return {
      en: note,
      es: 'Formato vertical comun para retrato.',
      fr: 'Format portrait vertical courant.',
      de: 'Standard-Hochformat fur Portrats.',
      ja: '縦長ポートレート用の一般的な印刷プリセットです。',
    }
  }

  return { en: note }
}

function formatMm(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

export default function PhotoToolsWorkbench({
  sources = [],
  allowUpload = false,
  sourceTitle,
  sourceDescription = 'Choose a portrait, then export ID-sized copies.',
  uploadLabel = 'Upload Image',
  sourceActions,
  emptyState,
  onRefresh,
  isRefreshing = false,
  locale = 'en',
}: PhotoToolsWorkbenchProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const previewRef = useRef<HTMLCanvasElement | null>(null)
  const uploadedUrlsRef = useRef<string[]>([])
  const [uploadedSources, setUploadedSources] = useState<PhotoToolSource[]>([])
  const [selectedUrl, setSelectedUrl] = useState('')
  const [selectedSpecId, setSelectedSpecId] = useState(photoSpecs[1].id)
  const [selectedPaperId, setSelectedPaperId] = useState(paperSpecs[0].id)
  const [backgroundColor, setBackgroundColor] = useState(backgrounds[0].value)
  const [zoom, setZoom] = useState(1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [isRendering, setIsRendering] = useState(false)
  const [error, setError] = useState('')

  const allSources = useMemo(() => [...uploadedSources, ...sources], [sources, uploadedSources])
  const selectedSpec = useMemo(
    () => photoSpecs.find((spec) => spec.id === selectedSpecId) || photoSpecs[0],
    [selectedSpecId],
  )
  const selectedPaper = useMemo(
    () => paperSpecs.find((paper) => paper.id === selectedPaperId) || paperSpecs[0],
    [selectedPaperId],
  )
  const outputSize = useMemo(() => ({
    width: mmToPx(selectedSpec.widthMm, selectedSpec.dpi),
    height: mmToPx(selectedSpec.heightMm, selectedSpec.dpi),
  }), [selectedSpec])
  const selectedSpecLabel = localizedText(selectedSpec.label, locale)
  const selectedSpecNote = localizedText(localizedNote(selectedSpec.note), locale)
  const printLayout = useMemo(
    () => calculatePrintLayout(outputSize.width, outputSize.height, selectedSpec.dpi, selectedPaper),
    [outputSize.height, outputSize.width, selectedPaper, selectedSpec.dpi],
  )
  const selectedSource = useMemo(
    () => allSources.find((source) => source.url === selectedUrl) || null,
    [allSources, selectedUrl],
  )
  const selectedIsPng = useMemo(
    () => selectedSource ? isPngSource(selectedSource) : false,
    [selectedSource],
  )
  const effectiveBackgroundColor = selectedIsPng ? backgroundColor : backgrounds[0].value
  const ui = workbenchText[locale]

  useEffect(() => {
    if (!allSources.length) {
      setSelectedUrl('')
      return
    }

    if (!selectedUrl || !allSources.some((source) => source.url === selectedUrl)) {
      setSelectedUrl(allSources[0].url)
    }
  }, [allSources, selectedUrl])

  useEffect(() => () => {
    uploadedUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
  }, [])

  const drawPreview = useCallback(async () => {
    const canvas = previewRef.current
    if (!canvas || !selectedUrl) return

    try {
      const rendered = await renderPhotoCanvas({
        imageUrl: selectedUrl,
        spec: selectedSpec,
        backgroundColor: effectiveBackgroundColor,
        zoom,
        offsetX,
        offsetY,
      })
      canvas.width = rendered.width
      canvas.height = rendered.height
      const context = canvas.getContext('2d')
      context?.clearRect(0, 0, canvas.width, canvas.height)
      context?.drawImage(rendered, 0, 0)
    } catch (previewError) {
      setError(previewError instanceof Error ? previewError.message : 'Failed to render preview.')
    }
  }, [effectiveBackgroundColor, offsetX, offsetY, selectedSpec, selectedUrl, zoom])

  useEffect(() => {
    void drawPreview()
  }, [drawPreview])

  const handleUpload = (files: FileList | null) => {
    const imageFiles = Array.from(files || []).filter((file) => file.type.startsWith('image/'))
    if (!imageFiles.length) return

    const nextSources = imageFiles.map((file, index) => {
      const url = URL.createObjectURL(file)
      uploadedUrlsRef.current.push(url)
      return {
        id: `upload-${Date.now()}-${index}-${file.name}`,
        url,
        label: file.name,
        caption: ui.localUpload,
        mimeType: file.type,
      }
    })

    setUploadedSources((current) => [...nextSources, ...current])
    setSelectedUrl(nextSources[0].url)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const downloadSingle = async () => {
    if (!selectedUrl) return

    setIsRendering(true)
    setError('')

    try {
      const canvas = await renderPhotoCanvas({
        imageUrl: selectedUrl,
        spec: selectedSpec,
        backgroundColor: effectiveBackgroundColor,
        zoom,
        offsetX,
        offsetY,
      })
      await downloadCanvas(canvas, `${selectedSpec.id}.jpg`)
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : 'Failed to download photo.')
    } finally {
      setIsRendering(false)
    }
  }

  const downloadPrintSheet = async () => {
    if (!selectedUrl) return

    setIsRendering(true)
    setError('')

    try {
      const photoCanvas = await renderPhotoCanvas({
        imageUrl: selectedUrl,
        spec: selectedSpec,
        backgroundColor: effectiveBackgroundColor,
        zoom,
        offsetX,
        offsetY,
      })
      const sheet = renderPrintSheet(photoCanvas, selectedSpec, selectedPaper)
      await downloadCanvas(sheet, `${selectedSpec.id}-${selectedPaper.id}-print-sheet.jpg`, 0.96)
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : 'Failed to download print sheet.')
    } finally {
      setIsRendering(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:px-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-none" />
          <div>
            <p className="font-semibold">{ui.warningTitle}</p>
            <p className="mt-1">{ui.warningText}</p>
          </div>
        </div>
      </div>

      <Card className="p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
              <ImageIcon className="h-4 w-4" />
              {sourceTitle || ui.sourcePhoto}
            </div>
            <p className="mt-1 text-sm text-slate-600">{sourceDescription}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {sourceActions}
            {allowUpload && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  className="hidden"
                  onChange={(event) => handleUpload(event.target.files)}
                />
                <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  {uploadLabel}
                </Button>
              </>
            )}
            {onRefresh && (
              <Button variant="secondary" size="sm" onClick={onRefresh} disabled={isRefreshing}>
                <RefreshCw className="mr-2 h-4 w-4" />
                {ui.refresh}
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-none" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {allSources.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500 sm:col-span-3 lg:col-span-4">
              {emptyState || ui.empty}
            </div>
          ) : (
            allSources.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedUrl(photo.url)}
                className={cn(
                  'overflow-hidden rounded-xl border bg-white text-left transition-all',
                  selectedUrl === photo.url ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300',
                )}
              >
                <div className="aspect-square bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="p-2 text-xs text-slate-500">
                  <div className="truncate font-semibold text-slate-700">{photo.label}</div>
                  {photo.caption && <div className="truncate">{photo.caption}</div>}
                </div>
              </button>
            ))
          )}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-3 sm:px-5">
            <h2 className="font-bold text-slate-900">{ui.preview}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {selectedSpecLabel}, {outputSize.width} x {outputSize.height}px at {selectedSpec.dpi} DPI
            </p>
          </div>
          <div className="flex min-h-[420px] items-center justify-center bg-slate-100 p-4">
            {selectedUrl ? (
              <canvas
                ref={previewRef}
                className="max-h-[620px] max-w-full rounded-lg bg-white shadow-sm"
                style={{ aspectRatio: `${outputSize.width} / ${outputSize.height}` }}
              />
            ) : (
              <div className="text-center text-sm text-slate-500">{ui.noPreview}</div>
            )}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <SlidersHorizontal className="h-4 w-4" />
              {ui.exportSettings}
            </div>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">{ui.photoSize}</span>
              <select
                value={selectedSpecId}
                onChange={(event) => setSelectedSpecId(event.target.value)}
                className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {photoSpecs.map((spec) => (
                  <option key={spec.id} value={spec.id}>{localizedText(spec.label, locale)}</option>
                ))}
              </select>
              <span className="mt-1.5 block text-xs text-slate-500">{selectedSpecNote}</span>
            </label>

            {selectedIsPng ? (
              <div className="mt-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Palette className="h-4 w-4" />
                  {ui.background}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {backgrounds.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setBackgroundColor(preset.value)}
                      className={cn(
                        'h-10 rounded-lg border text-xs font-semibold transition-all',
                        backgroundColor.toLowerCase() === preset.value ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200',
                      )}
                      style={{ backgroundColor: preset.value, color: preset.value === '#ffffff' || preset.value === '#f1f5f9' ? '#0f172a' : '#ffffff' }}
                    >
                      {localizedText(preset.label, locale)}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {ui.backgroundPngOnly}
              </div>
            )}

            <div className="mt-4 grid gap-4">
              <RangeControl label={ui.zoom} min={0.8} max={1.8} step={0.01} value={zoom} onChange={setZoom} valueLabel={`${Math.round(zoom * 100)}%`} />
              <RangeControl label={ui.horizontalPosition} min={-35} max={35} step={1} value={offsetX} onChange={setOffsetX} valueLabel={`${offsetX}%`} />
              <RangeControl label={ui.verticalPosition} min={-35} max={35} step={1} value={offsetY} onChange={setOffsetY} valueLabel={`${offsetY}%`} />
            </div>
          </Card>

          <Card className="p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-blue-600">
              <Printer className="h-4 w-4" />
              {ui.printLayout}
            </div>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">{ui.paper}</span>
              <select
                value={selectedPaperId}
                onChange={(event) => setSelectedPaperId(event.target.value)}
                className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {paperSpecs.map((paper) => (
                  <option key={paper.id} value={paper.id}>{paper.label}</option>
                ))}
              </select>
              <span className="mt-1.5 block text-xs text-slate-500">
                {printLayout.fits
                  ? ui.fits(printLayout.totalCopies, printLayout.columns, printLayout.rows)
                  : ui.doesNotFit}
              </span>
            </label>

            <div className="mt-4 grid gap-2">
              <Button onClick={() => void downloadSingle()} disabled={!selectedUrl || isRendering}>
                <Download className="mr-2 h-4 w-4" />
                {ui.downloadSingle}
              </Button>
              <Button variant="secondary" onClick={() => void downloadPrintSheet()} disabled={!selectedUrl || isRendering || !printLayout.fits}>
                <Printer className="mr-2 h-4 w-4" />
                {ui.downloadSheet}
              </Button>
            </div>
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

function isPngSource(source: PhotoToolSource) {
  const mimeType = source.mimeType?.split(';')[0].trim().toLowerCase()
  if (mimeType) return mimeType === 'image/png'

  try {
    const pathname = new URL(source.url, window.location.origin).pathname.toLowerCase()
    return pathname.endsWith('.png')
  } catch {
    return source.url.toLowerCase().split('?')[0].endsWith('.png')
  }
}

async function renderPhotoCanvas({
  imageUrl,
  spec,
  backgroundColor,
  zoom,
  offsetX,
  offsetY,
}: {
  imageUrl: string
  spec: PhotoSpec
  backgroundColor: string
  zoom: number
  offsetX: number
  offsetY: number
}) {
  const image = await loadImage(imageUrl)
  const width = mmToPx(spec.widthMm, spec.dpi)
  const height = mmToPx(spec.heightMm, spec.dpi)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d', { willReadFrequently: true })
  if (!context) throw new Error('Canvas is not available in this browser.')

  context.fillStyle = backgroundColor
  context.fillRect(0, 0, width, height)

  const baseScale = Math.max(width / image.naturalWidth, height / image.naturalHeight) * zoom
  const drawWidth = image.naturalWidth * baseScale
  const drawHeight = image.naturalHeight * baseScale
  const drawX = (width - drawWidth) / 2 + (offsetX / 100) * width
  const drawY = (height - drawHeight) / 2 + (offsetY / 100) * height
  context.drawImage(image, drawX, drawY, drawWidth, drawHeight)

  return canvas
}

function renderPrintSheet(photoCanvas: HTMLCanvasElement, spec: PhotoSpec, paper: PaperSpec) {
  const layout = calculatePrintLayout(photoCanvas.width, photoCanvas.height, spec.dpi, paper)
  if (!layout.fits) {
    throw new Error('The selected photo size does not fit the selected paper.')
  }

  const canvas = document.createElement('canvas')
  canvas.width = layout.sheetWidth
  canvas.height = layout.sheetHeight
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is not available in this browser.')

  context.fillStyle = '#ffffff'
  context.fillRect(0, 0, layout.sheetWidth, layout.sheetHeight)

  context.strokeStyle = '#cbd5e1'
  context.lineWidth = Math.max(1, Math.round(spec.dpi / 300))

  for (let row = 0; row < layout.rows; row += 1) {
    for (let column = 0; column < layout.columns; column += 1) {
      const x = layout.startX + column * (photoCanvas.width + layout.gap)
      const y = layout.startY + row * (photoCanvas.height + layout.gap)
      context.drawImage(photoCanvas, x, y)
      context.strokeRect(x - 1, y - 1, photoCanvas.width + 2, photoCanvas.height + 2)
    }
  }

  return canvas
}

function calculatePrintLayout(photoWidth: number, photoHeight: number, dpi: number, paper: PaperSpec) {
  const sheetWidth = mmToPx(paper.widthMm, dpi)
  const sheetHeight = mmToPx(paper.heightMm, dpi)
  const margin = mmToPx(5, dpi)
  const gap = mmToPx(3, dpi)
  const usableWidth = sheetWidth - margin * 2
  const usableHeight = sheetHeight - margin * 2
  const fitsSingle = photoWidth <= usableWidth && photoHeight <= usableHeight

  if (!fitsSingle) {
    return {
      sheetWidth,
      sheetHeight,
      margin,
      gap,
      columns: 0,
      rows: 0,
      totalCopies: 0,
      startX: margin,
      startY: margin,
      fits: false,
    }
  }

  const columns = Math.max(1, Math.floor((usableWidth + gap) / (photoWidth + gap)))
  const rows = Math.max(1, Math.floor((usableHeight + gap) / (photoHeight + gap)))
  const totalWidth = columns * photoWidth + (columns - 1) * gap
  const totalHeight = rows * photoHeight + (rows - 1) * gap

  return {
    sheetWidth,
    sheetHeight,
    margin,
    gap,
    columns,
    rows,
    totalCopies: columns * rows,
    startX: Math.max(margin, Math.floor((sheetWidth - totalWidth) / 2)),
    startY: Math.max(margin, Math.floor((sheetHeight - totalHeight) / 2)),
    fits: true,
  }
}

async function loadImage(url: string) {
  const blobUrl = await fetchImageBlobUrl(url)
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
      resolve(image)
    }
    image.onerror = () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
      reject(new Error('Could not load the selected image for export.'))
    }
    image.crossOrigin = 'anonymous'
    image.src = blobUrl || url
  })
}

async function fetchImageBlobUrl(url: string) {
  try {
    const response = await fetch(url, { mode: 'cors' })
    if (!response.ok) return ''
    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch {
    return ''
  }
}

function mmToPx(mm: number, dpi: number) {
  return Math.round((mm / 25.4) * dpi)
}

async function downloadCanvas(canvas: HTMLCanvasElement, filename: string, quality = 0.94) {
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
  if (!blob) throw new Error('Failed to create image file.')
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
