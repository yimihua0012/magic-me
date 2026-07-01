import { PLANS, type PlanType } from '@backend/config/plans'
import type { Currency } from '@/lib/currency'
import type { Locale } from '@/lib/i18n'

interface PricingJsonLdProps {
  locale: Locale
  currency: Currency
}

const planIds: PlanType[] = ['basic', 'pro', 'premium']

export default function PricingJsonLd({ locale, currency }: PricingJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Magic-Headshot AI Headshot Credits',
    description: 'One-time credit packs for AI-generated professional headshots.',
    inLanguage: locale,
    offers: planIds.map((planId) => {
      const plan = PLANS[planId]
      const price = plan.prices[currency]

      return {
        '@type': 'Offer',
        name: plan.name,
        price: String(price.amount),
        priceCurrency: currency,
        availability: 'https://schema.org/InStock',
        description: `${plan.credits} AI headshots with ${plan.validityDays} days validity.`,
      }
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
