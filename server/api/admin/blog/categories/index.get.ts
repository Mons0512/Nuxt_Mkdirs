import { supabaseAdmin } from '../../../../utils/supabase'
import { getCurrentUser } from '../../../../utils/auth'
import { getBlogCategories } from '../../../../utils/db/blog-posts'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'sb-access-token')
  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const { user, error } = await getCurrentUser(token)
  if (error || !user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  const categories = await getBlogCategories(supabaseAdmin)
  return categories
})
