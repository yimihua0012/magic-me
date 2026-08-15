import type { Metadata } from 'next'
import StyleTemplatesPageView from '@/components/admin/style-templates-page-view'

export const metadata: Metadata = {
  title: 'Style Templates',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminStyleTemplatesPage() {
  return <StyleTemplatesPageView />
}