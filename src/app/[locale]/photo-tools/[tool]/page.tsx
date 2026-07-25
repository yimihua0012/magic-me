import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import StandalonePhotoToolsPageView from '@/components/photo-tools/standalone-photo-tools-page-view'
import { BreadcrumbJsonLd } from '@/components/seo/page-json-ld'
import { appConfig } from '@/lib/config'
import {
  OPEN_GRAPH_LOCALES,
  ROUTED_LOCALES,
  isRoutedLocale,
  languageAlternatesForPath,
  localePath,
  type RoutedLocale,
} from '@/lib/i18n'
import { digitalMerchantPolicy } from '@/lib/merchant-structured-data'
import { getPhotoToolPage, photoToolPages } from '@/lib/photo-tool-page-content'

type PhotoToolPageProps = {
  params: Promise<{
    locale: string
    tool: string
  }>
}

const siteUrl = appConfig.url.replace(/\/$/, '')

export function generateStaticParams() {
  return ROUTED_LOCALES.flatMap((locale) => (
    photoToolPages.map((page) => ({
      locale,
      tool: page.id,
    }))
  ))
}

export async function generateMetadata({ params }: PhotoToolPageProps): Promise<Metadata> {
  const { locale, tool } = await params
  if (!isRoutedLocale(locale)) return {}

  const page = getPhotoToolPage(tool, locale)
  if (!page) {
    return {
      title: 'Photo Tool',
    }
  }

  const canonical = localePath(locale, page.path)

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical,
      languages: languageAlternatesForPath(page.path),
    },
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'website',
      url: canonical,
      locale: OPEN_GRAPH_LOCALES[locale],
      siteName: 'Magic-Headshot',
      images: [
        {
          url: '/api/og',
          width: 1200,
          height: 630,
          alt: page.h1,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: ['/api/og'],
    },
  }
}

export default async function LocalizedPhotoToolPage({ params }: PhotoToolPageProps) {
  const { locale, tool } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  const routedLocale = locale as RoutedLocale
  const page = getPhotoToolPage(tool, routedLocale)

  if (!page) {
    notFound()
  }

  const pageUrl = `${siteUrl}${localePath(routedLocale, page.path)}`
  const webApplicationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${pageUrl}#webapplication`,
    name: page.h1,
    description: page.description,
    url: pageUrl,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
    isAccessibleForFree: true,
    inLanguage: routedLocale,
    keywords: page.keywords.join(', '),
    featureList: page.features,
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
  }
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    name: `${page.h1} FAQ`,
    description: page.description,
    url: pageUrl,
    inLanguage: routedLocale,
    mainEntity: page.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <BreadcrumbJsonLd
        locale={routedLocale}
        path={page.path}
        currentName={page.h1}
        parent={{ name: 'Photo Tools', path: '/photo-tools' }}
      />
      <StandalonePhotoToolsPageView locale={routedLocale} initialTool={page.activeId} seoContent={page} />
    </>
  )
}
