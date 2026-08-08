import { after, NextResponse } from 'next/server'
import { InternalHumanSegmentationService } from '@backend/services/internal-human-segmentation.service'

export const dynamic = 'force-dynamic'

type HumanSegmentationBody = {
  imageUrl?: unknown
  orderid?: unknown
  types?: unknown
  base?: unknown
  clothing?: unknown
  commonSpecs?: unknown
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

function objectValue(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  return value as Record<string, unknown>
}

export async function POST(request: Request) {
  const auth = isAuthorized(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  try {
    const body = await request.json() as HumanSegmentationBody
    const task = await InternalHumanSegmentationService.createTask({
      imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl : '',
      orderid: typeof body.orderid === 'string' ? body.orderid : '',
      types: Array.isArray(body.types) ? body.types.filter((type): type is 'base' | 'suit' => type === 'base' || type === 'suit') : [],
      base: objectValue(body.base),
      clothing: objectValue(body.clothing),
      commonSpecs: objectValue(body.commonSpecs),
      metadata: objectValue(body.metadata),
    })

    after(() => InternalHumanSegmentationService.processTask(task.taskId).catch((error) => {
      console.error('[InternalHumanSegmentation] Background processing error:', error)
    }))

    return NextResponse.json({
      taskId: task.taskId,
      orderid: task.orderid,
      status: task.status,
      progress: task.progress,
      currentStep: task.currentStep,
      outputUrls: task.outputUrls,
      zipUrl: task.zipUrl,
      estimatedTime: 120,
    })
  } catch (error) {
    console.error('[InternalHumanSegmentation] Error creating task:', error)
    const message = error instanceof Error ? error.message : 'Failed to create human segmentation task'
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

    const task = await InternalHumanSegmentationService.getTask(taskId)
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(InternalHumanSegmentationService.toResponse(task))
  } catch (error) {
    console.error('[InternalHumanSegmentation] Error getting task:', error)
    return NextResponse.json({ error: 'Failed to get human segmentation task' }, { status: 500 })
  }
}
