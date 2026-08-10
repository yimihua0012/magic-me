import type { Locale } from '@/lib/i18n'

const BLOG_BREADCRUMB_LABELS: Record<Locale, string> = {
  en: 'Magic-Headshot Blog',
  es: 'Blog de Magic-Headshot',
  fr: 'Blog Magic-Headshot',
  de: 'Magic-Headshot Blog',
  ja: 'Magic-Headshot ブログ',
  zh: 'Magic-Headshot 博客',
}

export function getBlogBreadcrumbLabel(locale: Locale) {
  return BLOG_BREADCRUMB_LABELS[locale]
}
