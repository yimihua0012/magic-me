import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import StaticMarketingShell from '@/components/seo/static-marketing-shell'
import KeywordStrip from '@/components/seo/keyword-strip'
import { blogPosts } from '@/lib/seo-content'
import { buttonStyles } from '@/components/ui/button-styles'

type BlogArticlePageProps = {
  params: Promise<{
    slug: string
  }>
}

function getPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) {
    return {
      title: 'AI Headshot Article',
    }
  }

  return {
    title: post.title,
    description: post.description,
    keywords: [...post.keywords],
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `/blog/${post.slug}`,
    },
  }
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) {
    notFound()
  }

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3)

  return (
    <StaticMarketingShell>
      <main>
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Link href="/blog" className="mb-8 inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to blog
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{post.title}</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">{post.description}</p>
          <div className="mt-7">
            <KeywordStrip keywords={post.keywords} />
          </div>

          <div className="mt-10 rounded-lg bg-slate-50 p-6 text-base leading-8 text-slate-700">
            <p>{post.intro}</p>
          </div>

          <div className="mt-10 space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-bold text-slate-950">{section.heading}</h2>
                <p className="mt-3 text-base leading-8 text-slate-700">{section.body}</p>
              </section>
            ))}
          </div>

          <section className="mt-12 rounded-lg border border-primary-100 bg-primary-50 p-6">
            <h2 className="text-2xl font-bold text-slate-950">Try the workflow in Magic-Headshot</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Use Magic-Headshot when you need AI headshots for LinkedIn, professional headshots without photographer
              scheduling, an AI resume photo generator look, or a realistic professional profile photo maker workflow.
            </p>
            <Link href="/pricing" className={buttonStyles({ size: 'lg', className: 'mt-6' })}>
              View Credit Packs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </section>
        </article>

        <section className="border-t border-slate-200 bg-slate-50 py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-950">Related AI Headshot Guides</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.slug} href={`/blog/${item.slug}`} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm hover:border-primary-200">
                  <h3 className="font-bold leading-snug text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </StaticMarketingShell>
  )
}
