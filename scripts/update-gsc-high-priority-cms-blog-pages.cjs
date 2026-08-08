const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const updates = [
  {
    locale: 'es',
    slug: 'tamano-foto-cv-pixeles',
    title: 'Tama\u00f1o de Foto para CV en P\u00edxeles: Medidas Exactas',
    description: 'Consulta el tama\u00f1o de foto para CV en p\u00edxeles, formatos recomendados, recorte y fondo para curr\u00edculum o LinkedIn.',
    keywords: ['tama\u00f1o foto CV p\u00edxeles'],
  },
  {
    locale: 'es',
    slug: 'tamano-foto-cv-en-cm',
    title: 'Tama\u00f1o de Foto para CV en cm: Medidas y Formato',
    description: 'Consulta el tama\u00f1o de foto para CV en cm, proporci\u00f3n, fondo y recorte correcto para curr\u00edculum, perfil o candidatura.',
    keywords: ['tama\u00f1o foto CV cm'],
  },
  {
    locale: 'en',
    slug: 'id-photo-creator',
    title: 'Free ID Photo Creator Online: Crop, Background, Print',
    description: 'Create an ID photo online, crop the face, change background color, resize the file, and make a printable photo sheet.',
    keywords: ['free ID photo creator online'],
  },
  {
    locale: 'en',
    slug: 'headshot-generator-ai-reddit',
    title: 'Best AI Headshot Generator Reddit Users Compare',
    description: 'Compare AI headshot generators Reddit users discuss, including realism, price, privacy, editing control, and resume use.',
    keywords: ['best AI headshot generator Reddit'],
  },
  {
    locale: 'en',
    slug: 'id-photo-background-color-change-tips',
    title: 'ID Photo Background Color Tips: White, Blue, Red',
    description: 'Choose the right ID photo background color, compare white, blue, red, and gray, then crop and prepare a clean document photo.',
    keywords: ['ID photo background color tips'],
  },
  {
    locale: 'en',
    slug: 'resume-photo-size-in-cm',
    title: 'Resume Photo Size in cm: Dimensions, Pixels, Crop',
    description: 'Check resume photo size in cm, pixels, and inches, then choose a clean crop, background, and file format for applications.',
    keywords: ['resume photo size in cm'],
  },
  {
    locale: 'en',
    slug: 'what-size-of-photo-in-resume',
    title: 'What Size Photo in Resume? cm, Pixels, and Crop Guide',
    description: 'Find what size photo to use in a resume, compare cm and pixel dimensions, and prepare a professional crop for applications.',
    keywords: ['what size photo in resume'],
  },
]

loadEnvFile(path.resolve(process.cwd(), '.env.local'))

if (process.argv.includes('--dry-run')) {
  const results = updates.map((update) => ({
    locale: update.locale,
    slug: update.slug,
    titleLength: update.title.length,
    descriptionLength: update.description.length,
    validation: validate(update),
  }))

  console.log(JSON.stringify(results, null, 2))
  process.exit(results.some((result) => result.validation.length > 0) ? 1 : 0)
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
  const results = []

  for (const update of updates) {
    const validation = validate(update)
    if (validation.length > 0) {
      results.push({ locale: update.locale, slug: update.slug, ok: false, validation })
      continue
    }

    const { data: before, error: readError } = await supabase
      .from('blog_posts')
      .select('id,locale,slug,title,description,keywords,status')
      .eq('locale', update.locale)
      .eq('slug', update.slug)
      .maybeSingle()

    if (readError) throw readError

    if (!before) {
      results.push({ locale: update.locale, slug: update.slug, ok: false, reason: 'not found' })
      continue
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        title: update.title,
        description: update.description,
        keywords: update.keywords,
      })
      .eq('id', before.id)
      .select('id,locale,slug,title,description,keywords,status')
      .single()

    if (error) throw error

    results.push({
      locale: update.locale,
      slug: update.slug,
      ok: true,
      status: data.status,
      before: {
        title: before.title,
        description: before.description,
        keywords: before.keywords,
      },
      after: {
        title: data.title,
        description: data.description,
        keywords: data.keywords,
      },
    })
  }

  console.log(JSON.stringify(results, null, 2))
}

function validate(update) {
  const issues = []
  if (!update.title || update.title.length > 70) issues.push(`title length ${update.title.length}`)
  if (!update.description || update.description.length > 180) issues.push(`description length ${update.description.length}`)
  if (update.description.length < 100 || update.description.length > 145) {
    issues.push(`description target length ${update.description.length}`)
  }
  if (!Array.isArray(update.keywords) || update.keywords.length !== 1) issues.push('keywords must contain exactly one item')
  return issues
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
