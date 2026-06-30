import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'
import { CreditPackageService, isDailyLimitError } from '@backend/services'
import { PLANS } from '@backend/config/plans'

export const dynamic = 'force-dynamic'

// Lemon Squeezy variant_id 到 plan 的映射
// 需要在 Lemon Squeezy 后台配置产品时设置对应的 variant ID
const VARIANT_TO_PLAN: Record<string, 'basic' | 'pro' | 'premium'> = {
  // TODO: 替换为实际的 Lemon Squeezy variant IDs
  // 'variant_basic_123': 'basic',
  // 'variant_pro_456': 'pro',
  // 'variant_premium_789': 'premium',
}

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
      const { product_name, total } = event.data.attributes
      const userId = event.meta.custom_data?.user_id
      const orderId = event.data.id
      const variantId = event.data.attributes?.variant_id?.toString()

      // 优先使用 variant_id 确定套餐类型
      let planType: 'basic' | 'pro' | 'premium' = 'basic'

      if (variantId && VARIANT_TO_PLAN[variantId]) {
        planType = VARIANT_TO_PLAN[variantId]
        console.log(`[Lemon Webhook] Plan determined by variant_id: ${variantId} -> ${planType}`)
      } else if (variantId) {
        // 如果 variant_id 没有配置，尝试从 product_name 推断
        console.warn(`[Lemon Webhook] Unknown variant_id: ${variantId}, falling back to product_name`)
        const productNameLower = product_name.toLowerCase()
        if (productNameLower.includes('premium')) {
          planType = 'premium'
        } else if (productNameLower.includes('pro')) {
          planType = 'pro'
        }
      } else {
        // 完全没有 variant_id，使用 product_name
        const productNameLower = product_name.toLowerCase()
        if (productNameLower.includes('premium')) {
          planType = 'premium'
        } else if (productNameLower.includes('pro')) {
          planType = 'pro'
        }
        console.warn(`[Lemon Webhook] No variant_id, used product_name: ${product_name} -> ${planType}`)
      }

      if (!userId) {
        console.error('Missing user_id in custom_data')
        return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
      }

      try {
        // 创建信用包而不是 generation
        await CreditPackageService.createPackage({
          user_id: userId,
          plan_type: planType,
          lemon_order_id: orderId.toString(),
          amount_paid: total || undefined,
          currency: 'USD',
        })

        console.log(`[Lemon Webhook] Created credit package for user: ${userId}, plan: ${planType}`)
      } catch (dbError) {
        if (isDailyLimitError(dbError)) {
          console.error('[Lemon Webhook] Daily credit package limit reached:', {
            userId,
            planType,
            limit: dbError.limit,
            used: dbError.used,
            resetAt: dbError.resetAt,
          })
          return NextResponse.json({ error: 'Daily credit package limit reached' }, { status: 429 })
        }

        console.error('[Lemon Webhook] Error creating credit package:', dbError)
        return NextResponse.json({ error: 'Failed to create credit package' }, { status: 500 })
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Lemon Webhook] Handler error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
