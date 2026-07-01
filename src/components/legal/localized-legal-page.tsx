import Card from '@/components/ui/card'
import Footer from '@/components/layout/localized-footer'
import Navbar from '@/components/layout/localized-navbar'
import { appConfig } from '@/lib/config'
import type { RoutedLocale } from '@/lib/i18n'
import type { LegalPageContent } from '@/lib/localized-legal-content'

interface LocalizedLegalPageProps {
  locale: RoutedLocale
  content: LegalPageContent
}

export default function LocalizedLegalPage({ locale, content }: LocalizedLegalPageProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar locale={locale} />

      <main className="pb-16 pt-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold text-primary-600">{appConfig.name}</p>
          <h1 className="mb-5 text-3xl font-bold text-slate-900">{content.heading}</h1>
          <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {content.notice}
          </div>

          <div className="space-y-6 text-slate-600">
            {content.sections.map((section) => (
              <Card key={section.title} className="p-6">
                <h2 className="mb-3 text-xl font-semibold text-slate-900">{section.title}</h2>
                {section.body?.map((paragraph) => (
                  <p key={paragraph} className="mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="list-disc space-y-2 pl-6">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.ordered && (
                  <ol className="list-decimal space-y-2 pl-6">
                    {section.ordered.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                )}
              </Card>
            ))}

            <p className="mt-8 text-sm text-slate-500">Last Updated: {content.lastUpdated}</p>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  )
}
