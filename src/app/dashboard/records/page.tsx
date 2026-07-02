import UserRecordsPageView from '@/components/dashboard/user-records-page-view'
import { privatePageMetadata } from '@/lib/private-page-metadata'

export const metadata = privatePageMetadata

export default function DashboardRecordsPage() {
  return <UserRecordsPageView />
}
