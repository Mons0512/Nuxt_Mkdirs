import { supabase } from '../../utils/supabase';
import { getGroupsWithCategories } from '../../utils/db/categories';

export default defineEventHandler(async () => {
  try {
    const groups = await getGroupsWithCategories(supabase);
    return groups || [];
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch groups',
    });
  }
});
