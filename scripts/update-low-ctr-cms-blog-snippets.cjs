const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const updates = [
  {
    locale: 'en',
    slug: 'resize-image-to-passport-size-online',
    title: 'Resize Image to Passport Size Online for ID Photos',
    description: 'Resize an image to passport size online, crop the face, adjust the background, and prepare a clean ID photo for forms.',
    keywords: ['resize image to passport size online'],
  },
  {
    locale: 'es',
    slug: 'tamano-foto-cv-pixeles',
    title: 'Tamano de Foto para CV en Pixeles: Medidas y Recorte',
    description: 'Consulta el tamano de foto para CV en pixeles, ajusta recorte y fondo, y prepara una imagen clara para curriculum.',
    keywords: ['tamano foto curriculum pixeles'],
  },
  {
    locale: 'en',
    slug: 'how-to-change-id-photo-background-color',
    title: 'How to Change ID Photo Background Color Online',
    description: 'Change an ID photo background to white, blue, red, or gray online, then crop and download a document-ready image.',
    keywords: ['change ID photo background color'],
  },
  {
    locale: 'en',
    slug: 'id-photo-creator',
    title: 'ID Photo Creator Online for Passport and Profile Photos',
    description: 'Use an ID photo creator to crop passport-style photos, change the background, resize files, and prepare printable sheets.',
    keywords: ['ID photo creator online'],
  },
  {
    locale: 'en',
    slug: 'free-ai-photo-generator-for-resume-profile-picture',
    title: 'Free AI Photo Generator for Resume Profile Pictures',
    description: 'Turn a selfie into a resume profile picture with AI, then use crop, background, and file-size tools before applying.',
    keywords: ['free AI photo generator for resume profile picture'],
  },
  {
    locale: 'es',
    slug: 'foto-carnet-gratis-online-herramienta-recortar',
    title: 'Foto Carnet Gratis Online: Recorta, Cambia Fondo e Imprime',
    description: 'Crea una foto carnet gratis online, ajusta el recorte, cambia el fondo y prepara una hoja imprimible desde el navegador.',
    keywords: ['foto carnet gratis online'],
  },
  {
    locale: 'fr',
    slug: 'photo-cv-ia-conseils',
    title: 'Photo CV avec IA : conseils pour un rendu professionnel',
    description: 'Preparez une photo CV avec IA, ajustez le cadrage, le fond et la taille du fichier pour LinkedIn, CV ou candidature.',
    keywords: ['photo CV avec IA'],
  },
  {
    locale: 'ja',
    slug: 'rirekisho-shashin-app-muryo-osusume',
    title: '無料の履歴書写真アプリで証明写真を自宅作成',
    description: '無料の履歴書写真アプリで、自宅の写真を履歴書向けに整える方法を紹介。背景、サイズ、服装、提出前の確認もできます。',
    keywords: ['無料の履歴書写真アプリ'],
  },
  {
    locale: 'en',
    slug: 'free-passport-photo-tool-online',
    title: 'Free Passport Photo Tool Online: Crop, Resize, and Print',
    description: 'Use a free passport photo tool online to crop a document photo, resize it, change the background, and prepare print sheets.',
    keywords: ['free passport photo tool online'],
  },
  {
    locale: 'de',
    slug: 'bewerbungsfoto-online-erstellen',
    title: 'Bewerbungsfoto online erstellen: KI, Zuschnitt und Hintergrund',
    description: 'Erstelle ein Bewerbungsfoto online, pruefe Zuschnitt und Hintergrund und bereite ein klares Bild fuer Lebenslauf oder Profil vor.',
    keywords: ['bewerbungsfoto online erstellen'],
  },
  {
    locale: 'de',
    slug: 'bewerbungsfoto-ki-erstellen-kostenlos',
    title: 'Bewerbungsfoto mit KI erstellen: kostenlos starten',
    description: 'Erstelle ein Bewerbungsfoto mit KI, waehle einen professionellen Stil und pruefe Zuschnitt, Hintergrund und Dateigroesse.',
    keywords: ['Bewerbungsfoto KI erstellen kostenlos'],
  },
  {
    locale: 'en',
    slug: 'linkedin-photo-post-size',
    title: 'LinkedIn Photo Post Size and Profile Image Guide',
    description: 'Check LinkedIn photo post size, profile image crop, and file tips before uploading a clean professional picture.',
    keywords: ['LinkedIn photo post size'],
  },
  {
    locale: 'en',
    slug: 'free-id-photo-tool-online',
    title: 'Free ID Photo Tool Online: Crop, Background, and Print',
    description: 'Use a free ID photo tool online to crop a passport-style image, change background color, resize, and create a print sheet.',
    keywords: ['free ID photo tool online'],
  },
  {
    locale: 'en',
    slug: 'professional-headshot-photo-for-job-application',
    title: 'Professional Headshot Photo for Job Applications',
    description: 'Prepare a professional headshot photo for job applications with AI style options, clean background, crop, and size tips.',
    keywords: ['professional headshot photo for job application'],
  },
  {
    locale: 'fr',
    slug: 'magic-headshot-ai-photo-profil-professionnelle',
    title: 'Photo de profil professionnelle avec IA depuis un selfie',
    description: 'Transformez un selfie en photo de profil professionnelle avec IA pour LinkedIn, CV, site personnel ou profil public.',
    keywords: ['photo de profil professionnelle IA'],
  },
  {
    locale: 'en',
    slug: 'how-to-layout-id-photos-for-printing',
    title: 'How to Layout ID Photos for Printing on Photo Paper',
    description: 'Learn how to layout ID photos for printing, choose a photo size, leave cutting space, and download a clean print sheet.',
    keywords: ['layout ID photos for printing'],
  },
  {
    locale: 'es',
    slug: 'tamano-foto-cv-en-cm',
    title: 'Tamano de Foto para CV en cm: Medidas y Consejos',
    description: 'Consulta el tamano de foto para CV en cm, ajusta fondo y recorte, y prepara una imagen clara para curriculum o perfil.',
    keywords: ['tamano foto curriculum en cm'],
  },
  {
    locale: 'en',
    slug: 'ai-selfie-to-professional-headshot',
    title: 'Turn a Selfie into a Professional Headshot with AI',
    description: 'Turn a selfie into a professional headshot with AI, choose a business style, and prepare a polished photo for LinkedIn or resumes.',
    keywords: ['selfie to professional headshot'],
  },
  {
    locale: 'en',
    slug: 'ai-headshots-for-college-admissions',
    title: 'AI Headshots for College Admissions and Student Profiles',
    description: 'Create AI headshots for college admissions, student profiles, and applications with clean lighting, crop, and background tips.',
    keywords: ['AI headshots for college admissions'],
  },
  {
    locale: 'en',
    slug: 'generate-id-photo-change-background-print-sheet',
    title: 'Generate an ID Photo, Change Background, and Print',
    description: 'Generate an ID photo from a portrait, change the background color, create a transparent PNG, and prepare a printable sheet.',
    keywords: ['generate ID photo change background print sheet'],
  },
  {
    locale: 'en',
    slug: 'magic-headshot-ai-resume-photo-editor',
    title: 'AI Resume Photo Editor for Professional Headshots',
    description: 'Use an AI resume photo editor to turn selfies into polished headshots for job applications, LinkedIn, and professional profiles.',
    keywords: ['AI resume photo editor'],
  },
  {
    locale: 'en',
    slug: 'linkedin-photo-maker-selfie-to-professional-headshot',
    title: 'LinkedIn Photo Maker: Selfie to Professional Headshot',
    description: 'Use a LinkedIn photo maker to turn a selfie into a professional headshot, then check crop, background, and file size.',
    keywords: ['LinkedIn photo maker'],
  },
  {
    locale: 'en',
    slug: 'how-to-staple-resume-to-headshot',
    title: 'How to Staple a Resume to a Headshot for Applications',
    description: 'Learn how to staple a resume to a headshot, prepare the photo size, and keep your application materials neat and readable.',
    keywords: ['staple resume to headshot'],
  },
  {
    locale: 'en',
    slug: 'a4-photo-print-sheet-for-resume-photos',
    title: 'A4 Photo Print Sheet for Resume Photos: Simple Layout Guide',
    description: 'Create an A4 photo print sheet for resume photos, arrange copies with cutting space, and prepare images for home or shop printing.',
    keywords: ['A4 photo print sheet resume photos'],
  },
  {
    locale: 'fr',
    slug: 'creer-photo-profil-professionnelle-ia',
    title: 'Creer une photo de profil professionnelle avec IA',
    description: 'Creez une photo de profil professionnelle avec IA depuis un selfie, puis ajustez cadrage, fond et style pour LinkedIn ou CV.',
    keywords: ['creer photo profil professionnelle IA'],
  },
  {
    locale: 'ja',
    slug: 'create-document-photos-free-magic-headshot',
    title: '自撮りから証明写真を無料で作成する方法',
    description: '自撮りから証明写真を無料で作成し、履歴書や学生証向けに背景、サイズ、印刷レイアウト、提出前確認を整える方法を紹介。',
    keywords: ['自撮りから証明写真'],
  },
  {
    locale: 'ja',
    slug: 'student-id-photo-ai',
    title: '学生証や受験用の証明写真をAIで作成',
    description: '学生証や受験用の証明写真をAIで作成し、背景、サイズ、服装、スマホ撮影、提出前チェックまで整える方法を詳しく紹介。',
    keywords: ['学生証や受験用の証明写真'],
  },
  {
    locale: 'en',
    slug: 'cropping-and-resizing-photos-for-id-cards-free',
    title: 'Crop and Resize Photos for ID Cards Free Online',
    description: 'Crop and resize photos for ID cards free online, adjust background color, and prepare printable images for school or work.',
    keywords: ['crop and resize photos for ID cards free'],
  },
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
  for (const update of updates) {
    const validation = validate(update)
    if (validation.length > 0) {
      results.push({ locale: update.locale, slug: update.slug, ok: false, validation })
      continue
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        title: update.title,
        description: update.description,
        keywords: update.keywords,
      })
      .eq('locale', update.locale)
      .eq('slug', update.slug)
      .select('id,locale,slug,title,description,keywords')
      .maybeSingle()

    if (error) throw error
    results.push({ locale: update.locale, slug: update.slug, ok: Boolean(data), id: data?.id || null })
  }

  console.log(JSON.stringify(results, null, 2))
}

function validate(update) {
  const issues = []
  if (!update.title || update.title.length > 70) issues.push(`title length ${update.title.length}`)
  if (!update.description || update.description.length > 180) issues.push(`description length ${update.description.length}`)
  if (update.locale === 'ja') {
    if (update.description.length < 55 || update.description.length > 90) issues.push(`ja description target length ${update.description.length}`)
  } else if (update.description.length < 100 || update.description.length > 140) {
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
