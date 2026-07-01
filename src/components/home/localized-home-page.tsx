import Link from 'next/link'
import Image from 'next/image'
import { Camera, Check, Clock, Download, Shield, Sparkles, Star, Users, Zap } from 'lucide-react'
import Card from '@/components/ui/card'
import Footer from '@/components/layout/localized-footer'
import Navbar from '@/components/layout/localized-navbar'
import HeroHeadshotGallery from '@/components/home/hero-headshot-gallery'
import { buttonStyles } from '@/components/ui/button-styles'
import { appConfig } from '@/lib/config'
import { formatCurrency, getDefaultCurrencyForLocale } from '@/lib/currency'
import { localePath, type RoutedLocale } from '@/lib/i18n'
import { localizedPricingContent } from '@/lib/localized-pricing-content'
import { withSource } from '@/lib/navigation-source'
import type { LocalizedHomeContent } from '@/lib/localized-home-content'
import { PLANS, type PlanType } from '@backend/config/plans'

interface LocalizedHomePageProps {
  locale: RoutedLocale
  content: LocalizedHomeContent
}

const featureIcons = [
  <Zap key="zap" className="h-6 w-6" />,
  <Sparkles key="sparkles" className="h-6 w-6" />,
  <Shield key="shield" className="h-6 w-6" />,
  <Download key="download" className="h-6 w-6" />,
  <Clock key="clock" className="h-6 w-6" />,
  <Users key="users" className="h-6 w-6" />,
]

const styleImages = [
  '/home-pages/sample/professional%20headshots%20for%20team%20photos%20.jpeg',
  '/home-pages/sample/headshot-executive-portrait.jpg',
  '/home-pages/sample/high-likeness%20ai%20headshots.jpg',
  '/home-pages/sample/Perfect%20AI%20business%20portrait.jpg',
  '/home-pages/sample/perfect%20for%20my%20resume.jpg',
  '/home-pages/sample/AI%20Headshot%20Clean%20Luxury%20Social.jpeg',
]

const heroHeadshots = [
  {
    src: '/home-pages/headshot-linkedin-professional1.jpeg',
    alt: 'Professional AI headshot example',
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

const planIds: PlanType[] = ['basic', 'pro', 'premium']

const galleryLabels: Record<RoutedLocale, { badge: string; previewTitle: string; viewLabel: string }> = {
  es: {
    badge: 'Prueba 56 estilos de retrato IA',
    previewTitle: 'Vista previa del retrato',
    viewLabel: 'Ver más grande',
  },
  fr: {
    badge: 'Essayez 56 styles de portrait IA',
    previewTitle: 'Aperçu du portrait',
    viewLabel: 'Voir en grand',
  },
  de: {
    badge: '56 KI-Headshot-Stile testen',
    previewTitle: 'Headshot-Vorschau',
    viewLabel: 'Größer anzeigen',
  },
  ja: {
    badge: '56種類のAIヘッドショットスタイル',
    previewTitle: 'ヘッドショットのプレビュー',
    viewLabel: '大きく表示',
  },
}

function fillTemplate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template,
  )
}

export default function LocalizedHomePage({ locale, content }: LocalizedHomePageProps) {
  const currency = getDefaultCurrencyForLocale(locale)
  const gallery = galleryLabels[locale]
  const pricingContent = localizedPricingContent[locale]

  return (
    <main className="min-h-screen bg-white">
      <Navbar locale={locale} />

      <section className="relative overflow-hidden pb-10 pt-20 sm:pb-12 sm:pt-24 lg:pb-16 lg:pt-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="text-center lg:text-left">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1.5 text-xs font-medium text-primary-700 sm:mb-6 sm:px-4 sm:py-2 sm:text-sm">
                <Sparkles className="h-4 w-4" />
                {content.badge}
              </div>

              <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-6xl">
                {content.heading}
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-base text-slate-600 sm:mt-6 sm:text-xl lg:mx-0">
                {content.subheading}
              </p>

              <div className="relative z-10 mt-5 flex flex-col justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4 lg:justify-start">
                <Link href={withSource(localePath(locale, '/pricing'), `home_primary_${locale}`)} className={buttonStyles({ size: 'lg', className: 'w-full text-center sm:w-auto' })}>
                  {content.primaryCta}
                </Link>
                <Link href={withSource(localePath(locale, '/upload'), `home_secondary_upload_${locale}`)} className={buttonStyles({ variant: 'secondary', size: 'lg', className: 'w-full text-center sm:w-auto' })}>
                  {content.secondaryCta}
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 sm:mt-8 sm:gap-6 sm:text-sm lg:justify-start">
                {content.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-accent-500 sm:h-5 sm:w-5" />
                    {highlight}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto hidden w-full max-w-xl pb-12 sm:block">
              <HeroHeadshotGallery
                images={heroHeadshots}
                badgeText={gallery.badge}
                previewTitle={gallery.previewTitle}
                viewLabel={gallery.viewLabel}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-10 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-16">
            <h2 className="section-heading">{content.howItWorksTitle}</h2>
            <p className="section-subheading mx-auto mt-3 sm:mt-4">{content.howItWorksSubtitle}</p>
          </div>

          <div className="grid gap-3 sm:gap-6 md:grid-cols-3 md:gap-8">
            {content.steps.map((step, index) => (
              <div key={step.title} className="relative">
                <Card className="h-full p-5 text-center sm:p-8">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 sm:mb-6 sm:h-16 sm:w-16">
                    {index === 2 ? <Download className="h-8 w-8" /> : <Sparkles className="h-8 w-8" />}
                  </div>
                  <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-slate-900 sm:mb-3 sm:text-xl">{step.title}</h3>
                  <p className="text-sm text-slate-600 sm:text-base">{step.text}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-10 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-16">
            <h2 className="section-heading">{content.featuresTitle}</h2>
            <p className="section-subheading mx-auto mt-3 sm:mt-4">{content.featuresSubtitle}</p>
          </div>

          <div className="grid gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content.features.map((feature, index) => (
              <Card key={feature.title} className="p-4 sm:p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-600 sm:mb-4 sm:h-12 sm:w-12">
                  {featureIcons[index]}
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="examples" className="bg-slate-900 py-10 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-16">
            <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">{content.examplesTitle}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 sm:mt-4 sm:text-base">{content.examplesSubtitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {styleImages.map((src, index) => (
              <div key={src} className="group">
                <div className="relative aspect-square overflow-hidden rounded-xl border border-slate-700 bg-slate-800 transition-colors group-hover:border-primary-500">
                  <Image
                    src={src}
                    alt={`${content.styleNames[index]} AI headshot style example`}
                    fill
                    sizes="(min-width: 1024px) 180px, (min-width: 640px) 30vw, 45vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="mt-2 text-center text-xs font-medium sm:text-sm">{content.styleNames[index]}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center sm:mt-12">
            <Link href={withSource(localePath(locale, '/pricing'), `home_examples_pricing_${locale}`)} className={buttonStyles({ size: 'lg', className: 'w-full text-center sm:w-auto' })}>
              {content.examplesCta}
            </Link>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-10 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-16">
            <h2 className="section-heading">{content.testimonialsTitle}</h2>
            <p className="section-subheading mx-auto mt-3 sm:mt-4">{content.testimonialsSubtitle}</p>
          </div>

          <div className="grid gap-3 sm:gap-6 md:grid-cols-3 md:gap-8">
            {content.testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="p-4 sm:p-6">
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-5 text-sm text-slate-600 sm:mb-6 sm:text-base">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-600 text-sm font-semibold text-white">
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

      <section className="bg-slate-50 py-10 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-16">
            <h2 className="section-heading">{content.pricingTitle}</h2>
            <p className="section-subheading mx-auto mt-4">{content.pricingSubtitle}</p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-4 sm:gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {planIds.map((planId) => {
              const plan = PLANS[planId]
              const price = plan.prices[currency]
              const highlighted = planId === 'pro'
              const features = [
                `${plan.credits} ${pricingContent.headshots}`,
                fillTemplate(pricingContent.validityTemplate, { days: plan.validityDays }),
                pricingContent.highlights.resolution,
                pricingContent.highlights.downloads,
                pricingContent.highlights.commercial,
                ...(planId !== 'basic' ? [pricingContent.highlights.priority] : []),
                pricingContent.highlights.emailSupport,
                ...(planId === 'premium' ? [pricingContent.highlights.dedicatedSupport] : []),
              ]

              return (
                <Card key={planId} className={`relative p-6 sm:p-8 ${highlighted ? 'border-2 border-primary-500' : ''}`}>
                  {highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-500 px-3 py-1 text-xs font-semibold text-white">
                      {content.mostPopular}
                    </div>
                  )}
                  <h3 className="mb-2 text-lg font-semibold text-slate-900">{plan.name}</h3>
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900 sm:text-4xl">{formatCurrency(price.amount, currency)}</span>
                    <span className="text-sm text-slate-500 sm:text-base">/{content.perPurchase}</span>
                  </div>
                  <ul className="mb-4 space-y-3">
                    {features.map((feature, index) => (
                      <li
                        key={`${planId}-${feature}`}
                        className={`flex items-start gap-2 text-sm ${
                          index < 2 ? 'font-semibold text-primary-600' : 'text-slate-600'
                        }`}
                      >
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent-500" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <p className="mb-6 text-xs text-slate-500">{pricingContent.validityRule}</p>
                  <Link
                    href={withSource(localePath(locale, '/pricing'), `home_plan_${planId}_${locale}`)}
                    className={buttonStyles({ className: 'w-full text-center' })}
                  >
                    {fillTemplate(content.planCtaTemplate, { planName: plan.name })}
                  </Link>
                </Card>
              )
            })}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 sm:text-base">
            <Link href={withSource(localePath(locale, '/pricing'), `home_view_all_plans_${locale}`)} className="text-primary-600 hover:underline">
              {content.viewAllPlans}
            </Link>
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary-600 to-primary-700 py-10 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-white sm:mb-6 sm:text-3xl lg:text-4xl">{content.bottomTitle}</h2>
          <p className="mx-auto mb-6 max-w-2xl text-base text-primary-100 sm:mb-8 sm:text-lg">{content.bottomText}</p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <Link href={withSource(localePath(locale, '/pricing'), `home_bottom_primary_${locale}`)} className={buttonStyles({ size: 'lg', className: 'w-full bg-white text-primary-600 shadow-xl hover:bg-primary-50 sm:w-auto' })}>
              <Camera className="mr-2 h-5 w-5" />
              {content.bottomPrimaryCta}
            </Link>
            <Link href={withSource(localePath(locale, '/pricing'), `home_bottom_secondary_${locale}`)} className={buttonStyles({ variant: 'ghost', size: 'lg', className: 'w-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 sm:w-auto' })}>
              {content.bottomSecondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <Footer locale={locale} />
    </main>
  )
}
