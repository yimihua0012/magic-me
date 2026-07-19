import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { createClient } = require('@supabase/supabase-js')

const dryRun = !process.argv.includes('--apply')

loadLocalEnv()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const { data, error } = await supabase
  .from('blog_posts')
  .select('id,locale,slug,status,title,description,keywords')
  .eq('status', 'published')
  .order('locale')
  .order('slug')

if (error) throw error

const rows = data || []
const updates = []

for (const row of rows) {
  const range = descriptionRange(row.locale)
  const before = normalizeDescription(row.description || '')
  const beforeLength = textLength(before)

  if (beforeLength >= range.min && beforeLength <= range.max) continue

  const after = fixDescription(row, range)
  const afterLength = textLength(after)

  if (afterLength < range.min || afterLength > range.max) {
    throw new Error(`Unable to fix ${row.locale}/${row.slug}: ${beforeLength} -> ${afterLength}`)
  }

  updates.push({
    id: row.id,
    locale: row.locale,
    slug: row.slug,
    title: row.title,
    beforeLength,
    afterLength,
    before,
    after,
  })
}

if (!dryRun) {
  for (const item of updates) {
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ description: item.after })
      .eq('id', item.id)

    if (updateError) {
      throw new Error(`Failed to update ${item.locale}/${item.slug}: ${updateError.message}`)
    }
  }
}

console.log(JSON.stringify({
  mode: dryRun ? 'dry-run' : 'apply',
  checkedRows: rows.length,
  updateRows: updates.length,
  byLocale: updates.reduce((acc, item) => {
    acc[item.locale] = (acc[item.locale] || 0) + 1
    return acc
  }, {}),
  samples: updates.slice(0, 20).map(({ locale, slug, beforeLength, afterLength, before, after }) => ({
    locale,
    slug,
    beforeLength,
    afterLength,
    before,
    after,
  })),
}, null, 2))

function fixDescription(row, range) {
  const value = normalizeDescription(row.description || '')
  if (textLength(value) > range.max) return rewriteFromTopic(row, range) || shorten(value, row.locale, range)
  return lengthen(value, row, range)
}

function rewriteFromTopic(row, range) {
  if (row.locale === 'ja') return ''

  const topic = compactTopic(keywordHint(row), row.title)
  const templates = localizedDescriptionTemplates(row.locale, topic)

  for (const template of templates) {
    const candidate = ensureSentenceEnd(normalizeDescription(template), row.locale, range.max)
    const length = textLength(candidate)
    if (length >= range.min && length <= range.max) return candidate
  }

  return ''
}

function localizedDescriptionTemplates(locale, topic) {
  if (locale === 'de') {
    return [
      `Guide zu ${topic}: Foto vorbereiten, Hintergrund, Zuschnitt und Dateigroesse fuer Profil oder Dokument klaeren.`,
      `Ratgeber zu ${topic}: Bild vorbereiten, Hintergrund anpassen, zuschneiden und fuer Profil oder Dokument nutzen.`,
    ]
  }

  if (locale === 'es') {
    return [
      `Guia de ${topic}: prepara la foto, ajusta fondo y recorte, reduce el archivo y usala en CV, perfil o documentos.`,
      `Guia practica sobre ${topic}: recorte, fondo, tamano de archivo y uso en CV, perfiles o documentos.`,
    ]
  }

  if (locale === 'fr') {
    return [
      `Guide ${topic}: preparez la photo, ajustez fond et recadrage, reduisez le fichier et utilisez-la pour CV ou profil.`,
      `Guide pratique sur ${topic}: recadrage, fond, taille de fichier et usage pour CV, profil ou document.`,
    ]
  }

  return [
    `Guide to ${topic}: prepare the photo, adjust background and crop, reduce file size, and use it for resumes, profiles, or forms.`,
    `Practical ${topic} guide for photo prep, background changes, cropping, file sizing, profile images, and document uploads.`,
  ]
}

function compactTopic(keyword, title) {
  const raw = normalizeDescription(keyword || title || 'photo preparation')
    .replace(/\bMagic-Headshot\b/gi, 'Magic Headshot')
  const chars = Array.from(raw)
  if (chars.length <= 28) return trimDanglingWords(raw, 'en')
  const clipped = chars.slice(0, 28).join('')
  const lastSpace = clipped.lastIndexOf(' ')
  return (lastSpace > 18 ? clipped.slice(0, lastSpace) : clipped).replace(/[\s,;:–-]+$/u, '')
}

function shorten(value, locale, range) {
  const normalized = normalizeDescription(value)
  const punctuationCandidates = trimByPunctuation(normalized, range)
  if (punctuationCandidates) return punctuationCandidates

  if (locale === 'ja') {
    const clipped = Array.from(normalized).slice(0, range.max).join('').replace(/[、。・：:;,，.\s]+$/u, '')
    return ensureSentenceEnd(clipped, locale, range.max)
  }

  const chars = Array.from(normalized)
  const clipped = chars.slice(0, range.max).join('')
  const lastSpace = clipped.lastIndexOf(' ')
  const wordSafe = lastSpace >= range.min - 8 ? clipped.slice(0, lastSpace) : clipped
  return ensureSentenceEnd(wordSafe.replace(/[\s,;:–-]+$/u, ''), locale, range.max)
}

function trimByPunctuation(value, range) {
  const chars = Array.from(value)
  const separators = [',', ';', ':', ' - ', ' – ', '，', '、']

  for (const separator of separators) {
    let candidate = value
    while (textLength(candidate) > range.max && candidate.includes(separator)) {
      candidate = candidate.slice(0, candidate.lastIndexOf(separator)).trim()
      const length = textLength(candidate)
      if (length >= range.min && length <= range.max) return ensureSentenceEnd(candidate, 'en', range.max)
    }
  }

  const lastSentenceEnd = Math.max(
    chars.slice(0, range.max).join('').lastIndexOf('.'),
    chars.slice(0, range.max).join('').lastIndexOf('。'),
    chars.slice(0, range.max).join('').lastIndexOf('!'),
    chars.slice(0, range.max).join('').lastIndexOf('?'),
  )
  if (lastSentenceEnd >= range.min - 1) return chars.slice(0, lastSentenceEnd + 1).join('').trim()
  return ''
}

function lengthen(value, row, range) {
  const additions = row.locale === 'ja'
    ? ['準備手順と写真調整のポイントも確認できます。', '写真調整のポイントも確認できます。']
    : [
        ` Learn practical steps for ${keywordHint(row)}.`,
        ` Includes practical tips for ${keywordHint(row)}.`,
      ]

  for (const addition of additions) {
    const candidate = normalizeDescription(`${value}${addition}`)
    const length = textLength(candidate)
    if (length >= range.min && length <= range.max) return candidate
  }

  const fallback = normalizeDescription(`${value} ${row.title}`)
  return shorten(fallback, row.locale, range)
}

function keywordHint(row) {
  const keywords = Array.isArray(row.keywords) ? row.keywords.filter(Boolean) : []
  return keywords[0] || row.title || 'the article topic'
}

function descriptionRange(locale) {
  return locale === 'ja'
    ? { min: 55, max: 90 }
    : { min: 100, max: 140 }
}

function textLength(value) {
  return Array.from((value || '').trim()).length
}

function normalizeDescription(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

function ensureSentenceEnd(value, locale = 'en', maxLength = Infinity) {
  const trimmed = trimDanglingWords(value.trim(), locale)
  if (!trimmed) return trimmed
  if (/[.!?。]$/u.test(trimmed)) return trimmed
  const mark = locale === 'ja' ? '。' : '.'
  if (textLength(trimmed) + textLength(mark) <= maxLength) return `${trimmed}${mark}`
  return trimmed
}

function trimDanglingWords(value, locale) {
  if (locale === 'ja') return value.replace(/[、。・：:;,，.\s]+$/u, '')

  const danglingWords = new Set([
    'a',
    'an',
    'and',
    'as',
    'avec',
    'con',
    'de',
    'del',
    'der',
    'des',
    'du',
    'e',
    'el',
    'en',
    'et',
    'for',
    'from',
    'für',
    'fuer',
    'in',
    'la',
    'le',
    'mit',
    'of',
    'oder',
    'or',
    'para',
    'por',
    'sur',
    'the',
    'to',
    'und',
    'with',
    'y',
  ])

  let candidate = value.replace(/[\s,;:–-]+$/u, '')
  while (candidate.includes(' ')) {
    const lastSpace = candidate.lastIndexOf(' ')
    const lastWord = candidate.slice(lastSpace + 1).toLowerCase()
    if (!danglingWords.has(lastWord)) break
    candidate = candidate.slice(0, lastSpace).replace(/[\s,;:–-]+$/u, '')
  }
  return candidate
}

function loadLocalEnv() {
  for (const file of ['.env.local', '.env', '.env.production']) {
    if (!existsSync(file)) continue

    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
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
