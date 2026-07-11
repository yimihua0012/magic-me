'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import LocalizedFooter from '@/components/layout/localized-footer'
import LocalizedNavbar from '@/components/layout/localized-navbar'
import BackgroundColorTool from '@/components/photo-tools/background-color-tool'
import IdPhotoCropPrintTool from '@/components/photo-tools/id-photo-crop-print-tool'
import PhotoToolsAiWorkflowCard from '@/components/photo-tools/photo-tools-ai-workflow-card'
import PrintLayoutBuilderTool from '@/components/photo-tools/print-layout-builder-tool'
import ResizeImageKbTool from '@/components/photo-tools/resize-image-kb-tool'
import RemoveBackgroundTool from '@/components/photo-tools/remove-background-tool'
import { getPhotoToolPages, type PhotoToolActiveId, type PhotoToolPageContent } from '@/lib/photo-tool-page-content'
import { localePath, type Locale } from '@/lib/i18n'
import { BriefcaseBusiness, FileText, ImagePlus, Layers3, Palette, SlidersHorizontal, UserRoundCheck } from 'lucide-react'

type ToolId = PhotoToolActiveId

interface StandalonePhotoToolsPageViewProps {
  initialTool?: ToolId
  seoContent?: PhotoToolPageContent
  locale?: Locale
}

const pageText: Record<Locale, {
  eyebrow: string
  title: string
  description: string
  navLabel: string
  freeIdTool: string
  combinedText: string
  combinedLink: string
  faq: string
  professionalOutfit: string
  professionalImage: string
  cropSourceDescription: string
  cropUploadLabel: string
  cropEmptyText: string
}> = {
  en: {
    eyebrow: 'Free Photo Tools',
    title: 'Free Online Photo Tools',
    description: 'Remove backgrounds, crop ID photos, resize images to a target KB, and build printable photo layouts.',
    navLabel: 'Photo tools',
    freeIdTool: 'Free ID photo tool',
    combinedText: 'Need the original combined ID photo crop, background, and print sheet workflow?',
    combinedLink: 'Open Free ID Photo Tool',
    faq: 'FAQ',
    professionalOutfit: 'Professional outfit photo',
    professionalImage: 'Professional image photo',
    cropSourceDescription: 'Upload a local JPG, PNG, or WebP image, choose an ID photo size, adjust the crop, and download the cropped JPG.',
    cropUploadLabel: 'Upload Local Image',
    cropEmptyText: 'Upload a local image to start cropping.',
  },
  es: {
    eyebrow: 'Photo Tools',
    title: 'Photo tools online',
    description: 'Elimina fondos, recorta fotos ID, comprime imágenes a KB y prepara hojas de impresión.',
    navLabel: 'Photo tools',
    freeIdTool: 'Free ID photo tool',
    combinedText: '¿Necesitas el flujo combinado para recortar foto ID, cambiar fondo y preparar impresión?',
    combinedLink: 'Abrir Free ID Photo Tool',
    faq: 'Preguntas frecuentes',
    professionalOutfit: 'Professional outfit photo',
    professionalImage: 'Professional image photo',
    cropSourceDescription: 'Sube un JPG, PNG o WebP local, elige un tamaño de foto ID, ajusta el recorte y descarga el JPG.',
    cropUploadLabel: 'Subir imagen local',
    cropEmptyText: 'Sube una imagen local para empezar el recorte.',
  },
  fr: {
    eyebrow: 'Photo Tools',
    title: 'Photo tools en ligne',
    description: 'Retirez les fonds, recadrez les photos ID, compressez en KB et préparez des planches d’impression.',
    navLabel: 'Photo tools',
    freeIdTool: 'Free ID photo tool',
    combinedText: 'Besoin du flux complet pour recadrer une photo ID, changer le fond et préparer l’impression ?',
    combinedLink: 'Ouvrir Free ID Photo Tool',
    faq: 'FAQ',
    professionalOutfit: 'Professional outfit photo',
    professionalImage: 'Professional image photo',
    cropSourceDescription: 'Importez un JPG, PNG ou WebP local, choisissez un format de photo ID, ajustez le cadrage et téléchargez le JPG.',
    cropUploadLabel: 'Importer une image',
    cropEmptyText: 'Importez une image locale pour commencer.',
  },
  de: {
    eyebrow: 'Photo Tools',
    title: 'Photo tools online',
    description: 'Hintergruende entfernen, ID-Fotos zuschneiden, Bilder auf KB komprimieren und Drucklayouts erstellen.',
    navLabel: 'Photo tools',
    freeIdTool: 'Free ID photo tool',
    combinedText: 'Brauchst du den kombinierten Ablauf fuer ID-Foto-Zuschnitt, Hintergrund und Druckbogen?',
    combinedLink: 'Free ID Photo Tool oeffnen',
    faq: 'FAQ',
    professionalOutfit: 'Professional outfit photo',
    professionalImage: 'Professional image photo',
    cropSourceDescription: 'Lade ein lokales JPG, PNG oder WebP hoch, waehle eine ID-Fotogroesse, passe den Ausschnitt an und lade das JPG herunter.',
    cropUploadLabel: 'Lokales Bild hochladen',
    cropEmptyText: 'Lade ein lokales Bild hoch, um zu starten.',
  },
  ja: {
    eyebrow: 'Photo Tools',
    title: 'Photo tools',
    description: '背景削除、ID写真トリミング、KB指定の圧縮、印刷レイアウト作成をまとめて使えます。',
    navLabel: 'Photo tools',
    freeIdTool: 'Free ID photo tool',
    combinedText: 'ID写真のトリミング、背景変更、印刷シート作成をまとめて使いたい場合はこちら。',
    combinedLink: 'Free ID Photo Toolを開く',
    faq: 'よくある質問',
    professionalOutfit: 'Professional outfit photo',
    professionalImage: 'Professional image photo',
    cropSourceDescription: 'JPG、PNG、WebP画像をアップロードし、ID写真サイズを選んで位置を調整し、JPGで保存できます。',
    cropUploadLabel: '画像をアップロード',
    cropEmptyText: '画像をアップロードするとトリミングを開始できます。',
  },
}

export default function StandalonePhotoToolsPageView({
  initialTool = 'id-photo-crop',
  seoContent,
  locale = 'en',
}: StandalonePhotoToolsPageViewProps) {
  const [activeTool, setActiveTool] = useState<ToolId>(initialTool)
  const text = pageText[locale]
  const pages = getPhotoToolPages(locale)
  const pageTitle = seoContent?.h1 || text.title
  const pageDescription = seoContent?.description || text.description
  const showAiWorkflowCard = activeTool !== 'remove-background'
  const activeToolContent =
    activeTool === 'resize-image'
      ? <ResizeImageKbTool locale={locale} />
      : activeTool === 'resize-kb'
        ? (
          <ResizeImageKbTool
            locale={locale}
            title={pages[2].toolTitle}
            description={pages[2].toolDescription}
            actionLabel={pages[2].actionLabel}
            targetKbOnly
          />
        )
      : activeTool === 'remove-background'
        ? <RemoveBackgroundTool locale={locale} />
      : activeTool === 'background-color'
        ? <BackgroundColorTool locale={locale} />
      : activeTool === 'print-layout'
        ? <PrintLayoutBuilderTool locale={locale} />
        : (
          <IdPhotoCropPrintTool
            locale={locale}
            sourceDescription={text.cropSourceDescription}
            uploadLabel={text.cropUploadLabel}
            emptyText={text.cropEmptyText}
          />
        )
  const freeIdPhotoToolHref = localePath(locale, '/free-id-photo-tool')
  const Header = locale === 'en' ? <Navbar /> : <LocalizedNavbar locale={locale} />
  const PageFooter = locale === 'en' ? <Footer /> : <LocalizedFooter locale={locale} />

  return (
    <div className="min-h-screen bg-slate-50">
      {Header}
      <main className="pb-16 pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="mb-2 text-sm font-semibold text-blue-600">{text.eyebrow}</div>
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{pageTitle}</h1>
            <p className="mt-3 max-w-3xl text-slate-600">
              {pageDescription}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-24 lg:self-start" aria-label={text.navLabel}>
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="px-2 pb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                  {text.navLabel}
                </div>
                <nav className="space-y-1">
                  <ToolNavItem
                    icon={ImagePlus}
                    label={text.freeIdTool}
                    href={freeIdPhotoToolHref}
                  />
                  <ToolNavItem
                    icon={FileText}
                    label={pages[0].label}
                    active={activeTool === 'id-photo-crop'}
                    href={localePath(locale, pages[0].path)}
                    onClick={() => setActiveTool('id-photo-crop')}
                  />
                  <ToolNavItem
                    icon={SlidersHorizontal}
                    label={pages[1].label}
                    active={activeTool === 'resize-image'}
                    href={localePath(locale, pages[1].path)}
                    onClick={() => setActiveTool('resize-image')}
                  />
                  <ToolNavItem
                    icon={SlidersHorizontal}
                    label={pages[2].label}
                    active={activeTool === 'resize-kb'}
                    href={localePath(locale, pages[2].path)}
                    onClick={() => setActiveTool('resize-kb')}
                  />
                  <ToolNavItem
                    icon={ImagePlus}
                    label={pages[3].label}
                    active={activeTool === 'remove-background'}
                    href={localePath(locale, pages[3].path)}
                    onClick={() => setActiveTool('remove-background')}
                  />
                  <ToolNavItem
                    icon={Palette}
                    label={pages[4].label}
                    active={activeTool === 'background-color'}
                    href={localePath(locale, pages[4].path)}
                    onClick={() => setActiveTool('background-color')}
                  />
                  <ToolNavItem
                    icon={Layers3}
                    label={pages[5].label}
                    active={activeTool === 'print-layout'}
                    href={localePath(locale, pages[5].path)}
                    onClick={() => setActiveTool('print-layout')}
                  />
                  <ToolNavItem icon={BriefcaseBusiness} label={text.professionalOutfit} badge="TBD" />
                  <ToolNavItem icon={UserRoundCheck} label={text.professionalImage} badge="TBD" />
                </nav>
              </div>
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600">
                {text.combinedText}{' '}
                <Link href={freeIdPhotoToolHref} className="font-semibold text-blue-600 hover:underline">
                  {text.combinedLink}
                </Link>
              </div>
            </aside>

            <div className="min-w-0">
              <div className="space-y-6">
                {activeToolContent}
                {showAiWorkflowCard && <PhotoToolsAiWorkflowCard locale={locale} />}
              </div>
            </div>
          </div>

          {seoContent && (
            <section className="mt-10" aria-label={`${seoContent.h1} FAQ`}>
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <h2 className="text-xl font-bold text-slate-900">{text.faq}</h2>
                <div className="mt-4 grid gap-4">
                  {seoContent.faqs.map((faq) => (
                    <div key={faq.question}>
                      <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
      {PageFooter}
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
