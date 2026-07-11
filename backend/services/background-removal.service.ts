const BACKGROUND_REMOVAL_MODEL_NAME = process.env.REPLICATE_BACKGROUND_REMOVAL_MODEL_NAME || '851-labs/background-remover'
const BACKGROUND_REMOVAL_MODEL_VERSION = process.env.REPLICATE_BACKGROUND_REMOVAL_MODEL_VERSION
const POLL_INTERVAL_MS = 5000

let cachedBackgroundRemovalVersion: string | null = BACKGROUND_REMOVAL_MODEL_VERSION || null

export interface BackgroundRemovalResult {
  outputUrl: string
  durationMs: number
  metrics?: {
    predict_time?: number
    total_time?: number
  }
}

export class BackgroundRemovalService {
  static get modelName() {
    return BACKGROUND_REMOVAL_MODEL_NAME
  }

  static async removeBackground(imageUrl: string, sourceId = 'remove-background'): Promise<BackgroundRemovalResult> {
    const replicateApiKey = process.env.REPLICATE_API_KEY
    if (!replicateApiKey) {
      throw new Error('REPLICATE_API_KEY is required for background removal')
    }

    const startedAt = Date.now()
    const version = await resolveBackgroundRemovalVersion(replicateApiKey)
    const response = await fetchWithTimeout(
      'https://api.replicate.com/v1/predictions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${replicateApiKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait',
        },
        body: JSON.stringify({
          version,
          input: {
            image: imageUrl,
            format: 'png',
            background_type: 'rgba',
            threshold: 0,
            reverse: false,
          },
        }),
      },
      30000,
    )

    const prediction = await response.json()
    if (!response.ok || prediction.error) {
      throw new Error(`Background removal failed for ${sourceId}: ${prediction.error || response.status}`)
    }

    let result = prediction
    let pollCount = 0
    while (result.status !== 'succeeded' && result.status !== 'failed') {
      pollCount += 1
      if (pollCount > 60) {
        throw new Error(`Background removal timed out for ${sourceId}`)
      }

      await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS))
      const statusResponse = await fetchWithTimeout(
        `https://api.replicate.com/v1/predictions/${result.id}`,
        {
          headers: { 'Authorization': `Bearer ${replicateApiKey}` },
        },
        15000,
      )

      result = await statusResponse.json()
      if (!statusResponse.ok || result.error) {
        throw new Error(`Background removal polling failed for ${sourceId}: ${result.error || statusResponse.status}`)
      }
    }

    if (result.status === 'failed') {
      throw new Error(`Background removal failed for ${sourceId}: ${result.error || 'Prediction failed'}`)
    }

    const outputUrl = extractReplicateOutputUrl(result.output)
    if (!outputUrl) {
      throw new Error(`Background removal returned no output for ${sourceId}`)
    }

    return {
      outputUrl,
      durationMs: Date.now() - startedAt,
      metrics: result.metrics && typeof result.metrics === 'object'
        ? result.metrics as BackgroundRemovalResult['metrics']
        : undefined,
    }
  }
}

async function resolveBackgroundRemovalVersion(replicateApiKey: string): Promise<string> {
  if (cachedBackgroundRemovalVersion) {
    return cachedBackgroundRemovalVersion
  }

  const response = await fetchWithTimeout(
    `https://api.replicate.com/v1/models/${BACKGROUND_REMOVAL_MODEL_NAME}/versions`,
    {
      headers: {
        'Authorization': `Bearer ${replicateApiKey}`,
      },
    },
    15000,
  )

  const data = await response.json()
  const version = Array.isArray(data.results) && typeof data.results[0]?.id === 'string'
    ? data.results[0].id
    : null

  if (!response.ok || !version) {
    throw new Error(`Failed to resolve background removal model version: ${data.error || data.detail || response.status}`)
  }

  cachedBackgroundRemovalVersion = version
  return version
}

function extractReplicateOutputUrl(output: unknown): string | null {
  if (typeof output === 'string') return output
  if (Array.isArray(output)) {
    for (const item of output) {
      if (typeof item === 'string') return item
      if (item && typeof item === 'object') {
        const maybeOutput = item as { url?: unknown }
        if (typeof maybeOutput.url === 'string') return maybeOutput.url
      }
    }

    return null
  }

  if (output && typeof output === 'object') {
    const maybeOutput = output as { url?: unknown }
    if (typeof maybeOutput.url === 'string') return maybeOutput.url
  }

  return null
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 30000): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } finally {
    clearTimeout(timeoutId)
  }
}
