import type { Locale } from './i18n'

export const CURRENCIES = ['USD', 'EUR', 'JPY'] as const

export type Currency = (typeof CURRENCIES)[number]

export const DEFAULT_CURRENCY_BY_LOCALE: Record<Locale, Currency> = {
  en: 'USD',
  es: 'USD',
  fr: 'EUR',
  de: 'EUR',
  ja: 'JPY',
}

export function isCurrency(value: string): value is Currency {
  return (CURRENCIES as readonly string[]).includes(value)
}

export function getDefaultCurrencyForLocale(locale: Locale): Currency {
  return DEFAULT_CURRENCY_BY_LOCALE[locale]
}

export const CURRENCY_FORMAT_LOCALE: Record<Currency, string> = {
  USD: 'en-US',
  EUR: 'en-US',
  JPY: 'en-US',
}

export function formatCurrency(amount: number, currency: Currency) {
  if (currency === 'JPY') {
    const formattedAmount = new Intl.NumberFormat(CURRENCY_FORMAT_LOCALE.JPY, {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount)
    return `JPY ￥${formattedAmount}`
  }

  return new Intl.NumberFormat(CURRENCY_FORMAT_LOCALE[currency], {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
