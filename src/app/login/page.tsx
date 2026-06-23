'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/navbar'
import Button from '@/components/ui/button'
import { Camera, Mail, Lock, User, Chrome } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [returnTo, setReturnTo] = useState<string | null>(null)

  useEffect(() => {
    // Get return URL from query params
    const urlParams = new URLSearchParams(window.location.search)
    const returnParam = urlParams.get('returnTo')
    if (returnParam) {
      setReturnTo(returnParam)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
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
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
          },
        })
        data = result.data
        if (result.error) throw result.error
      }

      if (data.user) {
        // Redirect to return URL or dashboard
        router.push(returnTo || '/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    window.location.href = '/api/auth/google'
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-600/25">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-slate-600 mt-1">
                {isLogin ? 'Sign in to generate your AI headshots' : 'Start creating professional headshots today'}
              </p>
            </div>

            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-medium text-slate-700 mb-6"
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">or</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  minLength={8}
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
              )}

              <Button type="submit" className="w-full" isLoading={isLoading}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-600 mt-6">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsLogin(false); setError('') }}
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsLogin(true); setError('') }}
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>

            <p className="text-center text-xs text-slate-500 mt-4">
              By continuing, you agree to our{' '}
              <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
