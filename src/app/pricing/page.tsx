import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Card from '@/components/ui/card'
import PlanPaymentCta from '@/components/ui/plan-payment-cta'
import PricingJsonLd from '@/components/seo/pricing-json-ld'
import { Check, X, Sparkles, Zap, Crown } from 'lucide-react'
import { pricingConfig, pricingFAQ, appConfig } from '@/lib/config'
import { languageAlternatesForPath } from '@/lib/i18n'
import { PLANS, TRIAL_CREDITS, type PlanType } from '@backend/config/plans'

export const metadata: Metadata = {
  title: 'Professional Headshot Pricing: One-Time Credit Packs',
  description:
    'Compare headshot pricing for LinkedIn photos, resume portraits, business headshots, corporate headshots, and team pages.',
  keywords: [
    'headshot pricing',
    'professional headshots pricing',
    'corporate headshots pricing',
  ],
  alternates: {
    canonical: '/pricing',
    languages: languageAlternatesForPath('/pricing'),
  },
  openGraph: {
    title: 'Professional Headshot Pricing: One-Time Credit Packs',
    description:
      'Compare headshot pricing for LinkedIn photos, resume portraits, business headshots, corporate headshots, and team pages.',
    url: '/pricing',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Headshot Pricing: One-Time Credit Packs',
    description:
      'Compare headshot pricing for LinkedIn photos, resume portraits, business headshots, corporate headshots, and team pages.',
  },
}

const PAYPAL_BUTTONS: Record<PlanType, { id: string }> = Object.fromEntries(
  (Object.keys(PLANS) as PlanType[]).map((planId) => [
    planId,
    { id: PLANS[planId].prices.USD.paypalButtonId },
  ])
) as Record<PlanType, { id: string }>

const PAYPAL_LABELS: Record<PlanType, string> = {
  basic: 'Choose Basic Plan',
  pro: 'Choose Pro Plan',
  premium: 'Choose Premium Plan',
}

const plans = Object.values(pricingConfig).map((plan) => ({
  ...plan,
  icon:
    plan.id === 'basic' ? (
      <Sparkles className="h-5 w-5" />
    ) : plan.id === 'pro' ? (
      <Zap className="h-5 w-5" />
    ) : (
      <Crown className="h-5 w-5" />
    ),
  highlighted: plan.id === 'pro',
}))

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <PricingJsonLd
        locale="en"
        currency="USD"
        title="Professional Headshot Pricing for LinkedIn and Resume Photos"
        description="One-time pricing for realistic professional headshots for LinkedIn profiles, resumes, business portraits, and team pages."
        planDescription={(planId) => {
          const plan = PLANS[planId]
          return `${plan.credits} AI headshots with ${plan.validityDays} days validity. Validity starts from the first generation.`
        }}
      />

      <main className="pb-10 pt-20 sm:pb-16 sm:pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-center sm:mb-12">
            <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:mb-4 sm:text-3xl lg:text-4xl">
              Professional Headshot Pricing for LinkedIn and Resume Photos
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-lg lg:text-xl">
              One-time pricing for realistic professional headshots for LinkedIn profiles, resumes, business
              portraits, corporate headshots, and team pages. Compare credit packs before you upload, see what each
              plan includes, and choose the package that matches how many styles you want to generate.
            </p>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-2 rounded-xl border border-slate-200 bg-white p-2 text-center text-xs font-medium text-slate-600 sm:hidden">
            <span>{PLANS.basic.credits} shots</span>
            <span>{PLANS.pro.credits} shots</span>
            <span>{PLANS.premium.credits} shots</span>
          </div>

          <div className="mb-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 sm:flex-row sm:px-6">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                Try it free first
              </p>
              <p className="mt-1 text-sm text-emerald-700">
                New users get {TRIAL_CREDITS} free headshots when they create an account. No credit card required.
              </p>
            </div>
            <Link
              href="/upload"
              className="inline-flex min-h-[44px] flex-none items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              Generate my free headshots
            </Link>
          </div>

          <div id="plans" className="mx-auto grid max-w-5xl scroll-mt-24 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {plans.map((plan) => {
              const planId = plan.id as PlanType
              const paypal = PAYPAL_BUTTONS[planId]

              return (
                <Card
                  key={plan.id}
                  className={`relative p-4 sm:p-8 ${
                    plan.highlighted ? 'border-2 border-primary-500 shadow-lg lg:scale-105 lg:shadow-xl' : ''
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold text-white">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-4 flex items-start justify-between gap-3 text-left sm:mb-6 sm:block sm:text-center">
                    <div
                      className={`mx-auto mb-4 hidden h-12 w-12 items-center justify-center rounded-xl sm:flex ${
                        plan.highlighted ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {plan.icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{plan.name}</h2>
                      <p className="text-xs font-medium text-primary-600 sm:hidden">{plan.credits} headshots</p>
                    </div>
                    <div className="flex shrink-0 items-baseline justify-center gap-1 sm:justify-center">
                      <span className="text-3xl font-bold text-slate-900 sm:text-4xl">${plan.price}</span>
                      <span className="hidden text-sm text-slate-500 sm:inline">/one-time</span>
                    </div>
                  </div>

                  <div className="mb-5 space-y-2 sm:mb-8 sm:space-y-3">
                    {plan.features.map((feature, index) => {
                      const isHighlight = feature.includes('headshots') || feature.includes('days validity')

                      return (
                        <div key={index} className="flex items-start gap-3">
                          <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500 sm:h-5 sm:w-5" />
                          <span className={`text-sm ${isHighlight ? 'font-semibold text-primary-600' : 'text-slate-600'}`}>
                            {feature}
                          </span>
                        </div>
                      )
                    })}
                    {plan.notIncluded.slice(0, 1).map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <X className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-300" />
                        <span className="text-sm text-slate-400">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <PlanPaymentCta
                    buttonId={paypal.id}
                    label={PAYPAL_LABELS[planId]}
                    planType={planId}
                    price={plan.price}
                    highlighted={plan.highlighted}
                    source="pricing_cards"
                  />

                </Card>
              )
            })}
          </div>

          <div className="content-auto mt-12 sm:mt-20">
            <h2 className="mb-5 text-center text-xl font-bold text-slate-900 sm:mb-8 sm:text-2xl">
              Quick Questions About Pricing
            </h2>

            <div className="mx-auto grid max-w-4xl gap-3 sm:gap-6 md:grid-cols-2">
              {pricingFAQ.slice(0, 2).map((faq, index) => (
                <Card key={`credit-${index}`} className="p-4 sm:p-6">
                  <h3 className="mb-2 font-semibold text-slate-900">{faq.question}</h3>
                  <p className="text-sm text-slate-600">{faq.answer}</p>
                </Card>
              ))}
              {[
                {
                  q: 'Can I use the headshots commercially?',
                  a: 'Yes. All plans include commercial use rights for LinkedIn, resumes, company profiles, websites, team pages, and marketing materials.',
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept PayPal and major cards through secure PayPal checkout.',
                },
              ].map((faq, index) => (
                <Card key={`general-${index}`} className="p-4 sm:p-6">
                  <h3 className="mb-2 font-semibold text-slate-900">{faq.q}</h3>
                  <p className="text-sm text-slate-600">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="content-auto mt-12 text-center sm:mt-20">
            <h2 className="mb-3 text-xl font-bold text-slate-900 sm:mb-4 sm:text-2xl">
              Ready to Order Your AI Headshots?
            </h2>
            <p className="mb-6 text-sm text-slate-600 sm:mb-8 sm:text-base">
              Join 10,000+ professionals who use {appConfig.name} for realistic LinkedIn headshots, resume photos, and business portraits.
            </p>
            <a
              href="#plans"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Start Now - ${PLANS.basic.price}
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
