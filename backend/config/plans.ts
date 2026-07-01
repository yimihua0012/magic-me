export const PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic Plan',
    price: 19,
    prices: {
      USD: { amount: 19, paypalButtonId: 'SUZNHDUUW6K6E' },
      EUR: { amount: 16.6, paypalButtonId: 'ZLQHDULMNPZQG' },
      JPY: { amount: 2900, paypalButtonId: 'XWJHMGVYNW2YG' },
    },
    credits: 20,
    validityDays: 30,
    resolution: '1024x1024',
    priceId: 'prod_Ul3eCiU0C6mCCx',
  },
  pro: {
    id: 'pro',
    name: 'Pro Plan',
    price: 39,
    prices: {
      USD: { amount: 39, paypalButtonId: 'U8CQE5WXQEM4W' },
      EUR: { amount: 34.2, paypalButtonId: '8DUMEEUVJ3RR8' },
      JPY: { amount: 5900, paypalButtonId: 'YRS3BAHHXRV3Q' },
    },
    credits: 60,
    validityDays: 45,
    resolution: '1024x1024',
    priceId: 'prod_Ul3iGVN0rrs1NW',
  },
  premium: {
    id: 'premium',
    name: 'Premium Plan',
    price: 69,
    prices: {
      USD: { amount: 69, paypalButtonId: 'EWV87BFAXRZ88' },
      EUR: { amount: 60, paypalButtonId: 'GVM6XS6NL33MU' },
      JPY: { amount: 9900, paypalButtonId: 'DTRAEBPHC8PV2' },
    },
    credits: 120,
    validityDays: 60,
    resolution: '1024x1024',
    priceId: 'prod_Ul3l0JbDSnkjbS',
  },
} as const

export type PlanType = keyof typeof PLANS
