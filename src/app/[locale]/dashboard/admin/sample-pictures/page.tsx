import type { Metadata } from 'next'
import SamplePicturesPageView from '@/components/admin/sample-pictures-page-view'
import { isRoutedLocale, ROUTED_LOCALES, type RoutedLocale } from '@/lib/i18n'
import { notFound } from 'next/navigation'

type PageProps = {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Sample Pictures',
  robots: {
    index: false,
    follow: false,
  },
}

export function generateStaticParams() {
  return ROUTED_LOCALES.map((locale) => ({ locale }))
}

export default async function LocalizedAdminSamplePicturesPage({ params }: PageProps) {
  const { locale } = await params
  if (!isRoutedLocale(locale)) {
    notFound()
  }

  return <SamplePicturesPageView locale={locale as RoutedLocale} />
}
