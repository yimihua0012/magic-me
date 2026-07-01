'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/navbar'
import LocalizedNavbar from '@/components/layout/localized-navbar'
import Footer from '@/components/layout/footer'
import LocalizedFooter from '@/components/layout/localized-footer'
import Button from '@/components/ui/button'
import { Camera, Chrome, Lock, Mail, User } from 'lucide-react'
import { safeReturnTo } from '@/lib/auth-return'
import { localePath, type Locale } from '@/lib/i18n'
import { localizedAuthContent } from '@/lib/localized-auth-content'

interface LoginPageViewProps {
  locale?: Locale
}

export default function LoginPageView({ locale = 'en' }: LoginPageViewProps) {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [returnTo, setReturnTo] = useState<string | null>(null)
  const content = localizedAuthContent[locale]
  const isEnglish = locale === 'en'
  const homeFallback = localePath(locale)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const returnParam = urlParams.get('returnTo')
    if (returnParam) {
      setReturnTo(safeReturnTo(returnParam, homeFallback))
    }

    const authError = urlParams.get('error')
    if (authError) {
      setError(authErrorMessage(authError, locale))
    }
  }, [homeFallback, locale])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { supabase } = await import('@/lib/supabase/client')
      let data

      if (isLogin) {
        const result = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        data = result.data
        if (result.error) throw result.error
      } else {
        const result = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          },
        })
        data = result.data
        if (result.error) throw result.error
      }

      if (data.user) {
        router.push(returnTo || homeFallback)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    const target = returnTo ? `/api/auth/google?returnTo=${encodeURIComponent(returnTo)}` : `/api/auth/google?returnTo=${encodeURIComponent(homeFallback)}`
    window.location.href = target
  }

  const handleXAuth = () => {
    const target = returnTo ? `/api/auth/x?returnTo=${encodeURIComponent(returnTo)}` : `/api/auth/x?returnTo=${encodeURIComponent(homeFallback)}`
    window.location.href = target
  }

  const termsHref = localePath(locale, '/terms')
  const privacyHref = localePath(locale, '/privacy')

  return (
    <div className="min-h-screen bg-slate-50">
      {isEnglish ? <Navbar /> : <LocalizedNavbar locale={locale} />}

      <main className="pb-16 pt-24">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 shadow-lg shadow-primary-600/25">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isLogin ? content.signInTitle : content.registerTitle}
              </h1>
              <p className="mt-1 text-slate-600">
                {isLogin ? content.signInSubtitle : content.registerSubtitle}
              </p>
            </div>

            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Chrome className="h-5 w-5" />
              {content.google}
            </button>
            <button
              onClick={handleXAuth}
              disabled={isLoading}
              className="mb-6 mt-3 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <span className="text-base font-bold leading-none text-slate-900">X</span>
              {content.x}
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-slate-500">{content.divider}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={content.fullName}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder={content.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder={content.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                  minLength={8}
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-500">{error}</p>
              )}

              <Button type="submit" className="w-full" isLoading={isLoading}>
                {isLogin ? content.signIn : content.createAccount}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              {isLogin ? (
                <>
                  {content.noAccount}{' '}
                  <button
                    type="button"
                    onClick={() => { setIsLogin(false); setError('') }}
                    className="font-semibold text-primary-600 hover:text-primary-700"
                  >
                    {content.signUp}
                  </button>
                </>
              ) : (
                <>
                  {content.hasAccount}{' '}
                  <button
                    type="button"
                    onClick={() => { setIsLogin(true); setError('') }}
                    className="font-semibold text-primary-600 hover:text-primary-700"
                  >
                    {content.signIn}
                  </button>
                </>
              )}
            </p>

            <p className="mt-4 text-center text-xs text-slate-500">
              {content.termsPrefix}{' '}
              <Link href={termsHref} className="text-primary-600 hover:underline">{content.terms}</Link>
              {' '}{content.privacyJoin}{' '}
              <Link href={privacyHref} className="text-primary-600 hover:underline">{content.privacy}</Link>
            </p>
          </div>
        </div>
      </main>

      {isEnglish ? <Footer /> : <LocalizedFooter locale={locale} />}
    </div>
  )
}

function authErrorMessage(error: string, locale: Locale) {
  const content = localizedAuthContent[locale]

  switch (error) {
    case 'missing_code':
      return content.errorMissingCode
    case 'oauth_exchange_failed':
      return content.errorExchangeFailed
    case 'session_missing':
      return content.errorSessionMissing
    default:
      return content.errorDefault
  }
}
