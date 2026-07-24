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
    title: 'Photo tools online para fondo, foto ID, tamano y recorte',
    description: 'Usa photo tools para quitar fondo, recortar foto ID, cambiar tamano, comprimir imagen a KB y preparar hojas de impresion.',
    keywords: ['photo tools', 'quitar fondo online', 'recortar foto ID'],
  },
  fr: {
    title: 'Photo tools en ligne pour fond, photo ID, taille et recadrage',
    description: 'Utilisez les photo tools pour retirer un fond, recadrer une photo ID, redimensionner, compresser en KB et preparer l impression.',
    keywords: ['photo tools', 'remove background', 'photo ID'],
  },
  de: {
    title: 'Photo tools online fuer Hintergrund, ID-Foto, Groesse und Zuschnitt',
    description: 'Nutze photo tools, um Hintergruende zu entfernen, ID-Fotos zuzuschneiden, Bilder zu skalieren, KB zu reduzieren und Druckbogen zu bauen.',
    keywords: ['photo tools', 'remove background', 'ID-Foto zuschneiden'],
  },
  ja: {
    title: 'Photo tools: Remove Background、ID写真、比率切り抜き、円形切り抜き',
    description: '背景削除、ID写真の切り抜き、よく使う比率の切り抜き、円形アバター作成、印刷レイアウトをまとめて使えます。',
    keywords: ['photo tools', 'remove background', '写真 比率 切り抜き'],
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
    keywords: content.keywords.slice(0, 3),
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
