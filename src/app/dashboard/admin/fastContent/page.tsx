import type { Metadata } from 'next'
import FastContentPageView from '@/components/admin/fast-content-page-view'

export const metadata: Metadata = {
  title: 'Fast Content',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminFastContentPage() {
  return <FastContentPageView />
}
