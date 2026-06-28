'use client'

import { useState } from 'react'
import Button from '@/components/ui/button'
import PayPalButton from '@/components/ui/paypal-button'
import { PlanType } from '@backend/config/plans'

interface PlanPaymentCtaProps {
  buttonId: string
  label: string
  planType: PlanType
  price: number
  highlighted?: boolean
  source: string
}

export default function PlanPaymentCta({
  buttonId,
  label,
  planType,
  price,
  highlighted = false,
  source,
}: PlanPaymentCtaProps) {
  const [isReady, setIsReady] = useState(false)

  if (isReady) {
    return (
      <div className="space-y-2">
        <PayPalButton
          buttonId={buttonId}
          label={label}
          planType={planType}
          buttonType={`paypal_${planType}`}
          source={source}
          metadata={{ plan: planType, price }}
        />
        <p className="text-center text-xs text-slate-500">Secure PayPal checkout</p>
      </div>
    )
  }

  return (
    <Button
      className="w-full"
      variant={highlighted ? 'primary' : 'secondary'}
      onClick={() => setIsReady(true)}
    >
      {label} - ${price}
    </Button>
  )
}
