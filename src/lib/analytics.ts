'use client'

import { supabase } from '@/lib/supabase/client'
import { getSessionSafely } from '@/lib/supabase/auth-session'

type ButtonClickPayload = {
  buttonType: string
  source: string
  metadata?: Record<string, unknown>
}

export async function trackButtonClick({ buttonType, source, metadata }: ButtonClickPayload) {
  try {
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
        metadata,
      }),
      keepalive: true,
    })
  } catch (error) {
    console.error('[Analytics] Failed to track button click:', error)
  }
}
