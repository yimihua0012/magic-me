import type { MetadataRoute } from 'next'
import { appConfig } from '@/lib/config'

const siteUrl = appConfig.url.replace(/\/$/, '')

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/pricing', '/terms', '/privacy', '/contact', '/refund']

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.7,
  }))
}
