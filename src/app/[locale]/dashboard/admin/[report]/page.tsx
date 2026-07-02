import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AdminReportPageView, { type AdminReport } from '@/components/admin/admin-report-page-view'
import AdminMaintenancePageView, { type AdminMaintenanceSection } from '@/components/admin/admin-maintenance-page-view'
import { isRoutedLocale, ROUTED_LOCALES, type RoutedLocale } from '@/lib/i18n'

const reports = ['generation-logs', 'payment-audit', 'conversion-events'] as const
const maintenanceSections = ['styles', 'users', 'generations', 'orders'] as const

interface PageProps {
  params: Promise<{ locale: string; report: string }>
}

export const metadata: Metadata = {
  title: 'Admin Report',
  robots: {
    index: false,
    follow: false,
  },
}

export function generateStaticParams() {
  return ROUTED_LOCALES.flatMap((locale) => [
    ...reports.map((report) => ({ locale, report })),
    ...maintenanceSections.map((report) => ({ locale, report })),
  ])
}

export default async function LocalizedAdminReportPage({ params }: PageProps) {
  const { locale, report } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  if (reports.includes(report as AdminReport)) {
    return <AdminReportPageView locale={locale as RoutedLocale} report={report as AdminReport} />
  }

  if (maintenanceSections.includes(report as AdminMaintenanceSection)) {
    return <AdminMaintenancePageView locale={locale as RoutedLocale} section={report as AdminMaintenanceSection} />
  }

  notFound()
}
