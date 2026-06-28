import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Card from '@/components/ui/card'
import PlanPaymentCta from '@/components/ui/plan-payment-cta'
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react'
import { pricingConfig, pricingFAQ, appConfig } from '@/lib/config'
import { PLANS } from '@backend/config/plans'

// PayPal button configuration for each plan
const PAYPAL_BUTTONS = {
  basic: {
    id: 'SUZNHDUUW6K6E',
  },
  pro: {
    id: 'U8CQE5WXQEM4W',
  },
  premium: {
    id: 'EWV87BFAXRZ88',
  },
} as const

const PAYPAL_LABELS = {
  basic: 'Choose Basic Plan',
  pro: 'Choose Pro Plan',
  premium: 'Choose Premium Plan',
} as const

const plans = Object.values(pricingConfig).map((plan) => ({
  ...plan,
  icon: plan.id === 'basic' ? <Sparkles className="w-5 h-5" /> : 
        plan.id === 'pro' ? <Zap className="w-5 h-5" /> : 
        <Crown className="w-5 h-5" />,
  highlighted: plan.id === 'pro',
}))

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="pt-20 pb-10 sm:pt-24 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2 sm:mb-4">
              AI Headshot Generator Pricing for LinkedIn and Resume Photos
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto">
              One-time pricing for realistic, high-likeness AI headshots for LinkedIn profiles, resumes, business portraits, and team pages.
            </p>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2 rounded-xl border border-slate-200 bg-white p-2 text-center text-xs font-medium text-slate-600 sm:hidden">
            <span>{PLANS.basic.credits} shots</span>
            <span>{PLANS.pro.credits} shots</span>
            <span>{PLANS.premium.credits} shots</span>
          </div>

          <div id="plans" className="scroll-mt-24 grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => {
              const paypal = PAYPAL_BUTTONS[plan.id as keyof typeof PAYPAL_BUTTONS]
              return (
              <Card 
                key={plan.id}
                className={`relative p-4 sm:p-8 ${
                  plan.highlighted 
                    ? 'border-2 border-primary-500 shadow-lg lg:scale-105 lg:shadow-xl' 
                    : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span className="bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-4 flex items-start justify-between gap-3 text-left sm:mb-6 sm:block sm:text-center">
                  <div className={`hidden w-12 h-12 mx-auto rounded-xl sm:flex items-center justify-center mb-4 ${
                    plan.highlighted 
                      ? 'bg-primary-100 text-primary-600' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">{plan.name}</h2>
                    <p className="text-xs font-medium text-primary-600 sm:hidden">{plan.credits} headshots</p>
                  </div>
                  <div className="flex shrink-0 items-baseline justify-center gap-1 sm:justify-center">
                    <span className="text-3xl sm:text-4xl font-bold text-slate-900">${plan.price}</span>
                    <span className="hidden text-slate-500 text-sm sm:inline">/one-time</span>
                  </div>
                </div>

                <div className="space-y-2 mb-5 sm:space-y-3 sm:mb-8">
                  {plan.features.map((feature, i) => {
                    const isHighlight = feature.includes('headshots') || feature.includes('days validity')
                    return (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                        <span className={`text-sm ${isHighlight ? 'text-primary-600 font-semibold' : 'text-slate-600'}`}>{feature}</span>
                      </div>
                    )
                  })}
                  {plan.notIncluded.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-400">{feature}</span>
                    </div>
                  )).slice(0, 1)}
                </div>

                <PlanPaymentCta
                  buttonId={paypal.id}
                  label={PAYPAL_LABELS[plan.id as keyof typeof PAYPAL_LABELS]}
                  planType={plan.id as keyof typeof PAYPAL_LABELS}
                  price={plan.price}
                  highlighted={plan.highlighted}
                  source="pricing_cards"
                />

                <p className="hidden text-xs text-center mt-3 sm:block">
                  <span className="text-primary-600 font-semibold">{plan.credits} headshots</span>
                  <span className="text-slate-400 mx-1">/</span>
                  <span className="text-primary-600 font-semibold">{plan.validityDays} days validity</span>
                </p>
                
                <p className="hidden text-xs text-primary-600 text-center mt-2 sm:block">
                  {plan.validityNote}
                </p>
              </Card>
              )
            })}
          </div>

          {/* FAQ */}
          <div className="mt-12 sm:mt-20">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center mb-5 sm:mb-8">
              Quick Questions About Pricing
            </h2>
            
            <div className="grid md:grid-cols-2 gap-3 sm:gap-6 max-w-4xl mx-auto">
              {/* Credit-specific FAQs */}
              {pricingFAQ.slice(0, 2).map((faq, i) => (
                <Card key={`credit-${i}`} className="p-4 sm:p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">{faq.question}</h3>
                  <p className="text-sm text-slate-600">{faq.answer}</p>
                </Card>
              ))}
              {/* General FAQs */}
              {[
                {
                  q: 'Can I use the headshots commercially?',
                  a: 'Yes! All plans include full commercial use rights. Use your headshots on LinkedIn, your website, marketing materials, and more.'
                },
                {
                  q: 'What happens to my photos after generation?',
                  a: 'Your uploaded photos are handled only to provide your requested headshots. Input photos may be stored securely for processing, troubleshooting, abuse prevention, and support, and you can request deletion.'
                },
                {
                  q: 'How long does it take to generate my headshots?',
                  a: 'Most generations complete in 3-5 minutes. Pro and Premium users get priority processing for faster results.'
                },
                {
                  q: 'Can I get a refund if I\'m not satisfied?',
                  a: 'Yes, we offer a 30-day money-back guarantee. If you\'re not happy with your headshots, contact us for a full refund.'
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept PayPal and major cards through secure PayPal checkout.'
                },
                {
                  q: 'Do I need a subscription?',
                  a: 'No! Unlike other services, we use a one-time payment model. Pay once and you own your headshots forever.'
                },
              ].slice(0, 4).map((faq, i) => (
                <Card key={`general-${i}`} className="p-4 sm:p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-sm text-slate-600">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 sm:mt-20 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 sm:mb-4">
              Ready to Order Your AI Headshots?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8">
              Join 10,000+ professionals who use {appConfig.name} for realistic LinkedIn headshots and resume photos.
            </p>
            <a
              href="#plans"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Now - ${PLANS.basic.price}
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
