import { stripe, PLANS, PlanType } from '@backend/config/stripe'
import { config } from '@backend/config'
import { userRepository } from '@backend/db/repositories'
import { CheckoutSession, StripeCustomer } from '@backend/types'

export class PaymentService {
  async createCheckoutSession(
    userId: string,
    planType: PlanType,
    generationId?: string
  ): Promise<CheckoutSession> {
    const user = await userRepository.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const plan = PLANS[planType]
    if (!plan) {
      throw new Error('Invalid plan type')
    }

    let customerId = user.stripe_customer_id

    // Create Stripe customer if not exists
    if (!customerId) {
      const customer = await this.createCustomer(user.email, user.full_name)
      customerId = customer.id
      await userRepository.updateStripeCustomerId(userId, customerId)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `HeadshotAI ${plan.name}`,
              description: `${plan.styleCount} styles, ${plan.resolution} resolution`,
              images: [`${config.app.url}/og-image.png`],
            },
            unit_amount: Math.round(plan.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${config.app.url}/generate/${generationId || userId}?success=true`,
      cancel_url: `${config.app.url}/pricing?cancelled=true`,
      customer_email: customerId ? undefined : user.email,
      metadata: {
        user_id: userId,
        plan_type: planType,
        generation_id: generationId || '',
      },
    })

    return {
      id: session.id,
      url: session.url!,
      payment_status: session.payment_status as any,
      customer_email: session.customer_email || undefined,
      amount_total: session.amount_total ? session.amount_total / 100 : undefined,
      currency: session.currency || undefined,
      metadata: session.metadata as Record<string, string>,
    }
  }

  async createCustomer(email: string, name?: string): Promise<StripeCustomer> {
    const customer = await stripe.customers.create({
      email,
      name: name || undefined,
      metadata: {
        source: 'headshotai',
      },
    })

    return {
      id: customer.id,
      email: customer.email,
      name: customer.name || undefined,
    }
  }

  async getCustomer(customerId: string): Promise<StripeCustomer | null> {
    try {
      const customer = await stripe.customers.retrieve(customerId)
      if (customer.deleted) return null

      return {
        id: customer.id,
        email: customer.email || '',
        name: customer.name || undefined,
      }
    } catch {
      return null
    }
  }

  async constructWebhookEvent(payload: string, signature: string): Promise<any> {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripe.webhookSecret
    )
  }

  async handleCheckoutCompleted(session: any): Promise<void> {
    const userId = session.metadata?.user_id
    const planType = session.metadata?.plan_type as PlanType
    const generationId = session.metadata?.generation_id

    if (!userId) {
      console.error('No user_id in checkout session metadata')
      return
    }

    // Update user plan type
    if (planType) {
      await userRepository.update(userId, { plan_type: planType })
    }

    // In production, trigger generation here
    // await generationService.startGeneration(generationId)
  }

  async createCustomerPortalSession(customerId: string): Promise<string> {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${config.app.url}/dashboard`,
    })

    return session.url
  }

  async refundPayment(paymentIntentId: string): Promise<void> {
    await stripe.refunds.create({
      payment_intent: paymentIntentId,
    })
  }
}

export const paymentService = new PaymentService()
