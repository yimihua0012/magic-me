import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogContentPageView from '@/components/admin/blog-content-page-view'
import { isRoutedLocale, ROUTED_LOCALES, type RoutedLocale } from '@/lib/i18n'

interface PageProps {
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Blog Content',
  robots: {
    index: false,
    follow: false,
  },
}

export function generateStaticParams() {
  return ROUTED_LOCALES.map((locale) => ({ locale }))
}

export default async function LocalizedAdminBlogContentPage({ params }: PageProps) {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  return <BlogContentPageView locale={locale as RoutedLocale} />
}
