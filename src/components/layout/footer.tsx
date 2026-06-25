'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Twitter, Instagram, Linkedin, Github } from 'lucide-react'
import { appConfig } from '@/lib/config'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logo.svg" alt={appConfig.name} width={40} height={40} className="rounded-xl" />
              <span className="text-xl font-bold">{appConfig.name}</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Professional AI headshots in 3 minutes. Perfect for LinkedIn, social media, and personal branding.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#features" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Generate Now
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-white transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-slate-400 hover:text-white transition-colors text-sm">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            © 2024 {appConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Follow us on Twitter">
              <Twitter className="w-5 h-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Follow us on Instagram">
              <Instagram className="w-5 h-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Follow us on LinkedIn">
              <Linkedin className="w-5 h-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors" aria-label="View our GitHub repository">
              <Github className="w-5 h-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
