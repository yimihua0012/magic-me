import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PublicPhotoToolsPageView from '@/components/photo-tools/public-photo-tools-page-view'
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

const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/+$/, '')

const localizedContent: Record<RoutedLocale, {
  title: string
  description: string
  keywords: string[]
  name: string
  features: string[]
  imageAlt: string
}> = {
  es: {
    title: 'Herramienta gratis para foto de carnet, recorte e impresion | Magic-Headshot',
    description: 'Herramienta gratis para crear, recortar y preparar fotos de carnet para CV, examenes, credenciales, tarjetas de estudiante y hojas imprimibles.',
    keywords: [
      'foto de carnet gratis para imprimir',
      'recortar foto para CV gratis',
      'herramienta foto examen gratis',
      'foto credencial empleado gratis',
      'foto tarjeta estudiante gratis',
    ],
    name: 'Herramienta gratis para foto de carnet, recorte e impresion',
    features: [
      'Recorte gratis de foto de carnet',
      'Hoja imprimible con varias copias',
      'Recorte de foto para CV',
      'Foto para examen',
      'Foto para credencial y tarjeta de estudiante',
    ],
    imageAlt: 'Herramienta gratis para recortar e imprimir foto de carnet',
  },
  fr: {
    title: 'Outil gratuit de photo d identite, recadrage et impression | Magic-Headshot',
    description: 'Outil gratuit pour creer, recadrer et preparer des photos d identite pour CV, examens, badges, cartes etudiant et planches imprimables.',
    keywords: [
      'photo identite gratuite a imprimer',
      'recadrer photo CV gratuit',
      'outil photo examen gratuit',
      'photo badge employe gratuite',
      'photo carte etudiant gratuite',
    ],
    name: 'Outil gratuit de photo d identite, recadrage et impression',
    features: [
      'Recadrage gratuit de photo d identite',
      'Planche imprimable avec plusieurs copies',
      'Recadrage de photo pour CV',
      'Photo pour examen',
      'Photo pour badge et carte etudiant',
    ],
    imageAlt: 'Outil gratuit pour recadrer et imprimer une photo d identite',
  },
  de: {
    title: 'Kostenloses Ausweisfoto Tool zum Zuschneiden und Drucken | Magic-Headshot',
    description: 'Kostenloses Online-Tool zum Zuschneiden und Vorbereiten von Ausweisfotos fur Lebenslauf, Prufungen, Mitarbeiterausweise, Studentenkarten und Druckbogen.',
    keywords: [
      'kostenloses Ausweisfoto Druckbogen',
      'Lebenslauf Foto kostenlos zuschneiden',
      'kostenloses Prufungsfoto Tool',
      'kostenloses Mitarbeiterausweis Foto',
      'kostenloses Studentenausweis Foto',
    ],
    name: 'Kostenloses Ausweisfoto Tool zum Zuschneiden und Drucken',
    features: [
      'Kostenloses Zuschneiden von Ausweisfotos',
      'Druckbogen mit mehreren Kopien',
      'Lebenslauf Foto zuschneiden',
      'Foto fur Prufungen',
      'Foto fur Mitarbeiterausweis und Studentenausweis',
    ],
    imageAlt: 'Kostenloses Tool zum Zuschneiden und Drucken von Ausweisfotos',
  },
  ja: {
    title: '無料の証明写真作成・切り抜き・印刷ツール | Magic-Headshot',
    description: '履歴書、試験、社員証、学生証、印刷用レイアウトに使える無料の証明写真作成、切り抜き、印刷ツールです。',
    keywords: [
      '無料 証明写真 印刷シート',
      '無料 履歴書写真 トリミング',
      '無料 試験用写真 ツール',
      '無料 社員証 写真',
      '無料 学生証 写真',
    ],
    name: '無料の証明写真作成・切り抜き・印刷ツール',
    features: [
      '無料の証明写真トリミング',
      '複数枚を並べた印刷シート',
      '履歴書写真の切り抜き',
      '試験用写真ツール',
      '社員証・学生証向け写真ツール',
    ],
    imageAlt: '無料の証明写真切り抜きと印刷ツール',
  },
}

export function generateStaticParams() {
  return ROUTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isRoutedLocale(locale)) return {}

  const content = localizedContent[locale]
  const canonical = localePath(locale, '/free-id-photo-tool')

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
      languages: languageAlternatesForPath('/free-id-photo-tool'),
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
          url: `${siteUrl}/api/og`,
          width: 1200,
          height: 630,
          alt: content.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.description,
      images: [`${siteUrl}/api/og`],
    },
  }
}

export default async function LocalizedFreeIdPhotoToolPage({ params }: PageProps) {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  const routedLocale = locale as RoutedLocale
  const content = localizedContent[routedLocale]
  const pageUrl = `${siteUrl}${localePath(routedLocale, '/free-id-photo-tool')}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${pageUrl}#webapplication`,
    name: content.name,
    description: content.description,
    url: pageUrl,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
    isAccessibleForFree: true,
    keywords: content.keywords.join(', '),
    featureList: content.features,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    provider: {
      '@id': `${siteUrl}/#organization`,
    },
    isPartOf: {
      '@id': `${siteUrl}/#website`,
    },
    inLanguage: routedLocale,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicPhotoToolsPageView locale={routedLocale} />
    </>
  )
}
