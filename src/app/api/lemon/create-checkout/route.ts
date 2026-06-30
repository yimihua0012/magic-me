import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PLANS } from '@backend/config/plans'
import { PlanType } from '@backend/config/plans'
import { appConfig } from '@/lib/config'
import { DailyLimitService, isDailyLimitError } from '@backend/services'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Lemon Squeezy API base URL
const LEMON_API_URL = 'https://api.lemonsqueezy.com/v1'

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
    await DailyLimitService.enforceCreditPackage(user.id)

    // Create checkout using Lemon Squeezy API (20s timeout)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 20000)

    const response = await fetch(`${LEMON_API_URL}/checkouts`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              custom: {
                user_id: user.id,
                plan_type,
              },
            },
            checkout_options: {
              redirect_url: `${appConfig.url}/upload?payment=success`,
            },
            product_options: {
              name: `${appConfig.name} ${plan.name}`,
              description: `${plan.credits} headshots, ${plan.validityDays} days validity, ${plan.resolution} resolution`,
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: process.env.LEMONSQUEEZY_STORE_ID,
              },
            },
            variant: {
              data: {
                type: 'variants',
                id: plan.priceId, // Use variant ID from Lemon Squeezy dashboard
              },
            },
          },
        },
      }),
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Lemon Squeezy checkout error:', errorData)
      return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
    }

    const checkoutData = await response.json()
    const checkoutUrl = checkoutData.data.attributes.url

    return NextResponse.json({ url: checkoutUrl })
  } catch (error) {
    if (isDailyLimitError(error)) {
      return NextResponse.json(
        {
          error: 'Daily credit package limit reached. Please try again tomorrow.',
          limit: error.limit,
          used: error.used,
          resetAt: error.resetAt,
        },
        { status: 429 }
      )
    }

    console.error('Lemon Squeezy checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
