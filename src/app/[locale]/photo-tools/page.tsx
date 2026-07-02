import { notFound, redirect } from 'next/navigation'
import { isRoutedLocale, localePath } from '@/lib/i18n'

type PageProps = {
  params: Promise<{
    locale: string
  }>
}

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'fr' }, { locale: 'de' }, { locale: 'ja' }]
}

export default async function LocalizedPhotoToolsRedirectPage({ params }: PageProps) {
  const { locale } = await params

  if (!isRoutedLocale(locale)) {
    notFound()
  }

  redirect(localePath(locale, '/free-id-photo-tool'))
}
