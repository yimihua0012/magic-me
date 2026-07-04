import UseCasePageView from '@/components/use-case/use-case-page-view'
import { buildUseCasePageMetadata, getUseCasePageContent } from '@/lib/use-case-pages'

const slug = 'ai-headshot-studio-style'

export const metadata = buildUseCasePageMetadata({ slug, locale: 'en' })

export default function AiHeadshotStudioStylePage() {
  return <UseCasePageView locale="en" slug={slug} content={getUseCasePageContent(slug, 'en')} />
}
