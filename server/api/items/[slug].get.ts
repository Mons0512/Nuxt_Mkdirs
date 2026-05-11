import { supabase } from '../../utils/supabase';
import { getItemBySlug } from '../../utils/db/items';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required',
    });
  }

  try {
    const item = await getItemBySlug(supabase, slug);

    if (!item) {
      throw createError({
        statusCode: 404,
        message: 'Item not found',
      });
    }

    return item;
  } catch (error: any) {
    if (error.statusCode === 404) {
      throw error;
    }
    console.error('Error fetching item:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch item',
    });
  }
});
