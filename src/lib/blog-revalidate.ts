import 'server-only'

import { revalidatePath } from 'next/cache'
import { DEFAULT_LOCALE, localePath, type Locale } from '@/lib/i18n'

export function revalidateBlogPaths(locale: Locale, slug?: string) {
  revalidatePath(localePath(locale, '/blog'))
  revalidatePath(locale === DEFAULT_LOCALE ? '/sitemap.xml' : `/sitemap-${locale}.xml`)
  revalidatePath('/robots.txt')

  if (slug) {
    revalidatePath(localePath(locale, `/blog/${slug}`))
  }
}
