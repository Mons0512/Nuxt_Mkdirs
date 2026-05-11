import { supabaseAdmin } from '../../../../utils/supabase'
import { getCurrentUser } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'sb-access-token')
  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const { user, error } = await getCurrentUser(token)
  if (error || !user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20

  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, count, error: dbError } = await supabaseAdmin
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (dbError) {
    throw createError({ statusCode: 500, message: 'Failed to fetch blog posts' })
  }

  return {
    posts: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit)
  }
})
