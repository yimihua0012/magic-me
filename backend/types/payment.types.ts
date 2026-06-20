// Payment Types
export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: PaymentStatus
  customer_id?: string
  metadata?: Record<string, string>
}

export type PaymentStatus = 'succeeded' | 'pending' | 'failed' | 'cancelled' | 'refunded'

export interface CheckoutSession {
  id: string
  url: string
  payment_status: PaymentStatus
  customer_email?: string
  amount_total?: number
  currency?: string
  metadata?: Record<string, string>
}

export interface WebhookEvent {
  type: string
  data: {
    object: Record<string, unknown>
  }
}

export interface StripeCustomer {
  id: string
  email?: string
  name?: string
}
