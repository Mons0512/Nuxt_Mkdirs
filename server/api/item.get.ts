import { supabase } from '../utils/supabase';
import { getItemById } from '../utils/db/items';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id as string;

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Item ID is required',
    });
  }

  try {
    const item = await getItemById(supabase, id);

    if (!item) {
      throw createError({
        statusCode: 404,
        message: 'Item not found',
      });
    }

    return item;
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error('Error fetching item by ID:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch item',
    });
  }
});
