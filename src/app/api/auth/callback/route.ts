import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const cookieStore = await cookies()
  const returnTo = safeReturnTo(
    requestUrl.searchParams.get('returnTo') || cookieStore.get('oauth_return_to')?.value || null
  )

  if (!code) {
    return redirectToLogin(requestUrl, returnTo, 'missing_code')
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    console.error('[Auth Callback] Failed to exchange code for session:', error.message)
    return redirectToLogin(requestUrl, returnTo, 'oauth_exchange_failed')
  }

  if (!data.session) {
    console.error('[Auth Callback] Session missing after OAuth exchange')
    return redirectToLogin(requestUrl, returnTo, 'session_missing')
  }

  const completeUrl = new URL('/auth/complete', requestUrl.origin)
  completeUrl.searchParams.set('returnTo', returnTo)
  completeUrl.searchParams.set('access_token', data.session.access_token)
  completeUrl.searchParams.set('refresh_token', data.session.refresh_token)
  return redirectAndClear(completeUrl)
}

function safeReturnTo(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard'
  }

  return value
}

function redirectToLogin(requestUrl: URL, returnTo: string, error: string) {
  const loginUrl = new URL('/login', requestUrl.origin)
  loginUrl.searchParams.set('returnTo', returnTo)
  loginUrl.searchParams.set('error', error)
  return redirectAndClear(loginUrl)
}

function redirectAndClear(url: URL) {
  const response = NextResponse.redirect(url)
  response.cookies.set('oauth_return_to', '', {
    maxAge: 0,
    path: '/',
  })
  return response
}
