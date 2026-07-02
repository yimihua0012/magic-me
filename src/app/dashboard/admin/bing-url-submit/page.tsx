import type { Metadata } from 'next'
import BingUrlSubmitPageView from '@/components/admin/bing-url-submit-page-view'

export const metadata: Metadata = {
  title: 'Bing URL Submission',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminBingUrlSubmitPage() {
  return <BingUrlSubmitPageView />
}
