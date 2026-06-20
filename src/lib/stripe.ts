import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

export const PLANS = {
  basic: {
    name: 'Basic',
    price: 9.90,
    styleCount: 30,
    resolution: '1024x1024',
  },
  pro: {
    name: 'Pro',
    price: 19.90,
    styleCount: 100,
    resolution: '2048x2048',
  },
} as const

export type PlanType = keyof typeof PLANS
