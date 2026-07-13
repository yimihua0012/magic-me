import { after, NextResponse } from 'next/server'
import { PhotoProcessResultService } from '@backend/services/photo-process-result.service'

export const dynamic = 'force-dynamic'

type ProcessResultBody = {
  openid?: unknown
  orderid?: unknown
  type?: unknown
  productType?: unknown
  taskId?: unknown
  suitColor?: unknown
  outputUrls?: unknown
  metadata?: unknown
}

function isAuthorized(request: Request) {
  const configuredToken = process.env.INTERNAL_PHOTO_GENERATION_API_KEY?.trim()
  if (!configuredToken) {
    return { ok: false, status: 503, error: 'Photo process API is not configured' }
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
    const body = await request.json() as ProcessResultBody
    const outputUrls = Array.isArray(body.outputUrls)
      ? body.outputUrls.filter((url): url is string => typeof url === 'string').map(url => url.trim()).filter(Boolean)
      : []
    const requestedType = body.productType || body.type
    const type = requestedType === 'portrait' ? 'portrait' : requestedType === 'idphoto' ? 'idphoto' : null

    if (!type) {
      return NextResponse.json({ error: 'productType must be idphoto or portrait' }, { status: 400 })
    }

    const task = await PhotoProcessResultService.createTask({
      openid: typeof body.openid === 'string' ? body.openid : '',
      orderid: typeof body.orderid === 'string' ? body.orderid : '',
      type,
      taskId: typeof body.taskId === 'string' ? body.taskId : undefined,
      suitColor: typeof body.suitColor === 'string' ? body.suitColor : undefined,
      outputUrls,
      metadata: normalizeMetadata(body.metadata),
    })

    after(() => PhotoProcessResultService.processTask(task.taskId).catch((error) => {
      console.error('[PhotoProcessResult] Background processing error:', error)
    }))

    return NextResponse.json({
      taskId: task.taskId,
      status: task.status,
      progress: task.progress,
      currentStep: task.currentStep,
      outputUrls: task.outputUrls,
      zipUrl: task.zipUrl,
    })
  } catch (error) {
    console.error('[PhotoProcessResult] Error creating task:', error)
    const message = error instanceof Error ? error.message : 'Failed to create photo process task'
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

    const task = await PhotoProcessResultService.getTask(taskId)
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(PhotoProcessResultService.toResponse(task))
  } catch (error) {
    console.error('[PhotoProcessResult] Error getting task:', error)
    return NextResponse.json({ error: 'Failed to get photo process task' }, { status: 500 })
  }
}
