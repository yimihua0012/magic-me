import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { createClient } = require('@supabase/supabase-js')

const stopWords = new Set([
  'about',
  'after',
  'and',
  'are',
  'best',
  'can',
  'con',
  'das',
  'der',
  'des',
  'die',
  'ein',
  'eine',
  'for',
  'from',
  'fur',
  'how',
  'les',
  'los',
  'mit',
  'online',
  'para',
  'por',
  'the',
  'to',
  'und',
  'une',
  'use',
  'what',
  'with',
  'your',
])

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
  .select('id,locale,slug,status,title,keywords,updated_at')
  .order('locale')
  .order('slug')

if (error) {
  throw error
}

const candidates = (data || [])
  .filter((row) => Array.isArray(row.keywords) && row.keywords.length > 3)
  .map((row) => {
    const kept = row.keywords.filter((keyword) => isKeywordRelatedToTitle(keyword, row.title, row.locale))
    const nextKeywords = kept.length > 0 ? kept : [row.keywords[0]]
    return {
      ...row,
      nextKeywords: uniqueStrings(nextKeywords),
      removedKeywords: row.keywords.filter((keyword) => !nextKeywords.includes(keyword)),
    }
  })
  .filter((row) => row.removedKeywords.length > 0)

console.log(JSON.stringify({
  mode: dryRun ? 'dry-run' : 'apply',
  checkedRows: (data || []).length,
  candidateRows: candidates.length,
  updates: candidates.map((row) => ({
    id: row.id,
    locale: row.locale,
    slug: row.slug,
    status: row.status,
    title: row.title,
    before: row.keywords,
    after: row.nextKeywords,
    removed: row.removedKeywords,
  })),
}, null, 2))

if (!dryRun) {
  for (const row of candidates) {
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ keywords: row.nextKeywords })
      .eq('id', row.id)

    if (updateError) {
      throw new Error(`Failed to update ${row.locale}/${row.slug}: ${updateError.message}`)
    }
  }

  console.log(`Updated ${candidates.length} blog post keyword set(s).`)
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

function uniqueStrings(values) {
  return Array.from(new Set(values.map((value) => String(value).trim()).filter(Boolean)))
}

function isKeywordRelatedToTitle(keyword, title, locale) {
  const keywordText = normalizeText(keyword)
  const titleText = normalizeText(title)
  if (!keywordText || !titleText) return false
  if (titleText.includes(keywordText) || keywordText.includes(titleText)) return true

  const titleTokens = new Set(tokenize(titleText))
  const keywordTokens = tokenize(keywordText)
  if (keywordTokens.length === 0 || titleTokens.size === 0) return false

  const shared = keywordTokens.filter((token) => titleTokens.has(token))
  if (shared.length >= 1) return true
  if (hasCjkOverlap(keywordText, titleText)) return true

  return false
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[_|/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(text) {
  return Array.from(new Set(
    text
      .match(/[a-z0-9\u00c0-\u024f\u3040-\u30ff\u3400-\u9fff]+/g)
      ?.map(stemToken)
      .filter((token) => (token.length > 2 || ['ai', 'cv', 'id', 'kb'].includes(token)) && !stopWords.has(token)) || []
  ))
}

function stemToken(token) {
  if (token.length > 6 && token.endsWith('able')) return token.slice(0, -4)
  if (token.length > 5 && token.endsWith('ing')) return token.slice(0, -3)
  if (token.length > 5 && token.endsWith('ies')) return token.slice(0, -1)
  if (token.length > 4 && /(ches|shes|sses|xes|zes)$/.test(token)) return token.slice(0, -2)
  if (token.length > 5 && token.endsWith('e')) return token.slice(0, -1)
  if (token.length > 4 && token.endsWith('s')) return token.slice(0, -1)
  return token
}

function hasCjkOverlap(keywordText, titleText) {
  const keywordCjk = keywordText.replace(/[^\u3040-\u30ff\u3400-\u9fff]+/g, '')
  const titleCjk = titleText.replace(/[^\u3040-\u30ff\u3400-\u9fff]+/g, '')
  if (keywordCjk.length < 2 || titleCjk.length < 2) return false
  if (titleCjk.includes(keywordCjk) || keywordCjk.includes(titleCjk)) return true
  const grams = cjkNgrams(keywordCjk, keywordCjk.length >= 4 ? 2 : 1)
  const titleGrams = new Set(cjkNgrams(titleCjk, keywordCjk.length >= 4 ? 2 : 1))
  return grams.some((gram) => titleGrams.has(gram))
}

function cjkNgrams(text, size) {
  const grams = []
  for (let index = 0; index <= text.length - size; index += 1) {
    grams.push(text.slice(index, index + size))
  }
  return grams
}
