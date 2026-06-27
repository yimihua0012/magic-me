import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import TrackedLink from '@/components/ui/tracked-link'
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

export const metadata: Metadata = {
  title: 'AI Headshot Generator for LinkedIn, Resume, and Profile Photos',
  description: appConfig.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: appConfig.title,
    description: appConfig.description,
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: appConfig.title,
    description: appConfig.description,
  },
}

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Trained for Portraits',
    description: 'Built on a dedicated portrait model for realistic, high-likeness headshots.',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Professional Styles',
    description: 'Business-ready options for LinkedIn, resumes, websites, and teams.',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Privacy First',
    description: 'Your photos are deleted after generation. Your data stays yours.',
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: 'HD Downloads',
    description: 'Use your 1024x1024 images across profiles, resumes, and marketing.',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Fast Turnaround',
    description: 'Generate polished results in minutes, not days.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Team Friendly',
    description: 'Create consistent portraits for remote teams and company pages.',
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

export default async function HomePage({ searchParams }: { searchParams?: Promise<{ code?: string; returnTo?: string }> }) {
  const params = await searchParams
  if (params?.code) {
    const returnTo = params.returnTo || '/dashboard'
    redirect(`/api/auth/callback?code=${encodeURIComponent(params.code)}&returnTo=${encodeURIComponent(returnTo)}`)
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-6">
                <Sparkles className="w-4 h-4" />
                AI Headshot Generator for LinkedIn
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
                Realistic AI Headshots{' '}
                <span className="gradient-text">in Minutes</span>
              </h1>
              
              <p className="mt-3 sm:mt-6 text-base sm:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0">
                Pay once to add credits, choose the styles you want, then generate and deduct only the styles you selected.
              </p>
              
              <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start relative z-10">
                <TrackedLink
                  href="/pricing?plan=basic#plans"
                  className="w-full sm:w-auto"
                  buttonType="primary_cta"
                  source="home_hero_view_pricing"
                  metadata={{ plan: 'basic', price: PLANS.basic.price }}
                >
                  <Button size="lg" className="w-full">
                    Generate Headshots
                  </Button>
                </TrackedLink>
                <TrackedLink
                  href="#examples"
                  prefetch={false}
                  className="w-full sm:w-auto"
                  buttonType="secondary_cta"
                  source="home_hero_view_examples"
                >
                  <Button variant="secondary" size="lg" className="w-full">
                    View Headshot Style Examples
                  </Button>
                </TrackedLink>
              </div>
              
              <div className="mt-4 sm:mt-8 flex flex-wrap items-center gap-4 sm:gap-6 justify-center lg:justify-start text-xs sm:text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent-500" />
                  Pay once, add credits, no subscription
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-accent-500" />
                  Select styles, generate, then deduct by selection
                </div>
              </div>
            </div>

            <div className="relative max-w-sm mx-auto w-full hidden sm:block">
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
      <section className="content-auto py-10 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-16">
            <h2 className="section-heading">How It Works</h2>
            <p className="section-subheading mx-auto mt-3 sm:mt-4">
              Three quick steps to realistic AI headshots
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {[
              { step: '1', icon: <Sparkles className="w-8 h-8" />, title: 'Upload Your Selfie', desc: 'Take or upload 1-3 selfies with good lighting and a clear view of your face.' },
              { step: '2', icon: <Sparkles className="w-8 h-8" />, title: 'Portrait Model Works', desc: `Our dedicated portrait model generates ${PLANS.pro.credits} realistic headshots with strong likeness in minutes.` },
              { step: '3', icon: <Download className="w-8 h-8" />, title: 'Download & Save', desc: 'Pick your favorites and download in high resolution for any platform.' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <Card className="p-5 sm:p-8 text-center h-full">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 text-primary-600">
                    {item.icon}
                  </div>
                  <div className="absolute top-4 right-4 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">{item.title}</h3>
                  <p className="text-sm sm:text-base text-slate-600">{item.desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="content-auto py-10 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="section-heading">Why Choose Our AI Headshot Generator</h2>
            <p className="section-subheading mx-auto mt-3 sm:mt-4">
              Built for fast, high-likeness LinkedIn headshots, resume photos, and team portraits
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="p-4 sm:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-primary-600">
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
      <section id="examples" className="content-auto py-10 sm:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">56 AI Headshot Styles, grouped by type</h2>
            <p className="text-slate-400 mt-3 sm:mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              Professional, lifestyle, creative, and seasonal looks. Pick any combination up to your credits.
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

          <div className="text-center mt-8 sm:mt-12">
            <TrackedLink
              href="/pricing?plan=basic#plans"
              className="inline-flex w-full sm:w-auto"
              buttonType="primary_cta"
              source="home_style_examples_view_pricing"
              metadata={{ plan: 'basic', price: PLANS.basic.price }}
            >
              <Button size="lg" className="w-full">
                Try Basic {PLANS.basic.credits} Headshots
              </Button>
            </TrackedLink>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="content-auto py-10 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="section-heading">Loved by LinkedIn Professionals</h2>
            <p className="section-subheading mx-auto mt-3 sm:mt-4">
              Trusted for fast profile upgrades and better likeness
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="p-4 sm:p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-600 mb-5 sm:mb-6">&ldquo;{testimonial.content}&rdquo;</p>
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
      <section className="content-auto py-10 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="section-heading">Buy credits, then generate styles</h2>
            <p className="section-subheading mx-auto mt-4">
              Buy a credit pack once, choose your preferred styles, and each selected style is deducted on generation.
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
              <TrackedLink
                href="/pricing?plan=basic#plans"
                className="block"
                buttonType="pricing_preview_cta"
                source="home_pricing_preview"
                metadata={{ plan: 'basic', price: PLANS.basic.price }}
              >
                <Button className="w-full">Get Started</Button>
              </TrackedLink>
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
              <TrackedLink
                href="/pricing?plan=pro#plans"
                className="block"
                buttonType="pricing_preview_cta"
                source="home_pricing_preview"
                metadata={{ plan: 'pro', price: PLANS.pro.price }}
              >
                <Button className="w-full">Go Pro</Button>
              </TrackedLink>
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
              <TrackedLink
                href="/pricing?plan=premium#plans"
                className="block"
                buttonType="pricing_preview_cta"
                source="home_pricing_preview"
                metadata={{ plan: 'premium', price: PLANS.premium.price }}
              >
                <Button className="w-full">Go Premium</Button>
              </TrackedLink>
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
      <section className="content-auto py-10 sm:py-20 bg-gradient-to-br from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Upgrade Your Professional Image?
          </h2>
          <p className="text-primary-100 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join 10,000+ professionals who trust {appConfig.name} for their personal branding needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <TrackedLink
              href="/pricing"
              className="w-full sm:w-auto"
              buttonType="primary_cta"
              source="home_bottom_cta_view_pricing"
            >
              <Button
                size="lg"
                className="bg-white text-primary-600 hover:bg-primary-50 shadow-xl w-full"
              >
                <Camera className="w-5 h-5 mr-2" />
                Generate Headshots Now
              </Button>
            </TrackedLink>
            <TrackedLink
              href="/pricing"
              className="w-full sm:w-auto"
              buttonType="secondary_cta"
              source="home_bottom_cta_view_pricing"
            >
              <Button
                size="lg"
                variant="ghost"
                className="bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm w-full"
              >
                View Pricing
              </Button>
            </TrackedLink>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
