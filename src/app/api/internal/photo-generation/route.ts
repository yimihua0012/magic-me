import { NextResponse } from 'next/server'
import { InternalPhotoGenerationService } from '@backend/services/internal-photo-generation.service'
import { PhotoProcessResultService } from '@backend/services/photo-process-result.service'

export const dynamic = 'force-dynamic'

type InternalGenerationBody = {
  prompt?: unknown
  image?: unknown
  imageUrl?: unknown
  imageUrls?: unknown
  style?: unknown
  styleId?: unknown
  styleName?: unknown
  negativePrompt?: unknown
  prompts?: unknown
  generationPrompts?: unknown
  clientGenerationId?: unknown
  metadata?: unknown
  openid?: unknown
  orderid?: unknown
  type?: unknown
  productType?: unknown
  suitColor?: unknown
}

function isAuthorized(request: Request) {
  const configuredToken = process.env.INTERNAL_PHOTO_GENERATION_API_KEY?.trim()
  if (!configuredToken) {
    return { ok: false, status: 503, error: 'Internal photo generation API is not configured' }
  }

  const authHeader = request.headers.get('authorization') || ''
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length).trim() : ''
  const headerToken = request.headers.get('x-internal-api-key')?.trim() || ''
  const token = bearerToken || headerToken

  if (token !== configuredToken) {
    return { ok: false, status: 401, error: 'Unauthorized' }
  }

  return { ok: true, status: 200, error: null }
}

function normalizeImageUrls(body: InternalGenerationBody) {
  const candidate = Array.isArray(body.imageUrls) ? body.imageUrls : [body.imageUrl, body.image]
  return candidate
    .filter((value): value is string => typeof value === 'string')
    .map(value => value.trim())
    .filter(Boolean)
    .slice(0, 3)
}

function normalizeMetadata(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  return value as Record<string, unknown>
}

function normalizeGenerationPrompts(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  const allowedKeys = new Set(['idphoto', 'portraitWhite', 'portraitFront', 'portraitSide'])
  const prompts = Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key, prompt]) => allowedKeys.has(key) && typeof prompt === 'string' && prompt.trim())
      .map(([key, prompt]) => [key, (prompt as string).trim()])
  )
  return Object.keys(prompts).length > 0 ? prompts : undefined
}

function normalizeAutoProcess(body: InternalGenerationBody): Record<string, unknown> | null {
  const openid = typeof body.openid === 'string' ? body.openid.trim() : ''
  const orderid = typeof body.orderid === 'string' ? body.orderid.trim() : ''
  const requestedType = body.productType || body.type
  const type = requestedType === 'portrait' ? 'portrait' : requestedType === 'idphoto' ? 'idphoto' : null
  if (!openid && !orderid) return null
  if (!openid || !orderid || !type) {
    throw new Error('openid, orderid, and productType are required together for automatic post-processing')
  }

  return {
    openid,
    orderid,
    type,
    ...(typeof body.suitColor === 'string' && body.suitColor.trim() ? { suitColor: body.suitColor.trim() } : {}),
  }
}

export async function POST(request: Request) {
  const auth = isAuthorized(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json() as InternalGenerationBody
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : ''
    if (!prompt) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
    }

    if (prompt.length > 4000) {
      return NextResponse.json({ error: 'prompt must be 4000 characters or fewer' }, { status: 400 })
    }

    const imageUrls = normalizeImageUrls(body)
    if (imageUrls.length === 0) {
      return NextResponse.json({ error: 'imageUrl or imageUrls is required' }, { status: 400 })
    }

    const styleId = typeof body.styleId === 'string'
      ? body.styleId.trim()
      : typeof body.style === 'string'
        ? body.style.trim()
        : undefined
    const requestedType = body.productType || body.type
    const productType = requestedType === 'portrait' ? 'portrait' : 'idphoto'

    const metadata = normalizeMetadata(body.metadata) || {}
    const autoProcess = normalizeAutoProcess(body)
    const task = await InternalPhotoGenerationService.createTask({
      prompt,
      imageUrls,
      productType,
      generationPrompts: normalizeGenerationPrompts(body.generationPrompts || body.prompts),
      styleId,
      styleName: typeof body.styleName === 'string' ? body.styleName.trim() : undefined,
      negativePrompt: typeof body.negativePrompt === 'string' ? body.negativePrompt.trim() : undefined,
      clientGenerationId: typeof body.clientGenerationId === 'string' ? body.clientGenerationId.trim() : undefined,
      metadata: autoProcess ? { ...metadata, autoProcess } : metadata,
    })

    if (!task.reused) {
      InternalPhotoGenerationService.processTask(task.id).catch((error) => {
        console.error('[InternalPhotoGeneration] Background generation error:', error)
      })
    }

    return NextResponse.json({
      taskId: task.id,
      status: task.status,
      progress: task.progress,
      currentStep: task.currentStep,
      outputUrls: [],
      estimatedTime: task.status === 'processing' ? 180 : 0,
      reused: Boolean(task.reused),
    })
  } catch (error) {
    console.error('[InternalPhotoGeneration] Error creating task:', error)
    const message = error instanceof Error ? error.message : 'Failed to create internal photo generation task'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const auth = isAuthorized(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const { searchParams } = new URL(request.url)
    const taskId = searchParams.get('taskId')?.trim()
    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 })
    }

    const task = await InternalPhotoGenerationService.getTask(taskId)
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    const metadata = task.metadata || {}
    const processResultTaskId = typeof metadata.processResultTaskId === 'string' ? metadata.processResultTaskId : ''
    if (processResultTaskId) {
      const processTask = await PhotoProcessResultService.getTask(processResultTaskId)
      if (processTask) {
        const response = PhotoProcessResultService.toResponse(processTask)
        return NextResponse.json({
          taskId: task.id,
          processTaskId: processResultTaskId,
          status: response.status,
          progress: response.status === 'completed' ? 100 : Math.min(99, 60 + Math.round(response.progress * 0.4)),
          currentStep: response.currentStep,
          outputUrls: response.status === 'completed' && response.zipUrl ? [response.zipUrl] : [],
          zipUrl: response.status === 'completed' ? response.zipUrl : null,
          error: response.error,
          styleId: task.style_id,
          styleName: task.style_name,
        })
      }
    }

    const autoProcess = metadata.autoProcess
    const shouldHideIntermediateOutputs = Boolean(autoProcess && typeof autoProcess === 'object')
    return NextResponse.json({
      taskId: task.id,
      status: task.status,
      progress: task.progress,
      currentStep: task.current_step,
      outputUrls: shouldHideIntermediateOutputs ? [] : task.output_photos,
      error: task.error_message,
      styleId: task.style_id,
      styleName: task.style_name,
    })
  } catch (error) {
    console.error('[InternalPhotoGeneration] Error getting task:', error)
    return NextResponse.json({ error: 'Failed to get internal photo generation task' }, { status: 500 })
  }
}
