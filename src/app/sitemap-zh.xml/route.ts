import { sitemapXmlResponse } from '@/lib/sitemap-route'

export async function GET() {
  return sitemapXmlResponse('zh')
}
