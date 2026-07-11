import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { createClient } = require('@supabase/supabase-js')

const dryRun = !process.argv.includes('--apply')

const updates = [
  {
    slug: 'adult-education-entrance-exam-photo-requirements',
    description: 'Create compliant adult education entrance exam photos with clear crop, background, and print steps for applications, IDs, and job documents.',
  },
  {
    slug: 'ai-headshot-business-generator-realistic-professional-portraits',
    description: 'Use an AI headshot business generator to create realistic professional portraits with better photo prep, style choice, and profile-ready results.',
  },
  {
    slug: 'ai-headshot-generator-magic-headshot',
    description: 'See how AI headshot generators turn selfies into studio-quality headshots for LinkedIn, resumes, corporate profiles, and online teams.',
  },
  {
    slug: 'ai-resume-photo-editor-guide',
    description: 'Use an AI resume photo editor to improve lighting, background, expression, and crop so your headshot looks natural for job applications.',
  },
  {
    slug: 'ai-resume-photo-generator-professional-headshot-styles',
    description: 'Create professional headshot styles with an AI resume photo generator, then prepare images for LinkedIn, resumes, and student exam photos.',
  },
  {
    slug: 'compress-photo-to-kb-for-exam-photo',
    description: 'Compress photo to KB for exam photo uploads, then resize, crop, and adjust background color for student IDs and job application forms.',
  },
  {
    slug: 'compress-photo-to-kb-for-headshot',
    description: 'Compress photo to KB for headshot uploads, keep facial clarity, and prepare profile images for LinkedIn, resumes, and avatar styles.',
  },
  {
    slug: 'compress-photo-to-kb-for-profile-picture',
    description: 'Compress photo to KB for profile picture use while keeping clarity, background quality, and a polished look for resumes and LinkedIn.',
  },
  {
    slug: 'cropping-and-resizing-photos-for-id-cards-free',
    description: 'Crop and resize photos for ID cards free, then change background color and prepare printable sheets for students, exams, and jobs.',
  },
  {
    slug: 'free-ai-photo-generator-for-resume-profile-picture',
    description: 'Use a free AI photo generator for resume profile picture needs, from selfie upload to professional headshot for job applications.',
  },
  {
    slug: 'free-online-id-photo-maker-with-background-color-change',
    description: 'Use a free online ID photo maker to crop photos, change background color, and arrange printable sheets for student and job documents.',
  },
  {
    slug: 'free-online-tool-to-change-background-color-on-photo',
    description: 'Change background color on photo online for resumes, student IDs, and job applications, with crop and printable sheet tools included.',
  },
  {
    slug: 'free-photo-utility-for-document-photos',
    description: 'Use a free photo utility for document photos to crop images, change backgrounds, and arrange printable sheets for school or work.',
  },
  {
    slug: 'free-photo-utility-for-document-style-photos',
    description: 'Prepare document style photos with a free photo utility for cropping, background color changes, and printable ID photo sheets.',
  },
  {
    slug: 'free-resume-photo-generator-online',
    description: 'Create a resume photo online with free tools for cropping, background color changes, and printable sheets for job applications.',
  },
  {
    slug: 'how-to-prepare-a4-photo-print',
    description: 'Prepare an A4 photo print sheet for job application photos with clear steps for cropping, sizing, arranging, and printing images.',
  },
  {
    slug: 'professional-headshot-for-job-application',
    description: 'Create a professional headshot for job application use and meet student ID photo needs with practical AI photo preparation steps.',
  },
  {
    slug: 'professional-headshot-printing-services-near-me',
    description: 'Find professional headshot printing services near me after creating polished AI portraits from selfies for business profiles.',
  },
  {
    slug: 'professional-headshots-without-studio-ai',
    description: 'Create professional headshots without a studio by preparing selfies, choosing natural styles, and exporting images for work profiles.',
  },
  {
    slug: 'resize-image-size-for-headshot-ai-styles',
    description: 'Resize image size for headshot use, keep facial clarity, and prepare AI avatar styles for LinkedIn, resumes, and profile updates.',
  },
  {
    slug: 'resize-image-to-passport-size-online',
    description: 'Resize image to passport size online, then prepare ID photos, professional headshots, and avatar-style images from selfies.',
  },
  {
    slug: 'selfie-to-professional-headshot-online-free',
    description: 'Turn a selfie to professional headshot online free, with guidance on facial clarity, style choice, and use cases for jobs or profiles.',
  },
  {
    slug: 'student-id-photo-generator-online',
    description: 'Use a student ID photo generator online to crop, adjust background, and prepare exam or job application photos for print or upload.',
  },
  {
    slug: 'what-kind-of-headshot-for-resume',
    description: 'Learn what kind of headshot for resume use works best, including style, attire, expression, and AI photo preparation tips.',
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
    .eq('locale', 'en')
    .eq('slug', item.slug)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to read en/${item.slug}: ${error.message}`)
  }

  if (!data) {
    throw new Error(`Missing en/${item.slug}`)
  }

  report.push({
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
