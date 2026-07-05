import type { Metadata } from 'next'
import SamplePicturesPageView from '@/components/admin/sample-pictures-page-view'

export const metadata: Metadata = {
  title: 'Sample Pictures',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminSamplePicturesPage() {
  return <SamplePicturesPageView />
}
