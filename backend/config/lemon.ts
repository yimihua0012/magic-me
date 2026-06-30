// Lemon Squeezy Configuration
export const lemonConfig = {
  apiKey: process.env.LEMONSQUEEZY_API_KEY!,
  storeId: process.env.LEMONSQUEEZY_STORE_ID!,
  signingSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET!,
  webhookSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET!,
} as const

export type LemonConfig = typeof lemonConfig