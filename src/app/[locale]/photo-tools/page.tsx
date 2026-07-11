import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import StandalonePhotoToolsPageView from '@/components/photo-tools/standalone-photo-tools-page-view'
import {
  OPEN_GRAPH_LOCALES,
  ROUTED_LOCALES,
  isRoutedLocale,
  languageAlternatesForPath,
  localePath,
  type RoutedLocale,
} from '@/lib/i18n'

type PageProps = {
  params: Promise<{
    locale: string
  }>
}

const localizedIndexContent: Record<RoutedLocale, {
  title: string
  description: string
  keywords: string[]
}> = {
  es: {
    title: 'Photo tools online: Remove Background, foto ID, compresor y hoja de impresión',
    description: 'Usa photo tools online para eliminar fondos, recortar fotos ID, comprimir imágenes a KB, cambiar fondo y preparar hojas de impresión.',
    keywords: ['photo tools', 'remove background', 'foto ID online', 'comprimir imagen a KB', 'hoja de impresión foto'],
  },
  fr: {
    title: 'Photo tools en ligne : Remove Background, photo ID, compression et impression',
    description: 'Utilisez les photo tools pour retirer les fonds, recadrer des photos ID, compresser en KB, changer le fond et préparer une planche d’impression.',
    keywords: ['photo tools', 'remove background', 'photo ID en ligne', 'compresser image en KB', 'planche photo'],
  },
  de: {
    title: 'Photo tools online: Remove Background, ID-Foto, KB-Komprimierung und Druckbogen',
    description: 'Nutze photo tools online, um Hintergruende zu entfernen, ID-Fotos zuzuschneiden, Bilder auf KB zu komprimieren, Hintergrundfarben zu setzen und Druckbögen zu erstellen.',
    keywords: ['photo tools', 'remove background', 'ID-Foto online', 'Bild auf KB komprimieren', 'Druckbogen Foto'],
  },
  ja: {
    title: 'Photo tools：Remove Background、ID写真、KB圧縮、印刷レイアウト',
    description: '背景削除、ID写真トリミング、画像のKB圧縮、背景色変更、印刷レイアウト作成をオンラインで使えます。',
    keywords: ['photo tools', 'remove background', 'ID写真 オンライン', '画像 KB 圧縮', '印刷レイアウト'],
  },
}

export function generateStaticParams() {
  return ROUTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isRoutedLocale(locale)) return {}

  const content = localizedIndexContent[locale]
  const canonical = localePath(locale, '/photo-tools')

  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical,
      languages: languageAlternatesForPath('/photo-tools'),
    },
    openGraph: {
      title: content.title,
      description: content.description,
      type: 'website',
      url: canonical,
      locale: OPEN_GRAPH_LOCALES[locale],
      siteName: 'Magic-Headshot',
      images: [
        {
          url: '/api/og',
          width: 1200,
          height: 630,
          alt: content.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.description,
      images: ['/api/og'],
    },
  }
}

export default async function LocalizedPhotoToolsPage({ params }: PageProps) {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  return <StandalonePhotoToolsPageView locale={locale} />
}
