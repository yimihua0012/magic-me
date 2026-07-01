'use client'

import { useState } from 'react'
import Modal from '@/components/ui/modal'
import Button from '@/components/ui/button'
import { Camera, Mail, Lock, User, Chrome } from 'lucide-react'
import { safeReturnTo } from '@/lib/auth-return'
import { supabase } from '@/lib/supabase/client'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

type AuthMode = 'login' | 'register'

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'register') {
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters')
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/api/auth/callback`,
          },
        })
        if (error) throw error
        setSuccess('Check your email for a verification link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        
        // Client-side auth state is now updated, close modal and notify parent
        onClose()
        onSuccess?.()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    const currentPath = `${window.location.pathname}${window.location.search}`
    window.location.href = `/api/auth/google?returnTo=${encodeURIComponent(safeReturnTo(currentPath, '/dashboard'))}`
  }

  const handleXAuth = async () => {
    setIsLoading(true)
    const currentPath = `${window.location.pathname}${window.location.search}`
    window.location.href = `/api/auth/x?returnTo=${encodeURIComponent(safeReturnTo(currentPath, '/dashboard'))}`
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'login' ? 'Welcome Back' : 'Create Account'}>
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-600/25">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-600 text-sm">
            {mode === 'login' 
              ? 'Sign in to generate your AI headshots' 
              : 'Join thousands of professionals with stunning headshots'}
          </p>
        </div>

        <button
          onClick={handleGoogleAuth}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-medium text-slate-700 min-h-[48px] touch-target"
        >
          <Chrome className="w-5 h-5" />
          Continue with Google
        </button>

        <button
          onClick={handleXAuth}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-medium text-slate-700 min-h-[48px] touch-target"
        >
          <span className="text-base font-bold leading-none text-slate-900">X</span>
          Continue with X
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-500">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base min-h-[48px]"
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base min-h-[48px]"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base min-h-[48px]"
              required
              minLength={8}
            />
          </div>

          {mode === 'register' && (
            <p className="text-xs text-slate-500">
              Must be at least 8 characters with uppercase, lowercase, and numbers
            </p>
          )}

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
          )}

          {success && (
            <p className="text-sm text-accent-600 bg-accent-50 px-4 py-2 rounded-lg">{success}</p>
          )}

          <Button type="submit" className="w-full" isLoading={isLoading}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          {mode === 'login' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); setSuccess('') }}
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
                onClick={() => { setMode('login'); setError(''); setSuccess('') }}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </Modal>
  )
}
