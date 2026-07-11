import type { Metadata } from 'next'
import StandalonePhotoToolsPageView from '@/components/photo-tools/standalone-photo-tools-page-view'

export const metadata: Metadata = {
  title: 'Free Online Photo Tools: Remove Background, Crop, Resize, Print Layout',
  description:
    'Use online photo tools to remove image backgrounds, crop ID photos, resize images to a target KB, and build printable photo layouts.',
  alternates: {
    canonical: '/photo-tools',
  },
}

export default function PhotoToolsPage() {
  return <StandalonePhotoToolsPageView />
}
