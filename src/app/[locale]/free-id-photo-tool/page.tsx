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
import { digitalMerchantPolicy } from '@/lib/merchant-structured-data'
import { BreadcrumbJsonLd } from '@/components/seo/page-json-ld'

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
    title: "Recortar foto tipo carnet gratis para imprimir | Magic-Headshot",
    description: "Herramienta gratis para preparar fotos tipo carnet no oficiales: recorta, ajusta fondo PNG y descarga hojas imprimibles para CV, examenes y credenciales.",
    keywords: [
      "foto carnet para imprimir",
      "recortar foto carnet gratis",
      "hoja imprimible foto carnet",
      "cambiar fondo foto carnet",
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
    title: "Ausweisfoto kostenlos zuschneiden und drucken | Magic-Headshot",
    description: "Kostenloses Tool fuer alltaegliche Ausweisfotos: zuschneiden, transparentes PNG mit Hintergrundfarbe vorbereiten und Druckbogen speichern.",
    keywords: [
      "Ausweisfoto zuschneiden kostenlos",
      "Passfoto Druckbogen",
      "Bewerbungsfoto drucken",
      "Ausweisfoto Hintergrund aendern",
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
  zh: {
    title: '免费证件照裁剪、换底和排版工具 | Magic-Headshot',
    description: '免费处理日常证件照：裁剪尺寸、准备透明 PNG、换白底蓝底红底，并生成适合打印的排版图片。',
    keywords: [
      '免费证件照工具',
      '证件照裁剪',
      '证件照换底',
    ],
    name: '免费证件照裁剪、换底和排版工具',
    features: [
      '证件照尺寸裁剪',
      '白底、蓝底、红底背景',
      '透明 PNG 下载',
      '6寸相纸排版',
      '适合简历、考试、学生证和员工证照片',
    ],
    imageAlt: '免费证件照裁剪、换底和打印排版工具',
  },
  ja: {
    title: "証明写真を無料で切り抜き・印刷 | Magic-Headshot",
    description: "証明写真を無料で準備できるツールです。写真を切り抜き、透明PNGの背景色を調整し、履歴書、試験、社員証、学生証向けの印刷シートを作成できます。",
    keywords: [
      "証明写真 切り抜き 無料",
      "証明写真 印刷シート",
      "履歴書 写真 作成",
      "証明写真 背景 変更",
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
      ...digitalMerchantPolicy('USD'),
    },
    provider: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
    },
    isPartOf: {
      '@type': 'WebSite',
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
      <BreadcrumbJsonLd locale={routedLocale} path="/free-id-photo-tool" currentName={content.title} />
      <PublicPhotoToolsPageView locale={routedLocale} />
    </>
  )
}
