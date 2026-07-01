import { PLANS, PlanType } from '@backend/config/plans'
import { type Currency, isCurrency } from '@/lib/currency'

const PAYPAL_API_BASE =
  process.env.PAYPAL_ENVIRONMENT === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

type PayPalAccessTokenResponse = {
  access_token: string
  token_type: string
  expires_in: number
}

export type PayPalOrderResponse = {
  id: string
  status: string
  links?: { href: string; rel: string; method: string }[]
}

export type PayPalCaptureResponse = {
  id: string
  status: string
  purchase_units?: {
    custom_id?: string
    invoice_id?: string
    payments?: {
      captures?: {
        id: string
        status: string
        amount?: {
          currency_code: string
          value: string
        }
      }[]
    }
  }[]
}

export function getPublicPayPalClientId() {
  return process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''
}

export function parsePlanType(value: unknown): PlanType | null {
  return typeof value === 'string' && value in PLANS ? (value as PlanType) : null
}

export function expectedPayPalCurrencyAmount(planType: PlanType, currency: Currency) {
  const amount = PLANS[planType].prices[currency].amount
  return currency === 'JPY' ? String(amount) : amount.toFixed(2)
}

export function hasPayPalButtonForCurrency(planType: PlanType, currency: Currency) {
  return Boolean(PLANS[planType].prices[currency].paypalButtonId)
}

export function parsePayPalCurrency(value: unknown): Currency | null {
  return typeof value === 'string' && isCurrency(value) ? value : null
}

export function parsePayPalCustomId(customId: string | undefined) {
  if (!customId) {
    return null
  }

  const [userId, planType, currency = 'USD'] = customId.split(':')
  const parsedPlanType = parsePlanType(planType)
  const parsedCurrency = parsePayPalCurrency(currency)

  if (!userId || !parsedPlanType || !parsedCurrency) {
    return null
  }

  return {
    userId,
    planType: parsedPlanType,
    currency: parsedCurrency,
  }
}

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are not configured')
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to get PayPal access token: ${response.status} ${errorText}`)
  }

  const data = (await response.json()) as PayPalAccessTokenResponse
  return data.access_token
}

export async function createPayPalOrder(userId: string, planType: PlanType, currency: Currency) {
  const plan = PLANS[planType]
  const accessToken = await getPayPalAccessToken()

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          custom_id: `${userId}:${planType}:${currency}`,
          description: `${plan.name} - ${plan.credits} AI headshots`,
          amount: {
            currency_code: currency,
            value: expectedPayPalCurrencyAmount(planType, currency),
          },
        },
      ],
      application_context: {
        brand_name: process.env.NEXT_PUBLIC_APP_NAME || 'Magic-Headshot',
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING',
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to create PayPal order: ${response.status} ${errorText}`)
  }

  return (await response.json()) as PayPalOrderResponse
}

export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken()

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Failed to capture PayPal order: ${response.status} ${errorText}`)
  }

  return (await response.json()) as PayPalCaptureResponse
}
