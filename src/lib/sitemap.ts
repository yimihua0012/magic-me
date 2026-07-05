import type { MetadataRoute } from 'next'
import { appConfig } from '@/lib/config'
import { blogGeneratedPortraitImages, blogPosts, sampleComparisons } from '@/lib/seo-content'
import { DEFAULT_LOCALE, LOCALES, ROUTED_LOCALES, type Locale, localePath } from '@/lib/i18n'
import { getPublishedBlogPosts, localeHasPublishedCmsBlogPosts } from '@/lib/blog-store'
import { getSamplePictures } from '@/lib/sample-pictures'
import { sampleGalleryPath } from '@/lib/sample-gallery-content'

const siteUrl = appConfig.url.replace(/\/$/, '')
const lastModified = new Date('2026-07-03T00:00:00.000Z')

type SitemapRoute = {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
  images?: string[]
}

type SitemapEntry = MetadataRoute.Sitemap[number] & {
  images?: string[]
}

const defaultSeoImage = `/home-pages/${encodeURIComponent('Ai headshot-linkedin-professional.jpg')}`
const homeImages = [
  defaultSeoImage,
  '/home-pages/headshot-linkedin-professional1.jpeg',
  '/home-pages/headshot-linkedin-professional2.jpeg',
  '/home-pages/headshot-linkedin-professional3.jpg',
]
const sampleImages = sampleComparisons.flatMap((comparison) => [
  comparison.original.src,
  ...comparison.generated.map((image) => image.src),
])
const blogImages = blogGeneratedPortraitImages.map((image) => image.src)

const englishStaticRoutes: SitemapRoute[] = [
  { path: '', changeFrequency: 'weekly', priority: 1, images: homeImages },
  { path: '/landing', changeFrequency: 'monthly', priority: 0.7, images: ['/landing-headshot-showcase.png'] },
  { path: '/ai-headshot-linkedin', changeFrequency: 'monthly', priority: 0.8, images: [defaultSeoImage] },
  { path: sampleGalleryPath, changeFrequency: 'weekly', priority: 0.8 },
  { path: '/ai-headshot-corporate', changeFrequency: 'monthly', priority: 0.8, images: [defaultSeoImage] },
  { path: '/ai-headshot-resume', changeFrequency: 'monthly', priority: 0.8, images: [defaultSeoImage] },
  { path: '/ai-headshot-studio-style', changeFrequency: 'monthly', priority: 0.8, images: [defaultSeoImage] },
  { path: '/ai-headshot-professional-photo', changeFrequency: 'monthly', priority: 0.8, images: [defaultSeoImage] },
  { path: '/pricing', changeFrequency: 'weekly', priority: 0.9, images: [defaultSeoImage] },
  { path: '/free-id-photo-tool', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/questions', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/sample', changeFrequency: 'monthly', priority: 0.8, images: sampleImages },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.8, images: blogImages },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/refund', changeFrequency: 'yearly', priority: 0.3 },
]

const localizedStaticRoutes: SitemapRoute[] = [
  { path: '', changeFrequency: 'weekly', priority: 1, images: homeImages },
  { path: '/landing', changeFrequency: 'monthly', priority: 0.7, images: ['/landing-headshot-showcase.png'] },
  { path: '/ai-headshot-linkedin', changeFrequency: 'monthly', priority: 0.8, images: [defaultSeoImage] },
  { path: sampleGalleryPath, changeFrequency: 'weekly', priority: 0.8 },
  { path: '/ai-headshot-corporate', changeFrequency: 'monthly', priority: 0.8, images: [defaultSeoImage] },
  { path: '/ai-headshot-resume', changeFrequency: 'monthly', priority: 0.8, images: [defaultSeoImage] },
  { path: '/ai-headshot-studio-style', changeFrequency: 'monthly', priority: 0.8, images: [defaultSeoImage] },
  { path: '/ai-headshot-professional-photo', changeFrequency: 'monthly', priority: 0.8, images: [defaultSeoImage] },
  { path: '/pricing', changeFrequency: 'weekly', priority: 0.9, images: [defaultSeoImage] },
  { path: '/free-id-photo-tool', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/questions', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/sample', changeFrequency: 'monthly', priority: 0.8, images: sampleImages },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/refund', changeFrequency: 'yearly', priority: 0.3 },
]

// Add localized routes here only after the corresponding pages are implemented.
function localizedUrl(locale: Locale, path: string) {
  return `${siteUrl}${localePath(locale, path)}`
}

function absoluteAssetUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

function toSitemapEntry(locale: Locale, route: SitemapRoute): SitemapEntry {
  return {
    url: localizedUrl(locale, route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    images: route.images?.map(absoluteAssetUrl),
  }
}

export async function getSitemapForLocale(locale: Locale): Promise<SitemapEntry[]> {
  const publishedPosts = await getPublishedBlogPosts(locale)
  const samplePictureImages = (await getSamplePictures(locale)).map((picture) => picture.imageUrl)

  if (locale === DEFAULT_LOCALE) {
    const staticRoutes = englishStaticRoutes.map((route) => toSitemapEntry(locale, withSampleGalleryImages(route, samplePictureImages)))
    const blogRoutes = publishedPosts.map((post, index) => ({
      url: localizedUrl(locale, `/blog/${post.slug}`),
      lastModified: post.updatedAt ? new Date(post.updatedAt) : lastModified,
      changeFrequency: 'monthly' as const,
      priority: index < 11 ? 0.7 : 0.6,
      images: [
        absoluteAssetUrl(post.coverImage?.url || blogImages[index % blogImages.length] || defaultSeoImage),
      ],
    }))

    return [...staticRoutes, ...blogRoutes]
  }

  const staticRoutes = localizedStaticRoutes.map((route) => toSitemapEntry(locale, withSampleGalleryImages(route, samplePictureImages)))
  const hasLocalizedBlog = await localeHasPublishedCmsBlogPosts(locale)
  const blogIndexRoute = hasLocalizedBlog
    ? [toSitemapEntry(locale, { path: '/blog', changeFrequency: 'weekly', priority: 0.7, images: blogImages })]
    : []
  const blogRoutes = publishedPosts.map((post, index) => ({
    url: localizedUrl(locale, `/blog/${post.slug}`),
    lastModified: post.updatedAt ? new Date(post.updatedAt) : lastModified,
    changeFrequency: 'monthly' as const,
    priority: index < 11 ? 0.65 : 0.55,
    images: [
      absoluteAssetUrl(post.coverImage?.url || blogImages[index % blogImages.length] || defaultSeoImage),
    ],
  }))

  return [...staticRoutes, ...blogIndexRoute, ...blogRoutes]
}

function withSampleGalleryImages(route: SitemapRoute, images: string[]): SitemapRoute {
  if (route.path !== sampleGalleryPath || images.length === 0) return route
  return { ...route, images }
}

export async function getAllSitemaps(): Promise<SitemapEntry[]> {
  const entries = await Promise.all(LOCALES.map((locale) => getSitemapForLocale(locale)))
  return entries.flat()
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

export function renderSitemapXml(entries: SitemapEntry[]) {
  const hasImages = entries.some((entry) => entry.images?.length)
  const urls = entries
    .map((entry) => {
      const lastModified = entry.lastModified
        ? `<lastmod>${new Date(entry.lastModified).toISOString()}</lastmod>`
        : ''
      const changeFrequency = entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ''
      const priority = typeof entry.priority === 'number' ? `<priority>${entry.priority.toFixed(1)}</priority>` : ''
      const images = entry.images?.map((image) => (
        `<image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`
      )).join('') || ''

      return [
        '<url>',
        `<loc>${escapeXml(entry.url)}</loc>`,
        lastModified,
        changeFrequency,
        priority,
        images,
        '</url>',
      ].filter(Boolean).join('')
    })
    .join('')

  const imageNamespace = hasImages ? ' xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"' : ''
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"${imageNamespace}>${urls}</urlset>`
}
