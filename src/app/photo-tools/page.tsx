import type { Metadata } from 'next'
import StandalonePhotoToolsPageView from '@/components/photo-tools/standalone-photo-tools-page-view'
import { languageAlternatesForPath } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Free Online Photo Tools: Remove Background, Crop, Resize, Ratio Crop',
  description:
    'Use photo tools to remove backgrounds, crop ID photos, resize images, crop common ratios, shape crop avatars, and build print layouts.',
  keywords: [
    'online photo tools',
    'remove image backgrounds',
    'aspect ratio crop tool',
  ],
  alternates: {
    canonical: '/photo-tools',
    languages: languageAlternatesForPath('/photo-tools'),
  },
}

export default function PhotoToolsPage() {
  return <StandalonePhotoToolsPageView />
}
