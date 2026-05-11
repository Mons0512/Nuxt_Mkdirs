import { supabaseAdmin } from '../../../utils/supabase'
import { getCurrentUser } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'sb-access-token')
  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const { user, error } = await getCurrentUser(token)
  if (error || !user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }

  try {
    const [
      itemsCount,
      categoriesCount,
      tagsCount,
      collectionsCount,
      groupsCount,
      usersCount,
      ordersCount,
      subscribersCount,
      blogPostsCount,
      recentItems,
      pendingItems
    ] = await Promise.all([
      supabaseAdmin.from('items').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('categories').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('tags').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('collections').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('groups').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('subscribers').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('blog_posts').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('items').select('*').order('created_at', { ascending: false }).limit(5),
      supabaseAdmin.from('items').select('*').is('publish_date', null).limit(5)
    ])

    return {
      stats: {
        items: itemsCount.count || 0,
        categories: categoriesCount.count || 0,
        tags: tagsCount.count || 0,
        collections: collectionsCount.count || 0,
        groups: groupsCount.count || 0,
        users: usersCount.count || 0,
        orders: ordersCount.count || 0,
        subscribers: subscribersCount.count || 0,
        blogPosts: blogPostsCount.count || 0
      },
      recentItems: recentItems.data || [],
      pendingItems: pendingItems.data || []
    }
  } catch (dbError) {
    console.error('Dashboard stats error:', dbError)
    throw createError({ statusCode: 500, message: 'Failed to fetch dashboard stats' })
  }
})
