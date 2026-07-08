import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@backend/config/supabase'
import { revalidateBlogPaths } from '@/lib/blog-revalidate'
import { type Locale } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

type DraftBlogPost = {
  id: string
  locale: Locale
  slug: string
  title: string
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date().toISOString()
    const { data: draft, error: draftError } = await supabaseAdmin
      .from('blog_posts')
      .select('id,locale,slug,title')
      .eq('status', 'draft')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (draftError) {
      console.error('[Blog Auto Publish] Could not load draft:', draftError)
      return NextResponse.json({ error: 'Could not load draft blog post.' }, { status: 500 })
    }

    if (!draft) {
      return NextResponse.json({ success: true, published: false, message: 'No draft blog posts to publish.' })
    }

    const draftPost = draft as DraftBlogPost
    const { data: publishedPost, error: publishError } = await supabaseAdmin
      .from('blog_posts')
      .update({
        status: 'published',
        published_at: now,
        auto_published: true,
      })
      .eq('id', draftPost.id)
      .eq('status', 'draft')
      .select('id,locale,slug,title,published_at,auto_published')
      .single()

    if (publishError) {
      console.error('[Blog Auto Publish] Could not publish draft:', publishError)
      return NextResponse.json({ error: 'Could not publish draft blog post.' }, { status: 500 })
    }

    revalidateBlogPaths(draftPost.locale, draftPost.slug)

    return NextResponse.json({
      success: true,
      published: true,
      post: publishedPost,
    })
  } catch (error) {
    console.error('[Blog Auto Publish] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
