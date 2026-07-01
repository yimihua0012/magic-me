export const DEFAULT_LOCALE = 'en'

export const LOCALES = ['en', 'es', 'fr', 'de', 'ja'] as const

export type Locale = (typeof LOCALES)[number]

export const ROUTED_LOCALES = ['es', 'fr', 'de', 'ja'] as const

export type RoutedLocale = (typeof ROUTED_LOCALES)[number]

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
}

export const OPEN_GRAPH_LOCALES: Record<Locale, string> = {
  en: 'en_US',
  es: 'es_ES',
  fr: 'fr_FR',
  de: 'de_DE',
  ja: 'ja_JP',
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

export function isRoutedLocale(value: string): value is RoutedLocale {
  return (ROUTED_LOCALES as readonly string[]).includes(value)
}

export function localePath(locale: Locale, path = '') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  if (locale === DEFAULT_LOCALE) {
    return normalizedPath === '/' ? '/' : normalizedPath
  }

  return normalizedPath === '/' ? `/${locale}` : `/${locale}${normalizedPath}`
}

export function languageAlternatesForPath(path = '') {
  return {
    en: localePath(DEFAULT_LOCALE, path),
    es: localePath('es', path),
    fr: localePath('fr', path),
    de: localePath('de', path),
    ja: localePath('ja', path),
    'x-default': localePath(DEFAULT_LOCALE, path),
  }
}
