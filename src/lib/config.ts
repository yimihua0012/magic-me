// App Configuration
export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'HeadshotAI',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Professional AI Headshot Generator',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  title: process.env.NEXT_PUBLIC_APP_TITLE || 'AI Headshot Generator - Professional Photos in 3 Minutes',
  keywords: process.env.NEXT_PUBLIC_APP_KEYWORDS || 'AI headshot, professional photos, LinkedIn photo, AI portrait, headshot generator',
}

// Pricing Configuration - imported from backend
import { PLANS } from '@backend/config/plans'

export const pricingConfig = {
  basic: {
    id: 'basic',
    name: PLANS.basic.name,
    price: PLANS.basic.price,
    styleCount: PLANS.basic.styleCount,
    resolution: PLANS.basic.resolution,
    resolutionLabel: 'HD',
    features: [
      `${PLANS.basic.styleCount} unique AI styles`,
      `${PLANS.basic.resolution} HD resolution`,
      'Unlimited downloads',
      'Commercial use rights',
      'Email support',
    ],
    notIncluded: [
      'Priority processing',
      'Custom style training',
    ],
  },
  pro: {
    id: 'pro',
    name: PLANS.pro.name,
    price: PLANS.pro.price,
    styleCount: PLANS.pro.styleCount,
    resolution: PLANS.pro.resolution,
    resolutionLabel: 'Ultra HD',
    features: [
      `${PLANS.pro.styleCount} unique AI styles`,
      `${PLANS.pro.resolution} Ultra HD resolution`,
      'Unlimited downloads',
      'Commercial use rights',
      'Priority processing',
      'Dedicated support',
    ],
    notIncluded: [
      'Custom style training',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: PLANS.enterprise.name,
    price: PLANS.enterprise.price,
    styleCount: PLANS.enterprise.styleCount,
    resolution: PLANS.enterprise.resolution,
    resolutionLabel: 'Custom',
    features: [
      'Unlimited styles',
      'Custom resolution',
      'Custom style training',
      'Team management',
      'Dedicated account manager',
      'SLA guarantee',
    ],
    notIncluded: [],
  },
} as const

export type PlanType = keyof typeof pricingConfig