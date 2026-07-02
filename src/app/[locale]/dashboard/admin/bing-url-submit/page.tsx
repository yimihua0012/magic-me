import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BingUrlSubmitPageView from '@/components/admin/bing-url-submit-page-view'
import { isRoutedLocale, ROUTED_LOCALES, type RoutedLocale } from '@/lib/i18n'

interface PageProps {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Bing URL Submission',
  robots: {
    index: false,
    follow: false,
  },
}

export function generateStaticParams() {
  return ROUTED_LOCALES.map((locale) => ({ locale }))
}

export default async function LocalizedAdminBingUrlSubmitPage({ params }: PageProps) {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  return <BingUrlSubmitPageView locale={locale as RoutedLocale} />
}
