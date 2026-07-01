import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const locales = ['es', 'fr', 'de', 'ja']
const currencies = ['USD', 'EUR', 'JPY']

function read(path) {
  return readFileSync(join(root, path), 'utf8')
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function includesAll(file, values, label) {
  for (const value of values) {
    assert(file.includes(value), `${label} is missing ${value}`)
  }
}

const i18n = read('src/lib/i18n.ts')
includesAll(i18n, ["'en'", "'es'", "'fr'", "'de'", "'ja'"], 'i18n locales')
assert(!i18n.includes("'/en'"), 'English must not use /en')

const currency = read('src/lib/currency.ts')
includesAll(currency, currencies.map((item) => `'${item}'`), 'currency config')
assert(currency.includes("ja: 'JPY'"), 'Japanese default currency must be JPY')
assert(currency.includes("fr: 'EUR'"), 'French default currency must be EUR')
assert(currency.includes("de: 'EUR'"), 'German default currency must be EUR')
assert(currency.includes("es: 'USD'"), 'Spanish default currency must be USD')
assert(currency.includes('CURRENCY_FORMAT_LOCALE'), 'currency config must pin display formatting by currency')
assert(currency.includes('return `JPY ￥${formattedAmount}`'), 'JPY display must use the JPY code and yen symbol')
assert(currency.includes('minimumFractionDigits: 2'), 'USD and EUR display must fix two fraction digits')

const currencyFormatSamples = [
  { currency: 'USD', locale: 'en-US', amount: 19, expected: '$19.00' },
  { currency: 'EUR', locale: 'en-US', amount: 16.6, expected: '€16.60' },
  { currency: 'JPY', locale: 'en-US', amount: 2900, expected: 'JPY ￥2,900' },
]
for (const sample of currencyFormatSamples) {
  if (sample.currency === 'JPY') {
    const actual = `JPY ￥${new Intl.NumberFormat(sample.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(sample.amount)}`
    assert(actual === sample.expected, `currency display sample ${sample.currency} expected ${sample.expected}, got ${actual}`)
    continue
  }

  const fractionDigits = sample.currency === 'JPY' ? 0 : 2
  const actual = new Intl.NumberFormat(sample.locale, {
    style: 'currency',
    currency: sample.currency,
    currencyDisplay: 'symbol',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(sample.amount)
  assert(actual === sample.expected, `currency display sample ${sample.currency} expected ${sample.expected}, got ${actual}`)
}

const plans = read('backend/config/plans.ts')
for (const currencyCode of currencies) {
  assert(plans.includes(`${currencyCode}: { amount:`), `plans missing ${currencyCode} price matrix`)
}
const missingPayPalIds = []
const paypalButtonIds = new Map()
for (const planId of ['basic', 'pro', 'premium']) {
  const planBlockMatch = plans.match(new RegExp(`${planId}: \\{[\\s\\S]*?priceId:`))
  assert(planBlockMatch, `plans missing ${planId}`)
  const planBlock = planBlockMatch[0]
  for (const currencyCode of currencies) {
    const buttonMatch = planBlock.match(new RegExp(`${currencyCode}: \\{ amount: [0-9]+(?:\\.[0-9]+)?, paypalButtonId: '([^']*)' \\}`))
    assert(buttonMatch, `${planId} missing ${currencyCode} PayPal config`)
    const buttonId = buttonMatch[1]
    if (!buttonId) {
      missingPayPalIds.push(`${planId}:${currencyCode}`)
    } else {
      const existing = paypalButtonIds.get(buttonId)
      assert(!existing, `PayPal button ID ${buttonId} is reused by ${existing} and ${planId}:${currencyCode}`)
      paypalButtonIds.set(buttonId, `${planId}:${currencyCode}`)
    }
  }
}

const middleware = read('src/middleware.ts')
for (const route of ['', 'pricing', 'privacy', 'terms', 'refund', 'contact', 'questions', 'sample', 'landing', 'upload', 'login']) {
  assert(middleware.includes(`'${route}'`), `middleware localizedRoutes missing ${route || 'home'}`)
}
assert(middleware.includes('blogPosts.map'), 'middleware must whitelist real English blog slugs only')

const sitemap = read('src/lib/sitemap.ts')
for (const route of ['/landing', '/pricing', '/questions', '/sample', '/contact', '/privacy', '/terms', '/refund']) {
  assert(sitemap.includes(`path: '${route}'`), `localized sitemap missing ${route}`)
}
assert(!sitemap.includes("path: '/upload'"), 'upload must not be listed in sitemap')
assert(!sitemap.includes("path: '/blog'") || sitemap.indexOf("englishStaticRoutes") < sitemap.indexOf("path: '/blog'"), 'localized blog must not be listed in sitemap')

const robots = read('src/app/robots.ts')
assert(robots.includes("...ROUTED_LOCALES.map((locale) => `/${locale}/upload`)"), 'robots must disallow localized upload pages')
assert(robots.includes('getSitemapIndexEntries'), 'robots must list sitemap index entries')

const localizedNavbar = read('src/components/layout/localized-navbar.tsx')
assert(localizedNavbar.includes('withSource'), 'localized navbar CTA links must include source')
assert(localizedNavbar.includes('LOCALE_LABELS'), 'localized navbar must expose language switching')
assert(localizedNavbar.includes('localizedLayoutContent'), 'localized navbar must use localized layout copy')

const localizedFooter = read('src/components/layout/localized-footer.tsx')
assert(localizedFooter.includes('withSource'), 'localized footer links must include source')
assert(localizedFooter.includes("localePath(locale, '/contact')"), 'localized footer must link to localized contact')
assert(localizedFooter.includes('localizedLayoutContent'), 'localized footer must use localized layout copy')

const localizedLayoutContent = read('src/lib/localized-layout-content.ts')
for (const locale of ['en', ...locales]) {
  assert(localizedLayoutContent.includes(`${locale}: {`), `localized layout content missing ${locale}`)
}

const upload = read('src/components/upload/upload-page-view.tsx')
assert(upload.includes('pricingHref(`upload_no_credits_${locale}`)'), 'upload no-credit redirect must include source')
assert(upload.includes('localizedUploadContent[locale]'), 'upload page must use localized upload copy')
assert(upload.includes('formatUploadText'), 'upload page must format localized upload templates')

const localizedUploadContent = read('src/lib/localized-upload-content.ts')
for (const locale of ['en', ...locales]) {
  assert(localizedUploadContent.includes(`${locale}:`), `localized upload content missing ${locale}`)
}

const paypal = read('src/components/ui/paypal-button.tsx')
assert(paypal.includes('paypal_success_${planType}_${currency}_${locale}'), 'PayPal success redirect must include source')
assert(paypal.includes("localePath(locale, '/upload')"), 'PayPal success redirect must preserve locale')

const rootLayout = read('src/app/layout.tsx')
assert(!rootLayout.includes('priceCurrency'), 'root layout JSON-LD must not emit a single global price currency')
assert(rootLayout.includes("headers()"), 'root layout must read request headers for SEO-oriented server-rendered html lang')
assert(rootLayout.includes('lang={locale}'), 'root layout must render html lang from the active locale')
assert(rootLayout.includes('HtmlLangSync'), 'root layout must sync html lang after client-side locale navigation')

const htmlLangSync = read('src/components/layout/html-lang-sync.tsx')
assert(htmlLangSync.includes('usePathname'), 'html lang sync must react to client-side route changes')
assert(htmlLangSync.includes('isRoutedLocale'), 'html lang sync must derive routed locale from the path')

assert(middleware.includes("requestHeaders.set('x-mh-locale', locale)"), 'middleware must pass locale to root layout')
assert(middleware.includes('nextWithLocale(request, firstSegment)'), 'localized routes must set routed locale before rendering')

const pricingJsonLd = read('src/components/seo/pricing-json-ld.tsx')
assert(pricingJsonLd.includes('priceCurrency: currency'), 'pricing JSON-LD must use the active locale default currency')

const localizedPricingPage = read('src/components/pricing/localized-pricing-page.tsx')
assert(localizedPricingPage.includes('getDefaultCurrencyForLocale(locale)'), 'localized pricing must derive currency from the URL locale')
assert(!localizedPricingPage.includes('CURRENCIES.map'), 'localized pricing must not render a currency switcher')
assert(!localizedPricingPage.includes('localStorage'), 'localized pricing must not persist manual currency selection')
assert(!localizedPricingPage.includes('mh_currency'), 'localized pricing must not set currency cookies')

const localizedSeo = read('src/lib/localized-seo.ts')
for (const locale of locales) {
  assert(localizedSeo.includes(`${locale}: {`), `localized SEO missing ${locale}`)
}
for (const page of ['home', 'landing', 'pricing', 'contact', 'questions', 'sample', 'upload']) {
  assert(localizedSeo.includes(`${page}: {`), `localized SEO missing ${page}`)
}
for (const route of [
  'src/app/[locale]/page.tsx',
  'src/app/[locale]/landing/page.tsx',
  'src/app/[locale]/pricing/page.tsx',
  'src/app/[locale]/contact/page.tsx',
  'src/app/[locale]/questions/page.tsx',
  'src/app/[locale]/sample/page.tsx',
  'src/app/[locale]/upload/page.tsx',
]) {
  assert(read(route).includes('getLocalizedSeo'), `${route} must use localized SEO keywords`)
}

const authReturn = read('src/lib/auth-return.ts')
assert(authReturn.includes('safeReturnTo'), 'auth return helper must validate returnTo')
assert(authReturn.includes('loginPathForReturn'), 'auth return helper must build login return URLs')
assert(authReturn.includes("localePath(localeFromPath(safePath), '/login')"), 'login return helper must route localized users to localized login')
assert(read('src/app/[locale]/login/page.tsx').includes('LoginPageView'), 'localized login route must render shared login view')

for (const route of [
  'src/components/ui/paypal-button.tsx',
  'src/components/ui/plan-payment-cta.tsx',
  'src/components/dashboard/dashboard-page-view.tsx',
  'src/components/generate/generation-page-view.tsx',
  'src/components/generations/generation-info-page-view.tsx',
]) {
  assert(read(route).includes('loginPathForReturn'), `${route} must use loginPathForReturn`)
}

for (const route of [
  'src/app/[locale]/dashboard/page.tsx',
  'src/app/[locale]/generate/[id]/page.tsx',
  'src/app/[locale]/generations/[id]/page.tsx',
]) {
  assert(read(route).includes('locale'), `${route} must expose localized app flow route`)
}

assert(read('src/components/layout/localized-navbar.tsx').includes('window.location.href = homeHref'), 'localized logout must return to locale home')

assert(read('src/lib/localized-generation-status.ts').includes('localizeGenerationStatus'), 'generation status must have localized front-end mapping')
assert(read('src/components/generate/generation-page-view.tsx').includes('localizeGenerationStatus'), 'generation page must localize API currentStep display')
assert(read('backend/db/migrations/012_headshot_styles_localization.sql').includes('localized_names JSONB'), 'style localization migration must add localized_names JSONB')
const styleTextMigration = read('backend/db/migrations/013_headshot_style_localized_text.sql')
assert(styleTextMigration.includes('localized_names'), 'style text migration must populate localized_names')
assert((styleTextMigration.match(/jsonb_build_object\('es'/g) || []).length >= 50, 'style text migration should include localized text for current style set')
assert(read('src/app/api/styles/route.ts').includes('locale=') || read('src/app/api/styles/route.ts').includes('searchParams.get'), 'styles API must accept locale')

console.log('Multilingual config check passed.')
if (missingPayPalIds.length) {
  console.log(`PayPal button IDs still pending: ${missingPayPalIds.join(', ')}`)
}
