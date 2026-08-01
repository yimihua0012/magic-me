import fs from 'node:fs'
import { createClient } from '@supabase/supabase-js'

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return

  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match || process.env[match[1]]) continue

    let value = match[2].trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    process.env[match[1]] = value
  }
}

loadEnv(new URL('../.env.local', import.meta.url))

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
)

const { data, error } = await supabase.from('blog_posts').select('locale,status')

if (error) throw error

const locales = ['en', 'es', 'fr', 'de', 'ja', 'zh']
const total = Object.fromEntries(locales.map((locale) => [locale, 0]))
const published = Object.fromEntries(locales.map((locale) => [locale, 0]))

for (const row of data || []) {
  if (row.locale in total) total[row.locale] += 1
  if (row.status === 'published' && row.locale in published) published[row.locale] += 1
}

console.log(JSON.stringify({
  total: data?.length || 0,
  all: total,
  published,
}, null, 2))
