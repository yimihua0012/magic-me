import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { createClient } = require('@supabase/supabase-js')

const dryRun = !process.argv.includes('--apply')

const updates = [
  {
    locale: 'de',
    slug: 'bewerbungsfoto-mit-ki-erstellen',
    description: 'Bewerbungsfoto mit KI erstellen: Foto vorbereiten, Hintergrund und Zuschnitt pruefen, Dateigroesse anpassen und fuer Bewerbung nutzen.',
    keywords: ['Bewerbungsfoto mit KI erstellen'],
  },
  {
    locale: 'de',
    slug: 'magic-headshot-bewerbungsfoto-ki-kostenlos',
    description: 'Bewerbungsfoto mit KI erstellen kostenlos: Passfoto online vorbereiten, Hintergrund zuschneiden und Bewerbungsfoto fuer Beruf nutzen.',
    keywords: ['Bewerbungsfoto mit KI erstellen kostenlos', 'Passfoto online vorbereiten'],
  },
  {
    locale: 'de',
    slug: 'magic-headshot-ki-headshot-erstellen',
    description: 'KI Headshot erstellen: Selfies vorbereiten, Licht und Stil pruefen und professionelle Headshots fuer Profil oder Bewerbung nutzen.',
    keywords: ['KI Headshot erstellen', 'professionelle Headshots aus Selfies'],
  },
  {
    locale: 'de',
    slug: 'passbilder-layout-zum-drucken',
    description: 'Passbilder zum Drucken: Layout auf A4 oder Fotopapier planen, mehrere Kopien anordnen und ein Druck-JPG vorbereiten.',
    keywords: ['Passbilder zum Drucken', 'Passbilder auf A4 anordnen'],
  },
  {
    locale: 'de',
    slug: 'passfoto-erstellen-hintergrund-aendern-drucken',
    description: 'Selfie zu Passfoto: transparentes PNG Ausweisfoto, Hintergrund, Zuschnitt und Passfoto Druckbogen fuer den Druck vorbereiten.',
    keywords: ['Selfie zu Passfoto', 'transparentes PNG Ausweisfoto'],
  },
  {
    locale: 'en',
    slug: 'ai-headshots-for-college-admissions',
    description: 'AI headshots for college admissions: create student headshots from selfies, prepare application photos, adjust background, crop, and size.',
    keywords: ['AI headshots for college admissions', 'student headshots from selfies'],
  },
  {
    locale: 'en',
    slug: 'free-document-photo-editor-online',
    description: 'Free document photo editor online: change background color, crop document photos, resize files, and prepare printable photo sheets.',
    keywords: ['free document photo editor online', 'printable photo sheets'],
  },
  {
    locale: 'en',
    slug: 'free-id-photo-print-sheet-maker-online',
    description: 'Free ID photo print sheet maker online: turn selfies into ID photo sheets, printable layouts, and professional headshots from selfies.',
    keywords: ['free ID photo print sheet maker online', 'professional headshots from selfies'],
  },
  {
    locale: 'en',
    slug: 'generate-id-photo-change-background-print-sheet',
    description: 'Generate an ID photo from a portrait, change the background, create a transparent PNG, and prepare a print sheet from portrait.',
    keywords: ['selfie to ID photo', 'print sheet from portrait'],
  },
  {
    locale: 'en',
    slug: 'headshots-near-me-magic-headshot',
    description: 'Skip headshots near me searches and create professional headshots from selfies with studio-quality style, background, and crop.',
    keywords: ['headshots near me', 'professional headshots from selfies'],
  },
  {
    locale: 'en',
    slug: 'how-to-create-a-professional-resume',
    description: 'Create a professional headshot for resume use with a free AI headshot generator, photo prep tips, background checks, and crop guidance.',
    keywords: ['professional headshot for resume', 'AI headshot generator free'],
  },
  {
    locale: 'en',
    slug: 'how-to-staple-resume-to-headshot',
    description: 'Learn how to staple resume to headshot, prepare a professional headshot for resume use, and create an AI headshot for job application.',
    keywords: ['staple resume to headshot', 'AI headshot for job application'],
  },
  {
    locale: 'en',
    slug: 'magic-headshot-ai-headshot-generator',
    description: 'Magic Headshot AI headshot generator helps create professional headshots from selfies with realistic style, background, crop, and likeness.',
    keywords: ['AI headshot generator', 'professional headshots from selfies'],
  },
  {
    locale: 'en',
    slug: 'magic-headshot-ai-professional-headshots-from-selfies',
    description: 'Create professional headshots from selfies with natural looking AI headshots, likeness, background, crop, and profile-ready output.',
    keywords: ['professional headshots from selfies', 'natural looking AI headshots'],
  },
  {
    locale: 'en',
    slug: 'professional-headshot-photo-for-job-application',
    description: 'Prepare a professional headshot photo for job application with an AI headshot generator, student ID photo crop, background, and size tips.',
    keywords: ['professional headshot photo for job application', 'AI headshot generator'],
  },
  {
    locale: 'en',
    slug: 'resize-image-to-kb-for-student-id-photo',
    description: 'Resize image to KB for student ID photo uploads, adjust student ID photo size, use a free online image resizer, and keep files accepted.',
    keywords: ['resize image to kb for student id photo', 'student id photo size'],
  },
  {
    locale: 'es',
    slug: 'editor-de-fotos-gratis-para-fotos-carnet',
    description: 'Editor de fotos gratis para fotos carnet: generar foto carnet con IA, ajustar fondo, recorte y archivo para CV o perfil profesional.',
    keywords: ['editor de fotos gratis para fotos carnet', 'generar foto carnet con IA'],
  },
  {
    locale: 'es',
    slug: 'foto-profesional-para-curriculum-con-ia',
    description: 'Foto profesional para currículum con IA: prepara la imagen, mejora iluminación, ajusta fondo y usa el retrato en CV o perfil laboral.',
    keywords: ['foto profesional para currículum', 'iluminación para foto currículum'],
  },
  {
    locale: 'fr',
    slug: 'ai-headshot-for-professional-id-photos',
    description: 'Photo d identité professionnelle avec IA: preparez une photo de tête IA, ajustez fond et recadrage avec un outil photo professionnel.',
    keywords: ['photo d identité professionnelle', 'outil photo professionnel'],
  },
]

for (const item of updates) {
  const range = item.locale === 'ja' ? { min: 55, max: 90 } : { min: 100, max: 140 }
  const length = Array.from(item.description).length
  if (length < range.min || length > range.max) {
    throw new Error(`${item.locale}/${item.slug} description length ${length} is outside ${range.min}-${range.max}.`)
  }
  if (!Array.isArray(item.keywords) || item.keywords.length < 1 || item.keywords.length > 3) {
    throw new Error(`${item.locale}/${item.slug} keywords must contain 1-3 items.`)
  }
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
    .select('id,locale,slug,title,description,keywords')
    .eq('locale', item.locale)
    .eq('slug', item.slug)
    .maybeSingle()

  if (error) throw error
  if (!data) throw new Error(`Missing ${item.locale}/${item.slug}`)

  report.push({
    locale: item.locale,
    slug: item.slug,
    beforeDescription: data.description,
    afterDescription: item.description,
    beforeKeywords: data.keywords,
    afterKeywords: item.keywords,
  })

  if (!dryRun) {
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ description: item.description, keywords: item.keywords })
      .eq('id', data.id)

    if (updateError) throw new Error(`Failed to update ${item.locale}/${item.slug}: ${updateError.message}`)
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
