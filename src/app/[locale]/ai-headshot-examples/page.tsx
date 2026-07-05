import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import SampleGalleryPage from '@/components/seo/sample-gallery-page'
import { isRoutedLocale, languageAlternatesForPath, localePath, ROUTED_LOCALES, type RoutedLocale } from '@/lib/i18n'
import { sampleGalleryContent, sampleGalleryPath } from '@/lib/sample-gallery-content'
import { getSamplePictures } from '@/lib/sample-pictures'

type PageProps = {
  params: Promise<{ locale: string }>
}

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return ROUTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isRoutedLocale(locale)) return {}

  const content = sampleGalleryContent[locale]
  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    alternates: {
      canonical: localePath(locale, sampleGalleryPath),
      languages: languageAlternatesForPath(sampleGalleryPath),
    },
  }
}

export default async function LocalizedAiHeadshotExamplesPage({ params }: PageProps) {
  const { locale } = await params
  if (!isRoutedLocale(locale)) {
    notFound()
  }

  const routedLocale = locale as RoutedLocale
  const pictures = await getSamplePictures(routedLocale)
  return <SampleGalleryPage locale={routedLocale} pictures={pictures} />
}
