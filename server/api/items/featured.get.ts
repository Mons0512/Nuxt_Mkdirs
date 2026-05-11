import { supabase } from '../../utils/supabase';
import { getFeaturedItems } from '../../utils/db/items';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const count = Number(query.count) || 6;

  try {
    const items = await getFeaturedItems(supabase, count);
    return items || [];
  } catch (error) {
    console.error('Error fetching featured items:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch featured items',
    });
  }
});
