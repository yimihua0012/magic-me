'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackButtonClick } from '@/lib/analytics'
import { localeFromPath } from '@/lib/auth-return'

export default function PageViewTracker() {
  const pathname = usePathname()
  const lastTrackedRef = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname || pathname.startsWith('/dashboard/admin')) {
      return
    }

    const sourceParam = new URLSearchParams(window.location.search).get('source')
    const trackingKey = `${pathname}|${sourceParam || ''}`
    if (lastTrackedRef.current === trackingKey) {
      return
    }

    lastTrackedRef.current = trackingKey

    void trackButtonClick({
      buttonType: 'page_view',
      source: pathname,
      metadata: {
        locale: localeFromPath(pathname),
        referrerPath: safeReferrerPath(document.referrer),
        source: sourceParam || undefined,
      },
    })
  }, [pathname])

  return null
}

function safeReferrerPath(referrer: string) {
  if (!referrer) {
    return undefined
  }

  try {
    return new URL(referrer).pathname
  } catch {
    return undefined
  }
}
