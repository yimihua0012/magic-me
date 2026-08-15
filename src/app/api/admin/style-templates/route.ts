import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'
import { PHOTO_TOOL_STYLE_CONFIGS } from '@/lib/photo-tool-styles'

export const dynamic = 'force-dynamic'

const bucket = 'style-templates'
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const maxBytes = 10 * 1024 * 1024

export async function GET(request: Request) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  const { styles, error } = await listStyles()
  if (error) {
    return NextResponse.json({ error: 'Failed to load styles.' }, { status: 500 })
  }

  const { data: templates } = await supabaseAdmin
    .from('style_templates')
    .select('style_id,gender,image_url,storage_path,alt,updated_at')
    .order('updated_at', { ascending: false })

  const templateById = new Map((templates || []).map((row) => [`${row.style_id}:${row.gender || 'neutral'}`, row]))

  return NextResponse.json({
    styles: styles.map((style) => {
      const id = style.id || style.default_name || style.name
      const hasTemplate = Boolean(templateById.get(`${id}:neutral`)) || Boolean(templateById.get(`${id}:male`)) || Boolean(templateById.get(`${id}:female`))
      const preferred = templateById.get(`${id}:neutral`) || templateById.get(`${id}:male`) || templateById.get(`${id}:female`)
      return {
        id,
        name: style.name,
        category: style.category,
        has_template: hasTemplate,
        templates: ['neutral', 'male', 'female'].map((key) => {
          const template = templateById.get(`${id}:${key}`)
          return {
            key,
            has_template: Boolean(template),
            image_url: template?.image_url || null,
            storage_path: template?.storage_path || null,
            updated_at: template?.updated_at || null,
          }
        }),
        image_url: preferred?.image_url || null,
        storage_path: preferred?.storage_path || null,
        updated_at: preferred?.updated_at || null,
      }
    }),
  })
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  const formData = await request.formData().catch(() => null)
  if (!formData) {
    return NextResponse.json({ error: 'Form data is required.' }, { status: 400 })
  }

  const styleId = stringFormValue(formData, 'style_id')
  if (!styleId) {
    return NextResponse.json({ error: 'Style id is required.' }, { status: 400 })
  }

  const gender = ['male', 'female', 'neutral'].includes(stringFormValue(formData, 'gender'))
    ? (stringFormValue(formData, 'gender') as 'male' | 'female' | 'neutral')
    : 'neutral'

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Image file is required.' }, { status: 400 })
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: 'Only JPG, PNG, and WebP images are allowed.' }, { status: 400 })
  }

  if (file.size > maxBytes) {
    return NextResponse.json({ error: 'Image must be 10MB or smaller.' }, { status: 400 })
  }

  const alt = stringFormValue(formData, 'alt')

  // 检查 style_id 是否已知，避免写入无关模板
  const known = await isKnownStyle(styleId)
  if (known.error) {
    return NextResponse.json({ error: 'Failed to load styles.' }, { status: 500 })
  }
  if (!known.exists) {
    return NextResponse.json({ error: 'Unknown style id.' }, { status: 400 })
  }

  const id = crypto.randomUUID()
  const extension = extensionForType(file.type)
  const storagePath = `${new Date().toISOString().slice(0, 10)}/${id}.${extension}`
  const buffer = Buffer.from(await file.arrayBuffer())

  // 删除该 style 对应 gender 已有的旧模板文件（若存在）
  const { data: existing } = await supabaseAdmin
    .from('style_templates')
    .select('storage_path')
    .eq('style_id', styleId)
    .eq('gender', gender)
    .maybeSingle()

  const upload = await supabaseAdmin.storage
    .from(bucket)
    .upload(storagePath, buffer, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    })

  if (upload.error) {
    console.error('[Admin Style Templates] Upload error:', upload.error)
    return NextResponse.json({ error: 'Failed to upload image.' }, { status: 500 })
  }

  const publicUrl = supabaseAdmin.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl

  const { error: upsertError } = await supabaseAdmin
    .from('style_templates')
    .upsert(
      {
        style_id: styleId,
        gender,
        image_url: publicUrl,
        storage_path: storagePath,
        alt: alt || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'style_id,gender' }
    )

  if (upsertError) {
    await supabaseAdmin.storage.from(bucket).remove([storagePath])
    console.error('[Admin Style Templates] Upsert error:', upsertError)
    return NextResponse.json({ error: 'Failed to save style template.' }, { status: 500 })
  }

  if (existing?.storage_path && existing.storage_path !== storagePath) {
    await supabaseAdmin.storage.from(bucket).remove([existing.storage_path]).catch(() => {})
  }

  return NextResponse.json(
    {
      style: {
        id: styleId,
        gender,
        has_template: true,
        image_url: publicUrl,
        storage_path: storagePath,
      },
    },
    { status: 201 }
  )
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  const url = new URL(request.url)
  const styleId = url.searchParams.get('style_id')
  const gender = ['male', 'female', 'neutral'].includes(url.searchParams.get('gender') || '')
    ? (url.searchParams.get('gender') as 'male' | 'female' | 'neutral')
    : null
  if (!styleId) {
    return NextResponse.json({ error: 'Style id is required.' }, { status: 400 })
  }

  const deleteQuery = supabaseAdmin.from('style_templates').delete().eq('style_id', styleId)
  const selectQuery = supabaseAdmin.from('style_templates').select('storage_path').eq('style_id', styleId)
  if (gender) {
    deleteQuery.eq('gender', gender)
    selectQuery.eq('gender', gender)
  }

  const { data: existing } = await selectQuery

  const { error } = await deleteQuery
  if (error) {
    console.error('[Admin Style Templates] Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete style template.' }, { status: 500 })
  }

  if (Array.isArray(existing) && existing.length > 0) {
    await supabaseAdmin.storage
      .from(bucket)
      .remove(existing.map((row) => row.storage_path).filter(Boolean))
      .catch(() => {})
  }

  return NextResponse.json({ success: true })
}

async function listStyles(): Promise<{ styles: { id?: string; name: string; category: string; default_name?: string }[]; error: unknown }> {
  let { data, error } = await supabaseAdmin
    .from('headshot_styles')
    .select('id,name,category')
    .eq('is_active', true)
    .order('category_order', { ascending: true })
    .order('style_order', { ascending: true })

  if (error) {
    const fallback = await supabaseAdmin
      .from('headshot_styles')
      .select('id,name,category')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    data = fallback.data
    error = fallback.error
  }

  if (error) return { styles: [], error }

  const existingIds = new Set((data || []).map((style) => style.id).filter(Boolean))
  const photoToolFallbacks = PHOTO_TOOL_STYLE_CONFIGS
    .filter((style) => !existingIds.has(style.id))
    .map((style) => ({ id: style.id, name: style.name, category: style.category }))

  return { styles: [...(data || []), ...photoToolFallbacks], error: null }
}

async function isKnownStyle(styleId: string): Promise<{ exists: boolean; error: unknown }> {
  const { styles, error } = await listStyles()
  if (error) return { exists: false, error }
  return { exists: styles.some((style) => (style.id || style.name) === styleId), error: null }
}

async function requireAdmin(request: Request) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return null
}

function stringFormValue(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function extensionForType(type: string) {
  if (type === 'image/png') return 'png'
  if (type === 'image/jpeg') return 'jpg'
  return 'webp'
}