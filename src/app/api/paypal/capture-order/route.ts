import { NextResponse } from 'next/server'
import { CreditPackageService } from '@backend/services'
import { getBearerUser } from '@/lib/auth/server'
import {
  capturePayPalOrder,
  expectedPayPalAmount,
  parsePayPalCustomId,
} from '@/lib/paypal'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const user = await getBearerUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { orderID } = await request.json()
    if (typeof orderID !== 'string' || !orderID.trim()) {
      return NextResponse.json({ error: 'PayPal order ID is required' }, { status: 400 })
    }

    const capture = await capturePayPalOrder(orderID.trim())
    if (capture.status !== 'COMPLETED') {
      console.warn(`[PayPal] Order ${capture.id} captured with unexpected status: ${capture.status}`)
      return NextResponse.json({ error: 'PayPal payment was not completed' }, { status: 400 })
    }

    const purchaseUnit = capture.purchase_units?.[0]
    const custom = parsePayPalCustomId(purchaseUnit?.custom_id)
    if (!custom || custom.userId !== user.id) {
      console.warn(`[PayPal] Order ${capture.id} custom_id mismatch`, {
        customId: purchaseUnit?.custom_id,
        userId: user.id,
      })
      return NextResponse.json({ error: 'PayPal order does not match this user' }, { status: 403 })
    }

    const completedCapture = purchaseUnit?.payments?.captures?.find((item) => item.status === 'COMPLETED')
    const amount = completedCapture?.amount
    const expectedAmount = expectedPayPalAmount(custom.planType)

    if (!completedCapture || amount?.currency_code !== 'USD' || amount?.value !== expectedAmount) {
      console.warn(`[PayPal] Order ${capture.id} amount mismatch`, {
        amount,
        expectedAmount,
        planType: custom.planType,
      })
      return NextResponse.json({ error: 'PayPal payment amount mismatch' }, { status: 400 })
    }

    const creditPackage = await CreditPackageService.createPackage({
      user_id: user.id,
      plan_type: custom.planType,
      paypal_order_id: capture.id,
      amount_paid: Number(amount.value),
      currency: amount.currency_code,
    })

    console.log(`[PayPal] Created credit package ${creditPackage.id} for order ${capture.id}`)

    return NextResponse.json({
      ok: true,
      packageId: creditPackage.id,
      planType: creditPackage.plan_type,
      credits: creditPackage.total_credits,
    })
  } catch (error) {
    console.error('[PayPal] Capture order error:', error)
    return NextResponse.json({ error: 'Failed to capture PayPal order' }, { status: 500 })
  }
}
