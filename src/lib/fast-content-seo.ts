import type { BlogPostInput } from '@/lib/blog-store'
import type { Locale } from '@/lib/i18n'

export type FastContentKeywordValidation = {
  ok: boolean
  reasons: string[]
}

const LATIN_LOCALES = new Set<Locale>(['en', 'es', 'fr', 'de'])

const GENERIC_KEYWORDS = new Set([
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

const BLOCKED_FRAGMENTS = [
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

const TOPIC_FRAGMENTS = [
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
  '背景',
  '抠图',
  '去背景',
  '换底',
  '裁剪',
  '缩放',
  '打印排版',
]

const INTENT_FRAGMENTS = [
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

export function normalizeFastContentKeyword(value: string) {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ')
}

export function normalizeFastContentKeywordKey(value: string) {
  return normalizeFastContentKeyword(value).toLocaleLowerCase()
}

export function validateFastContentKeyword(keyword: string, locale: Locale): FastContentKeywordValidation {
  const cleanKeyword = normalizeFastContentKeyword(keyword)
  const normalized = cleanKeyword.toLocaleLowerCase()
  const reasons: string[] = []

  if (!cleanKeyword) reasons.push('Keyword is empty.')
  if (/https?:\/\//i.test(cleanKeyword)) reasons.push('Keyword must not be a URL.')
  if (/[<>{}[\]\\]/.test(cleanKeyword)) reasons.push('Keyword contains unsupported characters.')
  if (BLOCKED_FRAGMENTS.some((fragment) => normalized.includes(fragment))) {
    reasons.push('Keyword contains a competitor, website, brand, or unrelated named entity.')
  }

  if (LATIN_LOCALES.has(locale)) {
    const words = splitWords(cleanKeyword)
    if (cleanKeyword.length < 8) reasons.push('Keyword is too short to show useful long-tail intent.')
    if (cleanKeyword.length > 80) reasons.push('Keyword is too long; keep it concise enough for one article topic.')
    if (words.length < 2) reasons.push('Keyword must be more specific than a single broad word.')
    if (words.length > 8) reasons.push('Keyword is too broad or sentence-like; keep it within 2-8 words.')
    if (GENERIC_KEYWORDS.has(normalized)) reasons.push('Keyword is too generic for Fast Content.')
  } else {
    const length = Array.from(cleanKeyword).length
    if (length < 4) reasons.push('Keyword is too short to show useful search intent.')
    if (length > 40) reasons.push('Keyword is too long; keep it focused on one article topic.')
  }

  if (!hasAllowedTopic(cleanKeyword)) {
    reasons.push('Keyword is not closely related to headshots, profile photos, ID photos, or photo tools.')
  }

  if (!hasSearchIntent(cleanKeyword)) {
    reasons.push('Keyword does not show a clear use case, action, format, or target audience.')
  }

  return { ok: reasons.length === 0, reasons }
}

export function validateFastContentDraftSeo(draft: BlogPostInput) {
  const issues: string[] = []
  const locale = draft.locale
  const keywords = Array.isArray(draft.keywords) ? draft.keywords.map(normalizeFastContentKeyword).filter(Boolean) : []
  const title = normalizeFastContentKeyword(draft.title || '')
  const description = normalizeFastContentKeyword(draft.description || '')
  const intro = normalizeFastContentKeyword(draft.intro || '')
  const firstSection = draft.sections?.[0]
    ? `${draft.sections[0].heading || ''} ${draft.sections[0].body || ''}`
    : ''
  const firstContent = normalizeFastContentKeyword([title, description, keywords.join(' '), intro, firstSection].filter(Boolean).join(' '))

  if (keywords.length !== 1) {
    issues.push(`Fast Content requires exactly one keyword; got ${keywords.length}.`)
  }

  for (const keyword of keywords) {
    const validation = validateFastContentKeyword(keyword, locale)
    if (!validation.ok) {
      issues.push(`Generated keyword is not suitable: ${validation.reasons.join(' ')}`)
    }
  }

  const descriptionLength = Array.from(description).length
  if (locale === 'ja') {
    if (descriptionLength < 55 || descriptionLength > 90) {
      issues.push(`Japanese description must be 55-90 characters; got ${descriptionLength}.`)
    }
  } else if (locale === 'zh') {
    if (descriptionLength < 50 || descriptionLength > 90) {
      issues.push(`Chinese description must be 50-90 characters; got ${descriptionLength}.`)
    }
  } else if (descriptionLength < 100 || descriptionLength > 140) {
    issues.push(`${locale} description must be 100-140 characters; got ${descriptionLength}.`)
  }

  const primaryKeyword = keywords[0] || ''
  if (primaryKeyword && !hasTopicOverlap(primaryKeyword, `${title} ${description}`)) {
    issues.push('Keyword must match the title and meta description topic.')
  }
  if (primaryKeyword && !hasTopicOverlap(primaryKeyword, firstContent.slice(0, 400))) {
    issues.push('Keyword topic must appear in the first visible SEO content block.')
  }
  if (!hasAllowedTopic(`${title} ${description} ${intro}`)) {
    issues.push('Draft topic is not close enough to Magic-Headshot headshots, ID photos, or photo tools.')
  }

  return issues
}

function hasAllowedTopic(value: string) {
  const normalized = normalizeFastContentComparable(value)
  return TOPIC_FRAGMENTS.some((fragment) => normalized.includes(normalizeFastContentComparable(fragment)))
}

function hasSearchIntent(value: string) {
  const normalized = normalizeFastContentComparable(value)
  return INTENT_FRAGMENTS.some((fragment) => normalized.includes(normalizeFastContentComparable(fragment)))
}

function hasTopicOverlap(left: string, right: string) {
  const leftTokens = meaningfulTokens(left)
  const rightTokens = meaningfulTokens(right)
  if (leftTokens.length === 0 || rightTokens.length === 0) return false
  const rightSet = new Set(rightTokens)
  return leftTokens.some((token) => rightSet.has(token) || Array.from(rightSet).some((candidate) => candidate.includes(token) || token.includes(candidate)))
}

function meaningfulTokens(value: string) {
  const normalized = value.toLocaleLowerCase().normalize('NFKC')
  const words = splitWords(normalized)
  if (words.length > 0) {
    return words.filter((word) => word.length > 2 && !GENERIC_KEYWORDS.has(word))
  }

  return Array.from(normalized.replace(/\s+/g, '')).filter((char) => /[\p{Letter}\p{Number}]/u.test(char))
}

function splitWords(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize('NFKC')
    .split(/[^\p{Letter}\p{Number}]+/u)
    .map((word) => word.trim())
    .filter(Boolean)
}

function normalizeFastContentComparable(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
}
