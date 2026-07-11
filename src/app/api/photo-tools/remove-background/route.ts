import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { BackgroundRemovalService, CreditPackageService, CreditTransactionService } from '@backend/services'
import { getBearerUser } from '@/lib/auth/server'

export const dynamic = 'force-dynamic'

const TOOL_ID = 'remove-background'
const FREE_LIMIT = 1
const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(request: Request) {
  let consumedCredits: { packageId: string; amount: number }[] = []

  try {
    const user = await getBearerUser(request)
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('image')
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Please upload an image file.' }, { status: 400 })
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are supported.' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Image is too large. Use a file under 10MB.' }, { status: 400 })
    }

    const usage = await getUsage(user.id)
    const isFreeUse = usage.free_uses < FREE_LIMIT

    if (!isFreeUse) {
      const consumeResult = await CreditPackageService.consumeCredits(user.id, 1)
      if (!consumeResult.success) {
        return NextResponse.json({ error: 'No available credits. Please purchase a plan first.' }, { status: 402 })
      }

      consumedCredits = consumeResult.consumedFrom || (consumeResult.packageId ? [{ packageId: consumeResult.packageId, amount: 1 }] : [])
    }

    const imageDataUrl = await fileToDataUrl(file)
    const result = await BackgroundRemovalService.removeBackground(imageDataUrl, `${TOOL_ID}:${user.id}`)

    await recordUsage(user.id, usage, isFreeUse)

    if (!isFreeUse) {
      await Promise.all(consumedCredits.map((item) =>
        CreditTransactionService.record({
          userId: user.id,
          creditPackageId: item.packageId,
          transactionType: 'credit_used',
          amountDelta: -item.amount,
          description: 'Credit used for remove background photo tool',
          source: 'photo_tool',
          sourceKey: `photo_tool:${TOOL_ID}:${user.id}:${Date.now()}:${item.packageId}`,
          metadata: {
            toolId: TOOL_ID,
            model: BackgroundRemovalService.modelName,
          },
        })
      ))
    }

    const nextUsage = {
      freeUses: usage.free_uses + (isFreeUse ? 1 : 0),
      paidUses: usage.paid_uses + (isFreeUse ? 0 : 1),
      totalUses: usage.total_uses + 1,
      freeRemaining: Math.max(0, FREE_LIMIT - usage.free_uses - (isFreeUse ? 1 : 0)),
    }

    return NextResponse.json({
      outputUrl: result.outputUrl,
      chargedCredits: isFreeUse ? 0 : 1,
      freeUsed: isFreeUse,
      usage: nextUsage,
      model: BackgroundRemovalService.modelName,
      metrics: result.metrics,
    })
  } catch (error) {
    await Promise.all(consumedCredits.map((item) => CreditPackageService.refundCredits(item.packageId, item.amount).catch((refundError) => {
      console.error('[RemoveBackground] Failed to refund credit:', refundError)
    })))

    console.error('[RemoveBackground] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to remove image background.' },
      { status: 500 },
    )
  }
}

type UsageRow = {
  user_id: string
  tool_id: string
  free_uses: number
  paid_uses: number
  total_uses: number
}

async function getUsage(userId: string): Promise<UsageRow> {
  const { data, error } = await supabaseAdmin
    .from('photo_tool_usage')
    .select('user_id,tool_id,free_uses,paid_uses,total_uses')
    .eq('user_id', userId)
    .eq('tool_id', TOOL_ID)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data as UsageRow || {
    user_id: userId,
    tool_id: TOOL_ID,
    free_uses: 0,
    paid_uses: 0,
    total_uses: 0,
  }
}

async function recordUsage(userId: string, current: UsageRow, isFreeUse: boolean) {
  const { error } = await supabaseAdmin
    .from('photo_tool_usage')
    .upsert({
      user_id: userId,
      tool_id: TOOL_ID,
      free_uses: current.free_uses + (isFreeUse ? 1 : 0),
      paid_uses: current.paid_uses + (isFreeUse ? 0 : 1),
      total_uses: current.total_uses + 1,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,tool_id' })

  if (error) {
    throw error
  }
}

async function fileToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer())
  return `data:${file.type || 'image/png'};base64,${buffer.toString('base64')}`
}
