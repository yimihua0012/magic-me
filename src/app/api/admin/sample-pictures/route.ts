import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'
import type { SamplePictureRow } from '@/lib/sample-pictures'

export const dynamic = 'force-dynamic'

const bucket = 'sample-pictures'
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const maxBytes = 10 * 1024 * 1024

export async function GET(request: Request) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  const { data, error } = await supabaseAdmin
    .from('sample_picture')
    .select('id,image_url,storage_path,alt,title,style_name,category,localized_alt,localized_title,localized_style_name,localized_category,sort_order,is_active,created_at,updated_at')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[Admin Sample Pictures] List error:', error)
    return NextResponse.json({ error: 'Failed to load sample pictures.' }, { status: 500 })
  }

  return NextResponse.json({ pictures: data || [] })
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request)
  if (auth) return auth

  const formData = await request.formData().catch(() => null)
  if (!formData) {
    return NextResponse.json({ error: 'Form data is required.' }, { status: 400 })
  }

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

  const title = stringFormValue(formData, 'title')
  const alt = stringFormValue(formData, 'alt')
  const styleName = stringFormValue(formData, 'style_name')
  const category = stringFormValue(formData, 'category') || 'General'
  if (!title || !alt || !styleName) {
    return NextResponse.json({ error: 'Title, alt, and style name are required.' }, { status: 400 })
  }

  const id = crypto.randomUUID()
  const extension = extensionForType(file.type)
  const storagePath = `${new Date().toISOString().slice(0, 10)}/${id}.${extension}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const upload = await supabaseAdmin.storage
    .from(bucket)
    .upload(storagePath, buffer, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    })

  if (upload.error) {
    console.error('[Admin Sample Pictures] Upload error:', upload.error)
    return NextResponse.json({ error: 'Failed to upload image.' }, { status: 500 })
  }

  const publicUrl = supabaseAdmin.storage.from(bucket).getPublicUrl(storagePath).data.publicUrl
  const payload = {
    id,
    image_url: publicUrl,
    storage_path: storagePath,
    title,
    alt,
    style_name: styleName,
    category,
    localized_title: jsonFormObject(formData, 'localized_title'),
    localized_alt: jsonFormObject(formData, 'localized_alt'),
    localized_style_name: jsonFormObject(formData, 'localized_style_name'),
    localized_category: jsonFormObject(formData, 'localized_category'),
    sort_order: integerFormValue(formData, 'sort_order'),
    is_active: booleanFormValue(formData, 'is_active', true),
  }

  const { data, error } = await supabaseAdmin
    .from('sample_picture')
    .insert(payload)
    .select()
    .single()

  if (error) {
    await supabaseAdmin.storage.from(bucket).remove([storagePath])
    console.error('[Admin Sample Pictures] Insert error:', error)
    return NextResponse.json({ error: 'Failed to save sample picture.' }, { status: 500 })
  }

  return NextResponse.json({ picture: data as SamplePictureRow }, { status: 201 })
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

function integerFormValue(formData: FormData, key: string) {
  const value = Number(stringFormValue(formData, key))
  return Number.isInteger(value) && value >= 0 ? value : 0
}

function booleanFormValue(formData: FormData, key: string, fallback: boolean) {
  const value = stringFormValue(formData, key)
  if (value === 'true') return true
  if (value === 'false') return false
  return fallback
}

function jsonFormObject(formData: FormData, key: string) {
  const raw = stringFormValue(formData, key)
  if (!raw) return {}

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}

    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([, value]) => typeof value === 'string' && value.trim())
        .map(([locale, value]) => [locale, String(value).trim()]),
    )
  } catch {
    return {}
  }
}

function extensionForType(type: string) {
  if (type === 'image/png') return 'png'
  if (type === 'image/jpeg') return 'jpg'
  return 'webp'
}
