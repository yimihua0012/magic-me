import 'server-only'

import { revalidatePath } from 'next/cache'
import { DEFAULT_LOCALE, localePath, type Locale } from '@/lib/i18n'

export function revalidateBlogPaths(locale: Locale, slug?: string, categorySlugs?: string | string[]) {
  revalidatePath(localePath(locale, '/blog'))
  revalidatePath(localePath(locale, '/blog/category/[category]'), 'page')
  revalidatePath(locale === DEFAULT_LOCALE ? '/sitemap.xml' : `/sitemap-${locale}.xml`)
  revalidatePath('/robots.txt')

  if (slug) {
    revalidatePath(localePath(locale, `/blog/${slug}`))
  }
  const uniqueCategorySlugs = Array.from(new Set(Array.isArray(categorySlugs) ? categorySlugs : categorySlugs ? [categorySlugs] : []))
  for (const categorySlug of uniqueCategorySlugs) {
    revalidatePath(localePath(locale, `/blog/category/${categorySlug}`))
  }
}
