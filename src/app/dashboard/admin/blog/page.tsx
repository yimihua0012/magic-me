import type { Metadata } from 'next'
import BlogContentPageView from '@/components/admin/blog-content-page-view'

export const metadata: Metadata = {
  title: 'Blog Content',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminBlogContentPage() {
  return <BlogContentPageView />
}
