import { PLANS, type PlanType } from '@backend/config/plans'
import { appConfig } from '@/lib/config'
import type { Currency } from '@/lib/currency'
import { localePath, type Locale } from '@/lib/i18n'
import {
  digitalDeliveryPolicy,
  digitalMerchantPolicy,
  merchantReturnPolicy,
} from '@/lib/merchant-structured-data'
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
  const brand = {
    '@type': 'Brand',
    name: appConfig.name,
  }
  const seller = {
    '@id': `${siteUrl}/#organization`,
  }
  const category = 'AI headshot generation software'
  const planProducts = planIds.map((planId) => {
    const plan = PLANS[planId]
    const price = plan.prices[currency]
    const planName = planLabels?.[planId] ?? plan.name
    const planUrl = `${pageUrl}?plan=${planId}#plans`
    const planSummary =
      planDescription?.(planId) ??
      `${plan.credits} AI headshots with ${plan.validityDays} days validity.`

    return {
      '@type': 'Product',
      '@id': `${pageUrl}#product-${planId}`,
      name: planName,
      description: planSummary,
      sku: `magic-headshot-${planId}-${currency.toLowerCase()}`,
      productID: plan.priceId,
      category,
      image: imageUrl,
      brand,
      url: planUrl,
      inLanguage: locale,
      offers: {
        '@type': 'Offer',
        '@id': `${pageUrl}#offer-${planId}-${currency.toLowerCase()}`,
        name: planName,
        description: planSummary,
        url: planUrl,
        price: String(price.amount),
        priceCurrency: currency,
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: String(price.amount),
          priceCurrency: currency,
          billingDuration: 0,
          billingIncrement: 1,
          unitText: 'one-time purchase',
        },
        ...digitalMerchantPolicy(currency),
      },
    }
  })

  const product = {
    '@type': 'Product',
    '@id': `${pageUrl}#product`,
    name: title,
    description,
    url: pageUrl,
    image: imageUrl,
    sku: `magic-headshot-pricing-${currency.toLowerCase()}`,
    productID: 'magic-headshot-ai-headshot-credit-packs',
    category,
    inLanguage: locale,
    brand,
    hasVariant: planProducts.map((plan) => ({
      '@id': plan['@id'],
    })),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: currency,
      lowPrice: String(Math.min(...planIds.map((planId) => PLANS[planId].prices[currency].amount))),
      highPrice: String(Math.max(...planIds.map((planId) => PLANS[planId].prices[currency].amount))),
      offerCount: String(planIds.length),
      url: pageUrl,
      availability: 'https://schema.org/InStock',
      seller,
    },
  }
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      product,
      ...planProducts,
      merchantReturnPolicy(),
      digitalDeliveryPolicy(currency),
    ],
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
