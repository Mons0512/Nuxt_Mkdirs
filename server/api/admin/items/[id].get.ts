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
    throw createError({ statusCode: 400, message: 'Item ID is required' });
  }

  const { data, error: dbError } = await supabaseAdmin
    .from('items')
    .select('*')
    .eq('id', id)
    .single();

  if (dbError) {
    throw createError({ statusCode: 404, message: 'Item not found' });
  }

  return data;
});
