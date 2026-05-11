import { supabase } from '../../utils/supabase';
import { getLatestBlogPosts } from '../../utils/db/blog-posts';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const count = Number(query.count) || 6;

  try {
    const posts = await getLatestBlogPosts(supabase, count);
    return posts || [];
  } catch (error) {
    console.error('Error fetching latest blog posts:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch latest blog posts',
    });
  }
});
