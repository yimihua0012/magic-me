import type { Metadata } from 'next'
import BlogPreviewPageView from '@/components/admin/blog-preview-page-view'

interface PageProps {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: 'Blog Preview',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminBlogPreviewPage({ params }: PageProps) {
  const { id } = await params

  return <BlogPreviewPageView id={id} />
}
