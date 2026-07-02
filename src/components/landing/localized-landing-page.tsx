import Image from 'next/image'
import { ArrowRight, BriefcaseBusiness, Check, Clock3, Download, Linkedin, ShieldCheck, Upload, WandSparkles } from 'lucide-react'
import Navbar from '@/components/layout/localized-navbar'
import Footer from '@/components/layout/localized-footer'
import Card from '@/components/ui/card'
import { buttonStyles } from '@/components/ui/button-styles'
import { localePath, type RoutedLocale } from '@/lib/i18n'
import { withSource } from '@/lib/navigation-source'
import type { LocalizedLandingContent } from '@/lib/localized-marketing-content'

interface LocalizedLandingPageProps {
  locale: RoutedLocale
  content: LocalizedLandingContent
}

const benefitIcons = [ShieldCheck, BriefcaseBusiness, Clock3]
const stepIcons = [Upload, WandSparkles, Download]

export default function LocalizedLandingPage({ locale, content }: LocalizedLandingPageProps) {
  return (
    <main className="min-h-screen bg-white">
      <Navbar locale={locale} />

      <section className="relative overflow-hidden bg-slate-950 text-white">
        <Image
          src="/landing-headshot-showcase.png"
          alt={content.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-slate-950/75" />
        <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 pb-14 pt-24 sm:min-h-[720px] sm:px-6 sm:pt-28 lg:grid-cols-[1.03fr_0.97fr] lg:px-8 lg:pt-32">
          <div className="max-w-3xl text-center lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
              <Linkedin className="h-4 w-4 text-sky-300" />
              {content.badge}
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {content.heading}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg lg:mx-0">
              {content.subheading}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <a href={withSource(localePath(locale, '/pricing'), `landing_hero_pricing_${locale}`)} className={buttonStyles({ size: 'lg', className: 'w-full bg-white text-slate-950 shadow-xl hover:bg-slate-100 sm:w-auto' })}>
                {content.primaryCta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a href={withSource(localePath(locale, '/upload'), `landing_hero_upload_${locale}`)} className={buttonStyles({ variant: 'ghost', size: 'lg', className: 'w-full border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 sm:w-auto' })}>
                {content.secondaryCta}
              </a>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-200 lg:justify-start">
              {content.outcomes.map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2">
                  <Check className="h-4 w-4 text-accent-300" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="content-auto bg-slate-950 py-8 text-white">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {content.proof.map((item) => (
            <div key={item.value} className="rounded-lg border border-white/10 bg-white/5 px-5 py-4 text-center">
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="mt-1 text-sm text-slate-300">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="content-auto py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="section-heading">{content.benefitsTitle}</h2>
            <p className="section-subheading mx-auto mt-4">{content.benefitsText}</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {content.benefits.map((item, index) => {
              const Icon = benefitIcons[index] ?? ShieldCheck
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

      <section className="content-auto bg-slate-50 py-12 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h2 className="section-heading">{content.stepsTitle}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{content.stepsText}</p>
              <a href={withSource(localePath(locale, '/pricing'), `landing_steps_pricing_${locale}`)} className={buttonStyles({ size: 'lg', className: 'mt-7 w-full text-center sm:w-auto' })}>
                {content.primaryCta}
              </a>
            </div>
            <div className="grid gap-4">
              {content.steps.map((step, index) => {
                const Icon = stepIcons[index] ?? Upload
                return (
                  <Card key={step.title} className="p-5">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-primary-600 shadow-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
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

      <section className="content-auto bg-primary-600 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">{content.bottomTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-primary-100">{content.bottomText}</p>
          <a href={withSource(localePath(locale, '/pricing'), `landing_bottom_pricing_${locale}`)} className={buttonStyles({ size: 'lg', className: 'mt-7 w-full bg-white text-primary-600 shadow-xl hover:bg-primary-50 sm:w-auto' })}>
            {content.primaryCta}
          </a>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  )
}
