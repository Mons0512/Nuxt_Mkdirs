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

  const { data: itemData, error: itemError } = await supabaseAdmin
    .from('items')
    .select('*')
    .eq('id', id)
    .single();

  if (itemError) {
    throw createError({ statusCode: 404, message: 'Item not found' });
  }

  // 获取关联的分类ID
  const { data: categoriesData } = await supabaseAdmin
    .from('item_categories')
    .select('category_id')
    .eq('item_id', id);
  
  const category_ids = categoriesData?.map(c => c.category_id) || [];

  // 获取关联的标签ID
  const { data: tagsData } = await supabaseAdmin
    .from('item_tags')
    .select('tag_id')
    .eq('item_id', id);
  
  const tag_ids = tagsData?.map(t => t.tag_id) || [];

  // 获取关联的合集ID
  const { data: collectionsData } = await supabaseAdmin
    .from('item_collections')
    .select('collection_id')
    .eq('item_id', id);
  
  const collection_ids = collectionsData?.map(c => c.collection_id) || [];

  return {
    ...itemData,
    category_ids,
    tag_ids,
    collection_ids
  };
});
