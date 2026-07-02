import { notFound } from 'next/navigation'
import DashboardPageView from '@/components/dashboard/dashboard-page-view'
import { isRoutedLocale, ROUTED_LOCALES, type RoutedLocale } from '@/lib/i18n'
import { privatePageMetadata } from '@/lib/private-page-metadata'

interface PageProps {
  params: Promise<{ locale: string }>
}

export const metadata = privatePageMetadata

export function generateStaticParams() {
  return ROUTED_LOCALES.map((locale) => ({ locale }))
}

export default async function LocalizedDashboardPage({ params }: PageProps) {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  return <DashboardPageView locale={locale as RoutedLocale} />
}
