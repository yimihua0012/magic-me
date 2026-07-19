import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, HelpCircle, Images, Lightbulb, Link2, Sparkles } from 'lucide-react'
import Navbar from '@/components/layout/localized-navbar'
import Footer from '@/components/layout/localized-footer'
import { buttonStyles } from '@/components/ui/button-styles'
import { FaqPageJsonLd, WebPageJsonLd } from '@/components/seo/page-json-ld'
import { localePath, type Locale } from '@/lib/i18n'
import { withSource } from '@/lib/navigation-source'
import { type UseCasePageContent, type UseCasePageSlug, useCaseHeroImage } from '@/lib/use-case-pages'

type UseCasePageViewProps = {
  locale: Locale
  slug: UseCasePageSlug
  content: UseCasePageContent
}

export default function UseCasePageView({ locale, slug, content }: UseCasePageViewProps) {
  const path = `/${slug}`
  const pricingHref = withSource(localePath(locale, '/pricing'), `${slug}_primary_${locale}`)
  const sampleHref = withSource(localePath(locale, '/sample'), `${slug}_sample_${locale}`)

  return (
    <>
      <WebPageJsonLd
        locale={locale}
        path={path}
        title={content.title}
        description={content.description}
        image={useCaseHeroImage}
      />
      <FaqPageJsonLd
        locale={locale}
        path={path}
        title={content.faqTitle}
        description={content.faqText}
        items={content.faqs}
      />
      <main className="min-h-screen bg-white">
        <Navbar locale={locale} solid />

        <section className="relative overflow-hidden bg-slate-950 text-white">
          <Image
            src={useCaseHeroImage}
            alt={content.h1}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-slate-950/70" />
          <div className="relative mx-auto grid min-h-[680px] max-w-7xl gap-10 px-4 pb-14 pt-24 sm:px-6 sm:pt-28 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:pt-32">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-accent-300" />
                {content.eyebrow}
              </div>
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                {content.h1}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg">
                {content.intro}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={pricingHref} className={buttonStyles({ size: 'lg', className: 'w-full bg-white text-slate-950 shadow-xl hover:bg-slate-100 sm:w-auto' })}>
                  {content.primaryCta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href={sampleHref} className={buttonStyles({ variant: 'ghost', size: 'lg', className: 'w-full border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 sm:w-auto' })}>
                  {content.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="ml-auto max-w-md rounded-lg border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{content.eyebrow}</p>
                    <p className="text-xs text-slate-300">{content.description}</p>
                  </div>
                  <Images className="h-5 w-5 text-accent-300" />
                </div>
                <Image
                  src={useCaseHeroImage}
                  alt={content.title}
                  width={640}
                  height={640}
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className="aspect-square w-full rounded-md object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="content-auto border-b border-slate-200 bg-white py-10 sm:py-14">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-primary-600">{content.eyebrow}</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                {content.h1}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{content.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-bold text-slate-950">{content.guidanceTitle}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{content.guidanceText}</p>
              </article>
              <article className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-bold text-slate-950">{content.casesTitle}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{content.casesText}</p>
              </article>
            </div>
          </div>
        </section>

        <section className="content-auto py-12 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                <Lightbulb className="h-5 w-5" />
              </div>
              <h2 className="section-heading">{content.casesTitle}</h2>
              <p className="section-subheading mx-auto mt-4">{content.casesText}</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {content.cases.map((item) => (
                <article key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="content-auto bg-slate-50 py-12 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:px-8">
            <div>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-primary-600 shadow-sm">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h2 className="section-heading">{content.guidanceTitle}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">{content.guidanceText}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {content.checklist.map((item) => (
                <div key={item} className="flex min-h-[84px] items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" />
                  <p className="text-sm font-semibold leading-6 text-slate-800">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="content-auto py-12 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  <Link2 className="h-5 w-5" />
                </div>
                <h2 className="section-heading">{content.linksTitle}</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">{content.linksText}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {content.relatedLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={localePath(locale, item.href)}
                    className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-primary-300 hover:bg-primary-50"
                  >
                    <h3 className="flex items-center justify-between gap-3 text-base font-bold text-slate-950">
                      {item.label}
                      <ArrowRight className="h-4 w-4 shrink-0 text-primary-600 transition-transform group-hover:translate-x-1" />
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="content-auto bg-slate-950 py-12 text-white sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-accent-300">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">{content.faqTitle}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-300">{content.faqText}</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {content.faqs.map((faq) => (
                <article key={faq.question} className="rounded-lg border border-white/10 bg-white/5 p-5">
                  <h3 className="font-bold text-white">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="content-auto bg-primary-600 py-12 text-white sm:py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">{content.primaryCta}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-primary-100">{content.description}</p>
            <Link href={pricingHref} className={buttonStyles({ size: 'lg', className: 'mt-7 w-full bg-white text-primary-600 shadow-xl hover:bg-primary-50 sm:w-auto' })}>
              {content.primaryCta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>

        <Footer locale={locale} />
      </main>
    </>
  )
}
