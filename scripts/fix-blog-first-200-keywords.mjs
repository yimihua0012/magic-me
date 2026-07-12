import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { createClient } = require('@supabase/supabase-js')

const dryRun = !process.argv.includes('--apply')

const updates = [
  {
    locale: 'en',
    slug: 'ai-headshot-generator-magic-headshot',
    replace: {
      'corporate profile headshots': 'LinkedIn resume headshots',
    },
  },
  {
    locale: 'en',
    slug: 'free-photo-utility-for-document-style-photos',
    replace: {
      'arrange printable sheets': 'document style photos',
    },
  },
  {
    locale: 'en',
    slug: 'headshots-near-me-magic-headshot',
    replace: {
      'save time and money headshots': 'studio-quality headshots',
    },
  },
  {
    locale: 'en',
    slug: 'id-photo-creator',
    replace: {
      'background changer for photos': 'passport photos online',
    },
  },
  {
    locale: 'en',
    slug: 'magic-headshot-ai-headshot-generator',
    replace: {
      'business profile headshots': 'professional headshots',
    },
  },
  {
    locale: 'en',
    slug: 'selfie-to-professional-headshot-online-free',
    replace: {
      'headshots for exams jobs profiles': 'professional headshot online free',
    },
  },
]

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

const report = []

for (const item of updates) {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id,locale,slug,title,description,keywords')
    .eq('locale', item.locale)
    .eq('slug', item.slug)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to read ${item.locale}/${item.slug}: ${error.message}`)
  }

  if (!data) {
    throw new Error(`Missing ${item.locale}/${item.slug}`)
  }

  const nextKeywords = (data.keywords || []).map((keyword) => item.replace[keyword] || keyword)
  if (nextKeywords.length === 0 || nextKeywords.length > 3) {
    throw new Error(`${item.locale}/${item.slug} would have invalid keyword count ${nextKeywords.length}.`)
  }

  report.push({
    locale: item.locale,
    slug: item.slug,
    title: data.title,
    description: data.description,
    before: data.keywords,
    after: nextKeywords,
  })

  if (!dryRun) {
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ keywords: nextKeywords })
      .eq('id', data.id)

    if (updateError) {
      throw new Error(`Failed to update ${item.locale}/${item.slug}: ${updateError.message}`)
    }
  }
}

console.log(JSON.stringify({
  mode: dryRun ? 'dry-run' : 'apply',
  updateRows: report.length,
  rows: report,
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
