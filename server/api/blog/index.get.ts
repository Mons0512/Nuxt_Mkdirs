import { supabase } from '../../utils/supabase';
import { getBlogPosts } from '../../utils/db/blog-posts';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 6;
  const category = query.category as string | undefined;

  try {
    const { posts, total } = await getBlogPosts(supabase, {
      page,
      limit,
      category,
    });

    return {
      posts: posts || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch blog posts',
    });
  }
});
