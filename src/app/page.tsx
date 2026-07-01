import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Card from '@/components/ui/card'
import OAuthCodeRedirect from '@/components/auth/oauth-code-redirect'
import HeroHeadshotGallery from '@/components/home/hero-headshot-gallery'
import HomeJsonLd from '@/components/seo/home-json-ld'
import { buttonStyles } from '@/components/ui/button-styles'
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
import { languageAlternatesForPath } from '@/lib/i18n'
import { PLANS } from '@backend/config/plans'

export const metadata: Metadata = {
  title: 'Realistic AI Headshot Generator for LinkedIn, Resume, and Profile Photos',
  description: appConfig.description,
  keywords: [
    'AI headshot generator',
    'AI headshots for LinkedIn',
    'AI resume photo generator',
    'professional profile photo',
  ],
  alternates: {
    canonical: '/',
    languages: languageAlternatesForPath(),
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
    description: 'Your photos stay yours and are handled only to create your requested headshots.',
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
  {
    name: 'Corporate Office',
    src: '/home-pages/sample/professional%20headshots%20for%20team%20photos%20.jpeg',
  },
  {
    name: 'Executive Portrait',
    src: '/home-pages/sample/headshot-executive-portrait.jpg',
  },
  {
    name: 'Vintage Film',
    src: '/home-pages/sample/high-likeness%20ai%20headshots.jpg',
  },
  {
    name: 'Business Casual',
    src: '/home-pages/sample/Perfect%20AI%20business%20portrait.jpg',
  },
  {
    name: 'Cinematic Portrait',
    src: '/home-pages/sample/perfect%20for%20my%20resume.jpg',
  },
  {
    name: 'Coffee Shop',
    src: '/home-pages/sample/AI%20Headshot%20Clean%20Luxury%20Social.jpeg',
  },
]

const heroHeadshots = [
  {
    src: '/home-pages/headshot-linkedin-professional1.jpeg',
    alt: 'Professional LinkedIn AI headshot example',
  },
  {
    src: '/home-pages/headshot-linkedin-professional2.jpeg',
    alt: 'Corporate AI headshot example',
  },
  {
    src: '/home-pages/headshot-linkedin-professional3.jpg',
    alt: 'Business profile AI headshot example',
  },
]

const homeFaq = [
  {
    name: 'How to get professional headshots without a photographer?',
    text: 'Use our AI headshot generator to get realistic headshots without hiring a photographer. Upload selfies, choose styles, and get high-likeness portraits in minutes.',
  },
  {
    name: 'What is the best AI headshot generator for LinkedIn profile?',
    text: 'Magic-Headshot creates realistic LinkedIn profile photos with a dedicated portrait model, fast generation, and styles for business, resume, and executive use.',
  },
  {
    name: 'Can I get AI headshots with different backgrounds?',
    text: 'Yes. Magic-Headshot offers multiple background and style options for different professional contexts and platforms.',
  },
  {
    name: 'Do you offer professional headshots for team photos online?',
    text: 'Yes. Teams can use Magic-Headshot to create consistent professional portraits for remote teams, company pages, and profile photos.',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <HomeJsonLd
        locale="en"
        title="Realistic AI Headshot Generator for LinkedIn, Resume, and Profile Photos"
        description={appConfig.description}
        keywords={metadata.keywords as string[]}
        faq={homeFaq}
      />
      <OAuthCodeRedirect />
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-10 pt-20 sm:pb-12 sm:pt-24 lg:pb-16 lg:pt-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-6">
                <Sparkles className="w-4 h-4" />
                AI Headshot Generator for LinkedIn
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
                Realistic AI Headshots for LinkedIn{' '}
                <span className="gradient-text">in Minutes</span>
              </h1>
              
              <p className="mt-3 sm:mt-6 text-base sm:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0">
                Pay once to add credits, choose the styles you want, then generate and deduct only the styles you selected.
              </p>
              
              <div className="relative z-10 mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4 sm:justify-center lg:justify-start">
                <TrackedLink
                  href="/pricing?plan=basic#plans"
                  className={buttonStyles({ size: 'lg', className: 'w-full text-center sm:w-auto' })}
                  buttonType="primary_cta"
                  source="home_hero_view_pricing"
                  metadata={{ plan: 'basic', price: PLANS.basic.price }}
                >
                  Generate Headshots
                </TrackedLink>
                <TrackedLink
                  href="#examples"
                  prefetch={false}
                  className={buttonStyles({ variant: 'secondary', size: 'lg', className: 'w-full text-center leading-snug sm:w-auto' })}
                  buttonType="secondary_cta"
                  source="home_hero_view_examples"
                >
                  View Style Examples
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

            <div className="relative mx-auto hidden w-full max-w-xl pb-12 sm:block">
              <HeroHeadshotGallery images={heroHeadshots} />
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
              { step: '1', icon: <Sparkles className="w-8 h-8" />, title: 'Upload Your Selfies', desc: 'Take or upload 1-3 clear selfies of the same person with good lighting and a clear view of your face.' },
              { step: '2', icon: <Sparkles className="w-8 h-8" />, title: 'Portrait Model Works', desc: 'Our dedicated portrait model generates your selected realistic headshots with strong likeness in minutes.' },
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
                <div className="relative aspect-square overflow-hidden rounded-xl border border-slate-700 bg-slate-800 transition-colors group-hover:border-primary-500">
                  <Image
                    src={style.src}
                    alt={`${style.name} AI headshot style example`}
                    fill
                    sizes="(min-width: 1024px) 180px, (min-width: 640px) 30vw, 45vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2 text-xs sm:text-sm font-medium text-center">{style.name}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <TrackedLink
              href="/pricing?plan=basic#plans"
              className={buttonStyles({ size: 'lg', className: 'w-full text-center sm:w-auto' })}
              buttonType="primary_cta"
              source="home_style_examples_view_pricing"
              metadata={{ plan: 'basic', price: PLANS.basic.price }}
            >
              Try Basic {PLANS.basic.credits} Headshots
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
                className={buttonStyles({ className: 'w-full text-center' })}
                buttonType="pricing_preview_cta"
                source="home_pricing_preview"
                metadata={{ plan: 'basic', price: PLANS.basic.price }}
              >
                Choose {PLANS.basic.name}
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
                className={buttonStyles({ className: 'w-full text-center' })}
                buttonType="pricing_preview_cta"
                source="home_pricing_preview"
                metadata={{ plan: 'pro', price: PLANS.pro.price }}
              >
                Choose {PLANS.pro.name}
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
                className={buttonStyles({ className: 'w-full text-center' })}
                buttonType="pricing_preview_cta"
                source="home_pricing_preview"
                metadata={{ plan: 'premium', price: PLANS.premium.price }}
              >
                Choose {PLANS.premium.name}
              </TrackedLink>
            </Card>
          </div>

          <p className="text-center text-slate-500 mt-8 text-sm sm:text-base">
            <Link href="/pricing" className="text-primary-600 hover:underline" prefetch={true}>
              View all plans on our pricing page
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
              className={buttonStyles({ size: 'lg', className: 'w-full bg-white text-primary-600 shadow-xl hover:bg-primary-50 sm:w-auto' })}
              buttonType="primary_cta"
              source="home_bottom_cta_view_pricing"
            >
              <Camera className="mr-2 h-5 w-5" />
              Generate Headshots Now
            </TrackedLink>
            <TrackedLink
              href="/pricing"
              className={buttonStyles({ variant: 'ghost', size: 'lg', className: 'w-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 sm:w-auto' })}
              buttonType="secondary_cta"
              source="home_bottom_cta_view_pricing"
            >
              View Pricing
            </TrackedLink>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
