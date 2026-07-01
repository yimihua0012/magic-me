import type { MetadataRoute } from 'next'
import { getSitemapForLocale } from '@/lib/sitemap'

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapForLocale('en')
}
