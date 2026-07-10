import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react'
import BlogCoverImage from '@/components/blog/blog-cover-image'
import Navbar from '@/components/layout/localized-navbar'
import Footer from '@/components/layout/localized-footer'
import KeywordStrip from '@/components/seo/keyword-strip'
import BlogPostJsonLd from '@/components/seo/blog-post-json-ld'
import { buttonStyles } from '@/components/ui/button-styles'
import { blogGeneratedPortraitImages } from '@/lib/seo-content'
import { getBlogLanguageAlternates, getCmsPublishedBlogPosts, getPublishedBlogPost } from '@/lib/blog-store'
import { OPEN_GRAPH_LOCALES, isRoutedLocale, localePath, ROUTED_LOCALES, type RoutedLocale } from '@/lib/i18n'

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

const blogArticleLabels: Record<
  RoutedLocale,
  {
    fallbackTitle: string
    backToBlog: string
    ctaTitle: string
    ctaText: string
    ctaButton: string
    relatedTitle: string
  }
> = {
  es: {
    fallbackTitle: 'Articulo sobre AI headshots',
    backToBlog: 'Volver al blog',
    ctaTitle: 'Crea tus propios retratos profesionales',
    ctaText: 'Usa Magic-Headshot para generar fotos de perfil realistas para LinkedIn, CV, sitios web, redes y paginas de empresa.',
    ctaButton: 'Ver paquetes de creditos',
    relatedTitle: 'Guias relacionadas',
  },
  fr: {
    fallbackTitle: 'Article sur les portraits IA',
    backToBlog: 'Retour au blog',
    ctaTitle: 'Creez vos propres portraits professionnels',
    ctaText: 'Utilisez Magic-Headshot pour generer des photos de profil realistes pour LinkedIn, CV, sites web, reseaux et pages d’entreprise.',
    ctaButton: 'Voir les packs de credits',
    relatedTitle: 'Guides lies',
  },
  de: {
    fallbackTitle: 'Artikel zu KI-Headshots',
    backToBlog: 'Zurueck zum Blog',
    ctaTitle: 'Erstelle deine eigenen professionellen Portrats',
    ctaText: 'Nutze Magic-Headshot fuer realistische Profilbilder fuer LinkedIn, Bewerbungen, Websites, Social Media und Unternehmensseiten.',
    ctaButton: 'Credit-Pakete ansehen',
    relatedTitle: 'Verwandte Guides',
  },
  ja: {
    fallbackTitle: 'AIヘッドショットの記事',
    backToBlog: 'ブログへ戻る',
    ctaTitle: '自分用のプロフェッショナル写真を作成',
    ctaText: 'Magic-Headshotで、LinkedIn、履歴書、Webサイト、SNS、会社ページに使える自然なプロフィール写真を生成できます。',
    ctaButton: 'クレジットプランを見る',
    relatedTitle: '関連ガイド',
  },
}

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const locale of ROUTED_LOCALES) {
    const posts = await getCmsPublishedBlogPosts(locale)
    posts.forEach((post) => params.push({ locale, slug: post.slug }))
  }
  return params
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isRoutedLocale(locale)) return {}
  const post = await getPublishedBlogPost(slug, locale)
  if (!post || post.source !== 'cms') return { title: blogArticleLabels[locale].fallbackTitle }
  const alternates = await getBlogLanguageAlternates(post)
  const posts = await getCmsPublishedBlogPosts(locale)
  const postIndex = posts.findIndex((item) => item.slug === post.slug)
  const image = getBlogArticleImage(post, postIndex)

  return {
    title: post.title,
    description: post.description,
    keywords: [...post.keywords],
    alternates: {
      canonical: localePath(locale, `/blog/${post.slug}`),
      languages: alternates,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: localePath(locale, `/blog/${post.slug}`),
      locale: OPEN_GRAPH_LOCALES[locale],
      images: image ? [image.url] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: image ? [image.url] : undefined,
    },
  }
}

export default async function LocalizedBlogArticlePage({ params }: PageProps) {
  const { locale, slug } = await params
  if (!isRoutedLocale(locale)) notFound()
  const routedLocale = locale as RoutedLocale
  const post = await getPublishedBlogPost(slug, routedLocale)

  if (!post || post.source !== 'cms') {
    notFound()
  }

  const posts = await getCmsPublishedBlogPosts(routedLocale)
  const postIndex = posts.findIndex((item) => item.slug === post.slug)
  const image = getBlogArticleImage(post, postIndex)
  const related = getRelatedPosts(posts, post.slug, post.enhancement?.relatedSlugs)
  const labels = blogArticleLabels[routedLocale]

  return (
    <div className="min-h-screen bg-white">
      <BlogPostJsonLd post={post} index={Math.max(postIndex, 0)} imagePath={image?.url} locale={routedLocale} />
      <Navbar locale={routedLocale} />
      <main className="pt-20">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Link href={localePath(routedLocale, '/blog')} className="mb-8 inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700">
            <ArrowLeft className="mr-1 h-4 w-4" />
            {labels.backToBlog}
          </Link>
          <h1 className="break-words text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">{post.title}</h1>
          <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-500">
            <CalendarDays className="h-4 w-4" />
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(routedLocale) : ''}
          </div>
          <p className="mt-5 break-words text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">{post.description}</p>
          <div className="mt-7">
            <KeywordStrip keywords={post.keywords} />
          </div>

          {image && (
            <div className="relative mt-10 aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
              <BlogCoverImage
                src={image.url}
                alt={image.alt}
                priority
                sizes="(min-width: 768px) 768px, calc(100vw - 32px)"
                className="h-full w-full object-cover object-top"
              />
            </div>
          )}

          <div className="mt-10 rounded-lg bg-slate-50 p-5 text-base leading-8 text-slate-700 sm:p-6">
            <p>{post.intro}</p>
          </div>

          <div className="content-auto mt-10 space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="break-words text-2xl font-bold text-slate-950">{section.heading}</h2>
                <p className="mt-3 text-base leading-8 text-slate-700">{section.body}</p>
              </section>
            ))}
          </div>

          <section className="content-auto mt-12 rounded-lg border border-primary-100 bg-primary-50 p-6">
            <h2 className="break-words text-2xl font-bold text-slate-950">{labels.ctaTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {labels.ctaText}
            </p>
            <Link href={localePath(routedLocale, '/pricing')} className={buttonStyles({ size: 'lg', className: 'mt-6 w-full text-center sm:w-auto' })}>
              {labels.ctaButton}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </section>
        </article>

        {related.length > 0 && (
          <section className="content-auto border-t border-slate-200 bg-slate-50 py-12">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <h2 className="break-words text-2xl font-bold text-slate-950">{labels.relatedTitle}</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {related.map((item) => (
                  <Link key={item.slug} href={localePath(routedLocale, `/blog/${item.slug}`)} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-primary-200 sm:p-5">
                    <h3 className="break-words font-bold leading-snug text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer locale={routedLocale} />
    </div>
  )
}

function getBlogArticleImage(post: { coverImage?: { url: string; alt: string } }, postIndex: number) {
  if (post.coverImage) return post.coverImage

  const fallbackImages: readonly { src: string; alt: string }[] = blogGeneratedPortraitImages
  if (fallbackImages.length === 0) return null

  const fallbackPortrait = fallbackImages[Math.max(postIndex, 0) % fallbackImages.length]
  return { url: fallbackPortrait.src, alt: fallbackPortrait.alt }
}

function getRelatedPosts<T extends { slug: string }>(
  posts: T[],
  currentSlug: string,
  relatedSlugs: string[] | undefined,
) {
  const related: T[] = []
  const used = new Set([currentSlug])

  for (const relatedSlug of relatedSlugs || []) {
    const post = posts.find((item) => item.slug === relatedSlug)
    if (!post || used.has(post.slug)) continue
    used.add(post.slug)
    related.push(post)
    if (related.length >= 3) return related
  }

  for (const post of posts) {
    if (used.has(post.slug)) continue
    used.add(post.slug)
    related.push(post)
    if (related.length >= 3) return related
  }

  return related
}
