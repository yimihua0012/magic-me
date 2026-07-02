'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/button'
import { trackButtonClick } from '@/lib/analytics'
import { loginPathForReturn } from '@/lib/auth-return'
import type { Currency } from '@/lib/currency'
import { formatCurrency } from '@/lib/currency'
import { localePath, type Locale } from '@/lib/i18n'
import { PlanType } from '@backend/config/plans'

const PayPalButton = dynamic(() => import('@/components/ui/paypal-button'), {
  loading: () => (
    <div className="flex min-h-[48px] w-full items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-500">
      Loading checkout...
    </div>
  ),
  ssr: false,
})

interface PlanPaymentCtaProps {
  buttonId: string
  label: string
  planType: PlanType
  price: number
  highlighted?: boolean
  source: string
  currency?: Currency
  locale?: Locale
  helperText?: string
}

export default function PlanPaymentCta({
  buttonId,
  label,
  planType,
  price,
  highlighted = false,
  source,
  currency = 'USD',
  locale = 'en',
  helperText = 'Validity starts from your first generation, not the purchase date.',
}: PlanPaymentCtaProps) {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)

  const handlePrepareCheckout = async () => {
    try {
      setIsCheckingAuth(true)
      void trackButtonClick({
        buttonType: 'checkout_prepare',
        source,
        metadata: { plan: planType, price, currency, locale },
      })

      const { supabase } = await import('@/lib/supabase/client')
      const { getSessionSafely } = await import('@/lib/supabase/auth-session')
      const session = await getSessionSafely(supabase)

      if (!session?.access_token) {
        const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`
        router.push(loginPathForReturn(returnTo, localePath(locale, '/pricing')))
        return
      }

      setIsReady(true)
    } catch {
      const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`
      router.push(loginPathForReturn(returnTo, localePath(locale, '/pricing')))
    } finally {
      setIsCheckingAuth(false)
    }
  }

  if (isReady) {
    return (
      <div className="space-y-2">
        <PayPalButton
          buttonId={buttonId}
          label={label}
          planType={planType}
          buttonType={`paypal_${planType}`}
          source={source}
          currency={currency}
          locale={locale}
          metadata={{ plan: planType, price, currency, locale }}
        />
        <p className="text-center text-xs text-slate-500">{helperText}</p>
      </div>
    )
  }

  return (
    <Button
      className="w-full"
      variant={highlighted ? 'primary' : 'secondary'}
      onClick={handlePrepareCheckout}
      isLoading={isCheckingAuth}
    >
      {label} - {formatCurrency(price, currency)}
    </Button>
  )
}
