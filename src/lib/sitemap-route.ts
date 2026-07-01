import { NextResponse } from 'next/server'
import { getSitemapForLocale, renderSitemapXml } from '@/lib/sitemap'
import type { Locale } from '@/lib/i18n'

export function sitemapXmlResponse(locale: Locale) {
  return new NextResponse(renderSitemapXml(getSitemapForLocale(locale)), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
