export const PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic Plan',
    price: 3.9,
    prices: {
      USD: { amount: 3.9, paypalButtonId: 'SUZNHDUUW6K6E' },
      EUR: { amount: 3.5, paypalButtonId: 'ZLQHDULMNPZQG' },
      JPY: { amount: 590, paypalButtonId: 'XWJHMGVYNW2YG' },
    },
    credits: 3,
    validityDays: 30,
    resolution: '1024x1024',
    priceId: 'prod_Ul3eCiU0C6mCCx',
  },
  pro: {
    id: 'pro',
    name: 'Pro Plan',
    price: 9.9,
    prices: {
      USD: { amount: 9.9, paypalButtonId: 'U8CQE5WXQEM4W' },
      EUR: { amount: 8.9, paypalButtonId: '8DUMEEUVJ3RR8' },
      JPY: { amount: 1500, paypalButtonId: 'YRS3BAHHXRV3Q' },
    },
    credits: 10,
    validityDays: 45,
    resolution: '1024x1024',
    priceId: 'prod_Ul3iGVN0rrs1NW',
  },
  premium: {
    id: 'premium',
    name: 'Premium Plan',
    price: 24.9,
    prices: {
      USD: { amount: 24.9, paypalButtonId: 'EWV87BFAXRZ88' },
      EUR: { amount: 22.5, paypalButtonId: 'GVM6XS6NL33MU' },
      JPY: { amount: 3800, paypalButtonId: 'DTRAEBPHC8PV2' },
    },
    credits: 30,
    validityDays: 60,
    resolution: '1024x1024',
    priceId: 'prod_Ul3l0JbDSnkjbS',
  },
} as const

export type PlanType = keyof typeof PLANS
