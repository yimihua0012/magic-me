import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { createClient } = require('@supabase/supabase-js')

const dryRun = !process.argv.includes('--apply')

const updates = [
  {
    slug: 'ai-avatar-headshot-selfie-to-professional',
    description: 'セルフィーから履歴書写真を作成するAIヘッドショットガイド。プロフィール画像、服装、背景を整え、就活や転職に使える自然な写真に仕上げます。',
  },
  {
    slug: 'ai-headshot-selfie-to-professional',
    description: '自撮り写真をAIヘッドショットに変換する方法を解説。求職、SNS、ビジネスプロフィールに使える自然な写真へ整えます。',
  },
  {
    slug: 'ai-headshot-styles-from-selfies',
    description: 'セルフィーからプロフィール写真を作成するAIスタイルガイド。履歴書写真、SNSアイコン、学生証写真の使い分けを紹介します。',
  },
  {
    slug: 'ai-hedshot-selfie-kara-purofesshonaru-na-satsuei',
    description: '自撮り写真からプロフェッショナルなヘッドショットを作成。AIヘッドショットを履歴書、プロフィール写真、会社サイト向けに整えます。',
  },
]

const invalidDescriptions = updates
  .map((item) => ({ ...item, length: Array.from(item.description).length }))
  .filter((item) => item.length < 55 || item.length > 90)

if (invalidDescriptions.length > 0) {
  console.log(JSON.stringify({ invalidDescriptions }, null, 2))
  throw new Error('Some Japanese descriptions are outside 55-90 characters.')
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
    .eq('locale', 'ja')
    .eq('slug', item.slug)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to read ja/${item.slug}: ${error.message}`)
  }

  if (!data) {
    throw new Error(`Missing ja/${item.slug}`)
  }

  report.push({
    slug: item.slug,
    title: data.title,
    keywords: data.keywords,
    beforeLength: Array.from((data.description || '').trim()).length,
    afterLength: Array.from(item.description).length,
    before: data.description,
    after: item.description,
  })

  if (!dryRun) {
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ description: item.description })
      .eq('id', data.id)

    if (updateError) {
      throw new Error(`Failed to update ja/${item.slug}: ${updateError.message}`)
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
