import { NextResponse } from 'next/server'
import { isAdminEmail } from '@/lib/admin'
import { getCurrentUser } from '@/lib/auth/server'
import { getAdminBlogPostById } from '@/lib/blog-store'

export const dynamic = 'force-dynamic'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: RouteContext) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  if (!isAdminEmail(user.email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const post = await getAdminBlogPostById(id)

  if (!post) {
    return NextResponse.json({ error: 'Blog post not found.' }, { status: 404 })
  }

  return NextResponse.json({ post })
}
