import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, PLANS } from '@/lib/stripe'
import { PlanType } from '@/lib/stripe'
import { appConfig } from '@/lib/config'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { plan_type } = await request.json()

    if (!plan_type || !PLANS[plan_type as PlanType]) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
    }

    const plan = PLANS[plan_type as PlanType]

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${appConfig.name} ${plan.name}`,
              description: `${plan.credits} headshots, ${plan.validityDays} days validity, ${plan.resolution} resolution`,
            },
            unit_amount: Math.round(plan.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appConfig.url}/upload?payment=success`,
      cancel_url: `${appConfig.url}/pricing`,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        plan_type,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
