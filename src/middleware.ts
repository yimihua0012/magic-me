import { NextResponse, type NextRequest } from 'next/server'
import { ROUTED_LOCALES, localePath, type Locale, type RoutedLocale } from '@/lib/i18n'
import { blogPosts } from '@/lib/seo-content'

const rootPageRoutes = new Set([
  '',
  'auth',
  'auth/complete',
  'blog',
  'contact',
  'dashboard',
  'landing',
  'login',
  'pricing',
  'privacy',
  'questions',
  'refund',
  'sample',
  'terms',
  'upload',
])

const englishRoutes = new Set([
  ...rootPageRoutes,
  ...blogPosts.map((post) => `blog/${post.slug}`),
])

const localizedRoutes = new Set([
  '',
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
  'dashboard',
])
const dynamicRootRoutes = new Set(['generate', 'generations'])
const localizedDynamicRoutes = new Set(['generate', 'generations'])

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  url.search = ''
  return NextResponse.redirect(url)
}

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

    return redirectTo(request, localePath(firstSegment))
  }

  if (englishRoutes.has(segments.join('/'))) {
    return nextWithLocale(request)
  }

  if (dynamicRootRoutes.has(firstSegment)) {
    return nextWithLocale(request)
  }

  return redirectTo(request, '/')
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.*\\.xml|.*\\..*).*)'],
}
