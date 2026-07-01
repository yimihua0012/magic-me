import { PLANS, type PlanType } from '@backend/config/plans'
import { appConfig } from '@/lib/config'
import type { Currency } from '@/lib/currency'
import { localePath, type Locale } from '@/lib/i18n'
import { BreadcrumbJsonLd } from '@/components/seo/page-json-ld'

interface PricingJsonLdProps {
  locale: Locale
  currency: Currency
  title: string
  description: string
  planLabels?: Partial<Record<PlanType, string>>
  planDescription?: (planId: PlanType) => string
}

const planIds: PlanType[] = ['basic', 'pro', 'premium']

export default function PricingJsonLd({
  locale,
  currency,
  title,
  description,
  planLabels,
  planDescription,
}: PricingJsonLdProps) {
  const siteUrl = appConfig.url.replace(/\/$/, '')
  const pageUrl = `${siteUrl}${localePath(locale, '/pricing')}`
  const imageUrl = `${siteUrl}/home-pages/${encodeURIComponent('Ai headshot-linkedin-professional.jpg')}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description,
    url: pageUrl,
    image: imageUrl,
    inLanguage: locale,
    brand: {
      '@type': 'Brand',
      name: appConfig.name,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '10000',
    },
    offers: planIds.map((planId) => {
      const plan = PLANS[planId]
      const price = plan.prices[currency]

      return {
        '@type': 'Offer',
        name: planLabels?.[planId] ?? plan.name,
        price: String(price.amount),
        priceCurrency: currency,
        availability: 'https://schema.org/InStock',
        url: `${pageUrl}?plan=${planId}#plans`,
        description:
          planDescription?.(planId) ??
          `${plan.credits} AI headshots with ${plan.validityDays} days validity.`,
      }
    }),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd locale={locale} path="/pricing" currentName={title} />
    </>
  )
}
