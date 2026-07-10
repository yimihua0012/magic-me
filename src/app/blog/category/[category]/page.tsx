import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import BlogCategoryPageView from '@/components/blog/blog-category-page-view'
import StaticMarketingShell from '@/components/seo/static-marketing-shell'
import { getBlogCategorySeoContent } from '@/lib/blog-category-content'
import {
  blogCategoryPath,
  getBlogCategoryLanguageAlternates,
  getPublishedBlogCategories,
  getPublishedBlogCategory,
} from '@/lib/blog-store'

export const dynamic = 'force-dynamic'

type BlogCategoryPageProps = {
  params: Promise<{
    category: string
  }>
}

export async function generateStaticParams() {
  const categories = await getPublishedBlogCategories('en')
  return categories.map((category) => ({ category: category.slug }))
}

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = await getPublishedBlogCategory(categorySlug, 'en')

  if (!category) {
    return {
      title: 'Blog Category',
    }
  }

  const content = getBlogCategorySeoContent('en', category)

  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    alternates: {
      canonical: blogCategoryPath('en', category.slug),
      languages: await getBlogCategoryLanguageAlternates(category),
    },
    openGraph: {
      title: content.title,
      description: content.description,
      type: 'website',
      url: blogCategoryPath('en', category.slug),
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

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const { category: categorySlug } = await params
  const category = await getPublishedBlogCategory(categorySlug, 'en')

  if (!category) {
    notFound()
  }

  const content = getBlogCategorySeoContent('en', category)

  return (
    <StaticMarketingShell>
      <BlogCategoryPageView locale="en" category={category} content={content} />
    </StaticMarketingShell>
  )
}
