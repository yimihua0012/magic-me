import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.')
  process.exit(1)
}

const locale = process.argv[2] || 'en'
const supabase = createClient(supabaseUrl, serviceRoleKey)

const { data, error } = await supabase
  .from('blog_posts')
  .select('slug, title, category, status, published_at')
  .eq('status', 'published')
  .eq('locale', locale)
  .order('published_at', { ascending: false, nullsFirst: false })

if (error) {
  console.error(`Could not read blog_posts: ${error.message}`)
  process.exit(1)
}

const posts = (data || []).filter((row) => typeof row?.slug === 'string')

const categoryCounts = new Map()
for (const post of posts) {
  const category = post.category || '(uncategorized)'
  categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1)
}

const lines = [
  `# ${locale} blog post slugs for seo-index-policy.ts`,
  `# ${posts.length} published posts, ${categoryCounts.size} categories`,
  '',
  '## Categories',
  ...[...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => `- ${category} (${count})`),
  '',
  '## Posts',
  ...posts.map((post) => `- slug: ${post.slug}${post.category ? ` | category: ${post.category}` : ''} | title: ${post.title}`),
  '',
]

const outPath = join(process.cwd(), 'reports', `blog-slugs-${locale}-dump.md`)
writeFileSync(outPath, lines.join('\n'), 'utf8')
console.log(`Wrote ${posts.length} posts to ${outPath}`)
console.log('Copy the weak slugs into demotedBlogPostSlugs in src/lib/seo-index-policy.ts.')