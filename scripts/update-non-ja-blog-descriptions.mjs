import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { createClient } = require('@supabase/supabase-js')

const dryRun = !process.argv.includes('--apply')

const updates = [
  {
    locale: 'de',
    slug: 'bewerbungsfoto-online-erstellen-kostenlos',
    description: 'Bewerbungsfoto online erstellen kostenlos: Nutzen Sie KI fuer Zuschnitt, Hintergrund und ein professionelles Portraet fuer Lebenslauf und LinkedIn.',
  },
  {
    locale: 'de',
    slug: 'headshot-pro-bewerbungsfoto-ki',
    description: 'Headshot Pro Bewerbungsfoto KI hilft, aus Selfies ein professionelles Bewerbungsfoto fuer Studium, Beruf und Online-Profile zu erstellen.',
  },
  {
    locale: 'de',
    slug: 'ki-selfie-in-avatar-stil-umwandeln',
    description: 'KI Selfie in Avatar Stil umwandeln: Erstellen Sie Avatar-Stile, professionelle Headshots und Profilbilder fuer Social Media und Bewerbungen.',
  },
  {
    locale: 'de',
    slug: 'kostenloser-foto-generator-ohne-anmeldung',
    description: 'Kostenloser Foto Generator ohne Anmeldung fuer KI-Headshots, Passfoto-Zuschnitt, Hintergrundfarben und schnelle Bewerbungsbilder.',
  },
  {
    locale: 'de',
    slug: 'magic-headshot-bewerbungsfoto-ki-kostenlos',
    description: 'Bewerbungsfoto mit KI erstellen kostenlos: Bereiten Sie Passfoto, Hintergrund und Formate fuer Schule, Abendgymnasium und Beruf vor.',
  },
  {
    locale: 'de',
    slug: 'magic-headshot-ki-avatar-headshot-styles',
    description: 'KI Headshot Generator fuer Avatare und Headshot-Stile aus Selfies, passend fuer Business-Profile, Social Media und kreative Projekte.',
  },
  {
    locale: 'de',
    slug: 'magic-headshot-ki-professionelle-portraetfotos',
    description: 'Professionelle Aufnahmen aus Selfies: Erstellen Sie KI-Portraetfotos fuer LinkedIn, Xing, Lebenslauf und moderne Business-Profile.',
  },
  {
    locale: 'es',
    slug: 'cambiar-fondo-foto-carnet',
    description: 'Cambiar fondo foto carnet: ajusta blanco, azul, rojo o gris claro y prepara un retrato PNG transparente para documentos y perfiles.',
  },
  {
    locale: 'es',
    slug: 'foto-carnet-gratis-online',
    description: 'Foto carnet gratis online: recorta la imagen, cambia el fondo y organiza una hoja imprimible para estudiantes o solicitudes de empleo.',
  },
  {
    locale: 'es',
    slug: 'foto-carnet-profesional-ai',
    description: 'Foto carnet con inteligencia artificial para oposiciones, curriculum y documentos: crea una imagen profesional desde casa con fondo adecuado.',
  },
  {
    locale: 'es',
    slug: 'generador-de-fotos-gratis-para-curriculum',
    description: 'Generador de fotos gratis para curriculum: prepara una imagen profesional con fondo limpio, buen recorte y estilo natural para tu CV.',
  },
  {
    locale: 'es',
    slug: 'generador-fotos-online-perfiles-profesionales',
    description: 'Generador de fotos online para perfiles profesionales: transforma selfies para LinkedIn, CV o carnet con recorte y cambio de fondo gratis.',
  },
  {
    locale: 'es',
    slug: 'hoja-de-fotos-carnet-para-imprimir-gratis',
    description: 'Hoja de fotos carnet para imprimir gratis: prepara recorte, fondo blanco y diseno listo para examenes, curriculum o documentos.',
  },
  {
    locale: 'fr',
    slug: 'changer-fond-photo-identite',
    description: 'Changer fond photo identite : passez au blanc, bleu, rouge ou gris clair et preparez un portrait PNG transparent pour vos documents.',
  },
  {
    locale: 'fr',
    slug: 'compresser-photo-en-kb-en-ligne',
    description: 'Compresser photo en KB en ligne : reduisez une image pour CV, LinkedIn ou dossier administratif avec recadrage propre et visage lisible.',
  },
  {
    locale: 'fr',
    slug: 'compresser-photo-en-kb-pour-cv',
    description: 'Compresser photo en KB pour CV : reduisez le fichier sans perdre la lisibilite du visage, puis recadrez et ajustez le fond.',
  },
  {
    locale: 'fr',
    slug: 'creer-photo-profil-professionnelle-ia',
    description: 'Photo de profil professionnelle IA : transformez vos selfies avec conseils de cadrage, fond propre et rendu adapte a LinkedIn.',
  },
  {
    locale: 'fr',
    slug: 'generateur-photo-profil-en-ligne',
    description: 'Generateur de photo de profil en ligne : transformez un selfie, recadrez l image et preparez un profil professionnel pour CV ou LinkedIn.',
  },
  {
    locale: 'fr',
    slug: 'magic-headshot-ai-photo-profil-professionnelle',
    description: 'Photo de profil professionnelle IA : transformez vos selfies en image adaptee a LinkedIn, CV et profils publics avec un rendu naturel.',
  },
  {
    locale: 'fr',
    slug: 'photo-d-identite-pour-passeport-en-ligne-gratuit',
    description: 'Photo d identite pour passeport en ligne gratuit : recadrez le visage, choisissez un fond adapte et preparez le format document.',
  },
  {
    locale: 'fr',
    slug: 'photo-identite-fond-blanc-gratuit-en-ligne',
    description: 'Photo identite fond blanc gratuit en ligne : preparez une image pour examens, candidatures et dossiers avec recadrage simple.',
  },
  {
    locale: 'fr',
    slug: 'reduire-taille-photo-kb-cv',
    description: 'Reduire taille photo KB CV : compressez votre image, gardez un visage lisible et preparez une photo propre pour vos candidatures.',
  },
]

const invalid = updates
  .map((item) => ({ ...item, length: Array.from(item.description).length }))
  .filter((item) => item.length < 120 || item.length > 160)

if (invalid.length > 0) {
  console.log(JSON.stringify({
    mode: dryRun ? 'dry-run' : 'apply',
    invalid,
  }, null, 2))
  throw new Error('Some descriptions are outside 120-160 characters.')
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
    .select('id,slug,locale,title,description')
    .eq('locale', item.locale)
    .eq('slug', item.slug)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to read ${item.locale}/${item.slug}: ${error.message}`)
  }

  if (!data) {
    throw new Error(`Missing ${item.locale}/${item.slug}`)
  }

  report.push({
    locale: item.locale,
    slug: item.slug,
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
