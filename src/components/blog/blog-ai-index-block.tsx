import Link from 'next/link'
import { CheckCircle2, HelpCircle, Table2 } from 'lucide-react'
import { getBlogAiIndexEnhancement } from '@/lib/blog-ai-index-enhancements'

type BlogAiIndexBlockProps = {
  slug: string
}

export default function BlogAiIndexBlock({ slug }: BlogAiIndexBlockProps) {
  const enhancement = getBlogAiIndexEnhancement(slug)
  if (!enhancement) return null

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: enhancement.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <section className="content-auto mt-10 space-y-8" aria-label="Quick answer and facts">
      <div className="rounded-lg border border-primary-100 bg-primary-50 p-5 sm:p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-primary-700">{enhancement.answerLabel}</p>
        <h2 className="mt-2 break-words text-2xl font-bold text-slate-950">{enhancement.answerHeading}</h2>
        <p className="mt-3 text-base leading-8 text-slate-700">{enhancement.directAnswer}</p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {enhancement.quickFacts.map((fact) => (
            <div key={`${fact.label}-${fact.value}`} className="rounded-md bg-white p-4 shadow-sm">
              <dt className="text-xs font-bold uppercase tracking-wide text-slate-500">{fact.label}</dt>
              <dd className="mt-2 break-words text-sm font-bold leading-6 text-slate-950">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center gap-3">
          <Table2 className="h-6 w-6 text-primary-600" />
          <h2 className="break-words text-2xl font-bold text-slate-950">{enhancement.table.title}</h2>
        </div>
        <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-950">
              <tr>
                {enhancement.table.headers.map((header) => (
                  <th key={header} scope="col" className="px-4 py-3 font-bold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {enhancement.table.rows.map((row) => (
                <tr key={row.join('|')}>
                  {row.map((cell, index) => (
                    <td key={`${row.join('|')}-${index}`} className="px-4 py-3 align-top leading-6 text-slate-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {enhancement.table.note && <p className="mt-3 text-sm leading-6 text-slate-500">{enhancement.table.note}</p>}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <HelpCircle className="h-6 w-6 text-primary-600" />
            <h2 className="break-words text-2xl font-bold text-slate-950">{enhancement.faqTitle}</h2>
          </div>
          <div className="mt-5 space-y-5">
            {enhancement.faq.map((item) => (
              <div key={item.question}>
                <h3 className="break-words font-bold text-slate-950">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-accent-100 bg-accent-50 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-accent-600" />
            <h2 className="break-words text-2xl font-bold text-slate-950">{enhancement.cta.heading}</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">{enhancement.cta.description}</p>
          <Link href={enhancement.cta.href} className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-primary-600 px-5 text-center text-sm font-bold text-white shadow-md shadow-primary-600/20 transition hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/25 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
            {enhancement.cta.label}
          </Link>
          <div className="mt-6 space-y-3">
            {enhancement.links.map((link) => (
              <Link key={link.href} href={link.href} className="block rounded-md bg-white p-3 text-sm font-semibold leading-6 text-slate-700 shadow-sm hover:text-primary-700">
                {link.label}
              </Link>
            ))}
          </div>
        </aside>
      </div>
      </section>
    </>
  )
}
