import { NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'
import { LOCALES, type Locale } from '@/lib/i18n'
import { revalidateBlogPaths } from '@/lib/blog-revalidate'

export const dynamic = 'force-dynamic'

type RevalidateBody = {
  locale?: unknown
  slug?: unknown
}

export async function POST(request: Request) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json().catch(() => null) as RevalidateBody | null
  const locale = typeof body?.locale === 'string' ? body.locale : ''
  const slug = typeof body?.slug === 'string' ? body.slug.trim() : undefined

  if (!(LOCALES as readonly string[]).includes(locale)) {
    return NextResponse.json({ error: 'Invalid locale.' }, { status: 400 })
  }

  revalidateBlogPaths(locale as Locale, slug)
  return NextResponse.json({ revalidated: true, locale, slug })
}
