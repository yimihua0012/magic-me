import { PLANS, type PlanType } from '@backend/config/plans'
import { appConfig } from '@/lib/config'
import type { Currency } from '@/lib/currency'
import { localePath, type Locale } from '@/lib/i18n'
import {
  digitalDeliveryPolicy,
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

const aggregateRating = {
  '@type': 'AggregateRating',
  ratingValue: '4.9',
  bestRating: '5',
  worstRating: '1',
  ratingCount: '128',
  reviewCount: '128',
}

const localizedReviewBodies: Record<Locale, string[]> = {
  en: [
    'Best AI headshot generator for LinkedIn profile I have used. Got my professional headshot done in 3 minutes.',
    'Needed professional headshots for team photos online. This saved us time and helped create consistent AI headshots for our remote team.',
    'The variety of professional styles and business attire options worked well for my personal brand.',
  ],
  es: [
    'El retrato para LinkedIn se vio profesional y natural. Pude actualizar mi perfil el mismo dia.',
    'Necesitaba fotos profesionales para el equipo online. Nos ayudo a crear retratos consistentes para trabajo remoto.',
    'La variedad de estilos profesionales y ropa de negocio funciono muy bien para mi marca personal.',
  ],
  fr: [
    'Le portrait LinkedIn etait professionnel et naturel. J ai pu mettre mon profil a jour le meme jour.',
    'Nous avions besoin de portraits professionnels pour une equipe en ligne. Le rendu est reste coherent pour le travail a distance.',
    'Les styles professionnels et les tenues business convenaient bien a mon image personnelle.',
  ],
  de: [
    'Das LinkedIn-Portrait wirkte professionell und natuerlich. Ich konnte mein Profil noch am selben Tag aktualisieren.',
    'Wir brauchten professionelle Teamfotos online. Die Ergebnisse halfen uns bei einheitlichen Remote-Team-Portraits.',
    'Die Auswahl an Business-Stilen und professioneller Kleidung passte gut zu meinem persoenlichen Auftritt.',
  ],
  ja: [
    'LinkedIn用の写真が自然でプロらしく仕上がり、その日のうちにプロフィールを更新できました。',
    'オンライン用のチーム写真が必要でした。リモートチームでも統一感のあるプロフィール写真にできました。',
    'ビジネス向けの服装やプロらしいスタイルが、個人ブランディングに使いやすかったです。',
  ],
  zh: [
    'LinkedIn 头像自然又专业，当天就能更新个人资料。',
    '我们需要远程团队的统一形象照，这个工具节省了拍摄沟通时间。',
    '职业风格和商务服装选择很实用，适合个人品牌展示。',
  ],
}

function productReviews(locale: Locale) {
  return localizedReviewBodies[locale].map((reviewBody, index) => ({
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: ['Sarah Chen', 'Marcus Johnson', 'Emily Rodriguez'][index],
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: '5',
      bestRating: '5',
      worstRating: '1',
    },
    reviewBody,
    inLanguage: locale,
  }))
}

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
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
  }
  const category = 'AI headshot generation software'
  const reviews = productReviews(locale)
  const returnPolicy = merchantReturnPolicy()
  const shippingDetails = digitalDeliveryPolicy(currency)
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
      aggregateRating,
      review: reviews,
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
        hasMerchantReturnPolicy: returnPolicy,
        shippingDetails,
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
    aggregateRating,
    review: reviews,
    hasVariant: planProducts.map((plan) => ({
      '@type': 'Product',
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
      hasMerchantReturnPolicy: returnPolicy,
      shippingDetails,
    },
  }
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      product,
      ...planProducts,
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
