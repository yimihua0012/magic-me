import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AdminReportPageView, { type AdminReport } from '@/components/admin/admin-report-page-view'
import AdminMaintenancePageView, { type AdminMaintenanceSection } from '@/components/admin/admin-maintenance-page-view'

const reports = ['generation-logs', 'payment-audit', 'conversion-events'] as const
const maintenanceSections = ['styles', 'users', 'generations', 'orders'] as const

interface PageProps {
  params: Promise<{ report: string }>
}

export const metadata: Metadata = {
  title: 'Admin Report',
  robots: {
    index: false,
    follow: false,
  },
}

export function generateStaticParams() {
  return [
    ...reports.map((report) => ({ report })),
    ...maintenanceSections.map((report) => ({ report })),
  ]
}

export default async function AdminReportPage({ params }: PageProps) {
  const { report } = await params

  if (reports.includes(report as AdminReport)) {
    return <AdminReportPageView report={report as AdminReport} />
  }

  if (maintenanceSections.includes(report as AdminMaintenanceSection)) {
    return <AdminMaintenancePageView section={report as AdminMaintenanceSection} />
  }

  notFound()
}
