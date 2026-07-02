import DashboardPageView from '@/components/dashboard/dashboard-page-view'
import { privatePageMetadata } from '@/lib/private-page-metadata'

export const metadata = privatePageMetadata

export default function DashboardPage() {
  return <DashboardPageView />
}
