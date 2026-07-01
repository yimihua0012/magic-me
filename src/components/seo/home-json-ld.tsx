import { appConfig } from '@/lib/config'
import { getDefaultCurrencyForLocale } from '@/lib/currency'
import { localePath, type Locale } from '@/lib/i18n'

type FaqItem = {
  name: string
  text: string
}

interface HomeJsonLdProps {
  locale: Locale
  title: string
  description: string
  keywords: string[]
  faq: FaqItem[]
}

export default function HomeJsonLd({ locale, title, description, keywords, faq }: HomeJsonLdProps) {
  const siteUrl = appConfig.url.replace(/\/$/, '')
  const pagePath = localePath(locale)
  const pageUrl = `${siteUrl}${pagePath === '/' ? '' : pagePath}`
  const imageUrl = `${siteUrl}/home-pages/${encodeURIComponent('Ai headshot-linkedin-professional.jpg')}`
  const currency = getDefaultCurrencyForLocale(locale)

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
          lowPrice: currency === 'JPY' ? '2900' : currency === 'EUR' ? '16.60' : '19',
          offerCount: '3',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '10000',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        url: pageUrl,
        inLanguage: locale,
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.name,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.text,
          },
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
