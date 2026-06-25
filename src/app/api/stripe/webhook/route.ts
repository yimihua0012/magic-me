import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { PLANS } from '@backend/config/plans'

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
    
    try {
      const supabase = await createClient()
      
      const planType = session.metadata?.plan_type as keyof typeof PLANS
      const plan = PLANS[planType] || PLANS.basic
      
      const { error } = await supabase.from('generations').insert({
        user_id: session.metadata?.user_id,
        status: 'pending',
        plan_type: planType,
        style_count: plan.styleCount,
        input_photos: [],
        output_photos: [],
        stripe_payment_id: session.payment_intent as string,
      })

      if (error) {
        console.error('Failed to save generation:', error)
      }
    } catch (error) {
      console.error('Webhook handler error:', error)
    }
  }

  return NextResponse.json({ received: true })
}
