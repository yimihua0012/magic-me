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

if (error) {
  throw error
}

const rows = (data || [])
  .filter((row) => Array.isArray(row.keywords) && row.keywords.length > 3)
  .map((row) => ({
    ...row,
    nextKeywords: row.keywords.slice(0, 3),
  }))

for (const row of rows) {
  if (!dryRun) {
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ keywords: row.nextKeywords })
      .eq('id', row.id)

    if (updateError) {
      throw new Error(`Failed to update ${row.locale}/${row.slug}: ${updateError.message}`)
    }
  }
}

console.log(JSON.stringify({
  mode: dryRun ? 'dry-run' : 'apply',
  checkedRows: (data || []).length,
  updateRows: rows.length,
  rows: rows.map((row) => ({
    locale: row.locale,
    slug: row.slug,
    beforeCount: row.keywords.length,
    afterCount: row.nextKeywords.length,
    before: row.keywords,
    after: row.nextKeywords,
  })),
}, null, 2))

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
