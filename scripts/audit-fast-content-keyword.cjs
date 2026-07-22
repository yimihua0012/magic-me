const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

loadEnvFile(path.resolve(process.cwd(), '.env.local'))

const keyword = process.argv.slice(2).join(' ').trim()
if (!keyword) {
  throw new Error('Usage: node scripts/audit-fast-content-keyword.cjs <keyword>')
}

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
    .select('id,locale,keyword,status,blog_slug,error_message,updated_at')
    .ilike('keyword', keyword)
    .order('updated_at', { ascending: false })

  if (error) throw error
  console.log(JSON.stringify({ keyword, rows: data || [] }, null, 2))
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
