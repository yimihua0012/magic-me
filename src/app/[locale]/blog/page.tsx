import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, BookOpen, CalendarDays } from 'lucide-react'
import BlogCoverImage from '@/components/blog/blog-cover-image'
import BlogPhotoToolsCta from '@/components/blog/blog-photo-tools-cta'
import Navbar from '@/components/layout/localized-navbar'
import Footer from '@/components/layout/localized-footer'
import BlogJsonLd from '@/components/seo/blog-json-ld'
import KeywordStrip from '@/components/seo/keyword-strip'
import { blogGeneratedPortraitImages } from '@/lib/seo-content'
import { getBlogPublishDate } from '@/lib/blog-dates'
import {
  blogCategoryPath,
  blogPostCategoryLabel,
  getBlogCategoriesFromPosts,
  getBlogIndexLanguageAlternates,
  getCmsPublishedBlogPosts,
  localeHasPublishedCmsBlogPosts,
  slugifyBlogCategory,
} from '@/lib/blog-store'
import { OPEN_GRAPH_LOCALES, isRoutedLocale, localePath, ROUTED_LOCALES, type RoutedLocale } from '@/lib/i18n'

type PageProps = {
  params: Promise<{ locale: string }>
}

const localizedBlogIndexContent: Record<
  RoutedLocale,
  {
    title: string
    description: string
    heading: string
    intro: string
    keywords: string[]
    readArticle: string
    categoriesHeading: string
    categoriesDescription: string
    toolsHeading: string
    toolsDescription: string
    toolsLink: string
    workflowHeading: string
    workflowDescription: string
    workflowLink: string
    pricingHeading: string
    pricingDescription: string
    pricingLink: string
  }
> = {
  es: {
    title: 'Blog de AI headshots y fotos profesionales | Magic-Headshot',
    description:
      'Guias en espanol sobre AI headshots, fotos para LinkedIn, CV, perfiles de empresa, retratos realistas y herramientas de foto para uso profesional o creativo.',
    heading: 'Blog de AI headshots',
    intro:
      'Guias practicas para elegir retratos IA realistas, preparar fotos base, mejorar perfiles profesionales y usar imagenes para LinkedIn, CV, marca personal o proyectos creativos.',
    keywords: ['AI headshots', 'fotos para LinkedIn', 'foto profesional IA', 'retrato realista', 'foto para CV', 'perfil profesional'],
    readArticle: 'Leer articulo',
    categoriesHeading: 'Explorar categorias del blog',
    categoriesDescription: 'Usa estas paginas para agrupar guias sobre perfiles, CV, documentos, equipos y decisiones antes de publicar una foto profesional.',
    toolsHeading: 'Try the photo tools',
    toolsDescription: 'Despues de leer una guia, usa las herramientas de foto para recortar, cambiar tamano, preparar hojas imprimibles o ajustar el fondo antes de publicar o enviar una imagen.',
    toolsLink: 'Abrir herramientas de foto',
    workflowHeading: 'Try the workflow in Magic-Headshot',
    workflowDescription: 'Genera retratos IA realistas para LinkedIn, CV, paginas de equipo y perfiles profesionales cuando ya tengas claro el estilo y los controles que necesitas.',
    workflowLink: 'Crear retratos',
    pricingHeading: 'Elige el paquete de creditos adecuado',
    pricingDescription: 'Compara creditos de pago unico antes de producir imagenes finales para perfil, busqueda de empleo, pagina de equipo o foto tipo documento.',
    pricingLink: 'Ver precios',
  },
  fr: {
    title: 'Blog sur les portraits IA et photos professionnelles | Magic-Headshot',
    description:
      'Guides en francais sur les portraits IA, photos LinkedIn, CV, profils professionnels, portraits realistes et outils photo pour usages business ou creatifs.',
    heading: 'Blog portraits IA',
    intro:
      'Des guides pratiques pour choisir un portrait IA realiste, preparer ses photos sources, ameliorer un profil professionnel et adapter son image a LinkedIn, au CV ou a une presence en ligne.',
    keywords: ['portrait IA', 'photo LinkedIn', 'photo professionnelle IA', 'portrait realiste', 'photo CV', 'profil professionnel'],
    readArticle: 'Lire l’article',
    categoriesHeading: 'Parcourir les categories du blog',
    categoriesDescription: 'Retrouvez les guides par usage: profil professionnel, CV, document courant, equipe, publication et controles avant mise en ligne.',
    toolsHeading: 'Try the photo tools',
    toolsDescription: 'Apres la lecture, utilisez les outils photo pour recadrer une image, reduire son poids, preparer une planche imprimable ou ajuster le fond avant publication.',
    toolsLink: 'Ouvrir les outils photo',
    workflowHeading: 'Try the workflow in Magic-Headshot',
    workflowDescription: 'Generez des portraits IA realistes pour LinkedIn, CV, pages equipe et profils professionnels apres avoir choisi le style et les controles utiles.',
    workflowLink: 'Creer des portraits',
    pricingHeading: 'Choisir le bon pack de credits',
    pricingDescription: 'Comparez les packs de credits avant de produire vos images finales pour un profil, une candidature, une page equipe ou une photo de document.',
    pricingLink: 'Voir les tarifs',
  },
  de: {
    title: 'Blog zu KI-Headshots und professionellen Profilbildern | Magic-Headshot',
    description:
      'Deutschsprachige Guides zu KI-Headshots, LinkedIn-Fotos, Bewerbungsbildern, realistischen Portrats und Fotowerkzeugen fuer Beruf, Teams und kreative Profile.',
    heading: 'Blog zu KI-Headshots',
    intro:
      'Praxisnahe Guides fuer realistische KI-Portrats, bessere Ausgangsfotos, berufliche Profile, LinkedIn, Bewerbungen, Personal Branding und kreative Online-Auftritte.',
    keywords: ['KI Headshot', 'LinkedIn Foto', 'professionelles KI Foto', 'realistisches Portrat', 'Bewerbungsfoto', 'Profilbild'],
    readArticle: 'Artikel lesen',
    categoriesHeading: 'Blog-Kategorien ansehen',
    categoriesDescription: 'Finde zusammenhaengende Guides zu Profilbildern, Bewerbungsfotos, Dokumentfotos, Teamseiten und Checks vor der Veroeffentlichung.',
    toolsHeading: 'Try the photo tools',
    toolsDescription: 'Nach dem Lesen kannst du die Fotowerkzeuge nutzen, um Bilder zuzuschneiden, Dateigroessen anzupassen, Druckboegen vorzubereiten oder Hintergruende zu pruefen.',
    toolsLink: 'Fotowerkzeuge oeffnen',
    workflowHeading: 'Try the workflow in Magic-Headshot',
    workflowDescription: 'Erstelle realistische KI-Portrats fuer LinkedIn, Bewerbungen, Teamseiten und berufliche Profile, sobald Stil und Qualitaetschecks klar sind.',
    workflowLink: 'Portrats erstellen',
    pricingHeading: 'Passendes Credit-Paket waehlen',
    pricingDescription: 'Vergleiche Einmal-Credits, bevor du finale Bilder fuer Profil, Bewerbung, Teamseite oder dokumentaehnliche Fotos produzierst.',
    pricingLink: 'Preise ansehen',
  },
  zh: {
    title: 'AI职业形象照和 Photo Tools 指南 | Magic-Headshot',
    description:
      '阅读 AI 职业形象照、LinkedIn 头像、简历照片、证件照工具、图片压缩、背景处理和打印排版相关指南。',
    heading: 'AI职业形象照指南',
    intro:
      '这里会整理职业形象照、简历照片、LinkedIn 头像和 Photo Tools 使用指南。中文 CMS blog 第一阶段暂不正式发布内容。',
    keywords: ['AI职业形象照', '证件照工具', 'LinkedIn头像'],
    readArticle: '阅读文章',
    categoriesHeading: '分类',
    categoriesDescription: '按主题查看职业形象照、证件照工具和图片处理指南。',
    toolsHeading: 'Try the photo tools',
    toolsDescription: '阅读指南后，可以使用 Photo Tools 裁剪证件照、压缩图片、处理背景或准备打印排版。',
    toolsLink: '打开 Photo Tools',
    workflowHeading: 'Try the workflow in Magic-Headshot',
    workflowDescription: '需要更自然的职业头像时，可以上传自拍并生成适合 LinkedIn、简历和个人资料的 AI 形象照。',
    workflowLink: '生成职业形象照',
    pricingHeading: '选择合适的点数包',
    pricingDescription: '比较一次性点数包，再决定生成多少职业风格照片。',
    pricingLink: '查看价格',
  },
  ja: {
    title: 'AIヘッドショットとプロフィール写真のブログ | Magic-Headshot',
    description:
      'AIヘッドショット、LinkedIn写真、履歴書写真、リアルなAIポートレート、仕事用プロフィール、写真ツールの使い方を日本語で紹介します。',
    heading: 'AIヘッドショットブログ',
    intro:
      '自然に見えるAIポートレートの選び方、元写真の準備、LinkedInや履歴書、仕事用プロフィール、SNSや創作向けの写真活用をまとめています。',
    keywords: ['AIヘッドショット', 'LinkedIn写真', 'AIプロフィール写真', 'リアルなAIポートレート', '履歴書写真', '仕事用プロフィール'],
    readArticle: '記事を読む',
    categoriesHeading: 'ブログカテゴリから探す',
    categoriesDescription: 'プロフィール写真、履歴書、書類用写真、チーム紹介、公開前チェックなど、用途に近い記事をカテゴリ別に確認できます。',
    toolsHeading: 'Try the photo tools',
    toolsDescription: '記事を読んだあと、写真ツールで切り抜き、サイズ調整、印刷用レイアウト、背景色の確認を行い、提出や公開前の状態を整えられます。',
    toolsLink: '写真ツールを開く',
    workflowHeading: 'Try the workflow in Magic-Headshot',
    workflowDescription: '用途や確認ポイントを決めたうえで、LinkedIn、履歴書、チーム紹介、仕事用プロフィール向けの自然なAI写真を作成できます。',
    workflowLink: '写真を作成',
    pricingHeading: 'クレジットプランを確認',
    pricingDescription: 'プロフィール更新、応募、チームページ、書類風写真などに使う最終画像を作る前に、必要なクレジット数を確認できます。',
    pricingLink: '料金を見る',
  },
}

export function generateStaticParams() {
  return ROUTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isRoutedLocale(locale)) return {}
  const content = localizedBlogIndexContent[locale]
  const canonical = localePath(locale, '/blog')
  const image = blogGeneratedPortraitImages[0]?.src

  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,
    alternates: {
      canonical,
      languages: await getBlogIndexLanguageAlternates(),
    },
    robots: {
      index: await localeHasPublishedCmsBlogPosts(locale),
      follow: true,
    },
    openGraph: {
      title: content.title,
      description: content.description,
      type: 'website',
      url: canonical,
      locale: OPEN_GRAPH_LOCALES[locale],
      siteName: 'Magic-Headshot',
      images: image ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: content.heading,
        },
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function LocalizedBlogPage({ params }: PageProps) {
  const { locale } = await params
  if (!isRoutedLocale(locale)) notFound()
  const routedLocale = locale as RoutedLocale
  const posts = await getCmsPublishedBlogPosts(routedLocale)

  if (posts.length === 0) {
    notFound()
  }
  const content = localizedBlogIndexContent[routedLocale]
  const categories = getBlogCategoriesFromPosts(posts, routedLocale)

  return (
    <div className="min-h-screen bg-white">
      <BlogJsonLd posts={posts} locale={routedLocale} path="/blog" />
      <Navbar locale={routedLocale} />
      <main className="pt-20">
        <section className="bg-slate-50 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="break-words text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
              {content.heading}
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              {content.intro}
            </p>
            <div className="mt-7">
              <KeywordStrip keywords={content.keywords} />
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-950">{content.categoriesHeading}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{content.categoriesDescription}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={blogCategoryPath(routedLocale, category.slug)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700"
                >
                  {category.label}
                  <span className="ml-2 text-slate-400">{category.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="content-auto py-12 sm:py-16">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
            {posts.map((post, index) => {
              const portrait = post.coverImage || (index < blogGeneratedPortraitImages.length ? blogGeneratedPortraitImages[index] : null)
              const categoryLabel = blogPostCategoryLabel(post)
              const categoryHref = blogCategoryPath(routedLocale, slugifyBlogCategory(categoryLabel))
              const href = localePath(routedLocale, `/blog/${post.slug}`)

              return (
                <article key={post.slug} className="content-auto flex min-h-[270px] flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  {portrait && (
                    <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-md bg-slate-100">
                      <BlogCoverImage
                        src={'url' in portrait ? portrait.url : portrait.src}
                        alt={'alt' in portrait ? portrait.alt : post.title}
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, calc(100vw - 40px)"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  )}
                  <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(routedLocale) : getBlogPublishDate(index)}
                    <span className="text-slate-300">/</span>
                    <Link href={categoryHref} className="text-primary-600 hover:text-primary-700">
                      {categoryLabel}
                    </Link>
                  </div>
                  <h2 className="break-words text-xl font-bold leading-snug text-slate-950">
                    <Link href={href} className="hover:text-primary-600">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 break-words text-sm leading-6 text-slate-600">{post.description}</p>
                  <Link href={href} className="mt-5 inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700">
                    {content.readArticle}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </article>
              )
            })}
          </div>
        </section>
        <BlogPhotoToolsCta
          locale={routedLocale}
          photoTools={{
            heading: content.toolsHeading,
            description: content.toolsDescription,
            linkLabel: content.toolsLink,
          }}
          workflow={{
            heading: content.workflowHeading,
            description: content.workflowDescription,
            linkLabel: content.workflowLink,
          }}
          pricing={{
            heading: content.pricingHeading,
            description: content.pricingDescription,
            linkLabel: content.pricingLink,
          }}
        />
      </main>
      <Footer locale={routedLocale} />
    </div>
  )
}
