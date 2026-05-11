import { supabase } from '../../utils/supabase';
import { getCollections } from '../../utils/db/collections';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;

  try {
    const collections = await getCollections(supabase);
    return {
      collections: collections || [],
      pagination: {
        page,
        limit,
        total: collections.length,
        totalPages: Math.ceil(collections.length / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch collections',
    });
  }
});
