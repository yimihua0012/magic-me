import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import KeywordResearchPageView from '@/components/admin/keyword-research-page-view'
import { isRoutedLocale, ROUTED_LOCALES, type RoutedLocale } from '@/lib/i18n'

interface PageProps {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Keyword Research',
  robots: {
    index: false,
    follow: false,
  },
}

export function generateStaticParams() {
  return ROUTED_LOCALES.map((locale) => ({ locale }))
}

export default async function LocalizedAdminKeywordResearchPage({ params }: PageProps) {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  return <KeywordResearchPageView locale={locale as RoutedLocale} />
}
