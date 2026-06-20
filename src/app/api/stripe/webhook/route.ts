import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

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
      
      const generationId = `${session.metadata?.user_id}-${Date.now()}`
      
      const { error } = await supabase.from('generations').insert({
        user_id: session.metadata?.user_id,
        status: 'completed',
        plan_type: session.metadata?.plan_type,
        style_count: session.metadata?.plan_type === 'pro' ? 100 : 30,
        input_photos: [],
        output_photos: [],
        stripe_payment_id: session.payment_intent as string,
        completed_at: new Date().toISOString(),
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
