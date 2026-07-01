import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedLandingPage from '@/components/landing/localized-landing-page'
import { isRoutedLocale, languageAlternatesForPath, localePath, type RoutedLocale } from '@/lib/i18n'
import { localizedLandingContent } from '@/lib/localized-marketing-content'
import { getLocalizedSeo } from '@/lib/localized-seo'

type PageProps = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'fr' }, { locale: 'de' }, { locale: 'ja' }]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isRoutedLocale(locale)) return {}
  const content = localizedLandingContent[locale]
  const seo = getLocalizedSeo(locale, 'landing')
  return {
    title: content.title,
    description: content.description,
    keywords: seo.keywords,
    alternates: {
      canonical: localePath(locale, '/landing'),
      languages: languageAlternatesForPath('/landing'),
    },
  }
}

export default async function LocalizedLandingRoute({ params }: PageProps) {
  const { locale } = await params
  if (!isRoutedLocale(locale)) notFound()
  return <LocalizedLandingPage locale={locale as RoutedLocale} content={localizedLandingContent[locale as RoutedLocale]} />
}
