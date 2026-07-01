'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { trackButtonClick } from '@/lib/analytics'
import { loginPathForReturn } from '@/lib/auth-return'
import { supabase } from '@/lib/supabase/client'
import type { Currency } from '@/lib/currency'
import { localePath, type Locale } from '@/lib/i18n'
import { withSource } from '@/lib/navigation-source'
import { PlanType } from '@backend/config/plans'

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: PayPalButtonsConfig) => {
        render: (selector: HTMLElement) => Promise<void>
        close?: () => void
      }
    }
  }
}

type PayPalButtonAction = {
  restart?: () => void
}

type PayPalButtonsConfig = {
  style?: {
    layout?: 'vertical' | 'horizontal'
    color?: 'gold' | 'blue' | 'silver' | 'white' | 'black'
    shape?: 'rect' | 'pill'
    label?: 'paypal' | 'checkout' | 'buynow' | 'pay'
    height?: number
    tagline?: boolean
  }
  createOrder: () => Promise<string>
  onApprove: (data: { orderID: string }, actions: PayPalButtonAction) => Promise<void>
  onCancel?: () => void
  onError?: (error: unknown) => void
}

interface PayPalButtonProps {
  buttonId?: string
  label: string
  planType: PlanType
  buttonType?: string
  source?: string
  metadata?: Record<string, unknown>
  containerClassName?: string
  currency?: Currency
  locale?: Locale
}

let paypalScriptPromise: Promise<void> | null = null
let loadedPayPalCurrency: Currency | null = null

function removePayPalScript() {
  document.querySelector<HTMLScriptElement>('script[data-paypal-sdk="true"]')?.remove()
  window.paypal = undefined
  paypalScriptPromise = null
  loadedPayPalCurrency = null
}

function loadPayPalScript(clientId: string, currency: Currency) {
  if (typeof window === 'undefined') {
    return Promise.resolve()
  }

  if (window.paypal && loadedPayPalCurrency === currency) {
    return Promise.resolve()
  }

  const existing = document.querySelector<HTMLScriptElement>('script[data-paypal-sdk="true"]')
  const existingCurrency = existing?.dataset.paypalCurrency as Currency | undefined

  if (existing && existingCurrency !== currency) {
    removePayPalScript()
  }

  if (paypalScriptPromise) {
    return paypalScriptPromise
  }

  paypalScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${currency}&intent=capture&disable-funding=paylater,credit,venmo`
    script.async = true
    script.dataset.paypalSdk = 'true'
    script.dataset.paypalCurrency = currency
    script.onload = () => {
      loadedPayPalCurrency = currency
      resolve()
    }
    script.onerror = () => reject(new Error('Failed to load PayPal SDK'))
    document.head.appendChild(script)
  })

  return paypalScriptPromise
}

export default function PayPalButton({
  buttonId,
  label,
  planType,
  buttonType,
  source,
  metadata,
  containerClassName,
  currency = 'USD',
  locale = 'en',
}: PayPalButtonProps) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<{ close?: () => void } | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCapturing, setIsCapturing] = useState(false)
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  useEffect(() => {
    let isMounted = true

    async function renderPayPalButton() {
      if (!containerRef.current) {
        return
      }

      if (!clientId) {
        setIsLoading(false)
        setError('PayPal is not configured.')
        return
      }

      try {
        setIsLoading(true)
        setError('')
        await loadPayPalScript(clientId, currency)

        if (!isMounted || !containerRef.current || !window.paypal) {
          return
        }

        containerRef.current.innerHTML = ''
        buttonsRef.current?.close?.()

        const buttons = window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'pill',
            label: 'paypal',
            height: 48,
            tagline: false,
          },
          createOrder: async () => {
            setError('')

            if (buttonType && source) {
              void trackButtonClick({
                buttonType,
                source,
                metadata: {
                  buttonId,
                  label,
                  plan: planType,
                  currency,
                  ...metadata,
                },
              })
            }

            const { data: { session } } = await supabase.auth.getSession()
            if (!session?.access_token) {
              const returnTo = `${window.location.pathname}${window.location.search}`
              router.push(loginPathForReturn(returnTo, localePath(locale, '/pricing')))
              throw new Error('Please sign in before paying with PayPal.')
            }

            const response = await fetch('/api/paypal/create-order', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.access_token}`,
              },
              body: JSON.stringify({ plan_type: planType, currency }),
            })
            const data = await response.json()

            if (!response.ok || !data.orderID) {
              throw new Error(data.error || 'Failed to create PayPal order.')
            }

            return data.orderID as string
          },
          onApprove: async ({ orderID }) => {
            setError('')
            setIsCapturing(true)

            try {
              const { data: { session } } = await supabase.auth.getSession()
              if (!session?.access_token) {
                throw new Error('Please sign in again to finish your PayPal payment.')
              }

              const response = await fetch('/api/paypal/capture-order', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ orderID }),
              })
              const data = await response.json()

              if (!response.ok) {
                throw new Error(data.error || 'Failed to finish PayPal payment.')
              }

              router.push(withSource(`${localePath(locale, '/upload')}?payment=success`, `paypal_success_${planType}_${currency}_${locale}`))
            } catch (captureError) {
              setError(captureError instanceof Error ? captureError.message : 'Failed to finish PayPal payment.')
            } finally {
              setIsCapturing(false)
            }
          },
          onCancel: () => {
            setError('')
          },
          onError: (paypalError) => {
            console.error('[PayPalButton] Error:', paypalError)
            setError(paypalError instanceof Error ? paypalError.message : 'PayPal payment failed. Please try again.')
            setIsCapturing(false)
          },
        })

        buttonsRef.current = buttons
        await buttons.render(containerRef.current)
      } catch (renderError) {
        console.error('[PayPalButton] Render error:', renderError)
        if (isMounted) {
          setError(renderError instanceof Error ? renderError.message : 'Failed to load PayPal.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void renderPayPalButton()

    return () => {
      isMounted = false
      buttonsRef.current?.close?.()
    }
  }, [buttonId, buttonType, clientId, currency, label, locale, metadata, planType, router, source])

  return (
    <div className={containerClassName ?? 'text-center'}>
      <div className="relative min-h-[48px] w-full">
        {(isLoading || isCapturing) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-white/80">
            <Loader2 className="h-5 w-5 animate-spin text-primary-600" />
          </div>
        )}
        <div ref={containerRef} className="w-full" aria-label={label} />
      </div>
      {error && (
        <p className="mt-2 text-center text-xs font-medium text-red-600">{error}</p>
      )}
    </div>
  )
}
