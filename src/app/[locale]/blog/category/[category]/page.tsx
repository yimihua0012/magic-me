import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogCategoryPageView from '@/components/blog/blog-category-page-view'
import Navbar from '@/components/layout/localized-navbar'
import Footer from '@/components/layout/localized-footer'
import { getBlogCategorySeoContent } from '@/lib/blog-category-content'
import {
  blogCategoryPath,
  getBlogCategoryLanguageAlternates,
  getPublishedBlogCategories,
  getPublishedBlogCategory,
} from '@/lib/blog-store'
import { OPEN_GRAPH_LOCALES, ROUTED_LOCALES, isRoutedLocale, type RoutedLocale } from '@/lib/i18n'

export const revalidate = 600

type BlogCategoryPageProps = {
  params: Promise<{
    locale: string
    category: string
  }>
}

export async function generateStaticParams() {
  const params: { locale: string; category: string }[] = []
  for (const locale of ROUTED_LOCALES) {
    const categories = await getPublishedBlogCategories(locale)
    categories.forEach((category) => params.push({ locale, category: category.slug }))
  }
  return params
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { locale, category: categorySlug } = await params
  if (!isRoutedLocale(locale)) return {}

  const category = await getPublishedBlogCategory(categorySlug, locale)
  if (!category) return { title: 'Blog category' }

  const content = getBlogCategorySeoContent(locale, category)
  const canonical = blogCategoryPath(locale, category.slug)

  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    alternates: {
      canonical,
      languages: await getBlogCategoryLanguageAlternates(category),
    },
    openGraph: {
      title: content.title,
      description: content.description,
      type: 'website',
      url: canonical,
      locale: OPEN_GRAPH_LOCALES[locale],
      siteName: 'Magic-Headshot',
      images: ['/api/og'],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.description,
      images: ['/api/og'],
    },
  }
}

export default async function LocalizedBlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { locale, category: categorySlug } = await params
  if (!isRoutedLocale(locale)) notFound()

  const routedLocale = locale as RoutedLocale
  const category = await getPublishedBlogCategory(categorySlug, routedLocale)

  if (!category) {
    notFound()
  }

  const content = getBlogCategorySeoContent(routedLocale, category)

  return (
    <div className="min-h-screen bg-white">
      <Navbar locale={routedLocale} />
      <div className="pt-20">
        <BlogCategoryPageView locale={routedLocale} category={category} content={content} />
      </div>
      <Footer locale={routedLocale} />
    </div>
  )
}
