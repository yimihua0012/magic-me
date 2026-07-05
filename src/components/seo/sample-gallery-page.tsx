import Link from 'next/link'
import { Camera, Images, Sparkles } from 'lucide-react'
import LocalizedNavbar from '@/components/layout/localized-navbar'
import LocalizedFooter from '@/components/layout/localized-footer'
import { CollectionPageJsonLd } from '@/components/seo/page-json-ld'
import { buttonStyles } from '@/components/ui/button-styles'
import { localePath, type Locale } from '@/lib/i18n'
import { type LocalizedSamplePicture } from '@/lib/sample-pictures'
import { sampleGalleryContent, sampleGalleryPath } from '@/lib/sample-gallery-content'

interface SampleGalleryPageProps {
  locale: Locale
  pictures: LocalizedSamplePicture[]
}

export default function SampleGalleryPage({ locale, pictures }: SampleGalleryPageProps) {
  const content = sampleGalleryContent[locale]
  const image = pictures[0]?.imageUrl
  const groupedPictures = groupPicturesByCategory(pictures)

  return (
    <div className="min-h-screen bg-white">
      <LocalizedNavbar locale={locale} />
      <CollectionPageJsonLd
        locale={locale}
        path={sampleGalleryPath}
        title={content.title}
        description={content.description}
        image={image}
        items={pictures.map((picture) => ({
          name: picture.title,
          description: picture.alt,
          image: picture.imageUrl,
        }))}
      />
      <main>
        <section className="bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
              <Images className="h-4 w-4" />
              {content.eyebrow}
            </div>
            <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
              <div>
                <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                  {content.h1}
                </h1>
                <p className="mt-5 max-w-4xl text-base leading-8 text-slate-600 sm:text-lg">
                  {content.intro}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-950">{pictures.length}</div>
                    <div className="text-sm font-semibold text-slate-500">published examples</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {content.keywords.slice(0, 3).map((keyword) => (
                    <span key={keyword} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-600 shadow-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="content-auto border-y border-slate-200 bg-slate-50 py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {pictures.length > 0 ? (
              <div className="space-y-10">
                {groupedPictures.map((group) => (
                  <section key={group.category} aria-labelledby={`sample-category-${slugify(group.category)}`}>
                    <div className="mb-4 flex items-end justify-between gap-4">
                      <div>
                        <h2 id={`sample-category-${slugify(group.category)}`} className="text-2xl font-bold text-slate-950">
                          {group.category}
                        </h2>
                        <p className="mt-1 text-sm font-semibold text-slate-500">{group.pictures.length} examples</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                      {group.pictures.map((picture) => (
                        <figure key={picture.id} className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                          <div className="aspect-square overflow-hidden bg-slate-100">
                            <img
                              src={picture.imageUrl}
                              alt={picture.alt}
                              title={picture.title}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                            />
                          </div>
                          <figcaption className="p-3">
                            <div className="line-clamp-1 text-sm font-bold text-slate-950">{picture.title}</div>
                            <div className="mt-1 line-clamp-1 text-xs font-semibold text-blue-700">{picture.styleName}</div>
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                <Images className="mx-auto mb-4 h-10 w-10 text-slate-400" />
                <h2 className="text-xl font-bold text-slate-950">{content.emptyTitle}</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-600">{content.emptyText}</p>
              </div>
            )}
          </div>
        </section>

        <section className="content-auto bg-white py-12">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">{content.ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">{content.ctaText}</p>
            <Link href={localePath(locale, '/pricing')} className={buttonStyles({ size: 'lg', className: 'mt-7' })}>
              <Camera className="mr-2 h-5 w-5" />
              {content.ctaLabel}
            </Link>
            <div className="mt-5">
              <Link href={localePath(locale, '/questions')} className="text-sm font-semibold text-blue-700 underline-offset-4 hover:underline">
                {content.secondaryLink}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <LocalizedFooter locale={locale} />
    </div>
  )
}

function groupPicturesByCategory(pictures: LocalizedSamplePicture[]) {
  const groups = new Map<string, LocalizedSamplePicture[]>()
  for (const picture of pictures) {
    const category = picture.category || 'General'
    groups.set(category, [...(groups.get(category) || []), picture])
  }

  return Array.from(groups.entries()).map(([category, groupPictures]) => ({
    category,
    pictures: groupPictures,
  }))
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'general'
}
