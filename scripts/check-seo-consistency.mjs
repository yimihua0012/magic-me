import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const ts = require('typescript')
const root = process.cwd()
const appDir = join(root, 'src', 'app')
const firstContentCharacterLimit = 400
const seoCheckDbCacheDir = join(tmpdir(), 'magic-headshot-seo-check-cache')
const latinFastContentLocales = new Set(['en', 'es', 'fr', 'de'])
const genericFastContentKeywords = new Set([
  'ai',
  'avatar',
  'background',
  'crop',
  'cropping',
  'headshot',
  'headshots',
  'image',
  'photo',
  'photos',
  'picture',
  'portrait',
  'resize',
  'tool',
])
const blockedFastContentKeywordFragments = [
  'adobe',
  'canva',
  'croppola',
  'david chang',
  'hcorpo',
  'headshotpro',
  'i love img',
  'iloveimg',
  'jcpenney',
  'logo',
  'phoneboard',
  'www.',
  '.com',
  '.net',
  '.org',
]
const allowedFastContentTopicFragments = [
  'ai headshot',
  'avatar',
  'background color',
  'background remover',
  'bewerbungsfoto',
  'business headshot',
  'business portrait',
  'career photo',
  'change background',
  'compress image',
  'compress photo',
  'crop image',
  'crop photo',
  'cv photo',
  'document photo',
  'employee photo',
  'foto carnet',
  'foto curriculum',
  'foto de perfil',
  'foto profesional',
  'headshot',
  'id photo',
  'image crop',
  'image resize',
  'image resizer',
  'linkedin photo',
  'passport photo',
  'passfoto',
  'photo background',
  'photo crop',
  'photo editing',
  'photo layout',
  'photo resize',
  'photo resizer',
  'photo sheet',
  'png',
  'print layout',
  'professional photo',
  'portrait professionnel',
  'profile photo',
  'photo cv',
  'photo d identite',
  'photo d\'identite',
  'photo identite',
  'redimensionner photo',
  'supprimer fond',
  'fond photo',
  'mise en page photo',
  'lebenslauf foto',
  'hintergrund',
  'freistellen',
  'zuschneiden',
  'bild zuschneiden',
  'bildgroesse',
  'bildgröße',
  'remove background',
  'resize image',
  'resize photo',
  'resume photo',
  '証明写真',
  '履歴書写真',
  'プロフィール写真',
  '背景',
  '切り抜き',
  'リサイズ',
  '头像',
  '职业照',
  '职业头像',
  '证件照',
  '简历照片',
  '抠图',
  '去背景',
  '换底',
  '裁剪',
  '缩放',
  '打印排版',
]
const fastContentIntentFragments = [
  'background',
  'bewerbung',
  'business',
  'change',
  'compress',
  'corporate',
  'crop',
  'cv',
  'document',
  'free',
  'generator',
  'id',
  'job',
  'kb',
  'layout',
  'linkedin',
  'identite',
  'online',
  'passport',
  'passfoto',
  'print',
  'professional',
  'profile',
  'remove',
  'resize',
  'resume',
  'redimensionner',
  'supprimer',
  'fond',
  'lebenslauf',
  'hintergrund',
  'freistellen',
  'zuschneiden',
  'tool',
  'upload',
  '背景',
  '履歴書',
  '証明',
  '切り抜き',
  'リサイズ',
  '头像',
  '职业',
  '证件',
  '简历',
  '抠图',
  '去背景',
  '换底',
  '裁剪',
  '缩放',
  '打印',
]
const skippedRoutePatterns = [
  /^src\/app\/(?:\[locale\]\/)?auth\//,
  /^src\/app\/(?:\[locale\]\/)?dashboard\//,
  /^src\/app\/(?:\[locale\]\/)?generate\//,
  /^src\/app\/(?:\[locale\]\/)?generations\//,
  /^src\/app\/(?:\[locale\]\/)?login\//,
  /^src\/app\/(?:\[locale\]\/)?upload\//,
]

const requiredJsonLdSignals = [
  'application/ld+json',
  'WebPageJsonLd',
  'FaqPageJsonLd',
  'CollectionPageJsonLd',
  'HomeJsonLd',
  'PricingJsonLd',
  'BlogJsonLd',
  'BlogPostJsonLd',
]

const jsonLdDescriptionSignals = [
  'description={description}',
  'description={content.description}',
  'description={page.description}',
  'description={post.description}',
  'description={metadata.description',
  'description={appConfig.description}',
  'description={siteDescription}',
  'description="',
  'description,',
  'description: page.description',
  'description: post.description',
  'description: content.description',
  'description: appConfig.description',
  'description: siteDescription',
]

const jsonLdTitleSignals = [
  'title={title}',
  'title={content.title}',
  'title={page.title}',
  'title={post.title}',
  'title={metadata.title',
  'title=',
  'name: title',
  'name: page.h1',
  'name: post.title',
  'name: content.title',
  'currentName={title}',
  'currentName={content.title}',
  'currentName={page.h1}',
  'currentName={post.title}',
]

const jsonLdKeywordSignals = [
  'keywords={metadata.keywords',
  'keywords={keywords',
  'keywords: keywords',
  'keywords: page.keywords',
  'keywords: post.keywords',
  'keywords.join',
  'KeywordStrip keywords=',
]

function read(path) {
  return readFileSync(join(root, path), 'utf8')
}

function loadLocalEnv() {
  for (const file of ['.env.local', '.env', '.env.production']) {
    const path = join(root, file)
    if (!existsSync(path)) continue

    for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
      const parsed = parseEnvLine(line)
      if (!parsed || process.env[parsed.name] !== undefined) continue
      process.env[parsed.name] = parsed.value
    }
  }
}

function parseEnvLine(line) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) return null

  const separator = trimmed.indexOf('=')
  if (separator <= 0) return null

  const name = trimmed.slice(0, separator).trim()
  let value = trimmed.slice(separator + 1).trim()
  const first = value.charCodeAt(0)
  const last = value.charCodeAt(value.length - 1)

  if ((first === 34 && last === 34) || (first === 39 && last === 39)) {
    value = value.slice(1, -1)
  } else {
    value = value.replace(/\s+#.*$/, '')
  }

  return /^[A-Z0-9_]+$/.test(name) ? { name, value } : null
}

function readDailyDbCache(kind, supabaseUrl) {
  if (process.env.SEO_CHECK_DB_CACHE === '0' || process.env.SEO_CHECK_DB_CACHE === 'false') return null

  const path = dailyDbCachePath(kind, supabaseUrl)
  if (!existsSync(path)) return null

  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8'))
    return Array.isArray(parsed?.rows) ? parsed.rows : null
  } catch {
    return null
  }
}

function writeDailyDbCache(kind, supabaseUrl, rows) {
  if (process.env.SEO_CHECK_DB_CACHE === '0' || process.env.SEO_CHECK_DB_CACHE === 'false') return

  try {
    mkdirSync(seoCheckDbCacheDir, { recursive: true })
    writeFileSync(dailyDbCachePath(kind, supabaseUrl), JSON.stringify({
      cachedAt: new Date().toISOString(),
      rows,
    }), 'utf8')
  } catch {
    // Cache writes should never fail the SEO check.
  }
}

function dailyDbCachePath(kind, supabaseUrl) {
  const projectRef = supabaseProjectRef(supabaseUrl)
  return join(seoCheckDbCacheDir, `${kind}-${projectRef}-${shanghaiDayKey(new Date())}.json`)
}

function supabaseProjectRef(supabaseUrl) {
  try {
    return new URL(supabaseUrl).hostname.split('.')[0].replace(/[^a-z0-9_-]/gi, '_')
  } catch {
    return 'unknown'
  }
}

function shanghaiDayKey(value) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(value)
  const readPart = (type) => parts.find((part) => part.type === type)?.value || ''
  return `${readPart('year')}-${readPart('month')}-${readPart('day')}`
}

function toRepoPath(path) {
  return relative(root, path).split(sep).join('/')
}

function listPageFiles(dir = appDir) {
  const files = []
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const stats = statSync(fullPath)
    if (stats.isDirectory()) {
      files.push(...listPageFiles(fullPath))
    } else if (entry === 'page.tsx') {
      files.push(fullPath)
    }
  }
  return files
}

function readLayoutChain(file) {
  return readLayoutSources(file).join('\n')
}

function readLayoutSources(file) {
  const layouts = []
  let currentDir = join(file, '..')
  while (currentDir.startsWith(appDir)) {
    const layoutPath = join(currentDir, 'layout.tsx')
    try {
      const stats = statSync(layoutPath)
      if (stats.isFile()) {
        layouts.push({ path: toRepoPath(layoutPath), source: readFileSync(layoutPath, 'utf8') })
      }
    } catch {
      // No layout at this level.
    }
    const nextDir = join(currentDir, '..')
    if (nextDir === currentDir) break
    currentDir = nextDir
  }
  return layouts
}

function routePathForPage(repoPath) {
  return repoPath
    .replace(/^src\/app/, '')
    .replace(/\/page\.tsx$/, '')
    || '/'
}

function isSkipped(repoPath) {
  return skippedRoutePatterns.some((pattern) => pattern.test(repoPath))
}

function hasAny(source, needles) {
  return needles.some((needle) => source.includes(needle))
}

function hasMetadata(source) {
  return source.includes('export const metadata') || source.includes('export async function generateMetadata')
}

function hasTitleSignal(source) {
  return source.includes('title:') ||
    source.includes('title,') ||
    source.includes('title=') ||
    source.includes('buildUseCasePageMetadata') ||
    source.includes('localizedSocialMetadata')
}

function hasH1Signal(source) {
  return source.includes('<h1') ||
    source.includes('UseCasePageView') ||
    source.includes('BlogCategoryPageView') ||
    source.includes('SampleGalleryPage') ||
    source.includes('PublicPhotoToolsPageView') ||
    source.includes('StandalonePhotoToolsPageView') ||
    source.includes('ContactPageClient') ||
    source.includes('LocalizedHomePage') ||
    source.includes('LocalizedLandingPage') ||
    source.includes('LocalizedPricingPage') ||
    source.includes('LocalizedContactPage') ||
    source.includes('LocalizedQuestionsPage') ||
    source.includes('LocalizedSamplePage') ||
    source.includes('LocalizedLegalPage')
}

function hasDescriptionSignal(source) {
  return source.includes('description:') ||
    source.includes('description,') ||
    source.includes('description={') ||
    source.includes('description=') ||
    source.includes('buildUseCasePageMetadata') ||
    source.includes('localizedSocialMetadata')
}

function hasKeywordsSignal(source) {
  return source.includes('keywords:') ||
    source.includes('keywords={') ||
    source.includes('KeywordStrip') ||
    source.includes('getLocalizedSeo') ||
    source.includes('buildUseCasePageMetadata') ||
    source.includes('metadata.keywords') ||
    source.includes('seo.keywords') ||
    source.includes('post.keywords') ||
    source.includes('coreSeoKeywords')
}

function hasFeaturesSignal(source) {
  return source.includes('featureList') ||
    source.includes('features') ||
    source.includes('Features') ||
    source.includes('UseCasePageView') ||
    source.includes('BlogCategoryPageView') ||
    source.includes('LocalizedHomePage') ||
    source.includes('LocalizedLandingPage') ||
    source.includes('LocalizedPricingPage') ||
    source.includes('LocalizedContactPage') ||
    source.includes('LocalizedQuestionsPage') ||
    source.includes('LocalizedSamplePage') ||
    source.includes('LocalizedLegalPage') ||
    source.includes('PublicPhotoToolsPageView') ||
    source.includes('StandalonePhotoToolsPageView') ||
    source.includes('ContactPageClient') ||
    source.includes('SampleGalleryPage') ||
    source.includes('BlogJsonLd') ||
    source.includes('BlogPostJsonLd') ||
    source.includes('pricingConfig') ||
    source.includes('pricingFAQ') ||
    source.includes('outcomes') ||
    source.includes('steps') ||
    source.includes('cases') ||
    source.includes('sampleComparisons') ||
    source.includes('posts.map') ||
    source.includes('resourceLinks') ||
    source.includes('mainEntity') ||
    source.includes('sitemapEntries.map') ||
    source.includes('<h2') ||
    source.includes('<Card')
}

function hasFaqSignal(source) {
  return source.includes('FaqPageJsonLd') ||
    source.includes('FAQPage') ||
    source.includes('faqs') ||
    source.includes('faq') ||
    source.includes('FAQ') ||
    source.includes('UseCasePageView') ||
    source.includes('BlogCategoryPageView') ||
    source.includes('LocalizedLandingPage') ||
    source.includes('LocalizedPricingPage') ||
    source.includes('LocalizedQuestionsPage') ||
    source.includes('LocalizedHomePage') ||
    source.includes('LocalizedContactPage') ||
    source.includes('LocalizedSamplePage') ||
    source.includes('LocalizedLegalPage') ||
    source.includes('PublicPhotoToolsPageView') ||
    source.includes('StandalonePhotoToolsPageView') ||
    source.includes('SampleGalleryPage') ||
    source.includes('BlogJsonLd') ||
    source.includes('BlogPostJsonLd') ||
    source.includes('questions') ||
    source.includes('pricingFAQ') ||
    source.includes('content.questions')
}

function validatePageSeoRecord(repoPath, source, issues) {
  const missing = []
  if (!hasTitleSignal(source)) missing.push('title')
  if (!hasH1Signal(source)) missing.push('H1')
  if (!hasDescriptionSignal(source)) missing.push('description')
  if (!hasKeywordsSignal(source)) missing.push('keywords')
  if (!hasFeaturesSignal(source)) missing.push('features')
  if (!hasFaqSignal(source)) missing.push('FAQ')

  if (missing.length > 0) {
    issues.push(`${repoPath}: missing SEO field(s): ${missing.join(', ')}.`)
  }
}

const stopWords = new Set([
  'about',
  'after',
  'again',
  'also',
  'and',
  'another',
  'are',
  'article',
  'avec',
  'bei',
  'best',
  'but',
  'can',
  'common',
  'como',
  'con',
  'das',
  'der',
  'des',
  'die',
  'download',
  'ein',
  'eine',
  'for',
  'from',
  'fur',
  'get',
  'guide',
  'how',
  'into',
  'les',
  'los',
  'make',
  'mit',
  'need',
  'our',
  'para',
  'por',
  'que',
  'see',
  'sur',
  'the',
  'then',
  'this',
  'tips',
  'und',
  'une',
  'use',
  'vous',
  'what',
  'when',
  'with',
  'without',
  'you',
  'your',
])
const shortSeoTokens = new Set(['ai', 'cv', 'hd', 'id', 'kb'])

function stemToken(token) {
  if (token.length > 6 && token.endsWith('able')) return token.slice(0, -4)
  if (token.length > 5 && token.endsWith('ing')) return token.slice(0, -3)
  if (token.length > 5 && token.endsWith('ies')) return `${token.slice(0, -3)}y`
  if (token.length > 4 && /(ches|shes|sses|xes|zes)$/.test(token)) return token.slice(0, -2)
  if (token.length > 4 && token.endsWith('s')) return token.slice(0, -1)
  return token
}

function tokenizeSeoText(text) {
  if (!text) return []
  return Array.from(
    new Set(
      normalizeSeoText(text)
        .match(/[a-z0-9\u00c0-\u024f\u0370-\u03ff\u0400-\u04ff\u3040-\u30ff\u3400-\u9fff]+/g)
        ?.map(stemToken)
        .filter((token) => (token.length > 2 || shortSeoTokens.has(token)) && !stopWords.has(token)) || []
    )
  )
}

function getSeoOverlap(candidate, description) {
  const descriptionTokens = new Set(tokenizeSeoText(description))
  return tokenizeSeoText(candidate).filter((token) => descriptionTokens.has(token))
}

function hasSeoTopicOverlap(candidate, description, minimum = 2) {
  const candidateCompact = compactSeoText(candidate)
  const descriptionCompact = compactSeoText(description)

  if (!candidateCompact || !descriptionCompact) return false

  if (
    candidateCompact.length >= 4
    && (
      descriptionCompact.includes(candidateCompact)
      || candidateCompact.includes(descriptionCompact)
    )
  ) {
    return true
  }

  if (hasCjkSeoTopicOverlap(candidateCompact, descriptionCompact, minimum)) {
    return true
  }

  const candidateTokens = tokenizeSeoText(candidate)
  if (candidateTokens.length === 0) return false
  const required = Math.min(minimum, candidateTokens.length)
  return getSeoOverlap(candidate, description).length >= required
}

function keywordOverlapMinimum(keyword) {
  return tokenizeSeoText(keyword).length >= 3 ? 2 : 1
}

// Project meta description guideline:
// Google does not publish a strict meta description character limit. For this project,
// use snippet-friendly editorial ranges that reduce truncation risk while keeping
// descriptions specific enough for title/H1/keyword intent checks.
const META_DESCRIPTION_LENGTH_RANGES = {
  default: { min: 100, max: 140, label: '100-140 Unicode characters' },
  ja: { min: 55, max: 90, label: '55-90 Japanese characters' },
  zh: { min: 50, max: 90, label: '50-90 Chinese characters' },
}

function metaDescriptionLengthIssue(locale, description) {
  const length = Array.from(description.trim()).length
  const range = locale === 'ja'
    ? META_DESCRIPTION_LENGTH_RANGES.ja
    : locale === 'zh'
      ? META_DESCRIPTION_LENGTH_RANGES.zh
      : META_DESCRIPTION_LENGTH_RANGES.default

  if (length < range.min || length > range.max) {
    return `description length must be ${range.label}; got ${length}.`
  }

  return null
}

function normalizedKeywordKey(keyword) {
  return normalizeSeoText(keyword).replace(/\s+/g, ' ').trim()
}

function duplicateKeywords(keywords) {
  const seen = new Set()
  const duplicates = []

  for (const keyword of keywords) {
    const key = normalizedKeywordKey(keyword)
    if (!key) continue
    if (seen.has(key)) {
      duplicates.push(keyword)
    } else {
      seen.add(key)
    }
  }

  return duplicates
}

function validateFastContentKeywordForSeo(keyword, locale = 'en') {
  const cleanKeyword = normalizeWhitespace(String(keyword || '').normalize('NFKC'))
  const normalized = cleanKeyword.toLocaleLowerCase()
  const reasons = []

  if (!cleanKeyword) reasons.push('keyword is empty')
  if (/https?:\/\//i.test(cleanKeyword)) reasons.push('keyword must not be a URL')
  if (/[<>{}[\]\\]/.test(cleanKeyword)) reasons.push('keyword contains unsupported characters')
  if (blockedFastContentKeywordFragments.some((fragment) => normalized.includes(fragment))) {
    reasons.push('keyword contains a competitor, website, brand, or unrelated named entity')
  }

  if (latinFastContentLocales.has(locale)) {
    const words = splitFastContentWords(cleanKeyword)
    if (cleanKeyword.length < 8) reasons.push('keyword is too short to show useful long-tail intent')
    if (cleanKeyword.length > 80) reasons.push('keyword is too long for one focused article topic')
    if (words.length < 2) reasons.push('keyword must be more specific than one broad word')
    if (words.length > 8) reasons.push('keyword is too broad or sentence-like; keep it within 2-8 words')
    if (genericFastContentKeywords.has(normalized)) reasons.push('keyword is too generic for Fast Content')
  } else {
    const length = Array.from(cleanKeyword).length
    if (length < 4) reasons.push('keyword is too short to show useful search intent')
    if (length > 40) reasons.push('keyword is too long for one focused article topic')
  }

  if (!hasFastContentTopic(cleanKeyword)) {
    reasons.push('keyword is not closely related to headshots, profile photos, ID photos, or photo tools')
  }

  if (!hasFastContentIntent(cleanKeyword)) {
    reasons.push('keyword does not show a clear use case, action, format, or target audience')
  }

  return reasons
}

function hasFastContentTopic(value) {
  const normalized = normalizeFastContentComparable(value)
  return allowedFastContentTopicFragments.some((fragment) => normalized.includes(normalizeFastContentComparable(fragment)))
}

function hasFastContentIntent(value) {
  const normalized = normalizeFastContentComparable(value)
  return fastContentIntentFragments.some((fragment) => normalized.includes(normalizeFastContentComparable(fragment)))
}

function splitFastContentWords(value) {
  return String(value || '')
    .toLocaleLowerCase()
    .normalize('NFKC')
    .split(/[^\p{Letter}\p{Number}]+/u)
    .map((word) => word.trim())
    .filter(Boolean)
}

function normalizeFastContentComparable(value) {
  return String(value || '')
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
}

function inferLocaleFromRepoPath(repoPath) {
  const parts = repoPath.split('/')
  const locale = parts[2]
  return ['en', 'es', 'fr', 'de', 'ja', 'zh'].includes(locale) ? locale : 'en'
}

function validateSeoBasics(label, { locale = 'en', title = '', h1 = '', description = '', keywords = [], checkH1 = true, firstContent = '' }, issues) {
  const normalizedDescription = typeof description === 'string' ? description.trim() : ''
  const normalizedTitle = typeof title === 'string' ? title.trim() : ''
  const normalizedH1 = typeof h1 === 'string' ? h1.trim() : ''
  const normalizedKeywords = Array.isArray(keywords) ? keywords.filter((keyword) => typeof keyword === 'string' && keyword.trim()) : []

  if (!normalizedDescription) {
    issues.push(`${label}: missing description.`)
    return
  }

  const descriptionLengthIssue = metaDescriptionLengthIssue(locale, normalizedDescription)
  if (descriptionLengthIssue) {
    issues.push(`${label}: ${descriptionLengthIssue}`)
  }

  if (normalizedKeywords.length === 0) {
    issues.push(`${label}: missing keywords.`)
  }

  if (normalizedKeywords.length > 3) {
    issues.push(`${label}: keywords must contain 1-3 items; got ${normalizedKeywords.length}.`)
  }

  const repeatedKeywords = duplicateKeywords(normalizedKeywords)
  if (repeatedKeywords.length > 0) {
    issues.push(`${label}: duplicate keyword(s): ${repeatedKeywords.map((keyword) => `"${keyword}"`).join(', ')}.`)
  }

  if (normalizedTitle && !hasSeoTopicOverlap(normalizedTitle, normalizedDescription, 2)) {
    issues.push(`${label}: title does not match description topic.`)
  }

  if (checkH1 && normalizedH1 && !hasSeoTopicOverlap(normalizedH1, normalizedDescription, 2)) {
    issues.push(`${label}: H1 does not match description topic.`)
  }

  const mismatchedKeywords = normalizedKeywords.filter((keyword) => !hasSeoTopicOverlap(keyword, normalizedDescription, keywordOverlapMinimum(keyword)))
  if (mismatchedKeywords.length > 0) {
    issues.push(`${label}: keyword(s) do not match description topic: ${mismatchedKeywords.map((keyword) => `"${keyword}"`).join(', ')}.`)
  }

  validateFirstContentSeoCoverage(label, {
    title: normalizedTitle,
    h1: normalizedH1,
    description: normalizedDescription,
    keywords: normalizedKeywords,
    firstContent,
  }, issues)
}

function validateFirstContentSeoCoverage(label, { title = '', h1 = '', description = '', keywords = [], firstContent = '' }, issues) {
  const sourceText = firstContent || [h1 || title, description, ...keywords].filter(Boolean).join(' ')
  const firstContentText = Array.from(normalizeWhitespace(sourceText)).slice(0, firstContentCharacterLimit).join('')
  const titleCandidate = h1 || title

  if (!firstContentText) {
    issues.push(`${label}: first ${firstContentCharacterLimit} visible characters could not be checked.`)
    return
  }

  if (titleCandidate && !hasSeoTopicOverlap(titleCandidate, firstContentText, 2)) {
    issues.push(`${label}: first ${firstContentCharacterLimit} visible characters do not match title/H1 topic.`)
  }

  const missingKeywords = keywords.filter((keyword) => !hasSeoTopicOverlap(keyword, firstContentText, keywordOverlapMinimum(keyword)))
  if (missingKeywords.length > 0) {
    issues.push(`${label}: first ${firstContentCharacterLimit} visible characters do not cover keyword topic(s): ${missingKeywords.map((keyword) => `"${keyword}"`).join(', ')}.`)
  }
}

function normalizeWhitespace(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function compactSeoText(text) {
  return normalizeSeoText(text).replace(/[^a-z0-9\u00c0-\u024f\u0370-\u03ff\u0400-\u04ff\u3040-\u30ff\u3400-\u9fff]+/g, '')
}

function hasCjkSeoTopicOverlap(candidateCompact, descriptionCompact, minimum) {
  const candidateCjk = cjkSeoText(candidateCompact)
  const descriptionCjk = cjkSeoText(descriptionCompact)

  if (candidateCjk.length < 4 || descriptionCjk.length < 4) return false
  if (descriptionCjk.includes(candidateCjk) || candidateCjk.includes(descriptionCjk)) return true

  const gramSize = candidateCjk.length >= 6 ? 3 : 2
  const candidateGrams = cjkNgrams(candidateCjk, gramSize)
  if (candidateGrams.length === 0) return false

  const descriptionGrams = new Set(cjkNgrams(descriptionCjk, gramSize))
  const sharedCount = candidateGrams.filter((gram) => descriptionGrams.has(gram)).length
  const required = Math.min(candidateGrams.length, Math.max(minimum, Math.ceil(candidateGrams.length * 0.3)))

  return sharedCount >= required
}

function cjkSeoText(text) {
  return text.replace(/[^\u3040-\u30ff\u3400-\u9fff]+/g, '')
}

function cjkNgrams(text, size) {
  const grams = new Set()
  for (let index = 0; index <= text.length - size; index += 1) {
    const gram = text.slice(index, index + size)
    if (/[\u30a0-\u30ff\u3400-\u9fff]/.test(gram)) {
      grams.add(gram)
    }
  }
  return Array.from(grams)
}

function normalizeSeoText(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
}

function propertyName(node) {
  if (!node) return null
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text
  return null
}

function isStringNode(node) {
  return ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)
}

function parseSource(source, repoPath) {
  return ts.createSourceFile(repoPath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
}

function buildLiteralContext(sourceFile, sharedValues = {}) {
  const strings = new Map(Object.entries(sharedValues.strings || {}))
  const arrays = new Map(Object.entries(sharedValues.arrays || {}))
  const objects = new Map()

  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
      const name = node.name.text
      if (isStringNode(node.initializer)) {
        strings.set(name, node.initializer.text)
      } else if (ts.isArrayLiteralExpression(node.initializer)) {
        const values = node.initializer.elements
          .filter(isStringNode)
          .map((element) => element.text)
        if (values.length === node.initializer.elements.length) {
          arrays.set(name, values)
        }
      } else if (ts.isObjectLiteralExpression(node.initializer)) {
        objects.set(name, node.initializer)
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return { sourceFile, strings, arrays, objects, sharedValues }
}

function expressionText(node, sourceFile) {
  return node ? node.getText(sourceFile).replace(/\s+/g, ' ') : ''
}

function resolveStringExpression(node, context) {
  if (!node) return null
  if (isStringNode(node)) return node.text
  if (ts.isIdentifier(node)) return context.strings.get(node.text) || null
  if (ts.isPropertyAccessExpression(node)) {
    return context.sharedValues.strings?.[expressionText(node, context.sourceFile)] || null
  }
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression?.(node)) {
    return resolveStringExpression(node.expression, context)
  }
  return null
}

function resolveStringArrayExpression(node, context) {
  if (!node) return null
  if (ts.isArrayLiteralExpression(node)) {
    const values = node.elements.map((element) => resolveStringExpression(element, context))
    return values.every(Boolean) ? values : null
  }
  if (ts.isIdentifier(node)) return context.arrays.get(node.text) || null
  if (ts.isPropertyAccessExpression(node)) {
    return context.sharedValues.arrays?.[expressionText(node, context.sourceFile)] || null
  }
  if (ts.isSpreadElement(node)) return null
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression?.(node)) {
    return resolveStringArrayExpression(node.expression, context)
  }
  return null
}

function propertyExpression(objectLiteral, key) {
  if (!objectLiteral) return null
  for (const property of objectLiteral.properties) {
    if (ts.isPropertyAssignment(property) && propertyName(property.name) === key) return property.initializer
    if (ts.isShorthandPropertyAssignment(property) && propertyName(property.name) === key) return property.name
  }
  return null
}

function findMetadataObject(sourceFile) {
  let found = null

  function visit(node) {
    if (found) return
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'metadata' && ts.isObjectLiteralExpression(node.initializer)) {
      found = node.initializer
      return
    }
    if (ts.isReturnStatement(node) && node.expression && ts.isObjectLiteralExpression(node.expression)) {
      const title = propertyExpression(node.expression, 'title')
      const description = propertyExpression(node.expression, 'description')
      if (title || description) {
        found = node.expression
        return
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return found
}

function collectJsxText(node, context) {
  let text = ''
  const expressions = []

  function visit(child) {
    if (ts.isJsxText(child)) {
      text += child.text
      return
    }
    if (ts.isJsxExpression(child) && child.expression) {
      const resolved = resolveStringExpression(child.expression, context)
      if (resolved) {
        text += resolved
      } else {
        expressions.push(expressionText(child.expression, context.sourceFile))
      }
      return
    }
    if (ts.isJsxElement(child)) {
      child.children.forEach(visit)
      return
    }
    if (ts.isJsxSelfClosingElement(child)) return
    ts.forEachChild(child, visit)
  }

  visit(node)
  return {
    text: text.replace(/\s+/g, ' ').trim(),
    expressions,
  }
}

function extractH1Snapshot(sourceFile, context) {
  const h1s = []

  function visit(node) {
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText(sourceFile) === 'h1') {
      h1s.push(collectJsxText(node, context))
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return h1s[0] || { text: null, expressions: [] }
}

function extractSeoSnapshot(metadataSource, h1Source, repoPath) {
  const sharedValues = getSharedSeoValues()
  const metadataFile = parseSource(metadataSource, `${repoPath}:metadata`)
  const metadataContext = buildLiteralContext(metadataFile, sharedValues)
  const metadataObject = findMetadataObject(metadataFile)
  const titleExpression = propertyExpression(metadataObject, 'title')
  const descriptionExpression = propertyExpression(metadataObject, 'description')
  const keywordsExpression = propertyExpression(metadataObject, 'keywords')

  const h1File = parseSource(h1Source, `${repoPath}:h1`)
  const h1Context = buildLiteralContext(h1File, sharedValues)
  const h1 = extractH1Snapshot(h1File, h1Context)

  return {
    title: resolveStringExpression(titleExpression, metadataContext),
    titleSource: expressionText(titleExpression, metadataContext.sourceFile),
    description: resolveStringExpression(descriptionExpression, metadataContext),
    descriptionSource: expressionText(descriptionExpression, metadataContext.sourceFile),
    keywords: resolveStringArrayExpression(keywordsExpression, metadataContext),
    keywordsSource: expressionText(keywordsExpression, metadataContext.sourceFile),
    h1: h1.text,
    h1Source: h1.expressions[0] || h1.text,
  }
}

let sharedSeoValuesCache = null

function getSharedSeoValues() {
  if (sharedSeoValuesCache) return sharedSeoValuesCache
  const configSource = read('src/lib/config.ts')
  const defaultDescription = configSource.match(/const defaultDescription =\s*[\r\n\s]*'([^']+)'/)?.[1] || ''
  const defaultTitle = configSource.match(/title:\s*process\.env\.NEXT_PUBLIC_APP_TITLE \|\| '([^']+)'/)?.[1] || ''
  const defaultKeywords = configSource.match(/const defaultKeywords =\s*[\r\n\s]*'([^']+)'/)?.[1] || ''
  sharedSeoValuesCache = {
    strings: {
      'appConfig.description': defaultDescription,
      'appConfig.title': defaultTitle,
    },
    arrays: {
      'appConfig.keywords': defaultKeywords.split(',').map((keyword) => keyword.trim()).filter(Boolean),
    },
  }
  return sharedSeoValuesCache
}

function sourceUsesSharedSeoContent(source) {
  return source.includes('buildUseCasePageMetadata') ||
    (source.includes('content.title') && source.includes('content.description') && (source.includes('content.keywords') || source.includes('seo.keywords'))) ||
    (source.includes('post.title') && source.includes('post.description') && source.includes('post.keywords')) ||
    (source.includes('page.title') && source.includes('page.description') && source.includes('page.keywords')) ||
    (source.includes('metadata.title') && source.includes('metadata.description') && source.includes('metadata.keywords')) ||
    source.includes('getLocalizedSeo')
}

function validateSeoFieldConsistency(repoPath, metadataSource, h1Source, source, issues) {
  const snapshot = extractSeoSnapshot(metadataSource, h1Source, repoPath)
  const hasStaticDescription = Boolean(snapshot.description)

  if (!hasStaticDescription) {
    if (!sourceUsesSharedSeoContent(source)) {
      issues.push(`${repoPath}: cannot verify title/H1/keywords consistency because the page description source is not statically detectable or a recognized shared SEO content source.`)
    }
    return
  }

  validateSeoBasics(repoPath, {
    locale: inferLocaleFromRepoPath(repoPath),
    title: snapshot.title,
    h1: snapshot.h1,
    description: snapshot.description,
    keywords: snapshot.keywords || [],
    checkH1: !sourceUsesSharedSeoContent(source),
  }, issues)
}

function validateJsonLdConsistency(repoPath, source, issues) {
  if (!hasAny(source, requiredJsonLdSignals)) return

  if (
    source.includes('BlogJsonLd') ||
    source.includes('BlogPostJsonLd') ||
    source.includes('CollectionPageJsonLd') ||
    source.includes('PricingJsonLd') ||
    source.includes('UseCasePageView') ||
    source.includes('BlogCategoryPageView') ||
    source.includes('SampleGalleryPage') ||
    source.includes('LocalizedHomePage') ||
    source.includes('LocalizedLandingPage') ||
    source.includes('LocalizedPricingPage') ||
    source.includes('LocalizedContactPage') ||
    source.includes('LocalizedQuestionsPage') ||
    source.includes('LocalizedSamplePage') ||
    source.includes('LocalizedLegalPage') ||
    source.includes('PublicPhotoToolsPageView') ||
    source.includes('StandalonePhotoToolsPageView') ||
    source.includes('PublicSitemapPage')
  ) {
    return
  }

  if (!hasAny(source, jsonLdTitleSignals)) {
    issues.push(`${repoPath}: JSON-LD must pass title/name/currentName from the same page title or H1 source.`)
  }

  if (!hasAny(source, jsonLdDescriptionSignals)) {
    issues.push(`${repoPath}: JSON-LD must pass description from the same page description source.`)
  }
}

function validateBlogPostJsonLdSourceConsistency(issues) {
  const jsonLdPath = 'src/components/seo/blog-post-json-ld.tsx'
  const jsonLdSource = read(jsonLdPath)
  const jsonLdSignals = [
    ['headline: post.title', 'JSON-LD headline must use the same post.title as the page title/H1.'],
    ['description: post.description', 'JSON-LD description must use the same post.description as metadata and visible excerpt.'],
    ['keywords: post.keywords.join', 'JSON-LD keywords must use post.keywords.'],
    ['currentName={post.title}', 'Breadcrumb JSON-LD currentName must use the same post.title.'],
  ]

  for (const [signal, message] of jsonLdSignals) {
    if (!jsonLdSource.includes(signal)) {
      issues.push(`${jsonLdPath}: ${message}`)
    }
  }

  const blogArticlePages = [
    'src/app/blog/[slug]/page.tsx',
    'src/app/[locale]/blog/[slug]/page.tsx',
  ]
  const pageSignals = [
    ['title: post.title', 'metadata title must use post.title.'],
    ['description: post.description', 'metadata description must use post.description.'],
    ['keywords: [...post.keywords]', 'metadata keywords must use post.keywords.'],
    ['<BlogPostJsonLd post={post}', 'page must pass the same post object into BlogPostJsonLd.'],
    ['{post.title}</h1>', 'visible H1 must use post.title.'],
    ['{post.description}</p>', 'visible description must use post.description.'],
    ['<KeywordStrip keywords={post.keywords}', 'visible keyword strip must use post.keywords.'],
  ]

  for (const pagePath of blogArticlePages) {
    const pageSource = read(pagePath)
    for (const [signal, message] of pageSignals) {
      if (!pageSource.includes(signal)) {
        issues.push(`${pagePath}: ${message}`)
      }
    }
  }
}

async function checkPublishedCmsBlogSeoConsistency() {
  const warnings = []
  const issues = []

  if (process.env.SEO_CHECK_CMS === '0' || process.env.SEO_CHECK_CMS === 'false') {
    warnings.push('CMS blog_posts check skipped because SEO_CHECK_CMS is disabled.')
    return { checked: 0, warnings, issues }
  }

  loadLocalEnv()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    warnings.push('CMS blog_posts check skipped because NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.')
    return { checked: 0, warnings, issues }
  }

  const cachedRows = readDailyDbCache('cms-blog-posts', supabaseUrl)
  if (cachedRows) {
    for (const row of cachedRows) {
      validatePublishedCmsBlogRow(row, issues)
    }
    return { checked: cachedRows.length, warnings, issues }
  }

  let createClient
  try {
    createClient = require('@supabase/supabase-js').createClient
  } catch (error) {
    warnings.push(`CMS blog_posts check skipped because @supabase/supabase-js could not be loaded: ${error.message}`)
    return { checked: 0, warnings, issues }
  }

  let rows = []
  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
    const { data, error } = await supabase
      .from('blog_posts')
      .select('locale,slug,status,title,description,keywords,intro,content')
      .eq('status', 'published')
      .order('locale')
      .order('slug')

    if (error) {
      issues.push(`CMS blog_posts: query failed: ${error.message}`)
      return { checked: 0, warnings, issues }
    }

    rows = data || []
    writeDailyDbCache('cms-blog-posts', supabaseUrl, rows)
  } catch (error) {
    issues.push(`CMS blog_posts: query failed: ${error.message}`)
    return { checked: 0, warnings, issues }
  }

  for (const row of rows) {
    validatePublishedCmsBlogRow(row, issues)
  }

  return { checked: rows.length, warnings, issues }
}

function validatePublishedCmsBlogRow(row, issues) {
  const label = `${row.locale}/${row.slug}`
  const description = typeof row.description === 'string' ? row.description.trim() : ''
  const title = typeof row.title === 'string' ? row.title.trim() : ''
  const keywords = Array.isArray(row.keywords) ? row.keywords.filter((keyword) => typeof keyword === 'string' && keyword.trim()) : []
  const intro = typeof row.intro === 'string' ? row.intro.trim() : ''
  const sections = row.content && Array.isArray(row.content.sections) ? row.content.sections : []
  const firstSection = sections.find((section) => section && typeof section.body === 'string')
  const firstContent = [
    title,
    description,
    ...keywords,
    intro,
    firstSection?.heading,
    firstSection?.body,
  ].filter(Boolean).join(' ')

  validateSeoBasics(`CMS blog_posts ${label}`, {
    locale: row.locale,
    title,
    description,
    keywords,
    checkH1: false,
    firstContent,
  }, issues)

  for (const keyword of keywords) {
    const keywordIssues = validateFastContentKeywordForSeo(keyword, row.locale)
    if (keywordIssues.length > 0) {
      issues.push(`CMS blog_posts ${label}: keyword "${keyword}" fails Fast Content SEO gate: ${keywordIssues.join('; ')}.`)
    }
  }
}

async function checkFastContentKeywordQueueSeo() {
  const warnings = []
  const issues = []

  if (process.env.SEO_CHECK_CMS === '0' || process.env.SEO_CHECK_CMS === 'false') {
    warnings.push('Fast Content keyword queue check skipped because SEO_CHECK_CMS is disabled.')
    return { checked: 0, warnings, issues }
  }

  loadLocalEnv()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    warnings.push('Fast Content keyword queue check skipped because NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.')
    return { checked: 0, warnings, issues }
  }

  const cachedRows = readDailyDbCache('fast-content-keywords', supabaseUrl)
  if (cachedRows) {
    for (const row of cachedRows) {
      validateFastContentKeywordQueueRow(row, issues)
    }
    return { checked: cachedRows.length, warnings, issues }
  }

  let createClient
  try {
    createClient = require('@supabase/supabase-js').createClient
  } catch (error) {
    warnings.push(`Fast Content keyword queue check skipped because @supabase/supabase-js could not be loaded: ${error.message}`)
    return { checked: 0, warnings, issues }
  }

  let rows = []
  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
    const { data, error } = await supabase
      .from('fast_content_keywords')
      .select('id,locale,keyword,status')
      .neq('keyword', 'fast-content-cron')
      .in('status', ['pending', 'failed', 'draft'])
      .limit(1000)

    if (error) {
      issues.push(`Fast Content keyword queue: query failed: ${error.message}`)
      return { checked: 0, warnings, issues }
    }

    rows = data || []
    writeDailyDbCache('fast-content-keywords', supabaseUrl, rows)
  } catch (error) {
    issues.push(`Fast Content keyword queue: query failed: ${error.message}`)
    return { checked: 0, warnings, issues }
  }

  for (const row of rows) {
    validateFastContentKeywordQueueRow(row, issues)
  }

  return { checked: rows.length, warnings, issues }
}

function validateFastContentKeywordQueueRow(row, issues) {
  const locale = ['en', 'es', 'fr', 'de', 'ja', 'zh'].includes(row.locale) ? row.locale : 'en'
  const keyword = typeof row.keyword === 'string' ? row.keyword.trim() : ''
  const keywordIssues = validateFastContentKeywordForSeo(keyword, locale)
  if (keywordIssues.length > 0) {
    issues.push(`Fast Content keyword queue ${row.id || 'unknown'} ${locale}/${row.status}: "${keyword}" fails SEO gate: ${keywordIssues.join('; ')}.`)
  }
}

function validatePhotoToolSource(issues) {
  const pageSource = read('src/app/photo-tools/[tool]/page.tsx')
  const contentSource = read('src/lib/photo-tool-page-content.ts')

  const requiredPageSignals = [
    'title: page.title',
    'description: page.description',
    'keywords: page.keywords',
    'name: page.h1',
    'description: page.description',
    'keywords: page.keywords.join',
    'featureList: page.features',
    'mainEntity: page.faqs.map',
    'currentName={page.h1}',
    'seoContent={page}',
  ]
  for (const signal of requiredPageSignals) {
    if (!pageSource.includes(signal)) {
      issues.push(`src/app/photo-tools/[tool]/page.tsx: missing shared photo-tool SEO signal "${signal}".`)
    }
  }

  const basePageFieldCounts = getPhotoToolBasePageFieldCounts(contentSource)
  for (const [label, count] of Object.entries(basePageFieldCounts.fields)) {
    if (count !== basePageFieldCounts.pageCount) {
      issues.push(`src/lib/photo-tool-page-content.ts: ${label} count ${count} does not match photo tool page count ${basePageFieldCounts.pageCount}.`)
    }
  }

  validatePhotoToolContentConsistency(contentSource, issues)
}

function getPhotoToolBasePageFieldCounts(contentSource) {
  const file = parseSource(contentSource, 'src/lib/photo-tool-page-content.ts')
  const fields = {
    h1: 0,
    description: 0,
    keywords: 0,
    features: 0,
    faqs: 0,
  }
  let pageCount = 0

  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'photoToolPages' && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
      for (const element of node.initializer.elements) {
        if (!ts.isObjectLiteralExpression(element)) continue
        pageCount += 1
        for (const key of Object.keys(fields)) {
          if (propertyExpression(element, key)) fields[key] += 1
        }
      }
      return
    }
    ts.forEachChild(node, visit)
  }

  visit(file)
  return { pageCount, fields }
}

function validatePhotoToolContentConsistency(contentSource, issues) {
  const file = parseSource(contentSource, 'src/lib/photo-tool-page-content.ts')
  const context = buildLiteralContext(file)

  function validateObject(objectLiteral) {
    const path = resolveStringExpression(propertyExpression(objectLiteral, 'path'), context) || 'unknown photo tool path'
    const title = resolveStringExpression(propertyExpression(objectLiteral, 'title'), context)
    const h1 = resolveStringExpression(propertyExpression(objectLiteral, 'h1'), context)
    const description = resolveStringExpression(propertyExpression(objectLiteral, 'description'), context)
    const keywords = resolveStringArrayExpression(propertyExpression(objectLiteral, 'keywords'), context)

    validateSeoBasics(`src/lib/photo-tool-page-content.ts ${path}`, {
      locale: path.startsWith('/ja/') ? 'ja' : path.startsWith('/de/') ? 'de' : path.startsWith('/es/') ? 'es' : path.startsWith('/fr/') ? 'fr' : 'en',
      title,
      h1,
      description,
      keywords: keywords || [],
    }, issues)
  }

  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'photoToolPages' && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
      for (const element of node.initializer.elements) {
        if (ts.isObjectLiteralExpression(element)) validateObject(element)
      }
      return
    }
    ts.forEachChild(node, visit)
  }

  visit(file)
}

function validateSitemapHreflangSource(issues) {
  const source = read('src/lib/sitemap.ts')
  const requiredSignals = [
    'languageAlternates',
    'getBlogLanguageAlternates',
    'getBlogIndexLanguageAlternates',
    'xhtml:link',
    'hreflang=',
    'xmlns:xhtml',
  ]

  for (const signal of requiredSignals) {
    if (!source.includes(signal)) {
      issues.push(`src/lib/sitemap.ts: missing sitemap hreflang signal "${signal}".`)
    }
  }
}

function validateSharedKeywordLimitSources(issues) {
  const requiredSignals = [
    ['src/lib/blog-category-content.ts', 'const keywords = Array.from(new Set([label, ...category.keywords])).slice(0, 3)'],
    ['src/lib/use-case-pages.ts', 'keywords: content.keywords.slice(0, 3)'],
    ['src/lib/use-case-pages.ts', 'keywords: (keywords ?? content.keywords).slice(0, 3)'],
    ['src/lib/localized-seo.ts', 'keywords: content.keywords.slice(0, 3)'],
    ['src/lib/photo-tool-page-content.ts', 'keywords: page.keywords.slice(0, 3)'],
    ['src/lib/photo-tool-page-content.ts', 'keywords: localizedPage.keywords.slice(0, 3)'],
    ['src/lib/sample-gallery-content.ts', 'content.keywords = content.keywords.slice(0, 3)'],
    ['src/app/[locale]/photo-tools/page.tsx', 'keywords: content.keywords.slice(0, 3)'],
  ]

  for (const [path, signal] of requiredSignals) {
    if (!read(path).includes(signal)) {
      issues.push(`${path}: missing shared keywords 1-3 limit signal "${signal}".`)
    }
  }
}

function validateFirstContentSourceOrder(issues) {
  const requiredOrderedSignals = [
    [
      'src/components/blog/blog-category-page-view.tsx',
      ['{content.h1}', '{content.intro}', '<KeywordStrip keywords={content.keywords}'],
    ],
    [
      'src/app/blog/[slug]/page.tsx',
      ['{post.title}', '{post.description}', '<KeywordStrip keywords={post.keywords}', '{post.intro}'],
    ],
    [
      'src/app/[locale]/blog/[slug]/page.tsx',
      ['{post.title}', '{post.description}', '<KeywordStrip keywords={post.keywords}', '{post.intro}'],
    ],
  ]

  for (const [path, signals] of requiredOrderedSignals) {
    const source = read(path)
    let lastIndex = -1
    for (const signal of signals) {
      const index = source.indexOf(signal)
      if (index === -1) {
        issues.push(`${path}: missing first-content SEO signal "${signal}".`)
        continue
      }
      if (index < lastIndex) {
        issues.push(`${path}: first-content SEO signal "${signal}" appears before the expected previous signal.`)
      }
      lastIndex = index
    }
  }
}

export function checkAllPagesSeoConsistency() {
  const issues = []
  const warnings = []
  const skipped = []
  const checked = []

  for (const file of listPageFiles()) {
    const repoPath = toRepoPath(file)
    const route = routePathForPage(repoPath)
    const pageSource = readFileSync(file, 'utf8')
    const layoutSources = readLayoutSources(file)
    const source = `${layoutSources.map((layout) => layout.source).join('\n')}\n${pageSource}`

    if (isSkipped(repoPath)) {
      skipped.push(route)
      continue
    }

    if (pageSource.includes('permanentRedirect(') || (pageSource.includes('notFound()') && !pageSource.includes('return ('))) {
      skipped.push(route)
      continue
    }

    checked.push(route)

    if (!hasMetadata(source)) {
      warnings.push(`${repoPath}: no page-level metadata or generateMetadata found.`)
    }

    if (hasMetadata(source) && !hasDescriptionSignal(source)) {
      issues.push(`${repoPath}: metadata exists but no description signal was found.`)
    }

    if (source.includes('KeywordStrip') || source.includes('keywords:') || source.includes('keywords={')) {
      if (!hasKeywordsSignal(source)) {
        issues.push(`${repoPath}: keyword usage is not detectable from metadata or keyword component.`)
      }
    }

    validatePageSeoRecord(repoPath, source, issues)
    const metadataSource = hasMetadata(pageSource)
      ? pageSource
      : layoutSources.find((layout) => hasMetadata(layout.source))?.source || pageSource
    validateSeoFieldConsistency(repoPath, metadataSource, pageSource, source, issues)
    validateJsonLdConsistency(repoPath, source, issues)
  }

  validatePhotoToolSource(issues)
  validateBlogPostJsonLdSourceConsistency(issues)
  validateSitemapHreflangSource(issues)
  validateSharedKeywordLimitSources(issues)
  validateFirstContentSourceOrder(issues)

  return { checked, skipped, warnings, issues }
}

export async function checkSeoConsistency() {
  const pageResult = checkAllPagesSeoConsistency()
  const cmsResult = await checkPublishedCmsBlogSeoConsistency()
  const fastContentResult = await checkFastContentKeywordQueueSeo()

  return {
    checked: pageResult.checked,
    skipped: pageResult.skipped,
    cmsChecked: cmsResult.checked,
    fastContentChecked: fastContentResult.checked,
    warnings: [...pageResult.warnings, ...cmsResult.warnings, ...fastContentResult.warnings],
    issues: [...pageResult.issues, ...cmsResult.issues, ...fastContentResult.issues],
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const result = await checkSeoConsistency()
  for (const warning of result.warnings) {
    console.warn(`WARN ${warning}`)
  }

  if (result.issues.length > 0) {
    for (const issue of result.issues) {
      console.error(`FAIL ${issue}`)
    }
    console.error(`SEO consistency check failed: ${result.issues.length} issue(s), ${result.warnings.length} warning(s), ${result.cmsChecked} published CMS blog row(s) checked, ${result.fastContentChecked} Fast Content keyword row(s) checked.`)
    process.exitCode = 1
  } else {
    console.log(`SEO consistency check passed: ${result.checked.length} public page(s) checked, ${result.skipped.length} private/admin page(s) skipped, ${result.cmsChecked} published CMS blog row(s) checked, ${result.fastContentChecked} Fast Content keyword row(s) checked, ${result.warnings.length} warning(s).`)
  }
}
