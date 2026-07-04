import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogPreviewPageView from '@/components/admin/blog-preview-page-view'
import { isRoutedLocale, type RoutedLocale } from '@/lib/i18n'

interface PageProps {
  params: Promise<{ locale: string; id: string }>
}

export const metadata: Metadata = {
  title: 'Blog Preview',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function LocalizedAdminBlogPreviewPage({ params }: PageProps) {
  const { locale, id } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  return <BlogPreviewPageView id={id} locale={locale as RoutedLocale} />
}
