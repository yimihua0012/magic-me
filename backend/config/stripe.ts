import Stripe from 'stripe'
import { config } from './index'

export const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2024-04-10',
  typescript: true,
})

export { PLANS, type PlanType } from './plans'
export { config }
