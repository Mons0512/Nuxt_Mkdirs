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

  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const keyword = (query.keyword as string) || '';
  const featured = query.featured as string;
  const status = (query.status as string) || '';

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let dbQuery = supabaseAdmin
    .from('items')
    .select('*', { count: 'exact' });

  if (keyword) {
    dbQuery = dbQuery.or(`name.ilike.%${keyword}%,slug.ilike.%${keyword}%,description.ilike.%${keyword}%`);
  }

  if (featured === 'true') {
    dbQuery = dbQuery.eq('featured', true);
  } else if (featured === 'false') {
    dbQuery = dbQuery.eq('featured', false);
  }

  if (status === 'pending') {
    // 筛选待审核的项目 (free_plan_status = 'pending' 且没有 publish_date)
    dbQuery = dbQuery.or(`free_plan_status.eq.pending,pro_plan_status.eq.pending,sponsor_plan_status.eq.pending`);
  } else if (status === 'approved') {
    dbQuery = dbQuery.not('publish_date', 'is', null);
  } else if (status === 'rejected') {
    dbQuery = dbQuery.or(`free_plan_status.eq.rejected,pro_plan_status.eq.rejected,sponsor_plan_status.eq.rejected`);
  }

  const { data, count, error: dbError } = await dbQuery
    .order('created_at', { ascending: false })
    .range(from, to);

  if (dbError) {
    throw createError({ statusCode: 500, message: 'Failed to fetch items' });
  }

  return {
    items: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
});
