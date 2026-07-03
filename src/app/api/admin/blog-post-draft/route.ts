import { NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'
import { validateBlogPostInput, type BlogPostInput } from '@/lib/blog-store'
import { LOCALES, type Locale } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

const DEEPSEEK_TIMEOUT_MS = 60000

type DraftBody = {
  locale?: unknown
  keywords?: unknown
  useCase?: unknown
  brief?: unknown
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
  const useCase = typeof body?.useCase === 'string' ? body.useCase.trim() : ''
  const brief = typeof body?.brief === 'string' ? body.brief.trim() : ''
  const reviewedPrompt = typeof body?.prompt === 'string' ? body.prompt.trim() : ''

  if (keywords.length === 0) {
    return NextResponse.json({ error: 'Enter at least one keyword.' }, { status: 400 })
  }

  const prompt = reviewedPrompt || buildBlogDraftPrompt(locale, keywords, useCase, brief)
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

  const draft = normalizeGeneratedDraft(parsedDraft, locale, keywords)
  const validationErrors = validateBlogPostInput(draft)

  return NextResponse.json({
    draft,
    validationErrors,
  })
}

function buildBlogDraftPrompt(locale: Locale, keywords: string[], useCase: string, brief: string) {
  const languageNames: Record<Locale, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    ja: 'Japanese',
  }
  const language = languageNames[locale]

  return [
    'You will receive only a basic content brief. First decide the best SEO article angle, structure, search intent, and writing prompt internally. Then return the final article JSON only.',
    `Language: ${language}. Locale: ${locale}.`,
    `Keyword cluster: ${keywords.join(', ')}.`,
    `Use case: ${useCase || 'professional AI headshots for LinkedIn, resumes, company profiles, teams, and personal branding.'}`,
    `Additional notes: ${brief || 'Create a practical, trustworthy article for Magic-Headshot users.'}`,
    'Product context: Magic-Headshot is an AI avatar, photo, and professional image generation tool. Users upload selfies and generate realistic professional portraits.',
    'Important: do not reveal your internal prompt, outline planning, or reasoning. Return only the final JSON object.',
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
    '- Do not invent discounts, legal claims, medical claims, or guarantees.',
    '- The JSON content must not include markdown code fences.',
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
