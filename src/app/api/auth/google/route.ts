import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin
  const returnTo = requestUrl.searchParams.get('returnTo') || '/dashboard'

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/api/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
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
    : new URL(data.url, process.env.NEXT_PUBLIC_SUPABASE_URL).toString()

  return NextResponse.redirect(redirectUrl)
}
