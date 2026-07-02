import type { MetadataRoute } from 'next'
import { appConfig } from '@/lib/config'
import { blogPosts } from '@/lib/seo-content'
import { DEFAULT_LOCALE, LOCALES, ROUTED_LOCALES, type Locale, localePath } from '@/lib/i18n'

const siteUrl = appConfig.url.replace(/\/$/, '')
const lastModified = new Date('2026-06-30T00:00:00.000Z')

type SitemapRoute = {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}

const englishStaticRoutes: SitemapRoute[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/landing', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/pricing', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/free-id-photo-tool', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/questions', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/sample', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/refund', changeFrequency: 'yearly', priority: 0.3 },
]

const localizedLegalRoutes: SitemapRoute[] = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/landing', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/pricing', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/questions', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/sample', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/refund', changeFrequency: 'yearly', priority: 0.3 },
]

// Add localized routes here only after the corresponding pages are implemented.
const readyLocalizedRoutes: Partial<Record<Exclude<Locale, typeof DEFAULT_LOCALE>, SitemapRoute[]>> = {
  es: localizedLegalRoutes,
  fr: localizedLegalRoutes,
  de: localizedLegalRoutes,
  ja: localizedLegalRoutes,
}

function localizedUrl(locale: Locale, path: string) {
  return `${siteUrl}${localePath(locale, path)}`
}

function toSitemapEntry(locale: Locale, route: SitemapRoute): MetadataRoute.Sitemap[number] {
  return {
    url: localizedUrl(locale, route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }
}

export function getSitemapForLocale(locale: Locale): MetadataRoute.Sitemap {
  if (locale === DEFAULT_LOCALE) {
    const staticRoutes = englishStaticRoutes.map((route) => toSitemapEntry(locale, route))
    const blogRoutes = blogPosts.map((post, index) => ({
      url: localizedUrl(locale, `/blog/${post.slug}`),
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: index < 11 ? 0.7 : 0.6,
    }))

    return [...staticRoutes, ...blogRoutes]
  }

  return (readyLocalizedRoutes[locale] || []).map((route) => toSitemapEntry(locale, route))
}

export function getAllSitemaps(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) => getSitemapForLocale(locale))
}

export function getSitemapIndexEntries() {
  return [
    { locale: DEFAULT_LOCALE, url: `${siteUrl}/sitemap.xml` },
    ...ROUTED_LOCALES.map((locale) => ({
      locale,
      url: `${siteUrl}/sitemap-${locale}.xml`,
    })),
  ] as const
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function renderSitemapXml(entries: MetadataRoute.Sitemap) {
  const urls = entries
    .map((entry) => {
      const lastModified = entry.lastModified
        ? `<lastmod>${new Date(entry.lastModified).toISOString()}</lastmod>`
        : ''
      const changeFrequency = entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ''
      const priority = typeof entry.priority === 'number' ? `<priority>${entry.priority.toFixed(1)}</priority>` : ''

      return [
        '<url>',
        `<loc>${escapeXml(entry.url)}</loc>`,
        lastModified,
        changeFrequency,
        priority,
        '</url>',
      ].filter(Boolean).join('')
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
}
