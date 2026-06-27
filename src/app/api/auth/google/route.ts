import { createClient } from '@/lib/supabase/server'
import { appConfig } from '@/lib/config'
import { getSupabaseUrl } from '@/lib/supabase/url'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const origin = requestUrl.hostname === 'localhost' || requestUrl.hostname === '127.0.0.1'
    ? requestUrl.origin
    : appConfig.url
  const returnTo = safeReturnTo(requestUrl.searchParams.get('returnTo'))

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/api/auth/callback`,
      skipBrowserRedirect: true,
    },
  })

  if (error) {
    console.error('[Google Auth] OAuth URL error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  if (!data.url) {
    console.error('[Google Auth] Supabase did not return an OAuth URL')
    return NextResponse.json({ error: 'Failed to create Google login URL' }, { status: 500 })
  }

  const redirectUrl = data.url.startsWith('http')
    ? data.url
    : new URL(data.url, getSupabaseUrl()).toString()

  const response = NextResponse.redirect(redirectUrl)
  response.cookies.set('oauth_return_to', returnTo, {
    httpOnly: true,
    maxAge: 10 * 60,
    path: '/',
    sameSite: 'lax',
    secure: origin.startsWith('https://'),
  })

  return response
}

function safeReturnTo(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard'
  }

  return value
}
