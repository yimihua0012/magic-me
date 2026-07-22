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
    title: 'Photo tools online: Remove Background, foto ID, proporciones y formas',
    description: 'Usa photo tools para quitar fondos, recortar fotos ID, recortar proporciones comunes, crear avatares redondos y preparar impresion.',
    keywords: ['photo tools', 'remove background', 'recortar foto proporcion'],
  },
  fr: {
    title: 'Photo tools en ligne : Remove Background, photo ID, ratios et formes',
    description: 'Utilisez les photo tools pour retirer les fonds, recadrer des photos ID, couper aux ratios courants, creer des avatars et imprimer.',
    keywords: ['photo tools', 'remove background', 'recadrer photo ratio'],
  },
  de: {
    title: 'Photo tools online: Remove Background, ID-Foto, Seitenverhaeltnis und Formen',
    description: 'Nutze photo tools, um Hintergruende zu entfernen, ID-Fotos zuzuschneiden, gaengige Seitenverhaeltnisse und runde Avatare zu erstellen.',
    keywords: ['photo tools', 'remove background', 'Foto Seitenverhaeltnis zuschneiden'],
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
