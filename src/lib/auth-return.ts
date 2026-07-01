import { DEFAULT_LOCALE, isRoutedLocale, localePath, type Locale } from '@/lib/i18n'

export function safeReturnTo(value: string | null | undefined, fallback = '/dashboard') {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return fallback
  }

  return value
}

export function loginPathForReturn(returnTo: string, fallback = '/dashboard') {
  const safePath = safeReturnTo(returnTo, fallback)
  return `${localePath(localeFromPath(safePath), '/login')}?returnTo=${encodeURIComponent(safePath)}`
}

export function localeFromPath(pathname: string): Locale {
  const firstSegment = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)[0]
  return isRoutedLocale(firstSegment) ? firstSegment : DEFAULT_LOCALE
}

export function localeHomeFromPath(pathname: string) {
  return localePath(localeFromPath(pathname))
}
