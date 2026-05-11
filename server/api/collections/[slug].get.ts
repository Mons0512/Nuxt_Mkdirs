import { supabase } from '../../utils/supabase';
import { getCollectionBySlug } from '../../utils/db/collections';
import { getItems } from '../../utils/db/items';

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required',
    });
  }

  try {
    const collection = await getCollectionBySlug(supabase, slug);

    if (!collection) {
      throw createError({
        statusCode: 404,
        message: 'Collection not found',
      });
    }

    const { items, total } = await getItems(supabase, {
      page,
      limit,
    });

    return {
      collection,
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error('Error fetching collection:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch collection',
    });
  }
});
