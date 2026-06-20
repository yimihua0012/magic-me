import Stripe from 'stripe'
import { config } from './index'

export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2024-04-10',
  typescript: true,
})

export const PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 9.90,
    styleCount: 30,
    resolution: '1024x1024',
    priceId: null, // Set in Stripe dashboard
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 19.90,
    styleCount: 100,
    resolution: '2048x2048',
    priceId: null,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    styleCount: 999,
    resolution: 'Custom',
    priceId: null,
  },
} as const

export type PlanType = keyof typeof PLANS

export { config }
