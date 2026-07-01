import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import LocalizedSamplePage from '@/components/sample/localized-sample-page'
import { isRoutedLocale, languageAlternatesForPath, localePath, type RoutedLocale } from '@/lib/i18n'
import { localizedSocialMetadata } from '@/lib/localized-metadata'
import { localizedSampleContent } from '@/lib/localized-marketing-content'
import { getLocalizedSeo } from '@/lib/localized-seo'

type PageProps = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'fr' }, { locale: 'de' }, { locale: 'ja' }]
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isRoutedLocale(locale)) return {}
  const content = localizedSampleContent[locale]
  const seo = getLocalizedSeo(locale, 'sample')
  return {
    title: content.title,
    description: content.description,
    keywords: seo.keywords,
    alternates: {
      canonical: localePath(locale, '/sample'),
      languages: languageAlternatesForPath('/sample'),
    },
    ...localizedSocialMetadata({
      locale,
      path: '/sample',
      title: content.title,
      description: content.description,
    }),
  }
}

export default async function LocalizedSampleRoute({ params }: PageProps) {
  const { locale } = await params
  if (!isRoutedLocale(locale)) notFound()
  return <LocalizedSamplePage locale={locale as RoutedLocale} content={localizedSampleContent[locale as RoutedLocale]} />
}
