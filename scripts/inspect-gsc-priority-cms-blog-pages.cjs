const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const targets = [
  { locale: 'es', slug: 'tamano-foto-cv-pixeles' },
  { locale: 'es', slug: 'tamano-foto-cv-en-cm' },
  { locale: 'en', slug: 'id-photo-creator' },
  { locale: 'en', slug: 'resume-photo-size-in-cm' },
  { locale: 'en', slug: 'what-size-of-photo-in-resume' },
]

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
  const results = []

  for (const target of targets) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id,locale,slug,title,description,keywords,intro,content,seo_enhancement,status')
      .eq('locale', target.locale)
      .eq('slug', target.slug)
      .maybeSingle()

    if (error) throw error
    results.push(data || { ...target, missing: true })
  }

  console.log(JSON.stringify(results, null, 2))
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
