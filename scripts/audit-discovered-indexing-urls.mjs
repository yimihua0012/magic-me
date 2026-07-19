const urls = [
  'https://magic-headshot.com/ai-headshot-linkedin',
  'https://magic-headshot.com/ai-headshot-professional-photo',
  'https://magic-headshot.com/ai-headshot-resume',
  'https://magic-headshot.com/blog/clothing',
  'https://magic-headshot.com/blog/consultants',
  'https://magic-headshot.com/blog/fast',
  'https://magic-headshot.com/blog/founders',
  'https://magic-headshot.com/blog/no-photographer',
  'https://magic-headshot.com/blog/pricing',
  'https://magic-headshot.com/blog/professional',
  'https://magic-headshot.com/blog/profile-photo',
  'https://magic-headshot.com/blog/remote-teams',
  'https://magic-headshot.com/blog/resume',
  'https://magic-headshot.com/blog/resume-linkedin',
  'https://magic-headshot.com/blog/selfies',
  'https://magic-headshot.com/blog/teams',
  'https://magic-headshot.com/blog/virtual',
  'https://magic-headshot.com/de/ai-headshot-corporate',
  'https://magic-headshot.com/de/ai-headshot-examples',
  'https://magic-headshot.com/de/ai-headshot-linkedin',
  'https://magic-headshot.com/de/ai-headshot-professional-photo',
  'https://magic-headshot.com/de/ai-headshot-resume',
  'https://magic-headshot.com/de/ai-headshot-studio-style',
  'https://magic-headshot.com/de/blog/headshot-pro-bewerbungsfoto-ki',
  'https://magic-headshot.com/de/blog/ki-bewerbungsfoto-erstellen',
  'https://magic-headshot.com/de/blog/magic-headshot-bewerbungsfoto-ki-kostenlos',
  'https://magic-headshot.com/de/blog/magic-headshot-ki-avatar-headshot-styles',
  'https://magic-headshot.com/de/contact',
  'https://magic-headshot.com/de/landing',
  'https://magic-headshot.com/de/sample',
  'https://magic-headshot.com/es/ai-headshot-resume',
  'https://magic-headshot.com/es/blog/foto-carnet-profesional-ai',
  'https://magic-headshot.com/es/blog/foto-para-curriculum-ai-gratis',
  'https://magic-headshot.com/es/contact',
  'https://magic-headshot.com/es/landing',
  'https://magic-headshot.com/es/sample',
  'https://magic-headshot.com/fr/ai-headshot-resume',
  'https://magic-headshot.com/fr/ai-headshot-studio-style',
  'https://magic-headshot.com/fr/blog/photo-d-identite-en-ligne-gratuit-outil',
  'https://magic-headshot.com/fr/blog/photo-d-identite-pour-passeport-en-ligne-gratuit',
  'https://magic-headshot.com/fr/blog/photo-identite-fond-blanc-gratuit-en-ligne',
  'https://magic-headshot.com/fr/blog/photo-identite-ia-gratuite',
  'https://magic-headshot.com/fr/contact',
  'https://magic-headshot.com/fr/landing',
  'https://magic-headshot.com/fr/questions',
  'https://magic-headshot.com/fr/sample',
  'https://magic-headshot.com/free-id-photo-tool',
  'https://magic-headshot.com/ja/ai-headshot-resume',
  'https://magic-headshot.com/ja/ai-headshot-studio-style',
  'https://magic-headshot.com/ja/blog',
  'https://magic-headshot.com/ja/contact',
  'https://magic-headshot.com/ja/landing',
  'https://magic-headshot.com/ja/refund',
  'https://magic-headshot.com/ja/sample',
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
  if (url.includes('/photo-tools') || url.includes('/free-id-photo-tool')) return 'photo-tool'
  if (url.includes('/ai-headshot')) return 'use-case'
  return 'other'
}

function canonicalTarget(url) {
  const parsed = new URL(url)
  parsed.search = ''
  parsed.hash = ''
  return parsed.toString()
}

async function fetchText(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      headers: { 'user-agent': 'Mozilla/5.0 Magic-Headshot Discovered Indexing Audit' },
      signal: controller.signal,
    })
    return { response, text: await response.text() }
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
    const descLen = textLength(description)
    const issues = []

    if (response.status !== 200) issues.push(`HTTP ${response.status}`)
    if (!sitemapXml.includes(`<loc>${target}</loc>`)) issues.push('not in sitemap')
    if (canonical !== target) issues.push(`canonical mismatch: ${canonical || 'missing'}`)
    if (/noindex/i.test(robots)) issues.push(`noindex: ${robots}`)
    if (!title) issues.push('missing title')
    if (!description) issues.push('missing description')
    if (!h1) issues.push('missing h1')
    if (url.includes('/ja/')) {
      if (descLen < 55 || descLen > 90) issues.push(`description length ${descLen}, expected ja 55-90`)
    } else if (descLen < 100 || descLen > 140) {
      issues.push(`description length ${descLen}, expected 100-140`)
    }
    if ((pageType(url) === 'blog' || pageType(url) === 'use-case') && bodyText.length < 3200) issues.push(`possibly thin body: ${bodyText.length} chars`)

    return {
      url,
      type: pageType(url),
      status: response.status,
      finalUrl: response.url,
      inSitemap: sitemapXml.includes(`<loc>${target}</loc>`),
      canonical,
      canonicalSelf: canonical === target,
      titleLength: textLength(title),
      descriptionLength: descLen,
      h1,
      bodyLength: bodyText.length,
      issues,
      title,
      description,
    }
  } catch (error) {
    return { url, type: pageType(url), error: error instanceof Error ? error.message : String(error) }
  }
}

const results = await Promise.all([...new Set(urls)].map(auditUrl))
const summary = {
  total: results.length,
  ok: results.filter((item) => !item.error && item.issues.length === 0).length,
  withIssues: results.filter((item) => item.error || item.issues?.length).length,
  byType: Object.fromEntries(['blog', 'category', 'photo-tool', 'use-case', 'other'].map((type) => [
    type,
    results.filter((item) => item.type === type).length,
  ])),
  issueCounts: {},
}

for (const result of results) {
  for (const issue of result.issues || []) {
    const key = issue.replace(/:.*$/, '').replace(/\d+.*/, '').trim()
    summary.issueCounts[key] = (summary.issueCounts[key] || 0) + 1
  }
}

console.log(JSON.stringify({
  summary,
  issueRows: results
    .filter((item) => item.error || item.issues?.length)
    .map(({ url, type, status, finalUrl, inSitemap, canonicalSelf, descriptionLength, h1, bodyLength, issues, error }) => ({
      url,
      type,
      status,
      finalUrl,
      inSitemap,
      canonicalSelf,
      descriptionLength,
      h1,
      bodyLength,
      issues: error ? [error] : issues,
    })),
}, null, 2))
