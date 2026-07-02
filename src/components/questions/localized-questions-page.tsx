import Link from 'next/link'
import { ArrowRight, HelpCircle, SearchCheck } from 'lucide-react'
import Navbar from '@/components/layout/localized-navbar'
import Footer from '@/components/layout/localized-footer'
import Card from '@/components/ui/card'
import { buttonStyles } from '@/components/ui/button-styles'
import { localePath, type RoutedLocale } from '@/lib/i18n'
import { withSource } from '@/lib/navigation-source'
import type { LocalizedQuestionsContent } from '@/lib/localized-marketing-content'

interface LocalizedQuestionsPageProps {
  locale: RoutedLocale
  content: LocalizedQuestionsContent
}

export default function LocalizedQuestionsPage({ locale, content }: LocalizedQuestionsPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar locale={locale} />

      <main className="pt-20">
        <section className="bg-slate-50 py-14 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">{content.title}</h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              {content.description}
            </p>
          </div>
        </section>

        <section className="content-auto py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center gap-3">
              <SearchCheck className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-slate-950">{content.commonTitle}</h2>
            </div>
            <div className="space-y-4">
              {content.questions.map((item) => (
                <Card key={item.question} className="p-6">
                  <h3 className="text-lg font-bold text-slate-950">{item.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="content-auto bg-primary-600 py-12 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold sm:text-3xl">{content.ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-primary-100">{content.ctaText}</p>
            <Link
              href={withSource(localePath(locale, '/sample'), `questions_cta_sample_${locale}`)}
              className={buttonStyles({ size: 'lg', className: 'mt-7 bg-white text-primary-600 hover:bg-primary-50' })}
            >
              {content.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  )
}
