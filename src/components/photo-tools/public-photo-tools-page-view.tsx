'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import LocalizedNavbar from '@/components/layout/localized-navbar'
import LocalizedFooter from '@/components/layout/localized-footer'
import Button from '@/components/ui/button'
import { ImagePlus, Sparkles } from 'lucide-react'
import { localePath, type Locale } from '@/lib/i18n'
import { withSource } from '@/lib/navigation-source'

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
    description: 'Upload a local portrait, generate ID photo sizes, crop passport photos, change background colors, and download a printable layout sheet.',
    generate: 'Generate Transparent PNG Portrait',
    sourceDescription: 'Upload a local PNG, JPG, or WebP portrait. Transparent PNG works best for background color changes.',
    upload: 'Upload Local Image',
    empty: 'Upload a local image to start cropping and printing.',
    loading: 'Loading photo tools...',
  },
  es: {
    eyebrow: 'Herramienta gratis de foto de carnet',
    title: 'Generador, recorte e impresion gratis de foto de carnet',
    description: 'Sube un retrato local, elige tamanos comunes por pais, cambia el fondo y descarga una hoja lista para imprimir.',
    generate: 'Generar retrato PNG transparente',
    sourceDescription: 'Sube un retrato local PNG, JPG o WebP. Un PNG transparente funciona mejor para cambiar el fondo.',
    upload: 'Subir imagen local',
    empty: 'Sube una imagen local para empezar a recortar e imprimir.',
    loading: 'Cargando herramientas de foto...',
  },
  fr: {
    eyebrow: 'Outil gratuit de photo d identite',
    title: 'Generateur, recadrage et impression de photo d identite gratuits',
    description: 'Importez un portrait local, choisissez des formats courants par pays, changez le fond et telechargez une planche imprimable.',
    generate: 'Generer un portrait PNG transparent',
    sourceDescription: 'Importez un portrait PNG, JPG ou WebP. Un PNG transparent fonctionne mieux pour changer le fond.',
    upload: 'Importer une image locale',
    empty: 'Importez une image locale pour commencer le recadrage et l impression.',
    loading: 'Chargement des outils photo...',
  },
  de: {
    eyebrow: 'Kostenloses Ausweisfoto Tool',
    title: 'Kostenloser Ausweisfoto Generator, Zuschnitt und Druck',
    description: 'Lade ein lokales Portrat hoch, wahle gangige Landergroessen, andere den Hintergrund und lade einen Druckbogen herunter.',
    generate: 'Transparentes PNG Portrat erstellen',
    sourceDescription: 'Lade ein lokales PNG-, JPG- oder WebP-Portrat hoch. Transparente PNGs eignen sich am besten fur Hintergrundfarben.',
    upload: 'Lokales Bild hochladen',
    empty: 'Lade ein lokales Bild hoch, um Zuschnitt und Druck zu starten.',
    loading: 'Fototools werden geladen...',
  },
  ja: {
    eyebrow: '無料の証明写真ツール',
    title: '無料の証明写真作成・トリミング・印刷',
    description: 'ローカル画像をアップロードし、国や地域でよく使われるサイズを選び、背景色を変更して印刷用シートをダウンロードできます。',
    generate: '透明PNGポートレートを生成',
    sourceDescription: 'PNG、JPG、WebP のローカル画像をアップロードできます。背景色の変更には透明PNGが最適です。',
    upload: 'ローカル画像をアップロード',
    empty: 'ローカル画像をアップロードして、トリミングと印刷を始めます。',
    loading: '写真ツールを読み込み中...',
  },
}

const PhotoToolsWorkbench = dynamic(() => import('@/components/photo-tools/photo-tools-workbench'), {
  ssr: false,
  loading: () => (
    <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
      Loading photo tools...
    </div>
  ),
})

interface PublicPhotoToolsPageViewProps {
  locale?: Locale
}

export default function PublicPhotoToolsPageView({ locale = 'en' }: PublicPhotoToolsPageViewProps) {
  const content = pageContent[locale]
  const uploadHref = withSource(localePath(locale, '/upload'), `free_id_photo_tool_generate_png_${locale}`)

  return (
    <div className="min-h-screen bg-slate-50">
      {locale === 'en' ? <Navbar /> : <LocalizedNavbar locale={locale} />}

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

          <PhotoToolsWorkbench
            locale={locale}
            allowUpload
            sourceDescription={content.sourceDescription}
            uploadLabel={content.upload}
            emptyState={(
              <p>{content.empty}</p>
            )}
          />
        </div>
      </main>

      {locale === 'en' ? <Footer /> : <LocalizedFooter locale={locale} />}
    </div>
  )
}
