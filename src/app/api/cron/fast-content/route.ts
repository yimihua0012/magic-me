import { NextResponse } from 'next/server'
import {
  blogPostCategoryLabel,
  getAdminBlogPostById,
  slugifyBlogCategory,
  upsertAdminBlogPost,
  validateBlogPostInput,
  type BlogPostInput,
} from '@/lib/blog-store'
import { revalidateBlogPaths } from '@/lib/blog-revalidate'
import { LOCALES, type Locale } from '@/lib/i18n'
import { supabaseAdmin } from '@backend/config/supabase'

export const dynamic = 'force-dynamic'

const DEEPSEEK_TIMEOUT_MS = 60000
const MAX_ATTEMPTS_PER_RUN = 3
const PICK_LIMIT = 200

const META_DESCRIPTION_RULE =
  '- description must be 100-140 Unicode characters for English, Spanish, French, and German. For Japanese, keep it 55-90 Japanese characters.'

type DeepSeekResponse = {
  choices?: { message?: { content?: string | null } }[]
  error?: { message?: string }
}

type FastContentCronRow = {
  id: string
  locale: Locale
  keyword: string
  status: 'pending' | 'failed'
  created_by: string | null
  attempt_count: number | null
}

const queueColumns = [
  'id',
  'locale',
  'keyword',
  'status',
  'created_by',
  'attempt_count',
].join(',')

export async function GET(request: Request) {
  return runFastContentCron(request)
}

export async function POST(request: Request) {
  return runFastContentCron(request)
}

async function runFastContentCron(request: Request) {
  const authResult = verifyCronAuth(request)
  if (authResult) return authResult

  const apiKey = (process.env.DEEPSEEK_KEY || process.env.DEEPSEEK_API_KEY || '').trim()
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing DEEPSEEK_KEY on the server.' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const locale = parseLocale(searchParams.get('locale'))
  const picked = await pickRandomKeyword(locale)
  if (!picked) {
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: 'No pending fast content keyword found.',
    })
  }

  const userId = picked.created_by || process.env.FAST_CONTENT_CRON_USER_ID?.trim()
  if (!userId) {
    await markKeywordFailed(picked.id, 'Missing FAST_CONTENT_CRON_USER_ID and keyword has no created_by user.')
    return NextResponse.json(
      { success: false, keywordId: picked.id, error: 'Missing publish user id.' },
      { status: 500 },
    )
  }

  let lastError = ''
  let lastPrompt = ''

  for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_RUN; attempt += 1) {
    const attemptCount = (picked.attempt_count || 0) + attempt
    const acquired = await markKeywordGenerating(picked.id, attemptCount)
    if (!acquired) {
      return NextResponse.json({
        success: true,
        skipped: true,
        keywordId: picked.id,
        reason: 'Selected keyword is already being processed.',
      })
    }

    try {
      const { prompt, keywords } = preparePrompt(picked.locale, picked.keyword)
      lastPrompt = prompt
      const draft = await generateArticle(apiKey, picked.locale, keywords, prompt)
      const publishInput: BlogPostInput = {
        ...draft,
        status: 'published',
      }
      const validationErrors = validateBlogPostInput(publishInput)
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(' '))
      }

      const previousPost = publishInput.id ? await getAdminBlogPostById(publishInput.id) : null
      const result = await upsertAdminBlogPost(publishInput, userId)
      if (!result.ok) {
        throw new Error(result.errors.join(' '))
      }

      const categorySlugs = [previousPost, result.post]
        .filter((post): post is NonNullable<typeof post> => Boolean(post))
        .map((post) => slugifyBlogCategory(blogPostCategoryLabel(post)))

      revalidateBlogPaths(result.post.locale, result.post.slug, categorySlugs)
      if (previousPost && previousPost.locale === result.post.locale && previousPost.slug !== result.post.slug) {
        revalidateBlogPaths(previousPost.locale, previousPost.slug, categorySlugs)
      }

      await markKeywordPublished(picked.id, result.post.id || null, result.post.slug, prompt)

      return NextResponse.json({
        success: true,
        keywordId: picked.id,
        keyword: picked.keyword,
        locale: picked.locale,
        attempts: attempt,
        post: {
          id: result.post.id,
          slug: result.post.slug,
          locale: result.post.locale,
          title: result.post.title,
        },
      })
    } catch (error) {
      lastError = errorMessage(error)
      await markKeywordFailed(picked.id, lastError, lastPrompt)
    }
  }

  return NextResponse.json(
    {
      success: false,
      keywordId: picked.id,
      keyword: picked.keyword,
      locale: picked.locale,
      attempts: MAX_ATTEMPTS_PER_RUN,
      error: lastError || 'Fast content generation failed.',
    },
    { status: 500 },
  )
}

function verifyCronAuth(request: Request) {
  const secret = (process.env.FAST_CONTENT_CRON_SECRET || process.env.CRON_SECRET || '').trim()
  if (!secret) {
    return NextResponse.json({ error: 'Missing FAST_CONTENT_CRON_SECRET or CRON_SECRET.' }, { status: 500 })
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return null
}

async function pickRandomKeyword(locale?: Locale) {
  let query = supabaseAdmin
    .from('fast_content_keywords')
    .select(queueColumns)
    .in('status', ['pending', 'failed'])
    .order('updated_at', { ascending: true })
    .limit(PICK_LIMIT)

  if (locale) query = query.eq('locale', locale)

  const { data, error } = await query
  if (error) throw error

  const candidates = ((data || []) as unknown as FastContentCronRow[])
    .filter((row) => (LOCALES as readonly string[]).includes(row.locale) && row.keyword.trim())

  if (candidates.length === 0) return null
  return candidates[Math.floor(Math.random() * candidates.length)]
}

async function markKeywordGenerating(id: string, attemptCount: number) {
  const { data, error } = await supabaseAdmin
    .from('fast_content_keywords')
    .update({
      status: 'generating',
      attempt_count: attemptCount,
      last_attempt_at: new Date().toISOString(),
      error_message: null,
    })
    .eq('id', id)
    .in('status', ['pending', 'failed'])
    .select('id')
    .maybeSingle()

  if (error) throw error
  return Boolean(data?.id)
}

async function markKeywordFailed(id: string, errorMessageValue: string, prompt?: string) {
  const update: Record<string, unknown> = {
    status: 'failed',
    error_message: errorMessageValue.slice(0, 2000),
  }
  if (prompt) update.prompt = prompt

  await supabaseAdmin
    .from('fast_content_keywords')
    .update(update)
    .eq('id', id)
}

async function markKeywordPublished(id: string, blogPostId: string | null, blogSlug: string, prompt: string) {
  const { error } = await supabaseAdmin
    .from('fast_content_keywords')
    .update({
      status: 'published',
      blog_post_id: blogPostId,
      blog_slug: blogSlug,
      prompt,
      error_message: null,
      published_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) throw error
}

function preparePrompt(locale: Locale, keyword: string) {
  const cleanKeyword = keyword.trim().replace(/\s+/g, ' ')
  const uniquenessHint = [
    locale,
    cleanKeyword,
    new Date().toISOString(),
    Math.random().toString(36).slice(2, 10),
  ].join(' / ')

  return {
    keywords: [cleanKeyword],
    prompt: buildBlogDraftPrompt(locale, cleanKeyword, uniquenessHint),
  }
}

async function generateArticle(apiKey: string, locale: Locale, keywords: string[], prompt: string): Promise<BlogPostInput> {
  const response = await fetch(resolveDeepSeekEndpoint(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL?.trim() || 'deepseek-chat',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: [
            'You are an SEO editor for a multilingual AI headshot SaaS.',
            'Return only valid JSON.',
            'Never reuse identical meta descriptions across different article drafts.',
            'Write specific, warm, practical articles for real readers. Avoid generic automated wording.',
            'The description field must be concise: 100-140 Unicode characters for English, Spanish, French, and German; 55-90 Japanese characters for Japanese.',
          ].join('\n'),
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

  const raw = await response.text()
  const parsedResponse = parseJson<DeepSeekResponse>(raw)
  if (!response.ok) {
    const providerMessage = parsedResponse?.error?.message || 'DeepSeek draft generation failed.'
    throw new Error(readableDeepSeekError(providerMessage, response.status))
  }

  const content = parsedResponse?.choices?.[0]?.message?.content || raw
  const parsedDraft = parseJson<Record<string, unknown>>(stripJsonFence(content))
  if (!parsedDraft) {
    throw new Error('DeepSeek did not return valid JSON.')
  }

  return normalizeGeneratedDraft(parsedDraft, locale, keywords)
}

function buildBlogDraftPrompt(locale: Locale, keyword: string, uniquenessHint: string) {
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
    `Confirmed localized search keyword: ${keyword}.`,
    'Product context: Magic-Headshot lets users upload selfies and generate professional headshot images for work profiles, resumes, LinkedIn, business avatars, and online presence. It also offers free photo tools for ID-style photos, background colors, resizing, cropping, print layouts, and background removal.',
    'Write for local search behavior and local reader expectations in the selected language. Do not directly translate English examples.',
    'Write in a human editorial voice. Use specific scenarios, concrete decisions, natural phrasing, and one practical moment the reader might actually face.',
    'Do not include discounts, legal claims, medical claims, or guarantees.',
    '',
    'Return only one valid JSON object with exactly these keys:',
    'slug, title, description, keywords, category, coverImageUrl, coverImageAlt, intro, sections, enhancement, localizedSlugs.',
    '',
    'CMS rules:',
    '- slug must be lowercase English letters, numbers, and hyphens only.',
    META_DESCRIPTION_RULE,
    '- Count description characters before returning JSON. If Japanese is longer than 90 characters, rewrite it shorter; if another locale is longer than 140 characters, rewrite it shorter. The CMS rejects descriptions over 180 characters.',
    '- title is the public page H1, and title, description, and keywords must describe the same search intent.',
    '- description must be unique for this draft, include the primary keyword or a natural close variant, and mention one concrete use case, audience, or workflow from the article.',
    '- description must not be the same as title or the first intro sentence.',
    '- keywords must be an array with exactly one localized long-tail search phrase, and that keyword must clearly match the description topic.',
    '- coverImageUrl should be an empty string unless a site-local image path is known.',
    '- coverImageAlt must describe the intended cover image in the article language.',
    '- intro must be 80-140 words and should sound helpful and specific, not like a generic SEO opener.',
    '- visible article body should be about 1000-1200 words total.',
    '- sections must be an array of 5-7 objects, each with heading and body. Body should be 100-150 words.',
    '- enhancement must include category, audience, searchIntent, uniqueAngle, actionSteps, qualityChecks, avoid, internalLinks, relatedSlugs.',
    '- actionSteps must be 4-6 practical steps.',
    '- qualityChecks must be 3 objects with label and detail.',
    '- avoid must be 3-5 strings.',
    '- internalLinks must link only to public paths: /pricing, /sample, /questions, /blog, /free-id-photo-tool.',
    '- relatedSlugs can be an empty array.',
    `- localizedSlugs must include ${locale} mapped to slug.`,
    '- Do not include markdown fences or commentary outside JSON.',
    '',
    'Human tone rules:',
    '- Write like a skilled editor talking to a real person, not like a keyword template or product spec sheet.',
    '- Keep wording concrete, warm, and practical. Use one real use case, one audience, and one action or decision whenever possible.',
    '- Prefer simple verbs, natural sentence rhythm, and a clear point of view over stacked synonyms or buzzword phrases.',
    '- Do not repeat the brand name in every line. Mention Magic-Headshot only when it helps the reader understand the workflow.',
    '- Avoid copy that sounds automated, overly polished, or interchangeable with any other article.',
    `- Draft uniqueness hint for internal variation only, do not include it verbatim: ${uniquenessHint}.`,
  ].join('\n')
}

function normalizeGeneratedDraft(
  value: Record<string, unknown>,
  locale: Locale,
  fallbackKeywords: string[],
): BlogPostInput {
  const slug = slugify(readString(value.slug) || fallbackKeywords[0] || 'ai-headshot-guide')
  const keywords = readStringArray(value.keywords).slice(0, 1)
  const localizedSlugs = readRecord(value.localizedSlugs) as Partial<Record<Locale, string>>

  return {
    locale,
    slug,
    status: 'draft',
    title: readString(value.title),
    description: readString(value.description),
    keywords: keywords.length > 0 ? keywords : fallbackKeywords.slice(0, 1),
    category: readString(value.category),
    coverImageUrl: readString(value.coverImageUrl),
    coverImageAlt: readString(value.coverImageAlt),
    intro: readString(value.intro),
    sections: readSections(value.sections),
    enhancement: readRecord(value.enhancement),
    localizedSlugs: {
      ...localizedSlugs,
      [locale]: slug,
    },
  }
}

function parseLocale(value: string | null): Locale | undefined {
  return value && (LOCALES as readonly string[]).includes(value) ? value as Locale : undefined
}

function resolveDeepSeekEndpoint() {
  const baseUrl = process.env.DEEPSEEK_BASE_URL?.trim() || 'https://api.deepseek.com'
  return `${baseUrl.replace(/\/$/, '')}/chat/completions`
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
