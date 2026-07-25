import { appConfig } from '@/lib/config'
import { getBlogModifiedIsoDate, getBlogPublishIsoDate } from '@/lib/blog-dates'
import { BreadcrumbJsonLd } from '@/components/seo/page-json-ld'
import { localePath, type Locale } from '@/lib/i18n'
import type { BlogPostWithMeta } from '@/lib/blog-store'
import { getBlogEnhancement } from '@/lib/blog-enhancements'

interface BlogPostJsonLdProps {
  post: BlogPostWithMeta
  index: number
  imagePath?: string
  locale?: Locale
}

export default function BlogPostJsonLd({ post, index, imagePath, locale = 'en' }: BlogPostJsonLdProps) {
  const siteUrl = appConfig.url.replace(/\/$/, '')
  const pagePath = localePath(locale, `/blog/${post.slug}`)
  const pageUrl = `${siteUrl}${pagePath}`
  const imageUrl = imagePath
    ? imagePath.startsWith('http') ? imagePath : `${siteUrl}${imagePath}`
    : `${siteUrl}/api/og`
  const publishDate = post.publishedAt || getBlogPublishIsoDate(Math.max(index, 0))
  const modifiedDate = post.updatedAt || getBlogModifiedIsoDate()
  const enhancement = getBlogEnhancement(post.slug)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${pageUrl}#article`,
    headline: post.title,
    description: post.description,
    url: pageUrl,
    image: imageUrl,
    datePublished: publishDate,
    dateModified: modifiedDate,
    articleSection: post.category || enhancement?.category,
    keywords: post.keywords.join(', '),
    inLanguage: locale,
    author: {
      '@type': 'Organization',
      name: appConfig.name,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd
        locale={locale}
        path={`/blog/${post.slug}`}
        currentName={post.title}
        parent={{ name: 'Magic-Headshot Blog', path: '/blog' }}
      />
    </>
  )
}
