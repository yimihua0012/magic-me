'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import PayPalButton from '@/components/ui/paypal-button'
import { 
  Zap, 
  Shield, 
  Download, 
  Clock, 
  Sparkles,
  Check,
  X,
  Star,
  Users,
  Camera,
} from 'lucide-react'
import { appConfig } from '@/lib/config'
import { PLANS } from '@backend/config/plans'
import { supabase } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'

const AuthModal = dynamic(() => import('@/components/auth/auth-modal'), {
  loading: () => null,
  ssr: false,
})

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Professional Headshots Without a Photographer',
    description: 'Get studio-quality headshots without hiring a photographer. Our AI headshot generator delivers professional results in just 3 minutes.',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: '36 Styles with Business Attire',
    description: 'From corporate professional to executive portraits, choose from 36 different styles with business attire perfect for LinkedIn and resume.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Privacy First',
    description: 'Your photos are deleted after generation. Your data stays yours.',
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: 'HD Downloads for Any Platform',
    description: 'Get high-resolution 1024x1024 images perfect for LinkedIn profile, resume, CV, and business portraits.',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: '24/7 Virtual Headshot Generator',
    description: 'Generate virtual headshots for LinkedIn anytime, anywhere. No appointment needed with our AI business portrait generator.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Team Photos for Remote Teams',
    description: 'Professional headshots for team photos online. Perfect for remote teams who need consistent, high-quality portraits.',
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Manager at Google',
    content: 'Best AI headshot generator for LinkedIn profile I have used! Got my professional headshot done in 3 minutes. Looks like I hired a professional photographer - perfect for my resume and CV.',
    avatar: 'SC',
  },
  {
    name: 'Marcus Johnson',
    role: 'Startup Founder',
    content: 'Needed professional headshots for team photos online. This saved us hundreds of dollars and so much time. The AI headshot with different backgrounds feature is amazing for our remote team!',
    avatar: 'MJ',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Marketing Director',
    content: 'How to get professional headshots without a photographer? This is the answer! The variety of styles with business attire is amazing. Perfect AI business portrait for my personal brand.',
    avatar: 'ER',
  },
]

const styles = [
  { name: 'Corporate Professional', category: 'Business' },
  { name: 'Creative Studio', category: 'Artistic' },
  { name: 'Warm Natural', category: 'Lifestyle' },
  { name: 'Bold & Modern', category: 'Contemporary' },
  { name: 'Classic Portrait', category: 'Traditional' },
  { name: 'Urban Edge', category: 'Street' },
]

export default function HomePage() {
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setIsCheckingAuth(false)
    }
    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleOpenAuth = () => setShowAuthModal(true)

  const handlePrimaryAction = (planType?: string) => {
    if (user) {
      if (planType === 'enterprise') {
        router.push('/contact')
      } else {
        router.push('/upload')
      }
    } else {
      setShowAuthModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar onOpenAuthModal={handleOpenAuth} />
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false)
          setTimeout(() => {
            window.location.href = '/upload'
          }, 300)
        }}
      />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 pointer-events-none" />
        <div className="absolute top-16 left-0 w-64 h-64 sm:w-72 sm:h-72 bg-primary-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute bottom-16 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-accent-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Sparkles className="w-4 h-4" />
                AI-Powered Professional Headshots
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
                Get Professional Headshots{' '}
                <span className="gradient-text">Without a Photographer</span>
              </h1>
              
              <p className="mt-4 sm:mt-6 text-base sm:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0">
                The best AI headshot generator for LinkedIn profile. Upload a selfie, get 36 professional styles with business attire in 3 minutes. Perfect for resume, team photos, and virtual headshots.
              </p>
              
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start relative z-10">
                <Button size="lg" onClick={() => handlePrimaryAction()} className="w-full sm:w-auto">
                  <Camera className="w-5 h-5 mr-2" />
                  Generate Headshots - ${PLANS.basic.price}
                </Button>
                <Link href="#examples" prefetch={false} className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full">
                    View Headshot Style Examples
                  </Button>
                </Link>
              </div>
              
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4 sm:gap-6 justify-center lg:justify-start text-xs sm:text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent-500" />
                  1024x1024 HD
                </div>
              </div>
            </div>

            <div className="relative max-w-sm mx-auto w-full">
              <div className="relative z-10">
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {['bg-gradient-to-br from-blue-400 to-blue-600', 'bg-gradient-to-br from-purple-400 to-purple-600', 'bg-gradient-to-br from-pink-400 to-pink-600'].map((bg, i) => (
                    <div 
                      key={i}
                      className={`aspect-square rounded-xl sm:rounded-2xl ${bg} shadow-xl`}
                    />
                  ))}
                </div>
                <div className="absolute -bottom-3 -right-2 sm:-bottom-4 sm:-right-4 bg-white rounded-xl shadow-lg p-2 sm:p-3 flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-accent-600" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-700">{PLANS.basic.credits} Headshots Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-14 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="section-heading">How It Works</h2>
            <p className="section-subheading mx-auto mt-4">
              Three simple steps to professional headshots
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              { step: '1', icon: <Sparkles className="w-8 h-8" />, title: 'Upload Your Selfie', desc: 'Take or upload 1-3 selfies with good lighting and a clear view of your face.' },
              { step: '2', icon: <Sparkles className="w-8 h-8" />, title: 'AI Magic Happens', desc: `Our AI analyzes your photos and generates ${PLANS.pro.credits} professional headshots in 3 minutes.` },
              { step: '3', icon: <Download className="w-8 h-8" />, title: 'Download & Save', desc: 'Pick your favorites and download in high resolution for any platform.' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <Card className="p-8 text-center h-full">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600">
                    {item.icon}
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="section-heading">Why Choose Us</h2>
            <p className="section-subheading mx-auto mt-4">
              Everything you need for the perfect professional headshot
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 text-primary-600">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Style Examples */}
      <section id="examples" className="py-14 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{PLANS.basic.credits}+ Styles to Match Your Brand</h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              From corporate polish to creative flair, find the perfect headshot style for every platform and purpose.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {styles.map((style, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 group-hover:border-primary-500 transition-colors overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-600 rounded-full" />
                  </div>
                </div>
                <p className="mt-2 text-xs sm:text-sm font-medium text-center">{style.name}</p>
                <p className="text-xs text-slate-500 text-center hidden sm:block">{style.category}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <Button size="lg" onClick={() => handlePrimaryAction()} className="w-full sm:w-auto">
              <Sparkles className="w-5 h-5 mr-2" />
              Try All {PLANS.basic.credits} Styles - ${PLANS.basic.price}
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="section-heading">Loved by Professionals</h2>
            <p className="section-subheading mx-auto mt-4">
              Join thousands of happy users who upgraded their professional image
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-14 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="section-heading">Simple, Transparent Pricing</h2>
            <p className="section-subheading mx-auto mt-4">
              No subscriptions. No hidden fees. Pay only for what you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{PLANS.basic.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-slate-900">${PLANS.basic.price}</span>
                <span className="text-slate-500 text-sm sm:text-base">/one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-primary-600 font-semibold">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> {PLANS.basic.credits} headshots
                </li>
                <li className="flex items-center gap-2 text-sm text-primary-600 font-semibold">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> {PLANS.basic.validityDays} days validity
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> 1024x1024 resolution
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> Unlimited downloads
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> Commercial use
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> Email support
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <X className="w-4 h-4 text-slate-300 flex-shrink-0" /> Priority processing
                </li>
              </ul>
              <Button className="w-full mb-3" onClick={() => handlePrimaryAction('basic')}>
                Get Started
              </Button>
              <PayPalButton buttonId="SUZNHDUUW6K6E" price={PLANS.basic.price} />
            </Card>

            <Card className="p-6 sm:p-8 border-2 border-primary-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{PLANS.pro.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-slate-900">${PLANS.pro.price}</span>
                <span className="text-slate-500 text-sm sm:text-base">/one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-primary-600 font-semibold">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> {PLANS.pro.credits} headshots
                </li>
                <li className="flex items-center gap-2 text-sm text-primary-600 font-semibold">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> {PLANS.pro.validityDays} days validity
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> 1024x1024 HD resolution
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> Unlimited downloads
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> Commercial use
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> Priority processing
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> Email support
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <X className="w-4 h-4 text-slate-300 flex-shrink-0" /> Dedicated support
                </li>
              </ul>
              <Button className="w-full mb-3" onClick={() => handlePrimaryAction('pro')}>
                Go Pro
              </Button>
              <PayPalButton buttonId="U8CQE5WXQEM4W" price={PLANS.pro.price} />
            </Card>

            <Card className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{PLANS.premium.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl sm:text-4xl font-bold text-slate-900">${PLANS.premium.price}</span>
                <span className="text-slate-500 text-sm sm:text-base">/one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-primary-600 font-semibold">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> {PLANS.premium.credits} headshots
                </li>
                <li className="flex items-center gap-2 text-sm text-primary-600 font-semibold">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> {PLANS.premium.validityDays} days validity
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> 1024x1024 Ultra HD resolution
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> Unlimited downloads
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> Commercial use
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> Priority processing
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> Email support
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-accent-500 flex-shrink-0" /> Dedicated support
                </li>
              </ul>
              <Button className="w-full mb-3" onClick={() => handlePrimaryAction('premium')}>
                Go Premium
              </Button>
              {/* PayPal Button */}
              <PayPalButton buttonId="EWV87BFAXRZ88" price={PLANS.premium.price} />
            </Card>
          </div>

          <p className="text-center text-slate-500 mt-8 text-sm sm:text-base">
            <Link href="/pricing" className="text-primary-600 hover:underline" prefetch={true}>
              Compare all features on our pricing page
            </Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Upgrade Your Professional Image?
          </h2>
          <p className="text-primary-100 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join 10,000+ professionals who trust {appConfig.name} for their personal branding needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary-600 hover:bg-primary-50 shadow-xl w-full sm:w-auto"
              onClick={() => handlePrimaryAction()}
            >
              <Camera className="w-5 h-5 mr-2" />
              Generate Headshots Now
            </Button>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="ghost"
                className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm w-full"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
