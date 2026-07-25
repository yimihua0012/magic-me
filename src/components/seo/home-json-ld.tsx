import { appConfig } from '@/lib/config'
import { getDefaultCurrencyForLocale } from '@/lib/currency'
import { localePath, type Locale } from '@/lib/i18n'
import { digitalMerchantPolicy } from '@/lib/merchant-structured-data'
import { BreadcrumbJsonLd } from '@/components/seo/page-json-ld'
import { PLANS } from '@backend/config/plans'

interface HomeJsonLdProps {
  locale: Locale
  title: string
  description: string
  keywords: string[]
}

export default function HomeJsonLd({ locale, title, description, keywords }: HomeJsonLdProps) {
  const siteUrl = appConfig.url.replace(/\/$/, '')
  const pagePath = localePath(locale)
  const pageUrl = `${siteUrl}${pagePath === '/' ? '' : pagePath}`
  const imageUrl = `${siteUrl}/home-pages/${encodeURIComponent('Ai headshot-linkedin-professional.jpg')}`
  const currency = getDefaultCurrencyForLocale(locale)
  const planPrices = Object.values(PLANS).map((plan) => plan.prices[currency].amount)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': `${pageUrl}#webapp`,
        name: appConfig.name,
        alternateName: title,
        description,
        url: pageUrl,
        image: imageUrl,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web',
        keywords: keywords.join(', '),
        inLanguage: locale,
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: currency,
          lowPrice: String(Math.min(...planPrices)),
          highPrice: String(Math.max(...planPrices)),
          offerCount: '3',
          ...digitalMerchantPolicy(currency),
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbJsonLd locale={locale} path="/" currentName={title} />
    </>
  )
}
