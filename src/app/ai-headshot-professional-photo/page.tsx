import UseCasePageView from '@/components/use-case/use-case-page-view'
import { buildUseCasePageMetadata, getUseCasePageContent } from '@/lib/use-case-pages'

const slug = 'ai-headshot-professional-photo'

export const metadata = buildUseCasePageMetadata({ slug, locale: 'en' })

export default function AiHeadshotProfessionalPhotoPage() {
  return <UseCasePageView locale="en" slug={slug} content={getUseCasePageContent(slug, 'en')} />
}
