const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

const SHOULD_FIX = process.argv.includes('--fix')

loadEnvFile(path.resolve(process.cwd(), '.env.local'))

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})

async function main() {
  const { data, error } = await supabase
    .from('fast_content_keywords')
    .select('id,locale,keyword,status,blog_slug,error_message,updated_at')
    .order('updated_at', { ascending: false })
    .limit(10000)

  if (error) throw error

  const rows = data || []
  const existingKeys = new Set(rows.map((row) => `${row.locale}:${normalizeKeyword(row.keyword)}`))
  const mismatches = []
  const uncertain = []
  const fixed = []
  const blocked = []

  for (const row of rows) {
    const detected = detectLocale(row.keyword)
    if (!detected.locale) {
      uncertain.push(toReportRow(row, detected))
      continue
    }
    if (detected.locale === row.locale) continue

    const reportRow = toReportRow(row, detected)
    mismatches.push(reportRow)

    if (!SHOULD_FIX) continue

    const targetKey = `${detected.locale}:${normalizeKeyword(row.keyword)}`
    if (existingKeys.has(targetKey)) {
      blocked.push({ ...reportRow, reason: 'target_locale_keyword_already_exists' })
      continue
    }

    const update = await supabase
      .from('fast_content_keywords')
      .update({
        locale: detected.locale,
        status: row.status === 'failed' ? 'pending' : row.status,
        error_message: null,
      })
      .eq('id', row.id)
      .select('id', { count: 'exact', head: true })

    if (update.error) throw update.error
    existingKeys.delete(`${row.locale}:${normalizeKeyword(row.keyword)}`)
    existingKeys.add(targetKey)
    fixed.push(reportRow)
  }

  console.log(JSON.stringify({
    total: rows.length,
    mismatches: mismatches.length,
    uncertain: uncertain.length,
    fixed: fixed.length,
    blocked: blocked.length,
    mismatchSamples: mismatches.slice(0, 80),
    blockedSamples: blocked.slice(0, 80),
    uncertainSamples: uncertain.slice(0, 40),
  }, null, 2))
}

function toReportRow(row, detected) {
  return {
    id: row.id,
    locale: row.locale,
    detectedLocale: detected.locale || 'unknown',
    confidence: detected.confidence,
    keyword: row.keyword,
    status: row.status,
    blogSlug: row.blog_slug,
    errorMessage: row.error_message,
  }
}

function detectLocale(value) {
  const raw = String(value || '').trim()
  const normalized = normalizeKeyword(raw)
  if (!normalized) return { locale: '', confidence: 0 }

  if (/[\u3040-\u30ff\u3400-\u9fff]/.test(raw)) {
    return { locale: 'ja', confidence: 0.98 }
  }

  const scores = {
    en: score(normalized, [
      'online', 'free', 'photo', 'photos', 'picture', 'pictures', 'headshot', 'resume', 'linkedin', 'profile',
      'generator', 'tool', 'background', 'crop', 'resize', 'print', 'sheet', 'avatar', 'business', 'professional',
      'application', 'student', 'id', 'passport',
    ]),
    de: score(normalized, [
      'bilder', 'bild', 'fotos', 'foto', 'drucken', 'drucken lassen', 'seite', 'eine', 'auf', 'kostenlos',
      'kostenlose', 'selber', 'bewerbungsfoto', 'bewerbungsfotos', 'lebenslauf', 'hintergrund', 'freistellen',
      'werkzeug', 'erstellen', 'machen', 'stickerbogen', 'passfoto', 'ki', 'ohne', 'mit', 'fuer', 'fur',
      'eigenes', 'eigenem', 'umwandeln', 'erzeugen', 'aus', 'zum', 'als', 'von',
    ]),
    fr: score(normalized, [
      'photo', 'photos', 'gratuit', 'gratuite', 'ligne', 'outil', 'fond', 'blanc', 'identite', 'passeport',
      'cv', 'profil', 'pour', 'avec', 'sans', 'redimensionner', 'recadrer', 'generateur', 'image', 'imprimer',
      'feuille', 'ia', 'professionnel',
    ]),
    es: score(normalized, [
      'foto', 'fotos', 'gratis', 'gratuito', 'gratuita', 'online', 'herramienta', 'fondo', 'blanco', 'documento',
      'curriculum', 'perfil', 'para', 'con', 'sin', 'recortar', 'redimensionar', 'generador', 'imagen', 'imprimir',
      'hoja', 'ia', 'profesional',
    ]),
  }

  const ranked = Object.entries(scores).sort((left, right) => right[1] - left[1])
  const [bestLocale, bestScore] = ranked[0]
  const nextScore = ranked[1]?.[1] || 0

  if (bestScore < 2 || bestScore - nextScore < 1) {
    return { locale: '', confidence: Math.max(0, Math.min(0.6, bestScore / 6)) }
  }

  return {
    locale: bestLocale,
    confidence: Number(Math.min(0.95, 0.55 + (bestScore - nextScore) * 0.12).toFixed(2)),
  }
}

function score(normalized, terms) {
  let total = 0
  for (const term of terms) {
    const key = normalizeKeyword(term)
    if (!key) continue
    if (normalized === key) total += 4
    else if (normalized.includes(key)) total += key.includes(' ') ? 3 : 1
  }
  return total
}

function normalizeKeyword(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match || process.env[match[1]]) continue

    let value = match[2].trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    process.env[match[1]] = value
  }
}
