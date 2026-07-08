'use client'

import { supabase } from '@/lib/supabase/client'
import { getSessionSafely } from '@/lib/supabase/auth-session'
import { isAdminDashboardPath } from '@/lib/analytics-paths'

type ButtonClickPayload = {
  buttonType: string
  source: string
  metadata?: Record<string, unknown>
}

export async function trackButtonClick({ buttonType, source, metadata }: ButtonClickPayload) {
  try {
    const currentPath = typeof window === 'undefined' ? undefined : window.location.pathname
    if (isAdminDashboardPath(currentPath) || isAdminDashboardPath(source)) {
      return
    }

    const session = await getSessionSafely(supabase)

    await fetch('/api/analytics/button-click', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
      },
      body: JSON.stringify({
        buttonType,
        source,
        clickedAt: new Date().toISOString(),
        metadata: {
          ...(metadata || {}),
          currentPath,
        },
      }),
      keepalive: true,
    })
  } catch (error) {
    console.error('[Analytics] Failed to track button click:', error)
  }
}
