import { supabase } from '../../utils/supabase';
import { getBlogPostBySlug } from '../../utils/db/blog-posts';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required',
    });
  }

  try {
    const post = await getBlogPostBySlug(supabase, slug);

    if (!post) {
      throw createError({
        statusCode: 404,
        message: 'Blog post not found',
      });
    }

    return post;
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error('Error fetching blog post:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch blog post',
    });
  }
});
