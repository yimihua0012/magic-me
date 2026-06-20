'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import AuthModal from '@/components/auth/auth-modal'
import { Check, X, Sparkles, Zap, Crown, Building } from 'lucide-react'

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.90,
    styleCount: 30,
    resolution: '1024x1024',
    resolutionLabel: 'HD',
    icon: <Sparkles className="w-5 h-5" />,
    highlighted: false,
    features: [
      '30 unique AI styles',
      '1024x1024 HD resolution',
      'Unlimited downloads',
      'Commercial use rights',
      'Email support',
    ],
    notIncluded: [
      'Priority processing',
      'Custom style training',
      'API access',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 19.90,
    styleCount: 100,
    resolution: '2048x2048',
    resolutionLabel: 'Ultra HD',
    icon: <Zap className="w-5 h-5" />,
    highlighted: true,
    features: [
      '100 unique AI styles',
      '2048x2048 Ultra HD resolution',
      'Unlimited downloads',
      'Commercial use rights',
      'Priority processing',
      'Dedicated support',
    ],
    notIncluded: [
      'Custom style training',
      'API access',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99,
    styleCount: 999,
    resolution: 'Custom',
    resolutionLabel: 'Custom',
    icon: <Crown className="w-5 h-5" />,
    highlighted: false,
    features: [
      'Unlimited styles',
      'Custom resolution',
      'Custom style training',
      'API access',
      'Team management',
      'Dedicated account manager',
      'SLA guarantee',
    ],
    notIncluded: [],
  },
]

export default function PricingPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string>('basic')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const planParam = urlParams.get('plan')
    if (planParam) {
      setSelectedPlan(planParam)
    }
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          setIsAuthenticated(true)
        }
      } catch {
        // Not authenticated
      } finally {
        setIsCheckingAuth(false)
      }
    }
    checkAuth()
  }, [])

  const handleSelectPlan = async (planId: string) => {
    if (!isAuthenticated) {
      setSelectedPlan(planId)
      setShowAuthModal(true)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_type: planId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        window.location.href = `/generate/demo-${Date.now()}`
      }
    } catch {
      window.location.href = `/generate/demo-${Date.now()}`
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => {
          setShowAuthModal(false)
          setIsAuthenticated(true)
          handleSelectPlan(selectedPlan)
        }} 
      />

      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              No subscriptions. No hidden fees. Pay once and get professional headshots for life.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative p-8 ${
                  plan.highlighted 
                    ? 'border-2 border-primary-500 shadow-xl scale-105' 
                    : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 ${
                    plan.highlighted 
                      ? 'bg-primary-100 text-primary-600' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {plan.icon}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h2>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-slate-900">${plan.price}</span>
                    <span className="text-slate-500">/one-time</span>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-400">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full" 
                  variant={plan.highlighted ? 'primary' : 'secondary'}
                  isLoading={isLoading}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {plan.id === 'enterprise' ? 'Contact Sales' : `Get ${plan.name}`}
                </Button>

                {plan.id !== 'enterprise' && (
                  <p className="text-xs text-slate-500 text-center mt-3">
                    {plan.styleCount} styles • {plan.resolutionLabel}
                  </p>
                )}
              </Card>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
              Compare Plans
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-900">Basic</th>
                    <th className="px-6 py-4 text-center font-semibold text-primary-600 bg-primary-50">Pro</th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-6 py-4 text-slate-600">AI Styles</td>
                    <td className="px-6 py-4 text-center text-slate-900">30</td>
                    <td className="px-6 py-4 text-center text-slate-900 bg-primary-50/50">100</td>
                    <td className="px-6 py-4 text-center text-slate-900">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-slate-600">Resolution</td>
                    <td className="px-6 py-4 text-center text-slate-900">1024x1024</td>
                    <td className="px-6 py-4 text-center text-slate-900 bg-primary-50/50">2048x2048</td>
                    <td className="px-6 py-4 text-center text-slate-900">Custom</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-slate-600">Processing</td>
                    <td className="px-6 py-4 text-center text-slate-900">Standard</td>
                    <td className="px-6 py-4 text-center text-slate-900 bg-primary-50/50">Priority</td>
                    <td className="px-6 py-4 text-center text-slate-900">Instant</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-slate-600">Downloads</td>
                    <td className="px-6 py-4 text-center text-slate-900">Unlimited</td>
                    <td className="px-6 py-4 text-center text-slate-900 bg-primary-50/50">Unlimited</td>
                    <td className="px-6 py-4 text-center text-slate-900">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-slate-600">Commercial Use</td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-accent-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-primary-50/50"><Check className="w-5 h-5 text-accent-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-accent-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-slate-600">Custom Training</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-slate-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-primary-50/50"><X className="w-5 h-5 text-slate-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-accent-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-slate-600">API Access</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-slate-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-primary-50/50"><X className="w-5 h-5 text-slate-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-accent-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-slate-600">Team Management</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-slate-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center bg-primary-50/50"><X className="w-5 h-5 text-slate-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-accent-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
              Frequently Asked Questions
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  q: 'Can I use the headshots commercially?',
                  a: 'Yes! All plans include full commercial use rights. Use your headshots on LinkedIn, your website, marketing materials, and more.'
                },
                {
                  q: 'What happens to my photos after generation?',
                  a: 'Your uploaded photos are automatically deleted after the generation process is complete. We never store your selfies.'
                },
                {
                  q: 'How long does it take to generate my headshots?',
                  a: 'Most generations complete in 3-5 minutes. Pro users get priority processing for faster results.'
                },
                {
                  q: 'Can I get a refund if I\'m not satisfied?',
                  a: 'Yes, we offer a 30-day money-back guarantee. If you\'re not happy with your headshots, contact us for a full refund.'
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards, debit cards, and PayPal through our secure Stripe payment processing.'
                },
                {
                  q: 'Do I need a subscription?',
                  a: 'No! Unlike other services, we use a one-time payment model. Pay once and you own your headshots forever.'
                },
              ].map((faq, i) => (
                <Card key={i} className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-sm text-slate-600">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Get Your Professional Headshots?
            </h2>
            <p className="text-slate-600 mb-8">
              Join 10,000+ professionals who trust HeadshotAI
            </p>
            <Button size="lg" onClick={() => handleSelectPlan('basic')}>
              <Sparkles className="w-5 h-5 mr-2" />
              Start Now - $9.90
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
