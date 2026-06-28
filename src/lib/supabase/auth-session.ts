'use client'

import type { Session, SupabaseClient } from '@supabase/supabase-js'

const invalidRefreshTokenMessages = [
  'invalid refresh token',
  'refresh token not found',
]

export function isInvalidRefreshTokenError(error: unknown) {
  if (!error || typeof error !== 'object') {
    return false
  }

  const message = 'message' in error ? String(error.message).toLowerCase() : ''
  return invalidRefreshTokenMessages.every((part) => message.includes(part))
}

export function clearSupabaseAuthStorage() {
  if (typeof window === 'undefined') {
    return
  }

  const clearStorage = (storage: Storage) => {
    for (let index = storage.length - 1; index >= 0; index -= 1) {
      const key = storage.key(index)

      if (!key) {
        continue
      }

      if (
        key === 'supabase.auth.token' ||
        (key.startsWith('sb-') && (key.includes('auth-token') || key.includes('code-verifier')))
      ) {
        storage.removeItem(key)
      }
    }
  }

  try {
    clearStorage(window.localStorage)
  } catch {
  }

  try {
    clearStorage(window.sessionStorage)
  } catch {
  }
}

export async function getSessionSafely(supabase: SupabaseClient): Promise<Session | null> {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error && isInvalidRefreshTokenError(error)) {
      clearSupabaseAuthStorage()
      return null
    }

    if (error) {
      throw error
    }

    return session
  } catch (error) {
    if (isInvalidRefreshTokenError(error)) {
      clearSupabaseAuthStorage()
      return null
    }

    throw error
  }
}
