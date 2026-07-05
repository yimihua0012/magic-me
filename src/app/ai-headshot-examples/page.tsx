import type { Metadata } from 'next'
import SampleGalleryPage from '@/components/seo/sample-gallery-page'
import { languageAlternatesForPath } from '@/lib/i18n'
import { sampleGalleryContent, sampleGalleryPath } from '@/lib/sample-gallery-content'
import { getSamplePictures } from '@/lib/sample-pictures'

const content = sampleGalleryContent.en

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: content.title,
  description: content.description,
  keywords: content.keywords,
  alternates: {
    canonical: sampleGalleryPath,
    languages: languageAlternatesForPath(sampleGalleryPath),
  },
}

export default async function AiHeadshotExamplesPage() {
  const pictures = await getSamplePictures('en')
  return <SampleGalleryPage locale="en" pictures={pictures} />
}
