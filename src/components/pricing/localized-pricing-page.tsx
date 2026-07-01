'use client'

import { useMemo } from 'react'
import { Check, Crown, Sparkles, Zap } from 'lucide-react'
import Card from '@/components/ui/card'
import Footer from '@/components/layout/localized-footer'
import Navbar from '@/components/layout/localized-navbar'
import Button from '@/components/ui/button'
import PlanPaymentCta from '@/components/ui/plan-payment-cta'
import PricingJsonLd from '@/components/seo/pricing-json-ld'
import { formatCurrency, getDefaultCurrencyForLocale } from '@/lib/currency'
import type { RoutedLocale } from '@/lib/i18n'
import type { LocalizedPricingContent } from '@/lib/localized-pricing-content'
import { PLANS, type PlanType } from '@backend/config/plans'

interface LocalizedPricingPageProps {
  locale: RoutedLocale
  content: LocalizedPricingContent
}

const planIds: PlanType[] = ['basic', 'pro', 'premium']

const planIcons = {
  basic: <Sparkles className="h-5 w-5" />,
  pro: <Zap className="h-5 w-5" />,
  premium: <Crown className="h-5 w-5" />,
}

function fillTemplate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  )
}

export default function LocalizedPricingPage({ locale, content }: LocalizedPricingPageProps) {
  const currency = useMemo(() => getDefaultCurrencyForLocale(locale), [locale])

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar locale={locale} />
      <PricingJsonLd
        locale={locale}
        currency={currency}
        title={content.title}
        description={content.description}
        planLabels={Object.fromEntries(
          planIds.map((planId) => [
            planId,
            fillTemplate(content.choosePlanTemplate, { planName: PLANS[planId].name }),
          ]),
        )}
        planDescription={(planId) => {
          const plan = PLANS[planId]
          return `${plan.credits} ${content.headshots}. ${fillTemplate(content.validityTemplate, {
            days: plan.validityDays,
          })}. ${content.validityRule}`
        }}
      />

      <main className="pb-10 pt-20 sm:pb-16 sm:pt-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-center sm:mb-12">
            <h1 className="mb-2 text-2xl font-bold text-slate-900 sm:mb-4 sm:text-3xl lg:text-4xl">
              {content.title}
            </h1>
            <p className="mx-auto max-w-2xl text-sm text-slate-600 sm:text-lg lg:text-xl">
              {content.description}
            </p>
          </div>

          <div id="plans" className="mx-auto grid max-w-5xl scroll-mt-24 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {planIds.map((planId) => {
              const plan = PLANS[planId]
              const price = plan.prices[currency]
              const highlighted = planId === 'pro'
              const canCheckout = Boolean(price.paypalButtonId)

              return (
                <Card
                  key={plan.id}
                  className={`relative p-4 sm:p-8 ${
                    highlighted ? 'border-2 border-primary-500 shadow-lg lg:scale-105 lg:shadow-xl' : ''
                  }`}
                >
                  {highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold text-white">
                        {content.mostPopular}
                      </span>
                    </div>
                  )}

                  <div className="mb-6 text-center">
                    <div
                      className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                        highlighted ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {planIcons[planId]}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">{plan.name}</h2>
                    <div className="mt-4 flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-slate-900">
                        {formatCurrency(price.amount, currency)}
                      </span>
                      <span className="text-sm text-slate-500">/{content.perPurchase}</span>
                    </div>
                  </div>

                  <div className="mb-8 space-y-3">
                    {[
                      `${plan.credits} ${content.headshots}`,
                      fillTemplate(content.validityTemplate, { days: plan.validityDays }),
                      content.highlights.resolution,
                      content.highlights.downloads,
                      content.highlights.commercial,
                      ...(planId !== 'basic' ? [content.highlights.priority] : []),
                      content.highlights.emailSupport,
                      ...(planId === 'premium' ? [content.highlights.dedicatedSupport] : []),
                    ].map((feature, index) => (
                      <div key={`${feature}-${index}`} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-500" />
                        <span className={`text-sm ${index < 2 ? 'font-semibold text-primary-600' : 'text-slate-600'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {canCheckout ? (
                    <PlanPaymentCta
                        buttonId={price.paypalButtonId}
                        label={fillTemplate(content.choosePlanTemplate, { planName: plan.name })}
                        planType={planId}
                        price={price.amount}
                        highlighted={highlighted}
                        source={`pricing_${locale}`}
                        currency={currency}
                        locale={locale}
                        helperText={content.validityRule}
                      />
                  ) : (
                    <div className="space-y-2">
                      <Button className="w-full" variant={highlighted ? 'primary' : 'secondary'} disabled>
                        {fillTemplate(content.choosePlanTemplate, { planName: plan.name })}
                      </Button>
                      <p className="text-center text-xs text-slate-500">{content.checkoutUnavailable}</p>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>

          <div className="mt-12 sm:mt-20">
            <h2 className="mb-5 text-center text-xl font-bold text-slate-900 sm:mb-8 sm:text-2xl">
              {content.faqTitle}
            </h2>
            <div className="mx-auto grid max-w-4xl gap-3 sm:gap-6 md:grid-cols-2">
              {content.faq.map((faq) => (
                <Card key={faq.question} className="p-4 sm:p-6">
                  <h3 className="mb-2 font-semibold text-slate-900">{faq.question}</h3>
                  <p className="text-sm text-slate-600">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  )
}
