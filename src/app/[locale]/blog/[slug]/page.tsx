import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import BlogCoverImage from '@/components/blog/blog-cover-image'
import BlogPhotoToolsCta from '@/components/blog/blog-photo-tools-cta'
import Navbar from '@/components/layout/localized-navbar'
import Footer from '@/components/layout/localized-footer'
import KeywordStrip from '@/components/seo/keyword-strip'
import BlogPostJsonLd from '@/components/seo/blog-post-json-ld'
import { blogGeneratedPortraitImages } from '@/lib/seo-content'
import { getBlogLanguageAlternates, getCmsPublishedBlogPosts, getPublishedBlogPost, getRelatedPublishedBlogPosts } from '@/lib/blog-store'
import { OPEN_GRAPH_LOCALES, isRoutedLocale, localePath, ROUTED_LOCALES, type RoutedLocale } from '@/lib/i18n'

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

const blogArticleLabels: Record<
  RoutedLocale,
  {
    fallbackTitle: string
    backToBlog: string
    toolsDescription: string
    toolsLink: string
    workflowDescription: string
    workflowLink: string
    pricingHeading: string
    pricingDescription: string
    pricingLink: string
    relatedTitle: string
  }
> = {
  es: {
    fallbackTitle: 'Articulo sobre AI headshots',
    backToBlog: 'Volver al blog',
    toolsDescription: 'Despues de leer esta guia, usa las herramientas de foto para recortar, cambiar tamano, preparar hojas imprimibles o ajustar el fondo antes de publicar o enviar una imagen.',
    toolsLink: 'Abrir herramientas de foto',
    workflowDescription: 'Genera retratos IA realistas para LinkedIn, CV, paginas de equipo y perfiles profesionales cuando ya tengas claro el estilo y los controles que necesitas.',
    workflowLink: 'Crear retratos',
    pricingHeading: 'Elige el paquete de creditos adecuado',
    pricingDescription: 'Compara creditos de pago unico antes de producir imagenes finales para perfil, busqueda de empleo, pagina de equipo o foto tipo documento.',
    pricingLink: 'Ver precios',
    relatedTitle: 'Guias relacionadas',
  },
  fr: {
    fallbackTitle: 'Article sur les portraits IA',
    backToBlog: 'Retour au blog',
    toolsDescription: 'Apres cette lecture, utilisez les outils photo pour recadrer une image, reduire son poids, preparer une planche imprimable ou ajuster le fond avant publication.',
    toolsLink: 'Ouvrir les outils photo',
    workflowDescription: 'Generez des portraits IA realistes pour LinkedIn, CV, pages equipe et profils professionnels apres avoir choisi le style et les controles utiles.',
    workflowLink: 'Creer des portraits',
    pricingHeading: 'Choisir le bon pack de credits',
    pricingDescription: 'Comparez les packs de credits avant de produire vos images finales pour un profil, une candidature, une page equipe ou une photo de document.',
    pricingLink: 'Voir les tarifs',
    relatedTitle: 'Guides lies',
  },
  de: {
    fallbackTitle: 'Artikel zu KI-Headshots',
    backToBlog: 'Zurueck zum Blog',
    toolsDescription: 'Nach diesem Guide kannst du die Fotowerkzeuge nutzen, um Bilder zuzuschneiden, Dateigroessen anzupassen, Druckboegen vorzubereiten oder Hintergruende zu pruefen.',
    toolsLink: 'Fotowerkzeuge oeffnen',
    workflowDescription: 'Erstelle realistische KI-Portrats fuer LinkedIn, Bewerbungen, Teamseiten und berufliche Profile, sobald Stil und Qualitaetschecks klar sind.',
    workflowLink: 'Portrats erstellen',
    pricingHeading: 'Passendes Credit-Paket waehlen',
    pricingDescription: 'Vergleiche Einmal-Credits, bevor du finale Bilder fuer Profil, Bewerbung, Teamseite oder dokumentaehnliche Fotos produzierst.',
    pricingLink: 'Preise ansehen',
    relatedTitle: 'Verwandte Guides',
  },
  zh: {
    fallbackTitle: 'AI职业形象照指南',
    backToBlog: '返回 Blog',
    toolsDescription: '阅读这篇指南后，可以使用 Photo Tools 裁剪证件照、压缩图片、处理背景或准备打印排版。',
    toolsLink: '打开 Photo Tools',
    workflowDescription: '需要更自然的职业头像时，可以上传自拍并生成适合 LinkedIn、简历和个人资料的 AI 形象照。',
    workflowLink: '生成职业形象照',
    pricingHeading: '选择合适的点数包',
    pricingDescription: '比较一次性点数包，再决定生成多少职业风格照片。',
    pricingLink: '查看价格',
    relatedTitle: '相关阅读',
  },
  ja: {
    fallbackTitle: 'AIヘッドショットの記事',
    backToBlog: 'ブログへ戻る',
    toolsDescription: '記事を読んだあと、写真ツールで切り抜き、サイズ調整、印刷用レイアウト、背景色の確認を行い、提出や公開前の状態を整えられます。',
    toolsLink: '写真ツールを開く',
    workflowDescription: '用途や確認ポイントを決めたうえで、LinkedIn、履歴書、チーム紹介、仕事用プロフィール向けの自然なAI写真を作成できます。',
    workflowLink: '写真を作成',
    pricingHeading: 'クレジットプランを確認',
    pricingDescription: 'プロフィール更新、応募、チームページ、書類風写真などに使う最終画像を作る前に、必要なクレジット数を確認できます。',
    pricingLink: '料金を見る',
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
  const image = getBlogArticleImage(post, 0)

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

  const image = getBlogArticleImage(post, 0)
  const related = await getRelatedPublishedBlogPosts(routedLocale, post.slug, post.enhancement?.relatedSlugs)
  const labels = blogArticleLabels[routedLocale]

  return (
    <div className="min-h-screen bg-white">
      <BlogPostJsonLd post={post} index={0} imagePath={image?.url} locale={routedLocale} />
      <Navbar locale={routedLocale} />
      <main className="pt-20">
        <article className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
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
                sizes="(min-width: 1280px) 1216px, calc(100vw - 32px)"
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

        </article>

        <BlogPhotoToolsCta
          locale={routedLocale}
          photoTools={{
            heading: 'Try the photo tools',
            description: labels.toolsDescription,
            linkLabel: labels.toolsLink,
          }}
          workflow={{
            heading: 'Try the workflow in Magic-Headshot',
            description: labels.workflowDescription,
            linkLabel: labels.workflowLink,
          }}
          pricing={{
            heading: labels.pricingHeading,
            description: labels.pricingDescription,
            linkLabel: labels.pricingLink,
          }}
        />

        {related.length > 0 && (
          <section className="content-auto border-t border-slate-200 bg-slate-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
