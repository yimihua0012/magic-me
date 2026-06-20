// Auth Middleware
import { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { AuthenticationError, AuthorizationError } from '@backend/utils/errors'

export async function getUser(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    throw new AuthenticationError('Not authenticated')
  }

  return user
}

export async function requireAuth(req: NextRequest) {
  try {
    return await getUser(req)
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error
    }
    throw new AuthenticationError('Authentication required')
  }
}

export async function optionalAuth(req: NextRequest) {
  try {
    return await getUser(req)
  } catch {
    return null
  }
}
