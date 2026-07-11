import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { createClient } = require('@supabase/supabase-js')

const dryRun = !process.argv.includes('--apply')
const summaryOnly = process.argv.includes('--summary')
const brandPattern = /magic[\s-]*headshot/i

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
  .filter((row) => Array.isArray(row.keywords) && row.keywords.some((keyword) => brandPattern.test(keyword)))
  .map((row) => ({
    ...row,
    nextKeywords: row.keywords.filter((keyword) => !brandPattern.test(keyword)),
    removedKeywords: row.keywords.filter((keyword) => brandPattern.test(keyword)),
  }))

const report = {
  mode: dryRun ? 'dry-run' : 'apply',
  checkedRows: (data || []).length,
  candidateRows: candidates.length,
  removedKeywordCount: candidates.reduce((sum, row) => sum + row.removedKeywords.length, 0),
}

if (summaryOnly) {
  report.removedKeywords = Array.from(new Set(candidates.flatMap((row) => row.removedKeywords))).sort()
  report.rows = candidates.map((row) => ({
    locale: row.locale,
    slug: row.slug,
    removed: row.removedKeywords,
    afterCount: row.nextKeywords.length,
  }))
} else {
  report.updates = candidates.map((row) => ({
    id: row.id,
    locale: row.locale,
    slug: row.slug,
    status: row.status,
    title: row.title,
    before: row.keywords,
    after: row.nextKeywords,
    removed: row.removedKeywords,
  }))
}

console.log(JSON.stringify(report, null, 2))

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
