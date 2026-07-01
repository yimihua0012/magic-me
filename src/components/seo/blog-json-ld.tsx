import { appConfig } from '@/lib/config'
import { BreadcrumbJsonLd } from '@/components/seo/page-json-ld'
import type { BlogPost } from '@/lib/seo-content'

interface BlogJsonLdProps {
  posts: readonly BlogPost[]
}

export default function BlogJsonLd({ posts }: BlogJsonLdProps) {
  const siteUrl = appConfig.url.replace(/\/$/, '')
  const pageUrl = `${siteUrl}/blog`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${pageUrl}#blog`,
    name: 'Magic-Headshot Blog',
    description:
      'AI image generation guides for headshots, LinkedIn photos, resume portraits, and professional profile photos.',
    url: pageUrl,
    inLanguage: 'en',
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      keywords: post.keywords.join(', '),
      inLanguage: 'en',
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd locale="en" path="/blog" currentName="Magic-Headshot Blog" />
    </>
  )
}
