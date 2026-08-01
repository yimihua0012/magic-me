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
  const { data, error } = await supabase
    .from('fast_content_keywords')
    .select('id,locale,keyword,status,blog_slug,error_message,attempt_count,last_attempt_at,published_at,updated_at')
    .neq('keyword', 'fast-content-cron')
    .order('updated_at', { ascending: false })
    .limit(1000)

  if (error) throw error

  const rows = data || []
  const statusCounts = {}
  const localeStatusCounts = {}

  for (const row of rows) {
    statusCounts[row.status] = (statusCounts[row.status] || 0) + 1
    const localeKey = `${row.locale}:${row.status}`
    localeStatusCounts[localeKey] = (localeStatusCounts[localeKey] || 0) + 1
  }

  const recentFailed = rows
    .filter((row) => row.status === 'failed')
    .slice(0, 30)
    .map(toReportRow)

  const recentGenerating = rows
    .filter((row) => row.status === 'generating')
    .slice(0, 30)
    .map(toReportRow)

  const recentPublished = rows
    .filter((row) => row.status === 'published')
    .slice(0, 30)
    .map(toReportRow)

  console.log(JSON.stringify({
    checkedRows: rows.length,
    statusCounts,
    localeStatusCounts,
    recentFailed,
    recentGenerating,
    recentPublished,
  }, null, 2))
}

function toReportRow(row) {
  return {
    id: row.id,
    locale: row.locale,
    keyword: row.keyword,
    status: row.status,
    blogSlug: row.blog_slug,
    attempts: row.attempt_count,
    lastAttemptAt: row.last_attempt_at,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    errorMessage: row.error_message,
  }
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
