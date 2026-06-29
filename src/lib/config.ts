// App Configuration
const normalizeUrl = (url: string) => url.replace(/\/+$/, '')
const defaultDescription =
  'Create realistic AI headshots for LinkedIn, resumes, and business profiles in minutes with high-likeness portraits and one-time credit packs'
const defaultKeywords =
  'Magic-Headshot, AI headshots for LinkedIn, high likeness AI portraits, fast headshot generation'
const envDescription = process.env.NEXT_PUBLIC_APP_DESCRIPTION?.trim()
const envKeywords = process.env.NEXT_PUBLIC_APP_KEYWORDS?.trim()

export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'Magic-Headshot',
  description:
    envDescription && envDescription.length >= 80 && envDescription.length <= 160
      ? envDescription
      : defaultDescription,
  url: normalizeUrl(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: process.env.NEXT_PUBLIC_APP_TITLE || 'AI Headshot Generator for LinkedIn - Fast, High-Likeness Portraits',
  keywords: envKeywords && envKeywords.length <= 200 ? envKeywords : defaultKeywords,
}

// Pricing Configuration - imported from backend
import { PLANS } from '@backend/config/plans'

export const pricingConfig = {
  basic: {
    id: 'basic',
    name: PLANS.basic.name,
    price: PLANS.basic.price,
    credits: PLANS.basic.credits,
    validityDays: PLANS.basic.validityDays,
    resolution: PLANS.basic.resolution,
    resolutionLabel: 'resolution',
    features: [
      `${PLANS.basic.credits} picture AI-generated headshots`,
      `${PLANS.basic.validityDays} days validity`,
      `1024x1024 resolution`,
      'Unlimited downloads',
      'Commercial use rights',
      'Email support',
    ],
    notIncluded: [
      'Priority processing',
    ],
    validityNote: 'Validity starts from your first generation, not purchase date',
  },
  pro: {
    id: 'pro',
    name: PLANS.pro.name,
    price: PLANS.pro.price,
    credits: PLANS.pro.credits,
    validityDays: PLANS.pro.validityDays,
    resolution: PLANS.pro.resolution,
    resolutionLabel: 'HD resolution',
    features: [
      `${PLANS.pro.credits} picture AI-generated headshots`,
      `${PLANS.pro.validityDays} days validity`,
      `1024x1024 HD resolution`,
      'Unlimited downloads',
      'Commercial use rights',
      'Priority processing',
      'Email support',
    ],
    notIncluded: [
      'Dedicated support',
    ],
    validityNote: 'Validity starts from your first generation, not purchase date',
  },
  premium: {
    id: 'premium',
    name: PLANS.premium.name,
    price: PLANS.premium.price,
    credits: PLANS.premium.credits,
    validityDays: PLANS.premium.validityDays,
    resolution: PLANS.premium.resolution,
    resolutionLabel: 'Ultra HD resolution',
    features: [
      `${PLANS.premium.credits} picture AI-generated headshots`,
      `${PLANS.premium.validityDays} days validity`,
      `1024x1024 Ultra HD resolution`,
      'Unlimited downloads',
      'Commercial use rights',
      'Priority processing',
      'Email support',
      'Dedicated support',
    ],
    notIncluded: [],
    validityNote: 'Validity starts from your first generation, not purchase date',
  },
} as const

export type PlanType = keyof typeof pricingConfig

// FAQ Configuration for Pricing Page
export const pricingFAQ = [
  {
    question: 'What happens if I don\'t use all my generations within the time limit?',
    answer: 'Unused credits expire and become void after the validity period. You will receive an email reminder 3 days before expiration.',
  },
  {
    question: 'Can I extend the validity period?',
    answer: 'Yes, please contact our support team via email for extension options. Extension fees may apply.',
  },
  {
    question: 'When does the validity period start?',
    answer: 'The validity period starts from your first generation, not from the purchase date. Your credits remain safe until you begin using them.',
  },
] as const
