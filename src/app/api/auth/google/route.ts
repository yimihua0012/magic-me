import { redirectToOAuthProvider } from '@/lib/auth/oauth-route'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  return redirectToOAuthProvider(request, 'google', 'Google')
}
