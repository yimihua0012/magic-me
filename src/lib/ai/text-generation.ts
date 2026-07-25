export type AiTextProvider = 'deepseek' | 'qwen'

type AiTextGenerationInput = {
  system: string
  user: string
  temperature?: number
  timeoutMs?: number
}

type ProviderErrorPayload = {
  error?: { message?: string }
  message?: string
  code?: string
}

const DEFAULT_TIMEOUT_MS = 60_000

export class AiTextGenerationError extends Error {
  constructor(message: string, readonly provider?: AiTextProvider) {
    super(message)
    this.name = 'AiTextGenerationError'
  }
}

export function isAiTextGenerationConfigured() {
  return Boolean(getDeepSeekApiKey() || getQwenApiKey())
}

export async function generateAiText(input: AiTextGenerationInput) {
  const providers = resolveProviders()
  const errors: string[] = []

  for (const provider of providers) {
    try {
      const content = provider === 'qwen'
        ? await generateWithQwen(input)
        : await generateWithDeepSeek(input)

      return { content, provider }
    } catch (error) {
      errors.push(`${provider}: ${errorMessage(error)}`)
    }
  }

  throw new AiTextGenerationError(
    `AI text generation failed. ${errors.join(' | ') || 'No configured provider is available.'}`,
  )
}

function resolveProviders(): AiTextProvider[] {
  const requested = (process.env.AI_TEXT_PROVIDER || 'auto').trim().toLowerCase()
  const preferred: AiTextProvider[] = requested === 'qwen'
    ? ['qwen']
    : requested === 'deepseek'
      ? ['deepseek']
      : ['deepseek', 'qwen']

  return preferred.filter((provider) => provider === 'qwen' ? Boolean(getQwenApiKey()) : Boolean(getDeepSeekApiKey()))
}

async function generateWithDeepSeek(input: AiTextGenerationInput) {
  const apiKey = getDeepSeekApiKey()
  if (!apiKey) throw new AiTextGenerationError('DeepSeek API key is not configured.', 'deepseek')

  const response = await fetch(resolveDeepSeekEndpoint(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL?.trim() || 'deepseek-v4-flash',
      temperature: input.temperature ?? 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: input.system },
        { role: 'user', content: input.user },
      ],
    }),
    signal: AbortSignal.timeout(input.timeoutMs ?? DEFAULT_TIMEOUT_MS),
    cache: 'no-store',
  })

  const raw = await response.text()
  const parsed = parseJson<{
    choices?: { message?: { content?: string | null } }[]
  } & ProviderErrorPayload>(raw)

  if (!response.ok) {
    throw new AiTextGenerationError(
      readProviderError(parsed, `DeepSeek request failed with status ${response.status}.`),
      'deepseek',
    )
  }

  const content = parsed?.choices?.[0]?.message?.content?.trim()
  if (!content) throw new AiTextGenerationError('DeepSeek returned no text content.', 'deepseek')
  return content
}

async function generateWithQwen(input: AiTextGenerationInput) {
  const apiKey = getQwenApiKey()
  if (!apiKey) throw new AiTextGenerationError('Qwen API key is not configured.', 'qwen')

  const response = await fetch(resolveQwenEndpoint(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.QIANWEN_MODEL?.trim() || 'qwen3.7-flash',
      input: {
        messages: [
          { role: 'system', content: [{ text: input.system }] },
          { role: 'user', content: [{ text: input.user }] },
        ],
      },
      parameters: {
        temperature: input.temperature ?? 0.7,
        result_format: 'message',
      },
    }),
    signal: AbortSignal.timeout(input.timeoutMs ?? DEFAULT_TIMEOUT_MS),
    cache: 'no-store',
  })

  const raw = await response.text()
  const parsed = parseJson<{
    output?: {
      choices?: {
        message?: {
          content?: string | { text?: string }[]
        }
      }[]
    }
  } & ProviderErrorPayload>(raw)

  if (!response.ok) {
    throw new AiTextGenerationError(
      readProviderError(parsed, `Qwen request failed with status ${response.status}.`),
      'qwen',
    )
  }

  const content = readQwenContent(parsed?.output?.choices?.[0]?.message?.content)
  if (!content) throw new AiTextGenerationError('Qwen returned no text content.', 'qwen')
  return content
}

function getDeepSeekApiKey() {
  return (process.env.DEEPSEEK_KEY || process.env.DEEPSEEK_API_KEY || '').trim()
}

function getQwenApiKey() {
  return (process.env.QIANWEN_KEY || process.env.DASHSCOPE_API_KEY || '').trim()
}

function resolveDeepSeekEndpoint() {
  const baseUrl = process.env.DEEPSEEK_BASE_URL?.trim() || 'https://api.deepseek.com'
  return baseUrl.endsWith('/chat/completions')
    ? baseUrl
    : `${baseUrl.replace(/\/$/, '')}/chat/completions`
}

function resolveQwenEndpoint() {
  return process.env.QIANWEN_BASE_URL?.trim()
    || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation'
}

function readQwenContent(value: string | { text?: string }[] | undefined) {
  if (typeof value === 'string') return value.trim()
  if (!Array.isArray(value)) return ''
  return value.map((part) => typeof part?.text === 'string' ? part.text : '').join('').trim()
}

function readProviderError(payload: ProviderErrorPayload | null, fallback: string) {
  return payload?.error?.message || payload?.message || fallback
}

function parseJson<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : typeof error === 'string' ? error : 'Unknown error'
}
