import { notFound } from 'next/navigation'
import UserRecordsPageView from '@/components/dashboard/user-records-page-view'
import { isRoutedLocale, ROUTED_LOCALES, type RoutedLocale } from '@/lib/i18n'
import { privatePageMetadata } from '@/lib/private-page-metadata'

interface PageProps {
  params: Promise<{ locale: string }>
}

export const metadata = privatePageMetadata

export function generateStaticParams() {
  return ROUTED_LOCALES.map((locale) => ({ locale }))
}

export default async function LocalizedDashboardRecordsPage({ params }: PageProps) {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  return <UserRecordsPageView locale={locale as RoutedLocale} />
}
