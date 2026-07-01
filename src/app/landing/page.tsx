import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  Clock3,
  Download,
  Linkedin,
  ShieldCheck,
  Sparkles,
  Star,
  Upload,
  WandSparkles,
} from 'lucide-react'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import Card from '@/components/ui/card'
import TrackedLink from '@/components/ui/tracked-link'
import { buttonStyles } from '@/components/ui/button-styles'
import { languageAlternatesForPath } from '@/lib/i18n'
import { PLANS } from '@backend/config/plans'

export const metadata: Metadata = {
  title: 'AI LinkedIn Headshots That Look Professional in Minutes',
  description:
    'A conversion-focused AI headshot landing page for professionals who need realistic LinkedIn, resume, and team portraits without booking a photographer.',
  alternates: {
    canonical: '/landing',
    languages: languageAlternatesForPath('/landing'),
  },
  openGraph: {
    title: 'AI LinkedIn Headshots That Look Professional in Minutes',
    description:
      'Upload selfies, choose professional styles, and get polished AI headshots for LinkedIn, resumes, and business profiles.',
    url: '/landing',
    type: 'website',
    images: [
      {
        url: '/landing-headshot-showcase.png',
        width: 1600,
        height: 1000,
        alt: 'Professional AI headshot showcase',
      },
    ],
  },
}

const outcomes = [
  'LinkedIn profile refresh',
  'Resume and CV photo',
  'Founder bio and speaker page',
  'Remote team headshots',
]

const proof = [
  { value: '3-5 min', label: 'typical generation time' },
  { value: '1024px', label: 'profile-ready downloads' },
  { value: 'No subscription', label: 'one-time credit packs' },
]

const steps = [
  {
    icon: Upload,
    title: 'Upload 1-3 clear selfies',
    text: 'Use recent photos with good lighting and a clear face view. No studio setup required.',
  },
  {
    icon: WandSparkles,
    title: 'Pick the styles you want',
    text: 'Choose business, creative, natural, or modern looks. Credits are deducted only for selected styles.',
  },
  {
    icon: Download,
    title: 'Download profile-ready results',
    text: 'Use your best headshots across LinkedIn, resumes, websites, company pages, and press kits.',
  },
]

const objections = [
  {
    icon: ShieldCheck,
    title: 'Built for realistic likeness',
    text: 'The flow is tuned around professional portraits, not random avatar styles.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Business-first output',
    text: 'Every section points users toward polished LinkedIn, resume, and team-photo use cases.',
  },
  {
    icon: Clock3,
    title: 'Fast enough for urgent updates',
    text: 'Designed for people who need a better profile image today, not after a studio booking.',
  },
]

const faqs = [
  {
    q: 'Do I need a subscription?',
    a: 'No. Buy a credit pack once, generate selected styles, and use the results after download.',
  },
  {
    q: 'What should I upload?',
    a: 'Upload 1-3 clear selfies of the same person with good lighting and an unobstructed face.',
  },
  {
    q: 'Can I use the photos commercially?',
    a: 'Yes. Plans include commercial use for LinkedIn, resumes, business profiles, websites, and team pages.',
  },
  {
    q: 'How do credits work?',
    a: 'Choose the styles you want before generation. Credits are deducted by the selected styles you generate.',
  },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <Image
          src="/landing-headshot-showcase.png"
          alt="Professional AI headshot examples"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-slate-950/75" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />

        <div className="relative mx-auto grid min-h-[680px] max-w-7xl items-center gap-10 px-4 pb-14 pt-24 sm:min-h-[720px] sm:px-6 sm:pt-28 lg:grid-cols-[1.03fr_0.97fr] lg:px-8 lg:pt-32">
          <div className="max-w-3xl text-center lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
              <Linkedin className="h-4 w-4 text-sky-300" />
              AI headshots for LinkedIn, resumes, and teams
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Professional AI Headshots Without Booking a Photographer
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg lg:mx-0">
              Turn everyday selfies into realistic business portraits for LinkedIn, resumes, company bios, and personal branding. Pay once, choose styles, and generate only what you need.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <TrackedLink
                href="/pricing?plan=basic#plans"
                className={buttonStyles({ size: 'lg', className: 'w-full bg-white text-slate-950 shadow-xl hover:bg-slate-100 sm:w-auto' })}
                buttonType="landing_primary_cta"
                source="landing_hero"
                metadata={{ plan: 'basic', price: PLANS.basic.price }}
              >
                Choose {PLANS.basic.name}
                <ArrowRight className="ml-2 h-5 w-5" />
              </TrackedLink>
              <TrackedLink
                href="/upload"
                className={buttonStyles({ variant: 'ghost', size: 'lg', className: 'w-full border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 sm:w-auto' })}
                buttonType="landing_secondary_cta"
                source="landing_hero"
              >
                Upload Selfies
              </TrackedLink>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-200 lg:justify-start">
              {outcomes.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                  <Check className="h-4 w-4 text-accent-300" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="ml-auto max-w-md rounded-lg border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-100">Profile upgrade preview</p>
                  <p className="text-xs text-slate-300">From casual selfie to business-ready portrait</p>
                </div>
                <Sparkles className="h-5 w-5 text-accent-300" />
              </div>
              <Image
                src="/landing-headshot-showcase.png"
                alt="AI headshot preview grid"
                width={640}
                height={400}
                sizes="(min-width: 1024px) 420px, 100vw"
                className="aspect-[16/10] rounded-md object-cover"
              />
              <div className="mt-4 grid grid-cols-3 gap-3">
                {proof.map((item) => (
                  <div key={item.value} className="rounded-md bg-slate-950/60 p-3">
                    <p className="text-lg font-bold text-white">{item.value}</p>
                    <p className="mt-1 text-xs leading-4 text-slate-300">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-8 text-white">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {proof.map((item) => (
            <div key={item.value} className="rounded-lg border border-white/10 bg-white/5 px-5 py-4 text-center">
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="mt-1 text-sm text-slate-300">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="section-heading">Look credible wherever people find you first</h2>
            <p className="section-subheading mx-auto mt-4">
              A better profile photo can make LinkedIn outreach, job applications, founder bios, and team pages feel sharper in minutes.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {objections.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.title} className="p-6">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h2 className="section-heading">Three steps from selfie to polished profile photo</h2>
              <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                Upload a few clear selfies, choose the professional styles you want, and download portraits that are ready for your public profiles.
              </p>
              <TrackedLink
                href="/pricing?plan=basic#plans"
                className={buttonStyles({ size: 'lg', className: 'mt-7 w-full text-center sm:w-auto' })}
                buttonType="landing_process_cta"
                source="landing_process"
                metadata={{ plan: 'basic', price: PLANS.basic.price }}
              >
                View Credit Packs
              </TrackedLink>
            </div>

            <div className="grid gap-4">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <Card key={step.title} className="p-5">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-primary-600 shadow-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-primary-600">Step {index + 1}</p>
                        <h3 className="mt-1 text-lg font-bold text-slate-900">{step.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{step.text}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr] lg:items-start">
            <div className="rounded-lg bg-slate-950 p-6 text-white sm:p-8">
              <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-accent-300">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-accent-300 text-accent-300" />
                ))}
                Built for profile upgrades that need to look credible
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                Start with {PLANS.basic.name}: {PLANS.basic.credits} headshots for ${PLANS.basic.price}
              </h2>
              <p className="mt-4 text-slate-300">
                One-time credits, {PLANS.basic.validityDays} days validity after first generation, and profile-ready {PLANS.basic.resolution} downloads.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <TrackedLink
                  href="/pricing?plan=basic#plans"
                  className={buttonStyles({ size: 'lg', className: 'w-full bg-white text-slate-950 hover:bg-slate-100 sm:w-auto' })}
                  buttonType="landing_offer_cta"
                  source="landing_offer"
                  metadata={{ plan: 'basic', price: PLANS.basic.price }}
                >
                  Choose {PLANS.basic.name}
                </TrackedLink>
                <Link
                  href="/pricing"
                  className="inline-flex min-h-[56px] items-center justify-center rounded-xl border border-white/20 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10"
                >
                  View Plans
                </Link>
              </div>
            </div>

            <div className="grid gap-3">
              {[
                `${PLANS.basic.credits} AI-generated headshots`,
                `${PLANS.basic.validityDays} days validity`,
                `${PLANS.basic.resolution} downloads`,
                'Commercial use rights',
                'Unlimited downloads',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4">
                  <Check className="h-5 w-5 shrink-0 text-accent-500" />
                  <span className="font-medium text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-12 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="section-heading">Questions before you start?</h2>
            <p className="section-subheading mx-auto mt-4">
              Clear answers about credits, uploads, and usage before you buy.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {faqs.map((faq) => (
              <Card key={faq.q} className="p-5">
                <h3 className="font-bold text-slate-900">{faq.q}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-600 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to make the profile photo the easy part?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100">
            Buy credits once, pick the styles you want, and generate professional portraits without waiting on a studio booking.
          </p>
          <TrackedLink
            href="/pricing?plan=basic#plans"
            className={buttonStyles({ size: 'lg', className: 'mt-7 w-full bg-white text-primary-600 shadow-xl hover:bg-primary-50 sm:w-auto' })}
            buttonType="landing_bottom_cta"
            source="landing_bottom"
            metadata={{ plan: 'basic', price: PLANS.basic.price }}
          >
            Generate AI Headshots
          </TrackedLink>
        </div>
      </section>

      <Footer />
    </main>
  )
}
