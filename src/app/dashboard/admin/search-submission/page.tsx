import type { Metadata } from 'next'
import SearchSubmissionPageView from '@/components/admin/search-submission-page-view'

export const metadata: Metadata = {
  title: 'Search Submission',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminSearchSubmissionPage() {
  return <SearchSubmissionPageView />
}
