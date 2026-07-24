const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const URLS = [
  'https://magic-headshot.com/blog/resize-image-to-passport-size-online',
  'https://magic-headshot.com/photo-tools/resize-image-to-kb',
  'https://magic-headshot.com/es/blog/tamano-foto-cv-pixeles',
  'https://magic-headshot.com/es/photo-tools/resize-image',
  'https://magic-headshot.com/blog/how-to-change-id-photo-background-color',
  'https://magic-headshot.com/blog/id-photo-creator',
  'https://magic-headshot.com/blog/free-ai-photo-generator-for-resume-profile-picture',
  'https://magic-headshot.com/es/blog/foto-carnet-gratis-online-herramienta-recortar',
  'https://magic-headshot.com/fr/blog/photo-cv-ia-conseils',
  'https://magic-headshot.com/ja/blog/rirekisho-shashin-app-muryo-osusume',
  'https://magic-headshot.com/blog/free-passport-photo-tool-online',
  'https://magic-headshot.com/de/blog/bewerbungsfoto-online-erstellen',
  'https://magic-headshot.com/de/blog/bewerbungsfoto-ki-erstellen-kostenlos',
  'https://magic-headshot.com/blog/linkedin-photo-post-size',
  'https://magic-headshot.com/blog/free-id-photo-tool-online',
  'https://magic-headshot.com/blog/professional-headshot-photo-for-job-application',
  'https://magic-headshot.com/',
  'https://magic-headshot.com/blog/remote-teams',
  'https://magic-headshot.com/fr/blog/magic-headshot-ai-photo-profil-professionnelle',
  'https://magic-headshot.com/blog/how-to-layout-id-photos-for-printing',
  'https://magic-headshot.com/es/blog/tamano-foto-cv-en-cm',
  'https://magic-headshot.com/blog/ai-selfie-to-professional-headshot',
  'https://magic-headshot.com/blog/ai-headshots-for-college-admissions',
  'https://magic-headshot.com/blog/generate-id-photo-change-background-print-sheet',
  'https://magic-headshot.com/landing',
  'https://magic-headshot.com/blog/magic-headshot-ai-resume-photo-editor',
  'https://magic-headshot.com/pricing',
  'https://magic-headshot.com/refund',
  'https://magic-headshot.com/privacy',
  'https://magic-headshot.com/contact',
  'https://magic-headshot.com/photo-tools/id-photo-crop',
  'https://magic-headshot.com/blog/linkedin-photo-maker-selfie-to-professional-headshot',
  'https://magic-headshot.com/blog/how-to-staple-resume-to-headshot',
  'https://magic-headshot.com/blog/a4-photo-print-sheet-for-resume-photos',
  'https://magic-headshot.com/fr/blog/creer-photo-profil-professionnelle-ia',
  'https://magic-headshot.com/ja/blog/create-document-photos-free-magic-headshot',
  'https://magic-headshot.com/blog',
  'https://magic-headshot.com/sample',
  'https://magic-headshot.com/ja/blog/student-id-photo-ai',
  'https://magic-headshot.com/es/photo-tools/remove-background',
  'https://magic-headshot.com/blog/cropping-and-resizing-photos-for-id-cards-free',
  'https://magic-headshot.com/es',
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
  const blogTargets = URLS.map(parseBlogUrl).filter(Boolean)
  const orFilter = blogTargets.map((target) => `and(locale.eq.${target.locale},slug.eq.${target.slug})`).join(',')
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id,locale,slug,status,title,description,keywords,category,updated_at')
    .or(orFilter)
    .order('updated_at', { ascending: false })

  if (error) throw error

  const byKey = new Map((data || []).map((row) => [`${row.locale}/${row.slug}`, row]))
  const report = URLS.map((url) => {
    const target = parseBlogUrl(url)
    if (!target) return { url, type: 'static_or_tool' }
    const row = byKey.get(`${target.locale}/${target.slug}`)
    return {
      url,
      type: row ? 'cms_blog' : 'static_blog_or_missing',
      locale: target.locale,
      slug: target.slug,
      row: row || null,
    }
  })

  console.log(JSON.stringify(report, null, 2))
}

function parseBlogUrl(value) {
  const url = new URL(value)
  const parts = url.pathname.split('/').filter(Boolean)
  if (parts[0] === 'blog' && parts[1]) {
    return { locale: 'en', slug: parts[1] }
  }
  if (['es', 'fr', 'de', 'ja'].includes(parts[0]) && parts[1] === 'blog' && parts[2]) {
    return { locale: parts[0], slug: parts[2] }
  }
  return null
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
