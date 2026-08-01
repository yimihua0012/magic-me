import type { PlanType } from '@backend/config/plans'
import type { Currency } from '@/lib/currency'
import type { Locale } from '@/lib/i18n'
import { WebPageJsonLd } from '@/components/seo/page-json-ld'

interface PricingJsonLdProps {
  locale: Locale
  currency: Currency
  title: string
  description: string
  planLabels?: Partial<Record<PlanType, string>>
  planDescription?: (planId: PlanType) => string
}

export default function PricingJsonLd({
  locale,
  title,
  description,
}: PricingJsonLdProps) {
  return (
    <WebPageJsonLd
      locale={locale}
      path="/pricing"
      title={title}
      description={description}
    />
  )
}
