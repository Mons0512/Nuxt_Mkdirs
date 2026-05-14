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

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, message: 'Blog post ID is required' })
  }

  const { data: postData, error: postError } = await supabaseAdmin
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (postError) {
    throw createError({ statusCode: 404, message: 'Blog post not found' })
  }

  const { data: categoriesData, error: categoriesError } = await supabaseAdmin
    .from('blog_post_categories')
    .select('blog_category_id')
    .eq('blog_post_id', id)

  const category_ids = categoriesData?.map(c => c.blog_category_id) || []

  return {
    ...postData,
    category_ids
  }
})
