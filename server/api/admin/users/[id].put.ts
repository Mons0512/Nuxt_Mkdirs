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

  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, message: 'User ID is required' });
  }

  const body = await readBody(event);
  const { data, error: dbError } = await supabaseAdmin
    .from('users')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, name, email, image, role')
    .single();

  if (dbError) {
    throw createError({ statusCode: 500, message: 'Failed to update user' });
  }

  return data;
});
