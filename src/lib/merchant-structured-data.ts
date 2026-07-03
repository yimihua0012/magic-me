import { appConfig } from '@/lib/config'

const siteUrl = appConfig.url.replace(/\/$/, '')

export function digitalMerchantPolicy(currency = 'USD') {
  return {
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      '@id': `${siteUrl}/#merchant-return-policy`,
      applicableCountry: 'US',
      returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
      merchantReturnDays: 0,
    },
    shippingDetails: {
      '@type': 'OfferShippingDetails',
      '@id': `${siteUrl}/#digital-delivery`,
      shippingDestination: {
        '@type': 'DefinedRegion',
        addressCountry: 'US',
      },
      shippingRate: {
        '@type': 'MonetaryAmount',
        value: '0',
        currency,
      },
      deliveryTime: {
        '@type': 'ShippingDeliveryTime',
        handlingTime: {
          '@type': 'QuantitativeValue',
          minValue: 0,
          maxValue: 0,
          unitCode: 'DAY',
        },
        transitTime: {
          '@type': 'QuantitativeValue',
          minValue: 0,
          maxValue: 0,
          unitCode: 'DAY',
        },
      },
    },
  }
}
