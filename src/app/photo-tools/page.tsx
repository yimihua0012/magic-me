import type { Metadata } from 'next'
import StandalonePhotoToolsPageView from '@/components/photo-tools/standalone-photo-tools-page-view'
import { languageAlternatesForPath } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'Free Photo Tools for Headshots, ID Photos, and Print Layouts',
  description:
    'Use free photo tools to remove backgrounds, crop ID photos, resize images, shape crop avatars, and build printable photo layouts.',
  keywords: [
    'photo tools',
    'ID photo crop',
    'remove background',
  ],
  alternates: {
    canonical: '/photo-tools',
    languages: languageAlternatesForPath('/photo-tools'),
  },
}

export default function PhotoToolsPage() {
  return <StandalonePhotoToolsPageView />
}
