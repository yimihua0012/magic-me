import Link from 'next/link'
import Image from 'next/image'
import { Camera } from 'lucide-react'
import { appConfig } from '@/lib/config'
import { buttonStyles } from '@/components/ui/button-styles'
import Footer from '@/components/layout/footer'

export default function StaticMarketingShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt={appConfig.name} width={40} height={40} className="rounded-xl" />
            <span className="text-xl font-bold text-slate-900">{appConfig.name}</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
            <Link href="/questions" className="hover:text-slate-950">Questions</Link>
            <Link href="/sample" className="hover:text-slate-950">Samples</Link>
            <Link href="/blog" className="hover:text-slate-950">Blog</Link>
            <Link href="/pricing" className="hover:text-slate-950">Pricing</Link>
          </nav>
          <Link href="/pricing" className={buttonStyles({ size: 'sm' })}>
            <Camera className="mr-2 h-4 w-4" />
            Generate
          </Link>
        </div>
      </header>
      {children}
      <Footer />
    </div>
  )
}
