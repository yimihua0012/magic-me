import { appConfig } from '@/lib/config'
import { getBlogBreadcrumbLabel } from '@/lib/blog-breadcrumb'
import { BreadcrumbJsonLd } from '@/components/seo/page-json-ld'
import { localePath, type Locale } from '@/lib/i18n'
import type { BlogPostWithMeta } from '@/lib/blog-store'

interface BlogJsonLdProps {
  posts: readonly BlogPostWithMeta[]
  locale?: Locale
  path?: string
  title?: string
  description?: string
  breadcrumbName?: string
  breadcrumbParent?: {
    name: string
    path: string
  }
  includeBreadcrumb?: boolean
}

export default function BlogJsonLd({
  posts,
  locale = 'en',
  path = '/blog',
  title = 'Magic-Headshot Blog',
  description = 'AI image generation guides for headshots, LinkedIn photos, resume portraits, and professional profile photos.',
  breadcrumbName,
  breadcrumbParent,
  includeBreadcrumb = true,
}: BlogJsonLdProps) {
  const siteUrl = appConfig.url.replace(/\/$/, '')
  const pageUrl = `${siteUrl}${localePath(locale, path)}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${pageUrl}#blog`,
    name: title,
    description,
    url: pageUrl,
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
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
      {includeBreadcrumb && (
        <BreadcrumbJsonLd
          locale={locale}
          path={path}
          currentName={breadcrumbName || getBlogBreadcrumbLabel(locale)}
          parent={breadcrumbParent}
        />
      )}
    </>
  )
}
