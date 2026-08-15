// 只对外展示「职业照(professional)」与「证件照(photo_tools)」两个分类的样式。
// 其余分类（lifestyle / artistic / seasonal / classic / creative 等）在 headshot_styles 中
// 置为 is_active = false，使其不出现在 /api/styles 与前端可选样式列表里。
//
// 用法：
//   node scripts/limit-styles-to-core-categories.mjs            # dry-run，仅打印将改动的内容
//   node scripts/limit-styles-to-core-categories.mjs --apply    # 实际写入数据库

import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { createClient } = require('@supabase/supabase-js')

const KEEP_CATEGORIES = new Set(['professional', 'photo_tools'])
const isApply = process.argv.includes('--apply')

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

const { data: styles, error } = await supabase
  .from('headshot_styles')
  .select('id, name, category, is_active, category_order, style_order')
  .order('category_order', { ascending: true })
  .order('style_order', { ascending: true })

if (error) {
  throw new Error(`Failed to load headshot_styles: ${error.message}`)
}

if (!styles || styles.length === 0) {
  console.log('No styles found in headshot_styles.')
  process.exit(0)
}

const categories = [...new Set(styles.map((style) => style.category))]
console.log(`Categories present: ${categories.join(', ')}`)
console.log(`Keeping categories: ${[...KEEP_CATEGORIES].join(', ')}`)

const keep = styles.filter((style) => KEEP_CATEGORIES.has(style.category))
const hide = styles.filter((style) => !KEEP_CATEGORIES.has(style.category))

const toActivate = keep.filter((style) => !style.is_active)
const toDeactivate = hide.filter((style) => style.is_active)

console.log(`\nStyles: ${styles.length} total, ${keep.length} keep, ${hide.length} hide.`)
console.log(`Would activate (currently inactive): ${toActivate.length}`)
console.log(`Would deactivate (currently active): ${toDeactivate.length}`)

for (const style of toDeactivate) {
  console.log(`  - deactivate [${style.category}] ${style.id} (${style.name})`)
}
for (const style of toActivate) {
  console.log(`  + activate [${style.category}] ${style.id} (${style.name})`)
}

if (!isApply) {
  console.log('\nDry run — pass --apply to write changes.')
  process.exit(0)
}

let updated = 0
if (toDeactivate.length > 0) {
  const { error: updateError } = await supabase
    .from('headshot_styles')
    .update({ is_active: false })
    .in(
      'id',
      toDeactivate.map((style) => style.id)
    )
  if (updateError) {
    throw new Error(`Failed to deactivate styles: ${updateError.message}`)
  }
  updated += toDeactivate.length
}

if (toActivate.length > 0) {
  const { error: updateError } = await supabase
    .from('headshot_styles')
    .update({ is_active: true })
    .in(
      'id',
      toActivate.map((style) => style.id)
    )
  if (updateError) {
    throw new Error(`Failed to activate styles: ${updateError.message}`)
  }
  updated += toActivate.length
}

console.log(`\nDone — updated ${updated} style(s).`)
process.exit(0)

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