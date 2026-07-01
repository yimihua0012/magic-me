import { redirect } from 'next/navigation'
import { isRoutedLocale, localePath } from '@/lib/i18n'

type PageProps = {
  params: Promise<{
    locale: string
    slug: string[]
  }>
}

export default async function LocalizedCatchAllRoute({ params }: PageProps) {
  const { locale } = await params

  if (isRoutedLocale(locale)) {
    redirect(localePath(locale))
  }

  redirect('/')
}
