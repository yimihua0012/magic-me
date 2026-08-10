'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import LocalizedNavbar from '@/components/layout/localized-navbar'
import LocalizedFooter from '@/components/layout/localized-footer'
import BreadcrumbNav, { type BreadcrumbNavItem } from '@/components/seo/breadcrumb-nav'
import Button from '@/components/ui/button'
import { BriefcaseBusiness, CheckCircle2, FileText, ImagePlus, Layers3, Palette, Printer, Shapes, ShieldAlert, SlidersHorizontal, Sparkles, UserRoundCheck } from 'lucide-react'
import { localePath, type Locale } from '@/lib/i18n'
import { localizedLayoutContent } from '@/lib/localized-layout-content'
import { withSource } from '@/lib/navigation-source'
import AspectRatioCropTool from '@/components/photo-tools/aspect-ratio-crop-tool'
import BackgroundColorTool from '@/components/photo-tools/background-color-tool'
import IdPhotoCropPrintTool from '@/components/photo-tools/id-photo-crop-print-tool'
import PhotoToolsAiWorkflowCard from '@/components/photo-tools/photo-tools-ai-workflow-card'
import PrintLayoutBuilderTool from '@/components/photo-tools/print-layout-builder-tool'
import ResizeImageKbTool from '@/components/photo-tools/resize-image-kb-tool'
import RemoveBackgroundTool from '@/components/photo-tools/remove-background-tool'
import ShapeCropTool from '@/components/photo-tools/shape-crop-tool'
import { getPhotoToolPages, photoToolPages } from '@/lib/photo-tool-page-content'

type SeoContent = {
  useTitle: string
  useItems: string[]
  sizeTitle: string
  sizeItems: string[]
  printTitle: string
  printItems: string[]
  warningTitle: string
  warningText: string
  faqTitle: string
  faqs: Array<{ question: string; answer: string }>
}

const pageContent: Record<Locale, {
  eyebrow: string
  title: string
  description: string
  generate: string
  sourceDescription: string
  upload: string
  empty: string
  loading: string
}> = {
  en: {
    eyebrow: 'Free ID Photo Tool',
    title: 'Free ID Photo Generator, Crop & Print',
    description: 'Upload a local portrait, generate common ID photo sizes, crop passport-style images, change background colors, and download a printable layout sheet for resumes, exams, badges, student cards, or everyday document photos.',
    generate: 'Generate ID Photo And PNG',
    sourceDescription: 'Upload a local PNG, JPG, or WebP portrait. Transparent PNG works best for background color changes.',
    upload: 'Upload Local Image',
    empty: 'Upload a local image to start cropping and printing.',
    loading: 'Loading photo tools...',
  },
  zh: {
    eyebrow: 'Free ID Photo Tool',
    title: '免费证件照生成、裁剪和打印排版',
    description: '上传本地人像，生成常用证件照尺寸，裁剪证件照风格图片，更换背景色，并下载适合简历、考试、工牌、学生证和日常资料照的打印排版。',
    generate: '生成证件照和 PNG',
    sourceDescription: '上传本地 PNG、JPG 或 WebP 人像。透明 PNG 最适合更换白底、蓝底、红底或浅灰底。',
    upload: '上传本地图片',
    empty: '上传本地图片后开始裁剪和排版。',
    loading: '正在加载 Photo Tools...',
  },
  es: {
    eyebrow: "Foto tipo carnet gratis",
    title: "Recortar y preparar fotos tipo carnet para imprimir",
    description: "Sube una foto local, elige un tamano habitual, ajusta el recorte y descarga una hoja imprimible para CV, examenes, credenciales, tarjetas de estudiante o tramites no oficiales.",
    generate: "Crear foto ID y PNG",
    sourceDescription: "Sube PNG, JPG o WebP. Para cambiar el color de fondo necesitas un PNG con transparencia.",
    upload: "Subir foto local",
    empty: "Sube una foto para empezar a recortar, revisar fondo y preparar impresion.",
    loading: "Cargando herramienta...",
  },
  fr: {
    eyebrow: 'Outil gratuit de photo d identite',
    title: 'Generateur, recadrage et impression de photo d identite gratuits',
    description: 'Importez un portrait local, choisissez des formats courants par pays, changez le fond et telechargez une planche imprimable pour CV, examens, badges, cartes etudiant et petites photos du quotidien.',
    generate: 'Creer une photo ID et PNG',
    sourceDescription: 'Importez un portrait PNG, JPG ou WebP. Un PNG transparent fonctionne mieux pour changer le fond.',
    upload: 'Importer une image locale',
    empty: 'Importez une image locale pour commencer le recadrage et l impression.',
    loading: 'Chargement des outils photo...',
  },
  de: {
    eyebrow: "Kostenloses Ausweisfoto-Tool",
    title: "Ausweisfoto zuschneiden und Druckbogen vorbereiten",
    description: "Lade ein lokales Foto hoch, waehle ein gaengiges Format, passe den Ausschnitt an und speichere einen Druckbogen fuer Lebenslauf, Pruefung, Mitarbeiterausweis oder private Unterlagen.",
    generate: "Passfoto und PNG erstellen",
    sourceDescription: "PNG, JPG oder WebP hochladen. Hintergrundfarben funktionieren nur mit transparentem PNG.",
    upload: "Lokales Foto hochladen",
    empty: "Lade ein Foto hoch, um Zuschnitt, Hintergrundvorschau und Drucklayout zu starten.",
    loading: "Fototool wird geladen...",
  },
  ja: {
    eyebrow: "無料の証明写真ツール",
    title: "証明写真を無料で作成・切り抜き・印刷",
    description: "ローカル画像をアップロードし、よく使う証明写真サイズに合わせて切り抜き、背景色を確認して、履歴書、試験、社員証、学生証、日常の書類用に印刷シートをダウンロードできます。",
    generate: "証明写真とPNGを作成",
    sourceDescription: "PNG、JPG、WebPの人物写真をアップロードできます。背景色を変更する場合は透明PNGが最適です。",
    upload: "ローカル画像をアップロード",
    empty: "画像をアップロードすると、切り抜きと印刷準備を開始できます。",
    loading: "写真ツールを読み込み中...",
  },
}

const seoContent: Record<Locale, SeoContent> = {
  en: {
    useTitle: 'Useful for everyday ID photo needs',
    useItems: [
      'Resume, job application, school registration, exam registration, staff badge, and print shop preparation.',
      'Free local upload, crop, background preview, and printable sheet download without signing in.',
      'Transparent PNG portraits work best when you need white, blue, red, or light gray backgrounds.',
    ],
    sizeTitle: 'Common photo sizes included',
    sizeItems: [
      'United States 2 x 2 in, China 1 inch and 2 inch, Japan 3 x 4 cm, EU 35 x 45 mm, India 2 x 2 in, and other frequent local sizes.',
      'Photo paper presets include 4 x 6 in, 5 x 7 in, A4, and common metric print sheets for multi-photo layouts.',
    ],
    printTitle: 'Prepared for small photo printing',
    printItems: [
      'Export one finished JPG for digital use or a print sheet with repeated copies on one page.',
      'The layout keeps physical size, margins, and crop ratio stable so it is easier to print at home or at a shop.',
    ],
    warningTitle: 'Not recommended for official passport or visa submission',
    warningText: 'Use this tool for resumes, school, exams, badges, and printing. For passports, visas, national IDs, or government submission, follow the official photo rules from that authority.',
    faqTitle: 'Free ID Photo Tool FAQ',
    faqs: [
      {
        question: 'Can I make a 2 inch or 2 x 2 inch photo?',
        answer: 'Yes. Choose the matching photo size, adjust the crop, and download either a single image or a printable sheet.',
      },
      {
        question: 'Can I change the background color?',
        answer: 'Yes. Background replacement works best with a transparent PNG portrait. Regular JPG photos can still be cropped and printed.',
      },
    ],
  },
  zh: {
    useTitle: '适合日常证件照和资料照片',
    useItems: [
      '可用于简历、求职申请、学校登记、考试报名、员工证、学生证和打印店准备。',
      '支持本地上传、裁剪、背景预览和打印排版下载，无需登录即可使用基础工具。',
      '需要白底、蓝底、红底或浅灰底时，透明 PNG 人像效果更稳定。',
    ],
    sizeTitle: '包含常用照片尺寸',
    sizeItems: [
      '包含美国 2 x 2 英寸、中国一寸和二寸、日本 3 x 4 cm、欧盟 35 x 45 mm、印度 2 x 2 英寸等常见尺寸。',
      '纸张预设包含 4 x 6 英寸、5 x 7 英寸、A4 和常见公制打印纸。',
    ],
    printTitle: '适合小尺寸照片打印',
    printItems: [
      '可以导出单张完成图，也可以生成一页多张的打印排版。',
      '排版会尽量保持物理尺寸、边距和裁剪比例稳定，方便家庭打印或照相馆打印。',
    ],
    warningTitle: '不建议直接用于官方护照或签证提交',
    warningText: '这个工具适合简历、学校、考试、工牌和日常打印。护照、签证、身份证或政府提交，请以对应机构最新照片规则为准。',
    faqTitle: 'Free ID Photo Tool 常见问题',
    faqs: [
      {
        question: '可以制作二寸或 2 x 2 英寸照片吗？',
        answer: '可以。选择对应照片尺寸，调整裁剪位置后，下载单张图片或打印排版。',
      },
      {
        question: '可以更换背景颜色吗？',
        answer: '可以。背景更换最适合透明 PNG 人像。普通 JPG 照片仍然可以裁剪和打印。',
      },
    ],
  },
  es: {
    useTitle: "Para usos cotidianos, no oficiales",
    useItems: [
      "CV, formularios, examenes, credenciales de empresa, tarjetas de estudiante y copias para imprimir.",
      "Carga local gratis, recorte, vista previa y descarga de hoja sin iniciar sesion.",
      "El cambio de fondo funciona mejor cuando la foto ya es un PNG transparente.",
    ],
    sizeTitle: "Formatos frecuentes en un solo lugar",
    sizeItems: [
      "Incluye 1 pulgada, 2 pulgadas, 2 x 2 pulgadas, 35 x 45 mm, 3 x 4 cm y otros tamanos habituales.",
      "Puedes preparar hojas 4 x 6, 5 x 7, A4, Letter y otros papeles comunes.",
    ],
    printTitle: "Listo para llevar a imprimir",
    printItems: [
      "Descarga una foto individual o una hoja con varias copias.",
      "El layout mantiene margenes y separacion para que sea mas facil imprimir a tamano real.",
    ],
    warningTitle: "No lo uses como garantia para pasaporte o visa",
    warningText: "Esta herramienta esta pensada para usos cotidianos. Para documentos oficiales, revisa siempre las reglas actuales de la autoridad correspondiente.",
    faqTitle: "Preguntas frecuentes",
    faqs: [
      {
        question: "Puedo cambiar el fondo?",
        answer: "Si, pero solo cuando la imagen seleccionada es un PNG transparente. Un JPG se puede recortar e imprimir, pero no reemplaza el fondo.",
      },
      {
        question: "Sirve para imprimir varias copias?",
        answer: "Si. Elige el papel y descarga una hoja JPG con las copias que quepan.",
      },
    ],
  },
  fr: {
    useTitle: 'Utile pour les photos d identite du quotidien',
    useItems: [
      'CV, inscription scolaire, concours, badge professionnel, dossier administratif simple et preparation d impression.',
      'Import local gratuit, recadrage, apercu du fond et planche imprimable sans connexion.',
      'Un portrait PNG transparent donne le meilleur resultat pour les fonds blanc, bleu, rouge ou gris clair.',
    ],
    sizeTitle: 'Formats courants pris en charge',
    sizeItems: [
      'Formats 35 x 45 mm, 3 x 4 cm, 2 x 2 pouces, 1 pouce, 2 pouces et autres tailles frequentes.',
      'Formats papier 10 x 15 cm, 13 x 18 cm, A4 et feuilles metriques pour plusieurs copies.',
    ],
    printTitle: 'Prepare pour l impression de petites photos',
    printItems: [
      'Telechargez une photo JPG seule ou une planche avec plusieurs exemplaires.',
      'La mise en page conserve le ratio, les marges et la taille physique pour une impression plus fiable.',
    ],
    warningTitle: 'Non recommande pour passeport ou visa officiel',
    warningText: 'Utilisez cet outil pour CV, ecole, examens, badges et impressions. Pour passeport, visa ou piece officielle, suivez les exigences de l autorite concernee.',
    faqTitle: 'Questions frequentes',
    faqs: [
      {
        question: 'Puis-je creer une photo 35 x 45 mm?',
        answer: 'Oui. Choisissez le format, ajustez le recadrage, puis telechargez une image seule ou une planche imprimable.',
      },
      {
        question: 'Puis-je modifier la couleur de fond?',
        answer: 'Oui. Le resultat est meilleur avec un portrait PNG transparent; les JPG restent utiles pour recadrer et imprimer.',
      },
    ],
  },
  de: {
    useTitle: "Fuer alltaegliche, nicht amtliche Fotos",
    useItems: [
      "Lebenslauf, Bewerbungen, Pruefungen, Mitarbeiterausweise, Studentenkarten und private Ausdrucke.",
      "Lokaler Upload, Zuschnitt, Vorschau und Druckbogen ohne Anmeldung.",
      "Hintergrundfarben sind fuer transparente PNG Portraits gedacht.",
    ],
    sizeTitle: "Haeufige Formate schnell waehlen",
    sizeItems: [
      "Unterstuetzt 1 Zoll, 2 Zoll, 2 x 2 Zoll, 35 x 45 mm, 3 x 4 cm und weitere Standardgroessen.",
      "Druckbogen fuer 4 x 6, 5 x 7, A4, Letter und gaengige Papierformate.",
    ],
    printTitle: "Praktisch fuer Fotoausdrucke",
    printItems: [
      "Einzelnes JPG oder Druckbogen mit mehreren Kopien herunterladen.",
      "Rand und Abstand bleiben stabil, damit Drucken in Originalgroesse einfacher ist.",
    ],
    warningTitle: "Keine Garantie fuer Pass oder Visum",
    warningText: "Das Tool ist fuer alltaegliche Zwecke gedacht. Fuer amtliche Dokumente gelten immer die aktuellen Vorgaben der jeweiligen Behoerde.",
    faqTitle: "Haeufige Fragen",
    faqs: [
      {
        question: "Kann ich den Hintergrund aendern?",
        answer: "Ja, wenn das ausgewaehlte Bild ein transparentes PNG ist. JPG Bilder lassen sich zuschneiden und drucken, aber der Hintergrund wird nicht ersetzt.",
      },
      {
        question: "Kann ich mehrere Kopien drucken?",
        answer: "Ja. Waehle ein Papierformat und lade den Druckbogen als JPG herunter.",
      },
    ],
  },
  ja: {
    useTitle: "日常の証明写真用途に便利",
    useItems: [
      "履歴書、応募書類、学校登録、試験登録、社員証、学生証、印刷店への持ち込み準備に使えます。",
      "ログインなしで、ローカルアップロード、切り抜き、背景プレビュー、印刷シートのダウンロードができます。",
      "白、青、赤、薄いグレーなどの背景が必要な場合は、透明PNGの人物写真が最も扱いやすいです。",
    ],
    sizeTitle: "よく使う写真サイズに対応",
    sizeItems: [
      "米国2 x 2 inch、中国1 inch・2 inch、日本3 x 4 cm、EU 35 x 45 mm、インド2 x 2 inchなど、よく使うサイズを選べます。",
      "4 x 6 inch、5 x 7 inch、A4、Letterなどの用紙に複数枚を並べた印刷レイアウトを作成できます。",
    ],
    printTitle: "小さな写真の印刷用に準備",
    printItems: [
      "完成したJPGを1枚でダウンロードするか、同じ写真を複数並べた印刷シートを保存できます。",
      "物理サイズ、余白、切り抜き比率を保つため、自宅や店舗で実寸印刷しやすくなります。",
    ],
    warningTitle: "公式のパスポート・ビザ申請には推奨しません",
    warningText: "このツールは履歴書、学校、試験、バッジ、日常的な印刷用途向けです。パスポート、ビザ、本人確認書類などの公的申請では、必ず各機関の最新ルールに従ってください。",
    faqTitle: "無料証明写真ツール FAQ",
    faqs: [
      {
        question: "2 inchや2 x 2 inchの写真を作れますか？",
        answer: "はい。対応する写真サイズを選び、切り抜きを調整して、単体画像または印刷シートをダウンロードできます。",
      },
      {
        question: "背景色を変更できますか？",
        answer: "はい。背景変更は透明PNGの人物写真で最もきれいに機能します。通常のJPG写真は切り抜きと印刷に利用できます。",
      },
    ],
  },
}

interface PublicPhotoToolsPageViewProps {
  locale?: Locale
  breadcrumbItems?: readonly BreadcrumbNavItem[]
}

type EnglishTool = 'original' | 'id-photo-crop' | 'resize-image' | 'resize-image-kb' | 'remove-background' | 'background-color' | 'print-layout' | 'aspect-ratio-crop' | 'shape-crop'

const PhotoToolsWorkbench = dynamic(() => import('@/components/photo-tools/photo-tools-workbench'), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
      Loading photo tools...
    </div>
  ),
})

export default function PublicPhotoToolsPageView({ locale = 'en', breadcrumbItems }: PublicPhotoToolsPageViewProps) {
  const [activeTool, setActiveTool] = useState<EnglishTool>('original')
  const content = pageContent[locale]
  const seo = seoContent[locale]
  const layout = localizedLayoutContent[locale].footer
  const localizedToolPages = getPhotoToolPages(locale)
  const uploadHref = withSource(localePath(locale, '/upload'), `free_id_photo_tool_generate_png_${locale}`)
  const showAiWorkflowCard = locale === 'en' && activeTool !== 'original' && activeTool !== 'remove-background'
  const resourceLinks = [
    { href: localePath(locale, '/pricing'), label: layout.pricing },
    { href: localePath(locale, '/sample'), label: layout.samples },
    { href: localePath(locale, '/questions'), label: layout.questions },
  ]
  const toolContent = (
    <>
      <PhotoToolsWorkbench
        sourceDescription={content.sourceDescription}
        locale={locale}
        allowUpload
        uploadLabel={content.upload}
        emptyState={(
          <p>{content.empty}</p>
        )}
      />

      <section className="mt-10 space-y-6" aria-label="Free ID photo details">
        <div className="grid gap-4 lg:grid-cols-3">
          <InfoPanel icon={FileText} title={seo.useTitle} items={seo.useItems} />
          <InfoPanel icon={ImagePlus} title={seo.sizeTitle} items={seo.sizeItems} />
          <InfoPanel icon={Printer} title={seo.printTitle} items={seo.printItems} />
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 flex-none text-amber-700" />
            <div>
              <h2 className="font-bold">{seo.warningTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-amber-900">{seo.warningText}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-slate-900">{seo.faqTitle}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {seo.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-xl font-bold text-slate-900">{layout.resources}</h2>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            {resourceLinks.map((item) => (
              <Link key={item.href} href={item.href} className="font-medium text-blue-600 hover:underline">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
  const activeToolContent =
    activeTool === 'id-photo-crop'
      ? (
        <IdPhotoCropPrintTool
          locale={locale}
          sourceDescription={content.sourceDescription}
          uploadLabel={content.upload}
          emptyText={content.empty}
        />
      )
      : activeTool === 'resize-image'
        ? <ResizeImageKbTool locale={locale} />
        : activeTool === 'resize-image-kb'
          ? (
            <ResizeImageKbTool
              locale={locale}
              title={localizedToolPages[2].toolTitle}
              description={localizedToolPages[2].toolDescription}
              actionLabel={localizedToolPages[2].actionLabel}
              targetKbOnly
            />
          )
          : activeTool === 'remove-background'
            ? <RemoveBackgroundTool locale={locale} />
          : activeTool === 'background-color'
            ? <BackgroundColorTool locale={locale} />
            : activeTool === 'print-layout'
              ? <PrintLayoutBuilderTool locale={locale} />
              : activeTool === 'aspect-ratio-crop'
                ? <AspectRatioCropTool locale={locale} />
              : activeTool === 'shape-crop'
                ? <ShapeCropTool locale={locale} />
              : toolContent

  return (
    <div className="min-h-screen bg-slate-50">
      {locale === 'en' ? <Navbar /> : <LocalizedNavbar locale={locale} />}

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {breadcrumbItems && (
            <BreadcrumbNav className="mb-6" items={breadcrumbItems} />
          )}
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-600">
                <ImagePlus className="h-4 w-4" />
                {content.eyebrow}
              </div>
              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{content.title}</h1>
              <p className="mt-3 max-w-3xl text-slate-600">
                {content.description}
              </p>
            </div>
            <Link href={uploadHref} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">
                <Sparkles className="mr-2 h-4 w-4" />
                {content.generate}
              </Button>
            </Link>
          </div>

          {locale === 'en' ? (
            <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
              <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Photo tools">
                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                  <div className="px-2 pb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                    Photo tools
                  </div>
                  <nav className="space-y-1">
                    <ToolNavItem
                      icon={ImagePlus}
                      label="Free ID photo tool"
                      active={activeTool === 'original'}
                      onClick={() => setActiveTool('original')}
                    />
                    <ToolNavItem
                      icon={FileText}
                      label="ID photo crop"
                      active={activeTool === 'id-photo-crop'}
                      href={photoToolPages[0].path}
                      onClick={() => setActiveTool('id-photo-crop')}
                    />
                    <ToolNavItem
                      icon={SlidersHorizontal}
                      label="Resize image"
                      active={activeTool === 'resize-image'}
                      href={photoToolPages[1].path}
                      onClick={() => setActiveTool('resize-image')}
                    />
                    <ToolNavItem
                      icon={SlidersHorizontal}
                      label="Resize image to KB"
                      active={activeTool === 'resize-image-kb'}
                      href={photoToolPages[2].path}
                      onClick={() => setActiveTool('resize-image-kb')}
                    />
                    <ToolNavItem
                      icon={ImagePlus}
                      label="Remove background"
                      active={activeTool === 'remove-background'}
                      href={photoToolPages[3].path}
                      onClick={() => setActiveTool('remove-background')}
                    />
                    <ToolNavItem
                      icon={Palette}
                      label="Background color tool"
                      active={activeTool === 'background-color'}
                      href={photoToolPages[4].path}
                      onClick={() => setActiveTool('background-color')}
                    />
                    <ToolNavItem
                      icon={Layers3}
                      label="Print layout builder"
                      active={activeTool === 'print-layout'}
                      href={photoToolPages[5].path}
                      onClick={() => setActiveTool('print-layout')}
                    />
                    <ToolNavItem
                      icon={Shapes}
                      label="Aspect ratio crop"
                      active={activeTool === 'aspect-ratio-crop'}
                      href={photoToolPages[6].path}
                      onClick={() => setActiveTool('aspect-ratio-crop')}
                    />
                    <ToolNavItem
                      icon={Shapes}
                      label="Shape crop"
                      active={activeTool === 'shape-crop'}
                      href={photoToolPages[7].path}
                      onClick={() => setActiveTool('shape-crop')}
                    />
                    <ToolNavItem icon={BriefcaseBusiness} label="Professional outfit photo" badge="TBD" />
                    <ToolNavItem icon={UserRoundCheck} label="Professional image photo" badge="TBD" />
                  </nav>
                </div>
              </aside>
              <div className="min-w-0">
                <div className="space-y-6">
                  {activeToolContent}
                  {showAiWorkflowCard && <PhotoToolsAiWorkflowCard locale={locale} />}
                </div>
              </div>
            </div>
          ) : (
            toolContent
          )}
        </div>
      </main>

      {locale === 'en' ? <Footer /> : <LocalizedFooter locale={locale} />}
    </div>
  )
}

function ToolNavItem({
  icon: Icon,
  label,
  active = false,
  badge,
  href,
  onClick,
}: {
  icon: typeof FileText
  label: string
  active?: boolean
  badge?: string
  href?: string
  onClick?: () => void
}) {
  const className = `flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold transition-colors ${
    active
      ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
      : onClick || href
        ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        : 'cursor-not-allowed text-slate-500 opacity-75'
  }`
  const content = (
    <>
      <span className="flex min-w-0 items-center gap-2">
        <Icon className="h-4 w-4 flex-none" />
        <span className="truncate">{label}</span>
      </span>
      {badge && (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
          {badge}
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <Link href={href} aria-current={active ? 'page' : undefined} onClick={onClick} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      disabled={!onClick}
      onClick={onClick}
      className={className}
    >
      {content}
    </button>
  )
}

function InfoPanel({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof FileText
  title: string
  items: string[]
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-blue-600" />
        <h2 className="font-bold text-slate-900">{title}</h2>
      </div>
      <ul className="space-y-3 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <CheckCircle2 className="mt-1 h-4 w-4 flex-none text-green-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
