'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import LocalizedNavbar from '@/components/layout/localized-navbar'
import LocalizedFooter from '@/components/layout/localized-footer'
import Card from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { localePath, type Locale } from '@/lib/i18n'
import {
  Activity,
  CreditCard,
  Image,
  Home,
  LockKeyhole,
  MousePointerClick,
  PackageCheck,
  SearchCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'

interface AdminPageFrameProps {
  locale?: Locale
  title: string
  subtitle: string
  eyebrow?: string
  children: ReactNode
  isCheckingAuth?: boolean
  isAuthorized?: boolean
}

const menuItems = [
  { label: 'Admin Home', href: '/dashboard/admin', icon: Home, exact: true },
  { label: 'Style Maintenance', href: '/dashboard/admin/styles', icon: Image },
  { label: 'User Credits', href: '/dashboard/admin/users', icon: PackageCheck },
  { label: 'Generation Tasks', href: '/dashboard/admin/generations', icon: Sparkles },
  { label: 'Orders Payments', href: '/dashboard/admin/orders', icon: CreditCard },
  { label: 'Bing URL Submit', href: '/dashboard/admin/bing-url-submit', icon: SearchCheck },
  { label: 'Generation Records', href: '/dashboard/admin/generation-logs', icon: Activity },
  { label: 'Payment Audit', href: '/dashboard/admin/payment-audit', icon: CreditCard },
  { label: 'Conversion Events', href: '/dashboard/admin/conversion-events', icon: MousePointerClick },
]

export default function AdminPageFrame({
  locale = 'en',
  title,
  subtitle,
  eyebrow = 'Admin',
  children,
  isCheckingAuth = false,
  isAuthorized = true,
}: AdminPageFrameProps) {
  const pathname = usePathname()
  const dashboardHref = localePath(locale, '/dashboard')

  return (
    <div className="min-h-screen bg-slate-50">
      {locale === 'en' ? <Navbar /> : <LocalizedNavbar locale={locale} />}

      <main className="pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900 lg:hidden">
            Admin tools are available on desktop only. Please use a computer to manage settings, users, payments, reports, and URL submissions.
          </div>

          <div className="hidden gap-6 lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <Card className="overflow-hidden">
                <div className="border-b border-slate-100 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <LockKeyhole className="h-4 w-4 text-blue-600" />
                    Admin Menu
                  </div>
                  <p className="mt-1 truncate text-xs text-slate-500">Desktop maintenance</p>
                </div>

                <nav className="flex gap-1 overflow-x-auto p-2 lg:block lg:space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    const href = localePath(locale, item.href)
                    const active = item.exact ? pathname === href : pathname?.startsWith(href)

                    return (
                      <Link
                        key={item.href}
                        href={href}
                        className={cn(
                          'flex min-w-max items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors lg:min-w-0',
                          active
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                        )}
                      >
                        <Icon className="h-4 w-4 flex-none" />
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>

                <div className="border-t border-slate-100 p-2">
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                  >
                    <UserRound className="h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </div>
              </Card>
            </aside>

            <section className="min-w-0">
              <div className="mb-6">
                <div className="mb-2 text-sm font-semibold text-blue-600">{eyebrow}</div>
                <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
                <p className="mt-2 max-w-3xl text-slate-600">{subtitle}</p>
              </div>

              {isCheckingAuth || !isAuthorized ? (
                <Card className="p-8 text-center">
                  <div className="mx-auto mb-4 h-8 w-8 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                  <p className="font-semibold text-slate-700">Checking admin access...</p>
                </Card>
              ) : (
                children
              )}
            </section>
          </div>
        </div>
      </main>

      {locale === 'en' ? <Footer /> : <LocalizedFooter locale={locale} />}
    </div>
  )
}
