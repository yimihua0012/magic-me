import Link from 'next/link'
import Image from 'next/image'
import { appConfig } from '@/lib/config'
import FooterGenerateLink from '@/components/layout/footer-generate-link'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Image src="/logo.svg" alt={appConfig.name} width={40} height={40} className="rounded-xl" />
              <span className="text-xl font-bold">{appConfig.name}</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Professional AI headshots in minutes. Perfect for LinkedIn, social media, and personal branding.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#features" className="text-sm text-slate-400 transition-colors hover:text-white">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-slate-400 transition-colors hover:text-white">
                  Pricing
                </Link>
              </li>
              <li>
                <FooterGenerateLink className="text-left text-sm text-slate-400 transition-colors hover:text-white disabled:cursor-wait disabled:opacity-70">
                  Generate Now
                </FooterGenerateLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/questions" className="text-sm text-slate-400 transition-colors hover:text-white">
                  Questions
                </Link>
              </li>
              <li>
                <Link href="/sample" className="text-sm text-slate-400 transition-colors hover:text-white">
                  Samples
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-slate-400 transition-colors hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-sm text-slate-400 transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-slate-400 transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-400 transition-colors hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-sm text-slate-400 transition-colors hover:text-white">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8">
          <p className="text-sm text-slate-400">
            Copyright 2026 {appConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
