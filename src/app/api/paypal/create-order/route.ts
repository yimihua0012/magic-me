import { NextResponse } from 'next/server'
import { getBearerUser } from '@/lib/auth/server'
import { createPayPalOrder, getPublicPayPalClientId, parsePlanType } from '@/lib/paypal'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const user = await getBearerUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!getPublicPayPalClientId()) {
      return NextResponse.json({ error: 'PayPal is not configured' }, { status: 503 })
    }

    const { plan_type } = await request.json()
    const planType = parsePlanType(plan_type)
    if (!planType) {
      return NextResponse.json({ error: 'Invalid plan type' }, { status: 400 })
    }

    const order = await createPayPalOrder(user.id, planType)
    return NextResponse.json({ orderID: order.id })
  } catch (error) {
    console.error('[PayPal] Create order error:', error)
    return NextResponse.json({ error: 'Failed to create PayPal order' }, { status: 500 })
  }
}
