import type { MetadataRoute } from 'next'
import { appConfig } from '@/lib/config'

const siteUrl = appConfig.url.replace(/\/$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/upload', '/generate', '/login', '/api'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
