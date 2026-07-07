import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const locales = ['es', 'fr', 'de', 'ja']
const currencies = ['USD', 'EUR', 'JPY']
const useCaseRoutes = [
  '/ai-headshot-linkedin',
  '/ai-headshot-corporate',
  '/ai-headshot-resume',
  '/ai-headshot-studio-style',
  '/ai-headshot-professional-photo',
]
const useCaseSeoPages = [
  'aiHeadshotLinkedIn',
  'aiHeadshotCorporate',
  'aiHeadshotResume',
  'aiHeadshotStudioStyle',
  'aiHeadshotProfessionalPhoto',
]

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
assert(currency.includes('return `JPY ${formattedAmount}`'), 'JPY display must use the JPY code without mojibake')
assert(currency.includes('minimumFractionDigits: 2'), 'USD and EUR display must fix two fraction digits')

const currencyFormatSamples = [
  { currency: 'USD', locale: 'en-US', amount: 19, expected: '$19.00' },
  { currency: 'EUR', locale: 'en-US', amount: 16.6, expected: '€16.60' },
  { currency: 'JPY', locale: 'en-US', amount: 2900, expected: 'JPY 2,900' },
]
for (const sample of currencyFormatSamples) {
  if (sample.currency === 'JPY') {
    const actual = `JPY ${new Intl.NumberFormat(sample.locale, {
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
for (const route of ['', 'blog', 'pricing', 'privacy', 'terms', 'refund', 'contact', 'questions', 'sample', 'ai-headshot-examples', 'landing', 'upload', 'login', 'dashboard/admin/blog', 'dashboard/admin/sample-pictures', 'dashboard/admin/keyword-research', ...useCaseRoutes.map((route) => route.slice(1))]) {
  assert(middleware.includes(`'${route}'`), `middleware localizedRoutes missing ${route || 'home'}`)
}
assert(middleware.includes("const dynamicRootRoutes = new Set(['blog'"), 'middleware must allow dynamic English CMS blog slugs')
assert(middleware.includes("const localizedDynamicRoutes = new Set(['blog'"), 'middleware must allow dynamic localized CMS blog slugs')
assert(!middleware.includes("return redirectTo(request, '/')"), 'middleware must not redirect unknown URLs to home; allow real 404s')
assert(!middleware.includes('localePath(firstSegment))'), 'middleware must not redirect unknown localized URLs to locale home; allow real 404s')

const sitemap = read('src/lib/sitemap.ts')
for (const route of ['/landing', '/pricing', '/questions', '/sample', '/contact', '/privacy', '/terms', '/refund', ...useCaseRoutes]) {
  assert(sitemap.includes(`path: '${route}'`), `localized sitemap missing ${route}`)
}
assert(sitemap.includes('sampleGalleryPath'), 'localized sitemap missing /ai-headshot-examples')
assert(sitemap.includes('xmlns:image'), 'sitemap renderer must expose the image sitemap namespace when images are present')
assert(sitemap.includes('<image:image>'), 'sitemap renderer must emit image sitemap entries')
assert(sitemap.includes('getPublishedBlogPosts'), 'sitemap must include CMS blog posts')
assert(sitemap.includes('localeHasPublishedCmsBlogPosts'), 'localized blog sitemap index route must only appear when localized CMS posts exist')
assert(sitemap.includes('post.coverImage?.url'), 'sitemap must use CMS blog cover images for image SEO')
assert(!sitemap.includes("path: '/upload'"), 'upload must not be listed in sitemap')
assert(sitemap.includes("hasLocalizedBlog"), 'localized blog must be gated before being listed in sitemap')

const robots = read('src/app/robots.ts')
assert(robots.includes("'/api/og'"), 'robots must allow the dynamic OG image endpoint for crawlers')
assert(robots.includes("'/api/icon'"), 'robots must allow the dynamic icon endpoint for crawlers')
assert(robots.includes("...ROUTED_LOCALES.map((locale) => `/${locale}/upload`)"), 'robots must disallow localized upload pages')
assert(robots.includes('getSitemapIndexEntries'), 'robots must list sitemap index entries')
assert(read('src/app/sitemap.xml/route.ts').includes("sitemapXmlResponse('en')"), 'root sitemap must use the shared XML sitemap renderer')
for (const locale of locales) {
  assert(read(`src/app/sitemap-${locale}.xml/route.ts`).includes(`sitemapXmlResponse('${locale}')`), `sitemap-${locale}.xml must use the shared XML sitemap renderer`)
}

assert(read('src/app/api/admin/blog-posts/route.ts').includes('revalidateBlogPaths'), 'admin blog save must revalidate blog and sitemap paths after publish')
assert(read('src/app/api/admin/revalidate-blog/route.ts').includes('revalidateBlogPaths'), 'admin blog revalidate route must use shared revalidate helper')
assert(read('src/components/admin/blog-content-page-view.tsx').includes('SEO enhancement JSON'), 'admin blog UI must expose structured SEO enhancement fields')
assert(read('src/app/api/admin/blog-post-draft/route.ts').includes('DEEPSEEK_KEY'), 'DeepSeek blog draft generation must keep the API key server-side')
assert(read('src/components/admin/blog-content-page-view.tsx').includes('DeepSeek Draft Generator'), 'admin blog UI must expose the editable DeepSeek draft generator')
assert(read('src/components/admin/blog-content-page-view.tsx').includes('draftRelatedTerms'), 'admin blog UI must collect related terms before DeepSeek generation')
assert(read('src/components/admin/blog-content-page-view.tsx').includes('Prepare Keywords'), 'admin blog UI must let DeepSeek prepare localized keywords and a reviewable prompt')
assert(read('src/components/admin/blog-content-page-view.tsx').includes('Generate Article'), 'admin blog UI must separate prompt review from article generation')
assert(read('src/components/admin/blog-content-page-view.tsx').includes('Admin Preview'), 'admin blog UI must expose saved draft previews before publish')
assert(read('src/components/admin/blog-preview-page-view.tsx').includes('/api/admin/blog-posts/${id}'), 'admin blog preview must load saved posts by ID')
assert(read('src/app/dashboard/admin/blog/preview/[id]/page.tsx').includes('BlogPreviewPageView'), 'English admin blog preview route must render saved draft previews')
assert(read('src/app/[locale]/dashboard/admin/blog/preview/[id]/page.tsx').includes('BlogPreviewPageView'), 'localized admin blog preview route must render saved draft previews')
assert(read('src/app/api/admin/maintenance/styles/route.ts').includes('export async function DELETE'), 'style maintenance must support deleting styles')
assert(read('src/app/api/admin/maintenance/styles/route.ts').includes("body.action === 'draft'"), 'style maintenance must support DeepSeek style draft generation')
assert(read('src/app/api/admin/maintenance/styles/route.ts').includes('DEEPSEEK_KEY'), 'style maintenance draft generation must keep DeepSeek server-side')
assert(read('src/components/admin/admin-maintenance-page-view.tsx').includes('Generate Style Draft'), 'style maintenance UI must expose DeepSeek style draft generation')
assert(read('src/components/admin/admin-maintenance-page-view.tsx').includes('Delete'), 'style maintenance UI must expose a delete entry')
assert(read('src/app/api/admin/blog-post-draft/route.ts').includes("mode === 'prepare'"), 'DeepSeek blog draft generation must support keyword and prompt preparation')
assert(read('src/app/api/admin/blog-post-draft/route.ts').includes('exactly two localized long-tail Google search keywords'), 'DeepSeek preparation must return two localized long-tail Google search keywords')
assert(read('src/lib/blog-store.ts').includes('normalizeAdminBlogSlug'), 'admin blog save must normalize long AI-generated slugs')
assert(read('src/app/dashboard/admin/blog/page.tsx').includes('BlogContentPageView'), 'English admin blog page must render blog content manager')
assert(read('src/app/[locale]/dashboard/admin/blog/page.tsx').includes('BlogContentPageView'), 'localized admin blog page must render blog content manager')
assert(read('backend/db/migrations/021_sample_pictures.sql').includes('localized_alt JSONB'), 'sample picture SQL must include localized alt text')
assert(read('backend/db/migrations/021_sample_pictures.sql').includes('localized_title JSONB'), 'sample picture SQL must include localized titles')
assert(read('backend/db/migrations/021_sample_pictures.sql').includes('localized_style_name JSONB'), 'sample picture SQL must include localized style names')
assert(read('backend/db/migrations/022_sample_picture_categories.sql').includes('localized_category JSONB'), 'sample picture category SQL must include localized categories')
assert(read('backend/db/migrations/022_sample_picture_categories.sql').includes('category TEXT'), 'sample picture category SQL must include category field')
assert(read('src/app/api/admin/sample-pictures/route.ts').includes("bucket = 'sample-pictures'"), 'admin sample pictures API must upload to sample-pictures bucket')
assert(read('src/app/api/admin/sample-pictures/route.ts').includes('localized_category'), 'admin sample pictures API must save localized categories')
assert(read('src/components/admin/sample-pictures-page-view.tsx').includes('canvas.toBlob'), 'admin sample pictures UI must compress images before upload')
assert(read('src/components/admin/sample-pictures-page-view.tsx').includes('image.width'), 'admin sample picture compression must preserve dimensions')
assert(read('src/components/admin/sample-pictures-page-view.tsx').includes('datalist id="sample-picture-categories"'), 'admin sample picture UI must allow existing or new categories')
assert(read('src/app/dashboard/admin/sample-pictures/page.tsx').includes('SamplePicturesPageView'), 'English admin sample picture page must render manager')
assert(read('src/app/[locale]/dashboard/admin/sample-pictures/page.tsx').includes('SamplePicturesPageView'), 'localized admin sample picture page must render manager')
assert(read('src/app/ai-headshot-examples/page.tsx').includes('SampleGalleryPage'), 'English sample gallery page must render gallery')
assert(read('src/app/[locale]/ai-headshot-examples/page.tsx').includes('SampleGalleryPage'), 'localized sample gallery page must render gallery')
assert(read('src/components/seo/sample-gallery-page.tsx').includes('loading="lazy"'), 'sample gallery images must lazy load')
assert(read('src/components/seo/sample-gallery-page.tsx').includes('groupPicturesByCategory'), 'sample gallery must group pictures by category')
assert(read('src/app/api/admin/keyword-suggestions/route.ts').includes('suggestqueries.google.com'), 'admin keyword research must use Google-style suggestions server-side')
assert(read('src/components/admin/keyword-research-page-view.tsx').includes('Related Keywords'), 'admin keyword research UI must expose a copyable related keyword box')
assert(read('src/app/dashboard/admin/keyword-research/page.tsx').includes('KeywordResearchPageView'), 'English admin keyword research page must render keyword research UI')
assert(read('src/app/[locale]/dashboard/admin/keyword-research/page.tsx').includes('KeywordResearchPageView'), 'localized admin keyword research page must render keyword research UI')
assert(read('src/components/blog/blog-cover-image.tsx').includes('alt={alt}'), 'blog cover image component must preserve image alt text')

const localizedNavbar = read('src/components/layout/localized-navbar.tsx')
assert(localizedNavbar.includes('withSource'), 'localized navbar CTA links must include source')
assert(localizedNavbar.includes('LOCALE_LABELS'), 'localized navbar must expose language switching')
assert(localizedNavbar.includes('localizedLayoutContent'), 'localized navbar must use localized layout copy')
for (const route of useCaseRoutes.map((route) => route.slice(1))) {
  assert(localizedNavbar.includes(`route === '${route}'`), `localized navbar language switch must preserve ${route}`)
}
assert(localizedNavbar.includes("route === 'ai-headshot-examples'"), 'localized navbar language switch must preserve ai-headshot-examples')

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
assert((rootLayout.match(/availableLanguage/g) || []).length === 1, 'Organization must not emit top-level availableLanguage; keep it only inside ContactPoint')
assert(rootLayout.includes("contactType: 'customer support'"), 'Organization JSON-LD must expose customer support ContactPoint')
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
assert(pricingJsonLd.includes('BreadcrumbJsonLd'), 'pricing JSON-LD must include BreadcrumbList')
assert(pricingJsonLd.includes('Ai headshot-linkedin-professional.jpg'), 'pricing JSON-LD must use the stable static SEO image')
assert(pricingJsonLd.includes("'@graph'"), 'pricing JSON-LD must share merchant policies through @graph to avoid duplicate shipping details per offer')
assert(pricingJsonLd.includes('digitalDeliveryPolicy(currency)'), 'pricing JSON-LD must define delivery policy once per page')
const merchantStructuredData = read('src/lib/merchant-structured-data.ts')
assert(merchantStructuredData.includes('digitalDeliveryPolicyId(currency)'), 'merchant structured data must expose shared delivery policy IDs')
assert(merchantStructuredData.includes('shippingDetails: {') && merchantStructuredData.includes("'@id': digitalDeliveryPolicyId(currency)"), 'offers must reference shared shippingDetails instead of repeating deliveryTime and shippingRate')
assert(merchantStructuredData.includes('MerchantReturnFiniteReturnWindow'), 'merchant return policy must reflect the 30-day refund policy')
assert(merchantStructuredData.includes('merchantReturnDays: 30'), 'merchant return policy must expose 30 return days')

const pageJsonLd = read('src/components/seo/page-json-ld.tsx')
assert(pageJsonLd.includes('BreadcrumbJsonLd'), 'page JSON-LD helper must expose BreadcrumbList')
assert(pageJsonLd.includes("'BreadcrumbList'"), 'page JSON-LD helper must render BreadcrumbList schema')
assert(pageJsonLd.includes('defaultSeoImage'), 'page JSON-LD helper must default to the stable static SEO image')

const homeJsonLd = read('src/components/seo/home-json-ld.tsx')
assert(homeJsonLd.includes('Ai headshot-linkedin-professional.jpg'), 'home JSON-LD must use the stable static SEO image')
assert(!homeJsonLd.includes("'FAQPage'"), 'home JSON-LD must not emit FAQPage unless the homepage renders matching visible FAQs')

const localizedLandingPage = read('src/components/landing/localized-landing-page.tsx')
assert(localizedLandingPage.includes('content.faqs.map'), 'localized landing page must visibly render FAQ items used by FAQPage JSON-LD')

const localizedPricingPage = read('src/components/pricing/localized-pricing-page.tsx')
assert(localizedPricingPage.includes('getDefaultCurrencyForLocale(locale)'), 'localized pricing must derive currency from the URL locale')
assert(!localizedPricingPage.includes('CURRENCIES.map'), 'localized pricing must not render a currency switcher')
assert(!localizedPricingPage.includes('localStorage'), 'localized pricing must not persist manual currency selection')
assert(!localizedPricingPage.includes('mh_currency'), 'localized pricing must not set currency cookies')

const localizedSeo = read('src/lib/localized-seo.ts')
for (const locale of locales) {
  assert(localizedSeo.includes(`${locale}: {`), `localized SEO missing ${locale}`)
}
for (const page of ['home', 'landing', 'pricing', 'contact', 'questions', 'sample', 'upload', ...useCaseSeoPages]) {
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
  'src/app/[locale]/ai-headshot-linkedin/page.tsx',
  'src/app/[locale]/ai-headshot-corporate/page.tsx',
  'src/app/[locale]/ai-headshot-resume/page.tsx',
  'src/app/[locale]/ai-headshot-studio-style/page.tsx',
  'src/app/[locale]/ai-headshot-professional-photo/page.tsx',
]) {
  assert(read(route).includes('getLocalizedSeo'), `${route} must use localized SEO keywords`)
}

const useCasePages = read('src/lib/use-case-pages.ts')
const useCasePageView = read('src/components/use-case/use-case-page-view.tsx')
for (const route of useCaseRoutes) {
  const slug = route.slice(1)
  assert(useCasePages.includes(`'${slug}': {`), `use-case localized content missing ${slug}`)
  assert(read(`src/app/${slug}/page.tsx`).includes('buildUseCasePageMetadata'), `${slug} English page must expose metadata`)
  assert(read(`src/app/[locale]/${slug}/page.tsx`).includes('buildUseCasePageMetadata'), `${slug} localized page must expose metadata`)
}
for (const locale of ['en', ...locales]) {
  assert(useCasePages.includes(`${locale}: {`), `use-case content missing ${locale}`)
}
assert(useCasePages.includes('relatedLinks'), 'use-case pages must define internal related links')
assert(useCasePages.includes('cases:'), 'use-case pages must define local use cases')
assert(useCasePageView.includes('FaqPageJsonLd'), 'use-case pages must emit FAQPage JSON-LD')
assert(useCasePageView.includes('WebPageJsonLd'), 'use-case pages must emit WebPage JSON-LD')
assert(useCasePageView.includes('content.faqs.map'), 'use-case page must visibly render FAQ items used by FAQPage JSON-LD')
assert(useCasePageView.includes('content.relatedLinks.map'), 'use-case page must visibly render internal links')

const keywordStrategy = read('SEO_KEYWORD_STRATEGY.zh-CN.md')
for (const keyword of ['AI headshot generator', 'AI headshots for LinkedIn', 'AI resume photo generator', 'professional headshots without photographer']) {
  assert(keywordStrategy.includes(keyword), `SEO keyword strategy must include ${keyword}`)
}

const englishHome = read('src/app/page.tsx')
for (const source of ['home_resource_sample', 'home_resource_questions', 'home_resource_blog']) {
  assert(englishHome.includes(source), `English homepage must include resource link source ${source}`)
}

const localizedHomeUseCases = read('src/lib/localized-home-use-cases.ts')
for (const locale of locales) {
  assert(localizedHomeUseCases.includes(`${locale}: {`), `localized home use-case content missing ${locale}`)
}
for (const href of ["href: '/pricing'", "href: '/sample'", "href: '/questions'"]) {
  assert(localizedHomeUseCases.includes(href), `localized home use-case content must preserve deferred link ${href}`)
}

const blogArticle = read('src/app/blog/[slug]/page.tsx')
for (const link of ["href: '/sample'", "href: '/questions'", "href: '/pricing'"]) {
  assert(blogArticle.includes(link), `Blog article must link internally to ${link}`)
}
assert(blogArticle.includes('getBlogEnhancement'), 'Blog articles must use per-post enhancement content to reduce page similarity')
assert(blogArticle.includes('enhancement.qualityChecks'), 'Blog articles must render per-post quality checks')
assert(!blogArticle.includes('Practical steps'), 'Blog articles must not render the Practical steps module')
assert(!read('src/app/[locale]/blog/[slug]/page.tsx').includes('Practical steps'), 'Localized blog articles must not render the Practical steps module')
assert(blogArticle.includes('getRelatedPosts(allPosts, post.slug'), 'Blog articles must backfill related posts when CMS related slugs are empty')
assert(read('src/app/[locale]/blog/[slug]/page.tsx').includes('getRelatedPosts(posts, post.slug'), 'Localized blog articles must backfill related posts when CMS related slugs are empty')
const blogEnhancements = read('src/lib/blog-enhancements.ts')
const seoContent = read('src/lib/seo-content.ts')
const blogSlugMatches = [...seoContent.matchAll(/slug: '([^']+)'/g)].map((match) => match[1])
for (const slug of blogSlugMatches) {
  assert(blogEnhancements.includes(`${slug}: {`) || blogEnhancements.includes(`'${slug}': {`), `blog enhancement missing ${slug}`)
}
assert(read('src/app/questions/page.tsx').includes('View one-time credit packs'), 'Questions page must link toward pricing')
assert(read('src/app/sample/page.tsx').includes('Browse AI headshot guides'), 'Sample page must link toward blog guides')

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
