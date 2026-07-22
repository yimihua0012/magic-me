const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

loadEnvFile(path.resolve(process.cwd(), '.env.local'))

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

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

async function main() {
  const before = await supabase
    .from('fast_content_keywords')
    .select('id', { count: 'exact', head: true })
    .neq('locale', 'fr')

  if (before.error) throw before.error

  const rowsResult = await supabase
    .from('fast_content_keywords')
    .select('id,locale,keyword,updated_at')
    .order('updated_at', { ascending: false })
    .limit(10000)

  if (rowsResult.error) throw rowsResult.error

  const rows = rowsResult.data || []
  const groups = new Map()
  for (const row of rows) {
    const key = normalizeKeyword(row.keyword)
    if (!key) continue
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(row)
  }

  const idsToUpdate = []
  const conflicts = []

  for (const [keywordKey, group] of groups) {
    const nonFrRows = group.filter((row) => row.locale !== 'fr')
    if (nonFrRows.length === 0) continue

    const hasFr = group.some((row) => row.locale === 'fr')
    if (hasFr) {
      conflicts.push({
        keyword: keywordKey,
        reason: 'already_has_fr_keyword',
        blockedIds: nonFrRows.map((row) => row.id),
      })
      continue
    }

    idsToUpdate.push(nonFrRows[0].id)
    if (nonFrRows.length > 1) {
      conflicts.push({
        keyword: keywordKey,
        reason: 'multiple_non_fr_duplicates',
        blockedIds: nonFrRows.slice(1).map((row) => row.id),
      })
    }
  }

  let updated = 0
  for (const id of idsToUpdate) {
    const result = await supabase
      .from('fast_content_keywords')
      .update({ locale: 'fr' })
      .eq('id', id)
      .select('id', { count: 'exact', head: true })

    if (result.error) throw result.error
    updated += result.count || 0
  }

  const after = await supabase
    .from('fast_content_keywords')
    .select('id', { count: 'exact', head: true })
    .neq('locale', 'fr')

  if (after.error) throw after.error

  console.log(JSON.stringify({
    beforeNonFr: before.count || 0,
    updated,
    afterNonFr: after.count || 0,
    blockedByDuplicateKeyword: conflicts.length,
    conflictSamples: conflicts.slice(0, 20),
  }, null, 2))
}

function normalizeKeyword(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').toLowerCase()
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match || process.env[match[1]]) continue

    let value = match[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[match[1]] = value
  }
}
