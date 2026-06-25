import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'
import { PLANS } from '@backend/config/plans'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const rawBody = await request.text()
    const headersList = await headers()
    const signature = headersList.get('x-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 401 })
    }

    const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)
    const digest = hmac.update(rawBody).digest('hex')

    if (signature !== digest) {
      console.error('Webhook signature verification failed')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody)
    const eventName = event.meta.event_name

    if (eventName === 'order_created') {
      const { product_name } = event.data.attributes
      const userId = event.meta.custom_data?.user_id

      const planType = product_name.toLowerCase().includes('pro') ? 'pro' : 'basic'
      const plan = PLANS[planType]
      const orderId = event.data.id

      try {
        const supabase = await createClient()

        const { error } = await supabase.from('generations').insert({
          user_id: userId,
          status: 'pending',
          plan_type: planType,
          style_count: plan.styleCount,
          input_photos: [],
          output_photos: [],
          lemon_order_id: orderId.toString(),
        })

        if (error) {
          console.error('Failed to save generation:', error)
          return NextResponse.json({ error: 'Failed to save generation' }, { status: 500 })
        }

        console.log(`Order created for user ${userId}, plan: ${planType}, styles: ${plan.styleCount}`)
      } catch (dbError) {
        console.error('Database error:', dbError)
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}