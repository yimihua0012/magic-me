import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AdminHomePageView from '@/components/admin/admin-home-page-view'
import { isRoutedLocale, ROUTED_LOCALES, type RoutedLocale } from '@/lib/i18n'

interface PageProps {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Admin',
  robots: {
    index: false,
    follow: false,
  },
}

export function generateStaticParams() {
  return ROUTED_LOCALES.map((locale) => ({ locale }))
}

export default async function LocalizedAdminPage({ params }: PageProps) {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  return <AdminHomePageView locale={locale as RoutedLocale} />
}
