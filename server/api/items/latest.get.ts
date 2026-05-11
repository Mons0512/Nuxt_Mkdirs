import { supabase } from '../../utils/supabase';
import { getLatestItems } from '../../utils/db/items';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const count = Number(query.count) || 6;

  try {
    const items = await getLatestItems(supabase, count);
    return items || [];
  } catch (error) {
    console.error('Error fetching latest items:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch latest items',
    });
  }
});
