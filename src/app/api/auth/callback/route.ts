import { NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { loginPathForReturn } from '@/lib/auth-return'
import { supabaseAdmin } from '@backend/config/supabase'

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

  await ensureProfile(data.session.user)

  const completeUrl = new URL('/auth/complete', requestUrl.origin)
  completeUrl.searchParams.set('returnTo', returnTo)
  completeUrl.searchParams.set('access_token', data.session.access_token)
  completeUrl.searchParams.set('refresh_token', data.session.refresh_token)
  return redirectAndClear(completeUrl)
}

async function ensureProfile(user: User) {
  const metadata = user.user_metadata || {}
  const fullName = metadata.full_name || metadata.name || null
  const avatarUrl = metadata.avatar_url || metadata.picture || null
  const now = new Date().toISOString()

  const { error } = await supabaseAdmin
    .from('profiles')
    .upsert(
      {
        id: user.id,
        email: user.email || '',
        full_name: fullName,
        avatar_url: avatarUrl,
        email_verified: Boolean(user.email_confirmed_at),
        last_login_at: now,
        updated_at: now,
      },
      { onConflict: 'id' },
    )

  if (error) {
    console.error('[Auth Callback] Failed to ensure profile:', error)
  }
}

function safeReturnTo(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return '/dashboard'
  }

  return value
}

function redirectToLogin(requestUrl: URL, returnTo: string, error: string) {
  const loginUrl = new URL(loginPathForReturn(returnTo), requestUrl.origin)
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
