export const PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 12.90,
    styleCount: 12,
    resolution: '1024x1024',
    priceId: 'prod_Ul3eCiU0C6mCCx', // Set in Stripe dashboard
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 28.90,
    styleCount: 36,
    resolution: '1024x1024',
    priceId: 'prod_Ul3iGVN0rrs1NW',
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    styleCount: 100,
    resolution: 'Custom',
    priceId: 'prod_Ul3l0JbDSnkjbS',
  },
} as const

export type PlanType = keyof typeof PLANS
