import { ROUTED_LOCALES } from '@/lib/i18n'

const adminDashboardPrefixes = [
  '/dashboard/admin',
  ...ROUTED_LOCALES.map((locale) => `/${locale}/dashboard/admin`),
]

export function isAdminDashboardPath(value: string | null | undefined) {
  if (!value) return false

  const pathname = normalizePathname(value)
  return adminDashboardPrefixes.some((prefix) => (
    pathname === prefix || pathname.startsWith(`${prefix}/`)
  ))
}

function normalizePathname(value: string) {
  try {
    const parsed = value.startsWith('http://') || value.startsWith('https://')
      ? new URL(value).pathname
      : value
    const [withoutQuery] = parsed.split(/[?#]/)
    const normalized = withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`
    return normalized.replace(/\/+$/, '') || '/'
  } catch {
    return value
  }
}
