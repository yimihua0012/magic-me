import { appConfig } from '@/lib/config'
import { getBlogPublishDate } from '@/lib/blog-dates'
import type { BlogPost } from '@/lib/seo-content'

interface BlogPostJsonLdProps {
  post: BlogPost
  index: number
  imagePath?: string
}

export default function BlogPostJsonLd({ post, index, imagePath }: BlogPostJsonLdProps) {
  const siteUrl = appConfig.url.replace(/\/$/, '')
  const pageUrl = `${siteUrl}/blog/${post.slug}`
  const imageUrl = imagePath ? `${siteUrl}${imagePath}` : `${siteUrl}/api/og`
  const publishDate = getBlogPublishDate(Math.max(index, 0))
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${pageUrl}#article`,
    headline: post.title,
    description: post.description,
    url: pageUrl,
    image: imageUrl,
    datePublished: publishDate,
    dateModified: publishDate,
    keywords: post.keywords.join(', '),
    inLanguage: 'en',
    author: {
      '@type': 'Organization',
      name: appConfig.name,
      url: siteUrl,
    },
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
