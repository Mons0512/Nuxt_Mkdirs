import { supabase } from '../../utils/supabase';
import { getSponsorItems } from '../../utils/db/items';

export default defineEventHandler(async (event) => {
  try {
    const items = await getSponsorItems(supabase);
    return items || [];
  } catch (error) {
    console.error('Error fetching sponsor items:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch sponsor items',
    });
  }
});
