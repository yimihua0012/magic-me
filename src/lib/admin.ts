import 'server-only'

export const ADMIN_EMAIL = 'yimihua0011@gmail.com'

export function isAdminEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() === ADMIN_EMAIL
}
