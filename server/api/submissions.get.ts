import { supabase } from '../utils/supabase';
import { getUserSubmissions } from '../utils/db/items';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'sb-access-token');

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid session',
    });
  }

  const query = getQuery(event);
  const page = Number(query.page) || 1;

  try {
    const { submissions, total } = await getUserSubmissions(supabase, user.id, page);

    return {
      submissions,
      totalCount: total,
      totalPages: Math.ceil(total / 10),
      currentPage: page,
    };
  } catch (error) {
    console.error('submissions fetch error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch submissions',
    });
  }
});
