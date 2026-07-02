'use client'

import Link from 'next/link'
import AdminPageFrame from '@/components/admin/admin-page-frame'
import { useAdminAuth } from '@/components/admin/admin-auth'
import Card from '@/components/ui/card'
import { localePath, type Locale } from '@/lib/i18n'
import { Activity, ArrowRight, CreditCard, Image, MousePointerClick, PackageCheck, SearchCheck, Sparkles } from 'lucide-react'

interface AdminHomePageViewProps {
  locale?: Locale
}

const entries = [
  {
    title: 'Style Maintenance',
    description: 'Edit style names, prompts, ordering, and active status.',
    href: '/dashboard/admin/styles',
    icon: Image,
    tone: 'text-cyan-600 bg-cyan-50',
  },
  {
    title: 'User Credits',
    description: 'Search users and review their credit packages and balances.',
    href: '/dashboard/admin/users',
    icon: PackageCheck,
    tone: 'text-violet-600 bg-violet-50',
  },
  {
    title: 'Generation Tasks',
    description: 'Review generation task status, progress, errors, and credit usage.',
    href: '/dashboard/admin/generations',
    icon: Sparkles,
    tone: 'text-indigo-600 bg-indigo-50',
  },
  {
    title: 'Orders Payments',
    description: 'Review payment-linked credit packages and provider references.',
    href: '/dashboard/admin/orders',
    icon: CreditCard,
    tone: 'text-orange-600 bg-orange-50',
  },
  {
    title: 'Bing URL Submit',
    description: 'Submit one or many URLs to Bing Webmaster Tools.',
    href: '/dashboard/admin/bing-url-submit',
    icon: SearchCheck,
    tone: 'text-blue-600 bg-blue-50',
  },
  {
    title: 'Generation Records',
    description: 'Review generation status, duration, errors, and credit usage.',
    href: '/dashboard/admin/generation-logs',
    icon: Activity,
    tone: 'text-emerald-600 bg-emerald-50',
  },
  {
    title: 'Payment Audit',
    description: 'Review credit packages, balances, expiration, and payment source.',
    href: '/dashboard/admin/payment-audit',
    icon: CreditCard,
    tone: 'text-amber-600 bg-amber-50',
  },
  {
    title: 'Conversion Events',
    description: 'Review page views, CTA clicks, checkout intent, and related events.',
    href: '/dashboard/admin/conversion-events',
    icon: MousePointerClick,
    tone: 'text-rose-600 bg-rose-50',
  },
]

export default function AdminHomePageView({ locale = 'en' }: AdminHomePageViewProps) {
  const { isAuthorized, isCheckingAuth } = useAdminAuth(locale)

  return (
    <AdminPageFrame
      locale={locale}
      title="Admin Center"
      subtitle="Use the side menu to manage URL submission and review operational records."
      isCheckingAuth={isCheckingAuth}
      isAuthorized={isAuthorized}
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {entries.map((entry) => {
          const Icon = entry.icon
          return (
            <Link key={entry.href} href={localePath(locale, entry.href)}>
              <Card hover className="h-full p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${entry.tone}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{entry.title}</h2>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{entry.description}</p>
                    </div>
                  </div>
                  <ArrowRight className="mt-1 h-5 w-5 flex-none text-slate-400" />
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </AdminPageFrame>
  )
}
