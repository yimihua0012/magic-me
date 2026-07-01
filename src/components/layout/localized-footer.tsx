import Link from 'next/link'
import Image from 'next/image'
import { appConfig } from '@/lib/config'
import { localePath, type Locale } from '@/lib/i18n'
import { localizedLayoutContent } from '@/lib/localized-layout-content'
import { withSource } from '@/lib/navigation-source'

interface FooterProps {
  locale?: Locale
}

export default function Footer({ locale = 'en' }: FooterProps) {
  const homeHref = localePath(locale)
  const featuresHref = `${homeHref === '/' ? '' : homeHref}/#features`
  const pricingHref = localePath(locale, '/pricing')
  const uploadHref = localePath(locale, '/upload')
  const isEnglish = locale === 'en'
  const content = localizedLayoutContent[locale].footer

  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href={homeHref} className="mb-4 flex items-center gap-2">
              <Image src="/logo.svg" alt={appConfig.name} width={40} height={40} className="rounded-xl" />
              <span className="text-xl font-bold">{appConfig.name}</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              {content.tagline}
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{content.product}</h3>
            <ul className="space-y-3">
              <li>
                <Link href={withSource(featuresHref, `footer_features_${locale}`)} className="text-sm text-slate-400 transition-colors hover:text-white">
                  {content.features}
                </Link>
              </li>
              <li>
                <Link href={withSource(pricingHref, `footer_pricing_${locale}`)} className="text-sm text-slate-400 transition-colors hover:text-white">
                  {content.pricing}
                </Link>
              </li>
              <li>
                <Link href={withSource(uploadHref, `footer_generate_${locale}`)} className="text-sm text-slate-400 transition-colors hover:text-white">
                  {content.generate}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{content.resources}</h3>
            <ul className="space-y-3">
              <li>
                <Link href={withSource(localePath(locale, '/questions'), `footer_questions_${locale}`)} className="text-sm text-slate-400 transition-colors hover:text-white">
                  {content.questions}
                </Link>
              </li>
              <li>
                <Link href={withSource(localePath(locale, '/sample'), `footer_sample_${locale}`)} className="text-sm text-slate-400 transition-colors hover:text-white">
                  {content.samples}
                </Link>
              </li>
              {isEnglish && (
                <li>
                  <Link href="/blog" className="text-sm text-slate-400 transition-colors hover:text-white">
                    {content.blog}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">{content.legal}</h3>
            <ul className="space-y-3">
              <li>
                <Link href={withSource(localePath(locale, '/contact'), `footer_contact_${locale}`)} className="text-sm text-slate-400 transition-colors hover:text-white">
                  {content.contact}
                </Link>
              </li>
              <li>
                <Link href={localePath(locale, '/privacy')} className="text-sm text-slate-400 transition-colors hover:text-white">
                  {content.privacy}
                </Link>
              </li>
              <li>
                <Link href={localePath(locale, '/terms')} className="text-sm text-slate-400 transition-colors hover:text-white">
                  {content.terms}
                </Link>
              </li>
              <li>
                <Link href={localePath(locale, '/refund')} className="text-sm text-slate-400 transition-colors hover:text-white">
                  {content.refund}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8">
          <p className="text-sm text-slate-400">
            Copyright 2026 {appConfig.name}. {content.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
