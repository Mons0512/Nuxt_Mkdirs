import { supabase } from '../../utils/supabase';
import { getBlogCategories } from '../../utils/db/blog-posts';

export default defineEventHandler(async () => {
  try {
    const categories = await getBlogCategories(supabase);
    return categories || [];
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch blog categories',
    });
  }
});
