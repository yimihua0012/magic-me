import { appConfig } from '@/lib/config'
import { BreadcrumbJsonLd } from '@/components/seo/page-json-ld'
import { localePath, type Locale } from '@/lib/i18n'
import type { BlogPostWithMeta } from '@/lib/blog-store'

interface BlogJsonLdProps {
  posts: readonly BlogPostWithMeta[]
  locale?: Locale
  path?: string
}

export default function BlogJsonLd({ posts, locale = 'en', path = '/blog' }: BlogJsonLdProps) {
  const siteUrl = appConfig.url.replace(/\/$/, '')
  const pageUrl = `${siteUrl}${localePath(locale, path)}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${pageUrl}#blog`,
    name: 'Magic-Headshot Blog',
    description:
      'AI image generation guides for headshots, LinkedIn photos, resume portraits, and professional profile photos.',
    url: pageUrl,
    inLanguage: locale,
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    blogPost: posts.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      url: `${siteUrl}${localePath(locale, `/blog/${post.slug}`)}`,
      keywords: post.keywords.join(', '),
      inLanguage: locale,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd locale={locale} path="/blog" currentName="Magic-Headshot Blog" />
    </>
  )
}
