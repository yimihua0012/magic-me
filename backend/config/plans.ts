export const PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic Plan',
    price: 19,
    credits: 20,
    validityDays: 30,
    resolution: '1024x1024',
    priceId: 'prod_Ul3eCiU0C6mCCx',
  },
  pro: {
    id: 'pro',
    name: 'Pro Plan',
    price: 39,
    credits: 60,
    validityDays: 45,
    resolution: '1024x1024',
    priceId: 'prod_Ul3iGVN0rrs1NW',
  },
  premium: {
    id: 'premium',
    name: 'Premium Plan',
    price: 69,
    credits: 120,
    validityDays: 60,
    resolution: '1024x1024',
    priceId: 'prod_Ul3l0JbDSnkjbS',
  },
} as const

export type PlanType = keyof typeof PLANS
