import type { Metadata } from 'next'
import KeywordResearchPageView from '@/components/admin/keyword-research-page-view'

export const metadata: Metadata = {
  title: 'Keyword Research',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminKeywordResearchPage() {
  return <KeywordResearchPageView />
}
