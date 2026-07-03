import type { Metadata } from 'next'
import BingUrlInspectPageView from '@/components/admin/bing-url-inspect-page-view'

export const metadata: Metadata = {
  title: 'Bing URL Inspection',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminBingUrlInspectPage() {
  return <BingUrlInspectPageView />
}
