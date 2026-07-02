import type { Metadata } from 'next'
import AdminHomePageView from '@/components/admin/admin-home-page-view'

export const metadata: Metadata = {
  title: 'Admin',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminPage() {
  return <AdminHomePageView />
}
