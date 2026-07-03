import type { Metadata } from 'next'
import Link from 'next/link'
import { buttonStyles } from '@/components/ui/button-styles'

export const metadata: Metadata = {
  title: 'Page Not Found | Magic-Headshot',
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-16">
      <div className="max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">404</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">Page not found</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          The page may have moved, or the URL may be incorrect.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className={buttonStyles({ className: 'text-center' })}>
            Go Home
          </Link>
          <Link href="/sample" className={buttonStyles({ variant: 'secondary', className: 'text-center' })}>
            View Samples
          </Link>
        </div>
      </div>
    </main>
  )
}
