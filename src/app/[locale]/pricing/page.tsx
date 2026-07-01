import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedPricingPage from '@/components/pricing/localized-pricing-page'
import { appConfig } from '@/lib/config'
import {
  OPEN_GRAPH_LOCALES,
  ROUTED_LOCALES,
  isRoutedLocale,
  languageAlternatesForPath,
  localePath,
  type RoutedLocale,
} from '@/lib/i18n'
import { localizedPricingContent } from '@/lib/localized-pricing-content'
import { getLocalizedSeo } from '@/lib/localized-seo'

type PageProps = {
  params: Promise<{
    locale: string
  }>
}

export function generateStaticParams() {
  return ROUTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    return {}
  }

  const content = localizedPricingContent[locale]
  const seo = getLocalizedSeo(locale, 'pricing')
  const canonical = localePath(locale, '/pricing')
  const siteUrl = appConfig.url.replace(/\/$/, '')

  return {
    title: content.title,
    description: content.description,
    keywords: seo.keywords,
    alternates: {
      canonical,
      languages: languageAlternatesForPath('/pricing'),
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
          alt: `${appConfig.name} ${content.title}`,
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

export default async function LocalizedPricingRoute({ params }: PageProps) {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  const routedLocale = locale as RoutedLocale
  return <LocalizedPricingPage locale={routedLocale} content={localizedPricingContent[routedLocale]} />
}
