'use client'

import { useEffect } from 'react'

export default function ButtonClickTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) {
        return
      }

      const target = event.target.closest<HTMLElement>('[data-track-button="true"]')
      const buttonType = target?.dataset.trackButtonType
      const source = target?.dataset.trackSource

      if (!target || !buttonType || !source) {
        return
      }

      let metadata: Record<string, unknown> | undefined

      if (target.dataset.trackMetadata) {
        try {
          const parsed = JSON.parse(target.dataset.trackMetadata)
          metadata = parsed && typeof parsed === 'object' ? parsed : undefined
        } catch {
          metadata = undefined
        }
      }

      const body = JSON.stringify({
        buttonType,
        source,
        clickedAt: new Date().toISOString(),
        metadata,
      })

      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' })
        navigator.sendBeacon('/api/analytics/button-click', blob)
        return
      }

      void fetch('/api/analytics/button-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      })
    }

    document.addEventListener('click', handleClick, { capture: true })
    return () => document.removeEventListener('click', handleClick, { capture: true })
  }, [])

  return null
}
