import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { UploadPageView } from '@/components/upload/upload-page-view'
import { isRoutedLocale, languageAlternatesForPath, localePath, type RoutedLocale } from '@/lib/i18n'
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

  const seo = getLocalizedSeo(locale, 'upload')

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: localePath(locale, '/upload'),
      languages: languageAlternatesForPath('/upload'),
    },
  }
}

export default async function LocalizedUploadRoute({ params }: PageProps) {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  return <UploadPageView locale={locale as RoutedLocale} />
}
