import { supabaseAdmin } from '../../../utils/supabase';
import { getCurrentUser } from '../../../utils/auth';

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'sb-access-token');
  if (!token) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const { user, error } = await getCurrentUser(token);
  if (error || !user || user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, message: 'Forbidden' });
  }

  const body = await readBody(event);
  const { data, error: dbError } = await supabaseAdmin
    .from('collections')
    .insert(body)
    .select()
    .single();

  if (dbError) {
    throw createError({ statusCode: 500, message: 'Failed to create collection' });
  }

  return data;
});
