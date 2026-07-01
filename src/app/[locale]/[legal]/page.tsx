import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedLegalPage from '@/components/legal/localized-legal-page'
import { appConfig } from '@/lib/config'
import {
  OPEN_GRAPH_LOCALES,
  ROUTED_LOCALES,
  isRoutedLocale,
  languageAlternatesForPath,
  localePath,
  type RoutedLocale,
} from '@/lib/i18n'
import { localizedLegalContent, type LegalPageKey } from '@/lib/localized-legal-content'

type PageParams = {
  locale: string
  legal: string
}

type PageProps = {
  params: Promise<PageParams>
}

const legalPages = ['terms', 'privacy', 'refund'] as const

function isLegalPage(value: string): value is LegalPageKey {
  return (legalPages as readonly string[]).includes(value)
}

function getContent(locale: string, legal: string) {
  if (!isRoutedLocale(locale) || !isLegalPage(legal)) {
    return null
  }

  return localizedLegalContent[locale][legal]
}

export function generateStaticParams() {
  return ROUTED_LOCALES.flatMap((locale) => legalPages.map((legal) => ({ locale, legal })))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, legal } = await params
  const content = getContent(locale, legal)

  if (!content || !isLegalPage(legal) || !isRoutedLocale(locale)) {
    return {}
  }

  const canonical = localePath(locale, `/${legal}`)
  const siteUrl = appConfig.url.replace(/\/$/, '')

  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    alternates: {
      canonical,
      languages: languageAlternatesForPath(`/${legal}`),
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: canonical,
      type: 'website',
      locale: OPEN_GRAPH_LOCALES[locale],
      siteName: appConfig.name,
      images: [
        {
          url: `${siteUrl}/api/og`,
          width: 1200,
          height: 630,
          alt: `${appConfig.name} ${content.heading}`,
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

export default async function LocalizedLegalRoute({ params }: PageProps) {
  const { locale, legal } = await params
  const content = getContent(locale, legal)

  if (!content) {
    notFound()
  }

  return <LocalizedLegalPage locale={locale as RoutedLocale} content={content} />
}
