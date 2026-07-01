import { sitemapXmlResponse } from '@/lib/sitemap-route'

export function GET() {
  return sitemapXmlResponse('ja')
}
