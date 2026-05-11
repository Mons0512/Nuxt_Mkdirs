import { supabase } from '../../utils/supabase';
import { getTags } from '../../utils/db/tags';

export default defineEventHandler(async () => {
  try {
    const tags = await getTags(supabase);
    return tags || [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch tags',
    });
  }
});
