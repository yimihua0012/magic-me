export const PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 19,
    credits: 20, // 总次数
    validityDays: 30, // 有效期（从第一次生成开始）
    resolution: '1024x1024',
    priceId: 'prod_Ul3eCiU0C6mCCx', // Set in Stripe dashboard
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 39,
    credits: 60, // 总次数
    validityDays: 45, // 有效期（从第一次生成开始）
    resolution: '1024x1024',
    priceId: 'prod_Ul3iGVN0rrs1NW',
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 69,
    credits: 120, // 总次数
    validityDays: 60, // 有效期（从第一次生成开始）
    resolution: '1024x1024',
    priceId: 'prod_Ul3l0JbDSnkjbS',
  },
} as const

export type PlanType = keyof typeof PLANS
