import type { Metadata } from 'next'
import StandalonePhotoToolsPageView from '@/components/photo-tools/standalone-photo-tools-page-view'

export const metadata: Metadata = {
  title: 'Free Online Photo Tools: Crop, Resize to KB, and Print Layout',
  description:
    'Use free browser-based photo tools to crop ID photos, resize images to a target KB, and build printable photo layouts without uploading images.',
  alternates: {
    canonical: '/photo-tools',
  },
}

export default function PhotoToolsPage() {
  return <StandalonePhotoToolsPageView />
}
