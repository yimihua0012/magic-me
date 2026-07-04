import { appConfig } from '@/lib/config'

const siteUrl = appConfig.url.replace(/\/$/, '')

export function merchantReturnPolicyId() {
  return `${siteUrl}/#merchant-return-policy`
}

export function digitalDeliveryPolicyId(currency = 'USD') {
  return `${siteUrl}/#digital-delivery-${currency.toLowerCase()}`
}

export function merchantReturnPolicy() {
  return {
    '@type': 'MerchantReturnPolicy',
    '@id': merchantReturnPolicyId(),
    applicableCountry: 'US',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 30,
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/FreeReturn',
  }
}

export function digitalDeliveryPolicy(currency = 'USD') {
  return {
    '@type': 'OfferShippingDetails',
    '@id': digitalDeliveryPolicyId(currency),
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
  }
}

export function digitalMerchantPolicy(currency = 'USD') {
  return {
    hasMerchantReturnPolicy: {
      '@id': merchantReturnPolicyId(),
    },
    shippingDetails: {
      '@id': digitalDeliveryPolicyId(currency),
    },
  }
}
