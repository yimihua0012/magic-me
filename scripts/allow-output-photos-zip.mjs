import fs from 'fs'
import { createClient } from '@supabase/supabase-js'

for (const filename of ['.env.local', '.env.local.td']) {
  if (!fs.existsSync(filename)) continue
  for (const line of fs.readFileSync(filename, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const index = trimmed.indexOf('=')
    if (index < 0) continue
    const key = trimmed.slice(0, index).trim()
    let value = trimmed.slice(index + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
)

const { data: buckets, error: listError } = await supabase.storage.listBuckets()
if (listError) throw listError

const bucket = buckets.find((item) => item.id === 'output-photos')
if (!bucket) throw new Error('output-photos bucket not found')

const allowedMimeTypes = Array.from(new Set([
  ...((bucket.allowed_mime_types || bucket.allowedMimeTypes || [])),
  'application/zip',
]))

const { data, error } = await supabase.storage.updateBucket('output-photos', {
  public: true,
  allowedMimeTypes,
  fileSizeLimit: bucket.file_size_limit || bucket.fileSizeLimit || 49283072,
})

if (error) throw error
console.log(JSON.stringify({ updated: true, allowedMimeTypes, data }, null, 2))
