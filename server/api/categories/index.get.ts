import { supabase } from '../../utils/supabase';
import { getCategories } from '../../utils/db/categories';

export default defineEventHandler(async () => {
  try {
    const categories = await getCategories(supabase);
    return categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch categories',
    });
  }
});
