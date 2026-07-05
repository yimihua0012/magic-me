import { NextResponse, type NextRequest } from 'next/server'
import { ROUTED_LOCALES, type Locale, type RoutedLocale } from '@/lib/i18n'

const rootPageRoutes = new Set([
  '',
  'auth',
  'auth/complete',
  'ai-headshot-corporate',
  'ai-headshot-examples',
  'ai-headshot-linkedin',
  'ai-headshot-professional-photo',
  'ai-headshot-resume',
  'ai-headshot-studio-style',
  'blog',
  'contact',
  'dashboard',
  'dashboard/records',
  'dashboard/admin',
  'dashboard/admin/blog',
  'dashboard/admin/sample-pictures',
  'dashboard/admin/keyword-research',
  'dashboard/admin/styles',
  'dashboard/admin/users',
  'dashboard/admin/generations',
  'dashboard/admin/orders',
  'dashboard/admin/bing-url-submit',
  'dashboard/admin/bing-url-inspect',
  'dashboard/admin/generation-logs',
  'dashboard/admin/payment-audit',
  'dashboard/admin/conversion-events',
  'dashboard/bing-url-submit',
  'free-id-photo-tool',
  'landing',
  'login',
  'photo-tools',
  'pricing',
  'privacy',
  'questions',
  'refund',
  'sample',
  'terms',
  'upload',
])

const englishRoutes = new Set(rootPageRoutes)

const localizedRoutes = new Set([
  '',
  'ai-headshot-corporate',
  'ai-headshot-examples',
  'ai-headshot-linkedin',
  'ai-headshot-professional-photo',
  'ai-headshot-resume',
  'ai-headshot-studio-style',
  'blog',
  'pricing',
  'privacy',
  'terms',
  'refund',
  'contact',
  'questions',
  'sample',
  'landing',
  'upload',
  'login',
  'photo-tools',
  'dashboard',
  'dashboard/records',
  'dashboard/admin',
  'dashboard/admin/blog',
  'dashboard/admin/sample-pictures',
  'dashboard/admin/keyword-research',
  'dashboard/admin/styles',
  'dashboard/admin/users',
  'dashboard/admin/generations',
  'dashboard/admin/orders',
  'dashboard/admin/bing-url-submit',
  'dashboard/admin/bing-url-inspect',
  'dashboard/admin/generation-logs',
  'dashboard/admin/payment-audit',
  'dashboard/admin/conversion-events',
  'dashboard/bing-url-submit',
  'free-id-photo-tool',
])
const dynamicRootRoutes = new Set(['blog', 'generate', 'generations'])
const localizedDynamicRoutes = new Set(['blog', 'generate', 'generations'])

function nextWithLocale(request: NextRequest, locale: Locale = 'en') {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-mh-locale', locale)

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

function isRoutedLocaleSegment(segment: string): segment is RoutedLocale {
  return (ROUTED_LOCALES as readonly string[]).includes(segment)
}

export function middleware(request: NextRequest) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return nextWithLocale(request)
  }

  const pathname = request.nextUrl.pathname
  const segments = pathname.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
  const firstSegment = segments[0] ?? ''

  if (isRoutedLocaleSegment(firstSegment)) {
    const localizedPath = segments.slice(1).join('/')
    if (localizedRoutes.has(localizedPath)) {
      return nextWithLocale(request, firstSegment)
    }

    const secondSegment = segments[1] ?? ''
    if (localizedDynamicRoutes.has(secondSegment) && segments.length >= 3) {
      return nextWithLocale(request, firstSegment)
    }

    return nextWithLocale(request, firstSegment)
  }

  if (englishRoutes.has(segments.join('/'))) {
    return nextWithLocale(request)
  }

  if (dynamicRootRoutes.has(firstSegment)) {
    return nextWithLocale(request)
  }

  return nextWithLocale(request)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.*\\.xml|.*\\..*).*)'],
}
