'use client'

import { useState } from 'react'
import { Mail, MapPin, MessageSquare, Send } from 'lucide-react'
import Navbar from '@/components/layout/localized-navbar'
import Footer from '@/components/layout/localized-footer'
import Card from '@/components/ui/card'
import Button from '@/components/ui/button'
import { appConfig } from '@/lib/config'
import type { RoutedLocale } from '@/lib/i18n'
import type { LocalizedContactContent } from '@/lib/localized-marketing-content'

interface LocalizedContactPageProps {
  locale: RoutedLocale
  content: LocalizedContactContent
}

export default function LocalizedContactPage({ locale, content }: LocalizedContactPageProps) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar locale={locale} />

      <main className="pb-16 pt-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl">{content.title}</h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">{content.description}</p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-6">
              {[
                { icon: Mail, title: content.email, main: 'support@mail.magic-headshot.com', sub: content.responseTime },
                { icon: MessageSquare, title: content.chat, main: content.chatHours, sub: appConfig.name },
                { icon: MapPin, title: content.location, main: 'San Francisco, CA', sub: 'United States' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.title} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-100">
                        <Icon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h2 className="mb-1 font-semibold text-slate-900">{item.title}</h2>
                        <p className="text-sm text-slate-600">{item.main}</p>
                        <p className="mt-1 text-xs text-slate-500">{item.sub}</p>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            <div className="lg:col-span-2">
              <Card className="p-8">
                {submitted ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <Send className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="mb-2 text-xl font-semibold text-slate-900">{content.sentTitle}</h2>
                    <p className="mb-6 text-slate-600">{content.sentText}</p>
                    <Button onClick={() => setSubmitted(false)}>{content.sendAnother}</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">{content.formTitle}</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">{content.name}</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">{content.emailAddress}</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                          className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">{content.topic}</label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(event) => setFormData({ ...formData, subject: event.target.value })}
                        className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      >
                        <option value="">{content.topicPlaceholder}</option>
                        {content.topics.map((topic) => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">{content.message}</label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                        className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? content.sending : content.submit}
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  )
}
