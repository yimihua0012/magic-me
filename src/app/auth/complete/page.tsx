'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { safeReturnTo } from '@/lib/auth-return'
import { supabase } from '@/lib/supabase/client'

export default function AuthCompletePage() {
  return (
    <Suspense fallback={<AuthCompleteShell message="Completing sign-in..." />}>
      <AuthCompleteContent />
    </Suspense>
  )
}

function AuthCompleteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('Completing sign-in...')

  useEffect(() => {
    const finishSignIn = async () => {
      const accessToken = searchParams.get('access_token')
      const refreshToken = searchParams.get('refresh_token')
      const returnTo = safeReturnTo(searchParams.get('returnTo'))

      if (!accessToken || !refreshToken) {
        router.replace(`/login?returnTo=${encodeURIComponent(returnTo)}&error=session_missing`)
        return
      }

      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      if (error) {
        setMessage('Sign-in could not be saved. Redirecting...')
        router.replace(`/login?returnTo=${encodeURIComponent(returnTo)}&error=session_missing`)
        return
      }

      window.history.replaceState(null, '', returnTo)
      router.replace(returnTo)
    }

    void finishSignIn()
  }, [router, searchParams])

  return (
    <AuthCompleteShell message={message} />
  )
}

function AuthCompleteShell({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-600 shadow-sm">
        {message}
      </div>
    </main>
  )
}

