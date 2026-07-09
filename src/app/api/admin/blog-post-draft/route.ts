import { NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'
import { validateBlogPostInput, type BlogPostInput } from '@/lib/blog-store'
import { LOCALES, type Locale } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

const DEEPSEEK_TIMEOUT_MS = 60000

type DraftBody = {
  mode?: unknown
  locale?: unknown
  keywords?: unknown
  relatedTerms?: unknown
  prompt?: unknown
}

type DeepSeekMessage = {
  content?: string | null
}

type DeepSeekResponse = {
  choices?: { message?: DeepSeekMessage }[]
  error?: {
    message?: string
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const apiKey = (process.env.DEEPSEEK_KEY || process.env.DEEPSEEK_API_KEY || '').trim()
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Missing DEEPSEEK_KEY on the server.' },
      { status: 500 },
    )
  }

  const body = await request.json().catch(() => null) as DraftBody | null
  const locale = typeof body?.locale === 'string' && (LOCALES as readonly string[]).includes(body.locale)
    ? body.locale as Locale
    : 'en'
  const keywords = normalizeKeywords(body?.keywords)
  const relatedTerms = typeof body?.relatedTerms === 'string' ? body.relatedTerms.trim() : ''
  const reviewedPrompt = typeof body?.prompt === 'string' ? body.prompt.trim() : ''
  const mode = body?.mode === 'prepare' ? 'prepare' : 'article'

  if (mode === 'prepare' && !relatedTerms) {
    return NextResponse.json({ error: 'Enter related terms first.' }, { status: 400 })
  }

  if (mode === 'article' && keywords.length === 0) {
    return NextResponse.json({ error: 'Confirm one localized search keyword first.' }, { status: 400 })
  }

  const prompt = mode === 'prepare'
    ? buildKeywordAndPromptPrompt(locale, relatedTerms)
    : withCmsJsonRequirements(reviewedPrompt || buildBlogDraftPrompt(locale, keywords), locale)
  const endpoint = resolveDeepSeekEndpoint()
  const model = process.env.DEEPSEEK_MODEL?.trim() || 'deepseek-chat'

  let response: Response
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: 'You are an SEO editor for a multilingual AI headshot SaaS. Return only valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
      signal: AbortSignal.timeout(DEEPSEEK_TIMEOUT_MS),
      cache: 'no-store',
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Could not connect to DeepSeek.', details: errorMessage(error) },
      { status: 502 },
    )
  }

  const raw = await response.text()
  const parsedResponse = parseJson<DeepSeekResponse>(raw)
  if (!response.ok) {
    const providerMessage = parsedResponse?.error?.message || 'DeepSeek draft generation failed.'
    return NextResponse.json(
      {
        error: readableDeepSeekError(providerMessage, response.status),
        status: response.status,
      },
      { status: 502 },
    )
  }

  const content = parsedResponse?.choices?.[0]?.message?.content || raw
  const parsedDraft = parseJson<Record<string, unknown>>(stripJsonFence(content))
  if (!parsedDraft) {
    return NextResponse.json({ error: 'DeepSeek did not return valid JSON.' }, { status: 502 })
  }

  if (mode === 'prepare') {
    const preparedKeywords = readStringArray(parsedDraft.keywords).slice(0, 1)
    const preparedPrompt = readString(parsedDraft.prompt)

    if (preparedKeywords.length !== 1 || !preparedPrompt) {
      return NextResponse.json({ error: 'DeepSeek did not return one keyword and a prompt.' }, { status: 502 })
    }

    return NextResponse.json({
      keywords: preparedKeywords,
      prompt: preparedPrompt,
    })
  }

  const draft = normalizeGeneratedDraft(parsedDraft, locale, keywords)
  const validationErrors = validateBlogPostInput(draft)

  return NextResponse.json({
    draft,
    validationErrors,
  })
}

function buildKeywordAndPromptPrompt(locale: Locale, relatedTerms: string) {
  const languageNames: Record<Locale, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    ja: 'Japanese',
  }
  const language = languageNames[locale]
  const directions = [
    [
      'Draft angle: avatar and headshot style transformation.',
      'Focus on users who want to turn uploaded selfies into different avatar styles, professional headshots, social profile portraits, creative profile images, and polished personal branding visuals.',
      'The article prompt should make style choice, likeness, facial clarity, outfit/background mood, and profile use cases the main storyline.',
    ],
    [
      'Draft angle: free photo utility for document-style photos.',
      'Focus on users who need cropping, background color changes, and printable photo sheet arrangement for everyday document-style photos.',
      'The article prompt should make practical steps, print readiness, background color selection, image layout, and avoiding unusable source photos the main storyline.',
    ],
    [
      'Draft angle: student, adult education entrance exam, and job application scenarios.',
      'Focus on local users preparing profile or document-style images for school-related use, adult education entrance exams, job applications, resumes, online forms, and professional profiles.',
      'The article prompt should make the real-life scenario, search intent, local expectations, and step-by-step image preparation workflow the main storyline.',
    ],
  ]
  const selectedDirection = directions[Math.floor(Math.random() * directions.length)]

  return [
    'You are preparing a localized SEO blog draft for Magic-Headshot.',
    `Target language: ${language}. Locale: ${locale}.`,
    `User-provided related terms: ${relatedTerms}.`,
    ...selectedDirection,
    '',
    'Task:',
    '1. Return exactly one localized long-tail Google search keyword that real users in this language would commonly search.',
    '   The keyword should show clear search intent and likely Google search volume, not a broad seed term or brand-only phrase.',
    '   Vary the keyword direction based on the selected draft angle so repeated requests do not return the same keyword every time.',
    '2. Build one detailed article-generation prompt in the same target language for the editor to review.',
    'The article-generation prompt must make the SEO blog draft revolve around the selected keyword as the core topic.',
    'It must require the final article title, meta description, intro, section headings, searchIntent, and uniqueAngle to clearly support the keyword without keyword stuffing.',
    '',
    'The prompt must ask for one practical SEO blog article about Magic Headshot as an AI tool that creates different avatar and headshot styles from uploaded selfies, and as a free photo utility for cropping, arranging printable photo sheets, and changing background colors for student, adult education entrance exam, job application, profile, and everyday document-style photo scenarios.',
    'The prompt must be localized to the market and search behavior of the selected language, not a direct translation from English.',
    'The prompt must include this rule: Do not include discounts, legal claims, medical claims, or guarantees.',
    'Critical: the prompt must require DeepSeek to return only one valid JSON object that can be parsed and saved by the blog CMS.',
    'The prompt must preserve these exact required JSON keys: slug, title, description, keywords, category, coverImageUrl, coverImageAlt, intro, sections, enhancement, localizedSlugs.',
    'The prompt must preserve these field rules:',
    '- slug must be lowercase English letters/numbers/hyphens only.',
    '- description must be 120-160 characters and match the visible article.',
    '- keywords must be an array of 5-8 search phrases.',
    '- coverImageUrl should be an empty string unless a site-local image path is known.',
    '- coverImageAlt must describe the intended cover image in the article language.',
    '- intro must be 80-140 words.',
    '- visible article body should be about 1000-1200 words total.',
    '- sections must be an array of 5-7 objects, each with heading and body.',
    '- enhancement must include category, audience, searchIntent, uniqueAngle, actionSteps, qualityChecks, avoid, internalLinks, relatedSlugs.',
    '- actionSteps must be 4-6 practical steps.',
    '- qualityChecks must be 3 objects with label and detail.',
    '- avoid must be 3-5 strings.',
    '- internalLinks must link only to public paths: /pricing, /sample, /questions, /blog, /free-id-photo-tool.',
    '- relatedSlugs can be an empty array.',
    '- localizedSlugs must include the selected locale mapped to slug.',
    '- no markdown fences and no commentary outside JSON.',
    '',
    'Return only valid JSON with exactly these keys:',
    'keywords, prompt',
    '',
    'JSON rules:',
    '- keywords must be an array with exactly one localized long-tail Google search phrase.',
    '- prompt must be a detailed string that can be sent directly to DeepSeek to generate the article JSON.',
    '- Do not include markdown fences.',
    '- Do not include commentary outside JSON.',
  ].join('\n')
}

function buildBlogDraftPrompt(locale: Locale, keywords: string[]) {
  const languageNames: Record<Locale, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    ja: 'Japanese',
  }
  const language = languageNames[locale]

  return [
    'Write one localized SEO blog article for Magic-Headshot.',
    `Language: ${language}. Locale: ${locale}.`,
    `Confirmed localized search keywords: ${keywords.join(', ')}.`,
    'Product context: Magic-Headshot lets users upload selfies and generate professional headshot images for work-related profiles and online presence.',
    'Write for local search behavior and local reader expectations in the selected language. Do not directly translate English examples.',
    'Return only the final JSON object.',
    'Return one JSON object with exactly these keys:',
    'slug, title, description, keywords, category, coverImageUrl, coverImageAlt, intro, sections, enhancement, localizedSlugs.',
    'Rules:',
    '- slug must be lowercase English letters/numbers/hyphens only.',
    '- description must be 120-160 characters and match the visible article.',
    '- keywords must be an array of 5-8 search phrases.',
    '- coverImageUrl should be an empty string unless you know a site-local image path.',
    '- coverImageAlt must describe the intended article cover image in the article language.',
    '- intro must be 80-140 words.',
    '- The visible article body should be about 1000-1200 words total, counting intro, sections, action steps, checks, and avoid text.',
    '- sections must be an array of 5-7 objects, each with heading and body. Body should be 100-150 words.',
    '- enhancement must include category, audience, searchIntent, uniqueAngle, actionSteps, qualityChecks, avoid, internalLinks, relatedSlugs.',
    '- actionSteps must be 4-6 practical steps.',
    '- qualityChecks must be 3 objects with label and detail.',
    '- avoid must be 3-5 strings.',
    '- internalLinks must link only to public paths: /pricing, /sample, /questions, /blog, /free-id-photo-tool.',
    '- relatedSlugs can be an empty array.',
    '- localizedSlugs must include the selected locale mapped to slug.',
    '- Do not include discounts, legal claims, medical claims, or guarantees.',
    '- The JSON content must not include markdown code fences.',
  ].join('\n')
}

function withCmsJsonRequirements(prompt: string, locale: Locale) {
  const hasRequiredKeys =
    prompt.includes('slug, title, description, keywords, category, coverImageUrl, coverImageAlt, intro, sections, enhancement, localizedSlugs') ||
    (prompt.includes('slug') && prompt.includes('localizedSlugs') && prompt.includes('sections') && prompt.includes('enhancement'))

  if (hasRequiredKeys) return prompt

  return [
    prompt,
    '',
    'Mandatory CMS output format:',
    'Return only one valid JSON object that can be parsed and saved by the blog CMS.',
    'Required JSON keys: slug, title, description, keywords, category, coverImageUrl, coverImageAlt, intro, sections, enhancement, localizedSlugs.',
    'Rules:',
    '- slug must be lowercase English letters/numbers/hyphens only.',
    '- description must be 120-160 characters and match the visible article.',
    '- keywords must be an array of 5-8 search phrases.',
    '- coverImageUrl should be an empty string unless a site-local image path is known.',
    '- coverImageAlt must describe the intended cover image in the article language.',
    '- intro must be 80-140 words.',
    '- visible article body should be about 1000-1200 words total.',
    '- sections must be an array of 5-7 objects, each with heading and body.',
    '- enhancement must include category, audience, searchIntent, uniqueAngle, actionSteps, qualityChecks, avoid, internalLinks, relatedSlugs.',
    '- actionSteps must be 4-6 practical steps.',
    '- qualityChecks must be 3 objects with label and detail.',
    '- avoid must be 3-5 strings.',
    '- internalLinks must link only to public paths: /pricing, /sample, /questions, /blog, /free-id-photo-tool.',
    '- relatedSlugs can be an empty array.',
    `- localizedSlugs must include ${locale} mapped to slug.`,
    '- Do not include markdown fences or commentary outside JSON.',
  ].join('\n')
}

function normalizeGeneratedDraft(
  value: Record<string, unknown>,
  locale: Locale,
  fallbackKeywords: string[],
): BlogPostInput {
  const slug = slugify(readString(value.slug) || fallbackKeywords[0] || 'ai-headshot-guide')
  const keywords = readStringArray(value.keywords)
  const sections = readSections(value.sections)
  const enhancement = readRecord(value.enhancement)
  const localizedSlugs = readRecord(value.localizedSlugs) as Partial<Record<Locale, string>>

  return {
    locale,
    slug,
    status: 'draft',
    title: readString(value.title),
    description: readString(value.description),
    keywords: keywords.length > 0 ? keywords : fallbackKeywords,
    category: readString(value.category),
    coverImageUrl: readString(value.coverImageUrl),
    coverImageAlt: readString(value.coverImageAlt),
    intro: readString(value.intro),
    sections,
    enhancement,
    localizedSlugs: {
      ...localizedSlugs,
      [locale]: slug,
    },
  }
}

function resolveDeepSeekEndpoint() {
  const baseUrl = process.env.DEEPSEEK_BASE_URL?.trim() || 'https://api.deepseek.com'
  return `${baseUrl.replace(/\/$/, '')}/chat/completions`
}

function normalizeKeywords(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
  }

  if (typeof value === 'string') {
    return value.split(/[,，\n]+/).map((item) => item.trim()).filter(Boolean)
  }

  return []
}

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function readStringArray(value: unknown) {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
}

function readSections(value: unknown) {
  if (!Array.isArray(value)) return []
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object' && !Array.isArray(item)))
    .map((item) => ({
      heading: readString(item.heading),
      body: readString(item.body),
    }))
    .filter((item) => item.heading && item.body)
}

function readRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {}
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')

  return slug || 'ai-headshot-guide'
}

function stripJsonFence(value: string) {
  return value.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
}

function parseJson<T>(value: string) {
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  return typeof error === 'string' ? error : 'Unknown error'
}

function readableDeepSeekError(message: string, status: number) {
  if (status === 402 || /insufficient\s+balance/i.test(message)) {
    return 'DeepSeek account balance is insufficient. Recharge the DeepSeek account or switch to another API key.'
  }

  return message
}
