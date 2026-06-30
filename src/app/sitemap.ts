import type { MetadataRoute } from 'next'
import { appConfig } from '@/lib/config'
import { blogPosts } from '@/lib/seo-content'

const siteUrl = appConfig.url.replace(/\/$/, '')
const lastModified = new Date('2026-06-30T00:00:00.000Z')

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: '', changeFrequency: 'weekly' as const, priority: 1 },
    { path: '/landing', changeFrequency: 'monthly' as const, priority: 0.7 },
    { path: '/pricing', changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/questions', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/sample', changeFrequency: 'monthly' as const, priority: 0.8 },
    { path: '/blog', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/terms', changeFrequency: 'yearly' as const, priority: 0.3 },
    { path: '/refund', changeFrequency: 'yearly' as const, priority: 0.3 },
  ]

  const staticRoutes = routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const blogRoutes = blogPosts.map((post, index) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: index < 11 ? 0.7 : 0.6,
  }))

  return [...staticRoutes, ...blogRoutes]
}
