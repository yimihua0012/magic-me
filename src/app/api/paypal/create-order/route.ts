import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { createPayPalOrder, getPublicPayPalClientId, parsePlanType } from '@/lib/paypal'

export const dynamic = 'force-dynamic'

async function getCurrentUser(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  return error ? null : user
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request)
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
