'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginPathForReturn } from '@/lib/auth-return'
import { localePath, type Locale } from '@/lib/i18n'

function currentReturnTo() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

export function useAdminAuth(locale: Locale = 'en') {
  const router = useRouter()
  const dashboardHref = localePath(locale, '/dashboard')
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { supabase } = await import('@/lib/supabase/client')
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push(loginPathForReturn(currentReturnTo(), dashboardHref))
        return
      }

      const statusResponse = await fetch('/api/admin/status', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const status = await statusResponse.json().catch(() => null)

      if (!statusResponse.ok || !status?.isAdmin) {
        router.replace(dashboardHref)
        return
      }

      setAccessToken(session.access_token)
      setIsAuthorized(true)
      setIsCheckingAuth(false)
    }

    void checkAuth()
  }, [dashboardHref, router])

  return { accessToken, dashboardHref, isAuthorized, isCheckingAuth }
}
