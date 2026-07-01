import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedHomePage from '@/components/home/localized-home-page'
import { appConfig } from '@/lib/config'
import { OPEN_GRAPH_LOCALES, isRoutedLocale, languageAlternatesForPath, localePath, type RoutedLocale } from '@/lib/i18n'
import { localizedHomeContent } from '@/lib/localized-home-content'
import { getLocalizedSeo } from '@/lib/localized-seo'

type PageProps = {
  params: Promise<{
    locale: string
  }>
}

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'fr' }, { locale: 'de' }, { locale: 'ja' }]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    return {}
  }

  const content = localizedHomeContent[locale]
  const seo = getLocalizedSeo(locale, 'home')
  const canonical = localePath(locale)
  const siteUrl = appConfig.url.replace(/\/$/, '')

  return {
    title: content.title,
    description: content.description,
    keywords: seo.keywords,
    alternates: {
      canonical,
      languages: languageAlternatesForPath(),
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

export default async function LocalizedHomeRoute({ params }: PageProps) {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  const routedLocale = locale as RoutedLocale
  return <LocalizedHomePage locale={routedLocale} content={localizedHomeContent[routedLocale]} />
}
