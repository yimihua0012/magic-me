const urls = [
  'https://magic-headshot.com/blog/student-id-photo-generator-online',
  'https://magic-headshot.com/de/photo-tools/background-color-tool',
  'https://magic-headshot.com/blog/free-photo-utility-for-document-photos',
  'https://magic-headshot.com/blog/turn-selfies-into-professional-headshots-free',
  'https://magic-headshot.com/photo-tools',
  'https://magic-headshot.com/blog/compress-photo-to-kb-for-headshot',
  'https://magic-headshot.com/blog/how-to-prepare-a4-photo-print',
  'https://magic-headshot.com/fr/photo-tools/resize-image-to-kb',
  'https://magic-headshot.com/ja/photo-tools/id-photo-crop',
  'https://magic-headshot.com/ja/photo-tools/print-layout-builder',
  'https://magic-headshot.com/blog/compress-photo-to-kb-for-document-photo',
  'https://magic-headshot.com/de/blog/kostenloses-foto-tool-fuer-bewerbungsfotos-ohne',
  'https://magic-headshot.com/es/blog/generador-de-fotos-gratis-para-curriculum',
  'https://magic-headshot.com/fr/photo-tools/remove-background',
  'https://magic-headshot.com/blog/category/free-id-photo-tool',
  'https://magic-headshot.com/blog/category/tutorials',
  'https://magic-headshot.com/es/photo-tools/remove-background',
  'https://magic-headshot.com/de/blog/bewerbungsfoto-online-erstellen-kostenlos',
  'https://magic-headshot.com/blog/category/linkedin-profile',
  'https://magic-headshot.com/de/photo-tools/id-photo-crop',
  'https://magic-headshot.com/fr/blog/generateur-photo-profil-en-ligne',
  'https://magic-headshot.com/ja/photo-tools/resize-image',
  'https://magic-headshot.com/blog/category/publishing-checks',
  'https://magic-headshot.com/blog/category/free-tools',
  'https://magic-headshot.com/blog/category/resume-photo-tips',
  'https://magic-headshot.com/blog/category/seo-blog',
  'https://magic-headshot.com/ja/blog/category/ai-3snjij',
  'https://magic-headshot.com/ja/blog/category/ai-18ez9n',
  'https://magic-headshot.com/de/blog/category/bewerbungsfoto',
  'https://magic-headshot.com/ja/blog/category/ai-headshot-generator',
  'https://magic-headshot.com/ja/blog/category/student',
  'https://magic-headshot.com/de/blog/category/bewerbungsfotos',
  'https://magic-headshot.com/es/blog/category/foto-documento',
  'https://magic-headshot.com/fr/blog/category/ai-photo-tools',
  'https://magic-headshot.com/de/blog/category/foto-tipps',
  'https://magic-headshot.com/blog/category/wardrobe',
  'https://magic-headshot.com/blog/category/founder-headshots',
  'https://magic-headshot.com/blog/category/ai-headshot',
  'https://magic-headshot.com/de/blog/kostenloser-foto-generator-ohne-anmeldung',
  'https://magic-headshot.com/fr/photo-tools/id-photo-crop',
  'https://magic-headshot.com/blog/category/remote-teams',
  'https://magic-headshot.com/blog/category/professional-headshots',
  'https://magic-headshot.com/blog/category/likeness',
  'https://magic-headshot.com/blog/professional-headshot-for-job-application',
  'https://magic-headshot.com/blog/a4-photo-print-sheet-for-resume-photos',
  'https://magic-headshot.com/blog/compress-photo-to-kb-for-exam-application',
  'https://magic-headshot.com/blog/ai-headshot-generator-for-professional-profiles',
  'https://magic-headshot.com/ja/blog/gakusei-shomei-shashin-app-muryo',
  'https://magic-headshot.com/ja/blog/category/category-1jsojar',
  'https://magic-headshot.com/ja/blog/category/blog',
  'https://magic-headshot.com/blog/category/ai-photo-tools',
  'https://magic-headshot.com/ja/photo-tools/remove-background',
  'https://magic-headshot.com/blog/category/founder-and-consultant-profiles',
  'https://magic-headshot.com/ja/photo-tools/resize-image-to-kb',
  'https://magic-headshot.com/blog/category/resume-tips',
  'https://magic-headshot.com/de/photo-tools/resize-image',
  'https://magic-headshot.com/blog/category/document-photos',
  'https://magic-headshot.com/blog/category/platform-comparison',
  'https://magic-headshot.com/blog/category/urgent-updates',
  'https://magic-headshot.com/fr/photo-tools/background-color-tool',
  'https://magic-headshot.com/blog/category/photo-utilities',
  'https://magic-headshot.com/fr/photo-tools',
  'https://magic-headshot.com/blog/category/student-id-photos',
  'https://magic-headshot.com/es/photo-tools/print-layout-builder',
  'https://magic-headshot.com/ja/photo-tools',
  'https://magic-headshot.com/fr/photo-tools/print-layout-builder',
  'https://magic-headshot.com/ja/photo-tools/background-color-tool',
  'https://magic-headshot.com/de/blog/category/anleitung',
  'https://magic-headshot.com/blog/category/ai-vs-studio',
  'https://magic-headshot.com/photo-tools/background-color-tool',
  'https://magic-headshot.com/blog/category/resume-photo',
  'https://magic-headshot.com/blog/free-online-id-photo-maker-with-background-color-change',
  'https://magic-headshot.com/blog/compress-photo-to-kb-for-exam-photo',
  'https://magic-headshot.com/blog/category/student-resources',
  'https://magic-headshot.com/blog/free-photo-generator-for-student-id-and-resume',
  'https://magic-headshot.com/blog/category/consultant-conversion',
  'https://magic-headshot.com/es/photo-tools',
  'https://magic-headshot.com/blog/free-online-tool-to-change-background-color-on-photo',
  'https://magic-headshot.com/photo-tools/remove-background',
  'https://magic-headshot.com/blog/category/upload-quality',
  'https://magic-headshot.com/blog/compress-photo-to-kb-for-avatar',
  'https://magic-headshot.com/fr/blog/category/photo-d-identite',
  'https://magic-headshot.com/ja/blog/category/category-g4z5gi',
  'https://magic-headshot.com/blog/category/photo-utility',
  'https://magic-headshot.com/fr/blog/category/ia-et-photographie',
  'https://magic-headshot.com/fr/blog/category/ia-productivite',
  'https://magic-headshot.com/fr/photo-tools/resize-image',
  'https://magic-headshot.com/blog/compress-photo-to-kb-for-profile-picture',
  'https://magic-headshot.com/photo-tools/id-photo-crop',
  'https://magic-headshot.com/ja/blog/muryo-avatar-style-photo-generator',
  'https://magic-headshot.com/blog/category/ai-headshot-tips',
  'https://magic-headshot.com/blog/category/career-education',
  'https://magic-headshot.com/blog/category/pricing-decision',
  'https://magic-headshot.com/blog/category/company-pages',
  'https://magic-headshot.com/fr/blog/category/photo-ia',
  'https://magic-headshot.com/fr/blog/category/photo-utilitaire',
  'https://magic-headshot.com/es/blog/category/herramientas',
  'https://magic-headshot.com/es/blog/generador-fotos-online-perfiles-profesionales',
  'https://magic-headshot.com/blog/category/ai-headshot-generator',
  'https://magic-headshot.com/blog/category/job-application-photo-guide',
  'https://magic-headshot.com/blog/category/photo-editing',
  'https://magic-headshot.com/es/photo-tools/background-color-tool',
  'https://magic-headshot.com/blog/category/career-advice',
  'https://magic-headshot.com/blog/category/headshot-tips',
  'https://magic-headshot.com/blog/free-resume-photo-generator-online',
  'https://magic-headshot.com/blog/category/ai-headshot-tools',
  'https://magic-headshot.com/de/photo-tools',
  'https://magic-headshot.com/blog/category/ai-headshot-avatar',
  'https://magic-headshot.com/es/photo-tools/resize-image',
  'https://magic-headshot.com/blog/category/photo-tips',
  'https://magic-headshot.com/fr/blog/category/outils-photo',
  'https://magic-headshot.com/photo-tools/resize-image-to-kb',
  'https://magic-headshot.com/blog/free-ai-headshot-generator-for-resume',
  'https://magic-headshot.com/photo-tools/resize-image',
  'https://magic-headshot.com/blog/ai-resume-photo-generator-professional-headshot-styles',
  'https://magic-headshot.com/es/blog/generador-de-fotos-gratis-sin-registro',
  'https://magic-headshot.com/fr/blog/reduire-taille-photo-kb-cv',
  'https://magic-headshot.com/fr/contact?source=footer_contact_fr',
  'https://magic-headshot.com/blog/category/photo-tools',
  'https://magic-headshot.com/fr/blog/compresser-photo-en-kb-pour-cv',
]

const sitemapUrls = [
  'https://magic-headshot.com/sitemap.xml',
  'https://magic-headshot.com/sitemap-es.xml',
  'https://magic-headshot.com/sitemap-fr.xml',
  'https://magic-headshot.com/sitemap-de.xml',
  'https://magic-headshot.com/sitemap-ja.xml',
]

function textLength(value) {
  return Array.from((value || '').trim()).length
}

function decodeHtml(value) {
  return (value || '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function stripTags(value) {
  return decodeHtml((value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
}

function firstMatch(html, patterns) {
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match?.[1]) return decodeHtml(match[1].trim())
  }
  return ''
}

function pageType(url) {
  if (url.includes('/blog/category/')) return 'category'
  if (url.includes('/blog/')) return 'blog'
  if (url.includes('/photo-tools')) return 'photo-tool'
  return 'other'
}

function canonicalTarget(url) {
  const parsed = new URL(url)
  parsed.search = ''
  parsed.hash = ''
  return parsed.toString()
}

async function fetchText(url, method = 'GET') {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 35000)
  try {
    const response = await fetch(url, {
      method,
      redirect: 'follow',
      headers: { 'user-agent': 'Mozilla/5.0 Magic-Headshot Indexing Audit' },
      signal: controller.signal,
    })
    return { response, text: method === 'HEAD' ? '' : await response.text() }
  } finally {
    clearTimeout(timeout)
  }
}

function canonicalFromHtml(html) {
  const tag = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0]
    || html.match(/<link[^>]+href=["'][^"']*["'][^>]+rel=["']canonical["'][^>]*>/i)?.[0]
    || ''
  return tag.match(/href=["']([^"']+)["']/i)?.[1] || ''
}

function metaContent(html, name) {
  const tag = html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]*>`, 'i'))?.[0]
    || html.match(new RegExp(`<meta[^>]+content=["'][^"']*["'][^>]+name=["']${name}["'][^>]*>`, 'i'))?.[0]
    || ''
  return decodeHtml(tag.match(/content=["']([^"']*)["']/i)?.[1] || '')
}

const sitemapXml = (await Promise.all(sitemapUrls.map(async (url) => {
  try {
    return (await fetchText(url)).text
  } catch {
    return ''
  }
}))).join('\n')

async function auditUrl(url) {
  try {
    const { response, text: html } = await fetchText(url)
    const title = firstMatch(html, [/<title[^>]*>([\s\S]*?)<\/title>/i])
    const description = metaContent(html, 'description')
    const robots = metaContent(html, 'robots')
    const h1 = stripTags(firstMatch(html, [/<h1[^>]*>([\s\S]*?)<\/h1>/i]))
    const canonicalRaw = canonicalFromHtml(html)
    const canonical = canonicalRaw.startsWith('/') ? `https://magic-headshot.com${canonicalRaw}` : canonicalRaw
    const target = canonicalTarget(url)
    const bodyText = stripTags(html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' '))
    const first400 = bodyText.slice(0, 400)
    const issues = []

    if (response.status !== 200) issues.push(`HTTP ${response.status}`)
    if (!sitemapXml.includes(`<loc>${target}</loc>`)) issues.push('not in sitemap')
    if (canonical !== target) issues.push(`canonical mismatch: ${canonical || 'missing'}`)
    if (/noindex/i.test(robots)) issues.push(`noindex: ${robots}`)
    if (!title) issues.push('missing title')
    if (!description) issues.push('missing description')
    if (!h1) issues.push('missing h1')
    const descLen = textLength(description)
    if (url.includes('/ja/')) {
      if (descLen < 55 || descLen > 90) issues.push(`description length ${descLen}, expected ja 55-90`)
    } else if (descLen < 100 || descLen > 140) {
      issues.push(`description length ${descLen}, expected 100-140`)
    }
    if (pageType(url) === 'category' && bodyText.length < 2500) issues.push(`possibly thin category body: ${bodyText.length} chars`)

    return {
      url,
      type: pageType(url),
      status: response.status,
      inSitemap: sitemapXml.includes(`<loc>${target}</loc>`),
      canonical,
      canonicalSelf: canonical === target,
      robots,
      titleLength: textLength(title),
      descriptionLength: descLen,
      h1,
      issues,
      title,
      description,
      first400,
    }
  } catch (error) {
    return { url, type: pageType(url), error: error instanceof Error ? error.message : String(error) }
  }
}

const results = await Promise.all([...new Set(urls)].map(auditUrl))

const grouped = {
  total: results.length,
  ok: results.filter((item) => !item.error && item.issues.length === 0).length,
  withIssues: results.filter((item) => item.error || item.issues?.length).length,
  byType: Object.fromEntries(['blog', 'category', 'photo-tool', 'other'].map((type) => [
    type,
    results.filter((item) => item.type === type).length,
  ])),
  issueCounts: {},
}

for (const result of results) {
  for (const issue of result.issues || []) {
    const key = issue.replace(/:.*$/, '').replace(/\d+.*/, '').trim()
    grouped.issueCounts[key] = (grouped.issueCounts[key] || 0) + 1
  }
}

if (process.argv.includes('--summary')) {
  const issueRows = results
    .filter((item) => item.error || item.issues?.length)
    .map((item) => ({
      url: item.url,
      type: item.type,
      status: item.status,
      inSitemap: item.inSitemap,
      canonicalSelf: item.canonicalSelf,
      descriptionLength: item.descriptionLength,
      h1: item.h1,
      issues: item.error ? [item.error] : item.issues,
    }))

  console.log(JSON.stringify({ summary: grouped, issueRows }, null, 2))
} else {
  console.log(JSON.stringify({ summary: grouped, results }, null, 2))
}
