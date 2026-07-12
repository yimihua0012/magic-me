import { NextResponse } from 'next/server'
import { InternalBackgroundRemovalService } from '@backend/services/internal-background-removal.service'

export const dynamic = 'force-dynamic'

type InternalRemoveBackgroundBody = {
  image?: unknown
  imageUrl?: unknown
  clientTaskId?: unknown
  metadata?: unknown
}

function isAuthorized(request: Request) {
  const configuredToken = process.env.INTERNAL_PHOTO_GENERATION_API_KEY?.trim()
  if (!configuredToken) {
    return { ok: false, status: 503, error: 'Internal photo API is not configured' }
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

function normalizeMetadata(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  return value as Record<string, unknown>
}

export async function POST(request: Request) {
  const auth = isAuthorized(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json() as InternalRemoveBackgroundBody
    const imageUrl = typeof body.imageUrl === 'string' && body.imageUrl.trim()
      ? body.imageUrl.trim()
      : typeof body.image === 'string'
        ? body.image.trim()
        : ''

    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 })
    }

    const task = await InternalBackgroundRemovalService.createTask({
      imageUrl,
      clientTaskId: typeof body.clientTaskId === 'string' ? body.clientTaskId.trim() : undefined,
      metadata: normalizeMetadata(body.metadata),
    })

    if (!task.reused) {
      InternalBackgroundRemovalService.processTask(task.id).catch((error) => {
        console.error('[InternalRemoveBackground] Background removal error:', error)
      })
    }

    return NextResponse.json({
      taskId: task.id,
      status: task.status,
      progress: task.progress,
      currentStep: task.currentStep,
      outputUrl: task.outputUrl,
      estimatedTime: task.status === 'processing' ? 90 : 0,
      reused: Boolean(task.reused),
    })
  } catch (error) {
    console.error('[InternalRemoveBackground] Error creating task:', error)
    const message = error instanceof Error ? error.message : 'Failed to create internal background removal task'
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

    const task = await InternalBackgroundRemovalService.getTask(taskId)
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json({
      taskId: task.id,
      status: task.status,
      progress: task.progress,
      currentStep: task.current_step,
      outputUrl: task.output_photo,
      error: task.error_message,
      model: task.model,
      metrics: task.metrics || {},
    })
  } catch (error) {
    console.error('[InternalRemoveBackground] Error getting task:', error)
    return NextResponse.json({ error: 'Failed to get internal background removal task' }, { status: 500 })
  }
}
