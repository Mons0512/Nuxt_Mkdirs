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
      free_plan_status: 'pending',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('Submit to review error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to submit to review',
    });
  }

  return {
    success: true,
    message: 'Successfully submitted to review',
  };
});
