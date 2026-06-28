import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { CreditPackageService, isDailyLimitError } from '@backend/services'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata?.user_id
    const planType = session.metadata?.plan_type
    
    try {
      if (!userId || !planType) {
        console.error('Missing user_id or plan_type in session metadata')
        return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
      }

      if (!['basic', 'pro', 'premium'].includes(planType)) {
        console.error(`Invalid plan_type in session metadata: ${planType}`)
        return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
      }

      // 创建信用包而不是 generation
      await CreditPackageService.createPackage({
        user_id: userId,
        plan_type: planType as 'basic' | 'pro' | 'premium',
        stripe_payment_id: session.payment_intent as string,
        amount_paid: session.amount_total ? session.amount_total / 100 : undefined,
        currency: session.currency || 'USD',
      })

      console.log(`[Stripe Webhook] Created credit package for user: ${userId}, plan: ${planType}`)
    } catch (error) {
      if (isDailyLimitError(error)) {
        console.error('[Stripe Webhook] Daily credit package limit reached:', {
          userId,
          planType,
          limit: error.limit,
          used: error.used,
          resetAt: error.resetAt,
        })
        return NextResponse.json({ error: 'Daily credit package limit reached' }, { status: 429 })
      }

      console.error('[Stripe Webhook] Error creating credit package:', error)
      return NextResponse.json({ error: 'Failed to create credit package' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
