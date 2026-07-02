import type { MetadataRoute } from 'next'
import { appConfig } from '@/lib/config'
import { ROUTED_LOCALES } from '@/lib/i18n'
import { getSitemapIndexEntries } from '@/lib/sitemap'

const siteUrl = appConfig.url.replace(/\/$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/auth',
          '/dashboard',
          '/upload',
          '/generate',
          '/generations',
          '/login',
          ...ROUTED_LOCALES.map((locale) => `/${locale}/upload`),
          ...ROUTED_LOCALES.map((locale) => `/${locale}/dashboard`),
          ...ROUTED_LOCALES.map((locale) => `/${locale}/generate`),
          ...ROUTED_LOCALES.map((locale) => `/${locale}/generations`),
          ...ROUTED_LOCALES.map((locale) => `/${locale}/login`),
          '/api',
        ],
      },
    ],
    sitemap: getSitemapIndexEntries().map((entry) => entry.url),
    host: siteUrl,
  }
}
