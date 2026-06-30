'use client'

import { useEffect } from 'react'

export default function OAuthCodeRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (!code) {
      return
    }

    const callbackUrl = new URL('/api/auth/callback', window.location.origin)
    callbackUrl.searchParams.set('code', code)

    const returnTo = params.get('returnTo')
    if (returnTo) {
      callbackUrl.searchParams.set('returnTo', returnTo)
    }

    window.location.replace(callbackUrl.toString())
  }, [])

  return null
}
