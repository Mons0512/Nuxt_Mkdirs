import { supabase } from '../../utils/supabase';
import { getItems } from '../../utils/db/items';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;
  const category = query.category as string | undefined;
  const tag = query.tag as string | undefined;
  const sort = query.sort as string | undefined;
  const filter = query.f as string | undefined;
  const searchQuery = query.q as string | undefined;
  const dateFrom = query.dateFrom as string | undefined;
  const dateTo = query.dateTo as string | undefined;

  try {
    const { items, total } = await getItems(supabase, {
      page,
      limit,
      category,
      tag,
      sort,
      search: searchQuery,
      dateFrom,
      dateTo,
      filter,
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching items:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch items',
    });
  }
});
