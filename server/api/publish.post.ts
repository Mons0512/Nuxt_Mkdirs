import { supabaseAdmin } from '../utils/supabase';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Item ID is required',
    });
  }

  const { error } = await supabaseAdmin
    .from('items')
    .update({
      publish_date: new Date().toISOString(),
      free_plan_status: 'approved',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Publish error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to publish item',
    });
  }

  return {
    success: true,
  };
});
