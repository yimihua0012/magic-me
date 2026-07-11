import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { createClient } = require('@supabase/supabase-js')

const dryRun = !process.argv.includes('--apply')

const updates = [
  {
    slug: 'ai-resume-photo-editor-guide',
    description: 'Use an AI resume photo editor to improve lighting, corporate headshot style, background, expression, and crop for job applications.',
  },
  {
    slug: 'professional-headshot-for-resume-ai-headshot-generator',
    keywords: [
      'professional headshot for resume',
      'AI headshot generator for resume',
      'resume headshot styles',
      'standout profile picture',
    ],
  },
  {
    slug: 'professional-headshots-without-studio-ai',
    description: 'Create professional headshots without a studio, save time and money, choose natural styles, and export images for work profiles.',
  },
  {
    slug: 'turn-selfies-into-professional-headshots-free',
    keywords: [
      'turn selfies into professional headshots',
      'free AI headshot generator',
      'professional headshots from selfies',
      'avatar style transformation',
    ],
  },
  {
    slug: 'what-kind-of-headshot-for-resume',
    description: 'Learn what kind of headshot for resume use works best, with style, attire, expression, and strong first impression headshot tips.',
  },
]

const invalidDescriptions = updates
  .filter((item) => item.description)
  .map((item) => ({ ...item, length: Array.from(item.description).length }))
  .filter((item) => item.length < 120 || item.length > 160)

if (invalidDescriptions.length > 0) {
  console.log(JSON.stringify({ invalidDescriptions }, null, 2))
  throw new Error('Some descriptions are outside 120-160 characters.')
}

const invalidKeywords = updates
  .filter((item) => item.keywords)
  .filter((item) => item.keywords.length === 0 || item.keywords.length > 4)

if (invalidKeywords.length > 0) {
  console.log(JSON.stringify({ invalidKeywords }, null, 2))
  throw new Error('Some keyword arrays are empty or longer than 4.')
}

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
    .select('id,slug,locale,title,description,keywords')
    .eq('locale', 'en')
    .eq('slug', item.slug)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to read en/${item.slug}: ${error.message}`)
  }

  if (!data) {
    throw new Error(`Missing en/${item.slug}`)
  }

  const patch = {}
  if (item.description) patch.description = item.description
  if (item.keywords) patch.keywords = item.keywords

  report.push({
    slug: item.slug,
    title: data.title,
    beforeDescriptionLength: Array.from((data.description || '').trim()).length,
    afterDescriptionLength: item.description ? Array.from(item.description).length : Array.from((data.description || '').trim()).length,
    beforeKeywords: data.keywords,
    afterKeywords: item.keywords || data.keywords,
    beforeDescription: data.description,
    afterDescription: item.description || data.description,
  })

  if (!dryRun) {
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update(patch)
      .eq('id', data.id)

    if (updateError) {
      throw new Error(`Failed to update en/${item.slug}: ${updateError.message}`)
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
