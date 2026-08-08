export type AiTextProvider = 'deepseek' | 'qwen' | 'kimi' | 'glm'

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
  return Boolean(getDeepSeekApiKey() || getQwenApiKey() || getKimiApiKey() || getGlmApiKey())
}

export async function generateAiText(input: AiTextGenerationInput) {
  const providers = resolveProviders()
  const errors: string[] = []

  for (const provider of providers) {
    try {
      const content = provider === 'qwen'
        ? await generateWithQwen(input)
        : provider === 'kimi'
          ? await generateWithKimi(input)
          : provider === 'glm'
            ? await generateWithGlm(input)
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
  const allProviders: AiTextProvider[] = ['deepseek', 'qwen', 'kimi', 'glm']
  const preferred: AiTextProvider[] = allProviders.includes(requested as AiTextProvider)
    ? [requested as AiTextProvider]
    : allProviders

  return preferred.filter((provider) => isProviderConfigured(provider))
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

async function generateWithKimi(input: AiTextGenerationInput) {
  const apiKey = getKimiApiKey()
  if (!apiKey) throw new AiTextGenerationError('Kimi API key is not configured.', 'kimi')

  const response = await fetch(resolveKimiEndpoint(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.KIMI_MODEL?.trim() || 'kimi-k2.6',
      temperature: input.temperature ?? 0.7,
      thinking: { type: 'disabled' },
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
      readProviderError(parsed, `Kimi request failed with status ${response.status}.`),
      'kimi',
    )
  }

  const content = parsed?.choices?.[0]?.message?.content?.trim()
  if (!content) throw new AiTextGenerationError('Kimi returned no text content.', 'kimi')
  return content
}

async function generateWithGlm(input: AiTextGenerationInput) {
  const apiKey = getGlmApiKey()
  if (!apiKey) throw new AiTextGenerationError('GLM API key is not configured.', 'glm')

  const response = await fetch(resolveGlmEndpoint(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.GLM_MODEL?.trim() || 'GLM-4.6',
      temperature: input.temperature ?? 0.7,
      stream: false,
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
      readProviderError(parsed, `GLM request failed with status ${response.status}.`),
      'glm',
    )
  }

  const content = parsed?.choices?.[0]?.message?.content?.trim()
  if (!content) throw new AiTextGenerationError('GLM returned no text content.', 'glm')
  return content
}

function getDeepSeekApiKey() {
  return (process.env.DEEPSEEK_KEY || process.env.DEEPSEEK_API_KEY || '').trim()
}

function getQwenApiKey() {
  return (process.env.QIANWEN_KEY || process.env.DASHSCOPE_API_KEY || '').trim()
}

function getKimiApiKey() {
  return (process.env.KIMI_KEY || process.env.KIMI_API_KEY || process.env.MOONSHOT_API_KEY || '').trim()
}

function getGlmApiKey() {
  return (process.env.GLM_KEY || process.env.GLM_API_KEY || process.env.ZHIPUAI_API_KEY || process.env.BIGMODEL_API_KEY || '').trim()
}

function isProviderConfigured(provider: AiTextProvider) {
  if (provider === 'qwen') return Boolean(getQwenApiKey())
  if (provider === 'kimi') return Boolean(getKimiApiKey())
  if (provider === 'glm') return Boolean(getGlmApiKey())
  return Boolean(getDeepSeekApiKey())
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

function resolveKimiEndpoint() {
  const baseUrl = process.env.KIMI_BASE_URL?.trim() || process.env.MOONSHOT_BASE_URL?.trim() || 'https://api.moonshot.ai/v1'
  return baseUrl.endsWith('/chat/completions')
    ? baseUrl
    : `${baseUrl.replace(/\/$/, '')}/chat/completions`
}

function resolveGlmEndpoint() {
  const baseUrl = process.env.GLM_BASE_URL?.trim() || process.env.ZHIPUAI_BASE_URL?.trim() || 'https://open.bigmodel.cn/api/paas/v4'
  return baseUrl.endsWith('/chat/completions')
    ? baseUrl
    : `${baseUrl.replace(/\/$/, '')}/chat/completions`
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
