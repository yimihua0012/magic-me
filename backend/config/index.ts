const normalizeUrl = (url: string) => url.replace(/\/+$/, '')

// Backend Configuration
export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  },
  lemon: {
    apiKey: process.env.LEMONSQUEEZY_API_KEY!,
    storeId: process.env.LEMONSQUEEZY_STORE_ID!,
    signingSecret: process.env.LEMONSQUEEZY_WEBHOOK_SECRET!,
  },
  app: {
    url: normalizeUrl(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    env: process.env.NODE_ENV || 'development',
  },
  email: {
    enabled: process.env.EMAIL_ENABLED === 'true',
    resendApiKey: process.env.RESEND_API_KEY!,
    resendInboundWebhookSecret: process.env.RESEND_INBOUND_WEBHOOK_SECRET!,
    fromEmail: 'support@mail.magic-headshot.com',
    fromName: process.env.NEXT_PUBLIC_APP_NAME || 'Magic-Headshot',
  },
} as const

export type Config = typeof config
