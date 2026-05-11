import { supabase } from '../../utils/supabase';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const token = query.token as string;
  const type = query.type as string || 'signup';

  if (!token) {
    throw createError({
      statusCode: 400,
      message: 'Token is required',
    });
  }

  if (type === 'signup') {
    const { data, error } = await supabase.auth.verifyOtp({
      type: 'email_change',
      token,
    });

    if (error) {
      throw createError({
        statusCode: 400,
        message: error.message,
      });
    }

    return {
      success: true,
      message: 'Email verified successfully',
    };
  }

  if (type === 'recovery') {
    return {
      success: true,
      message: 'Token verified. You can now reset your password.',
    };
  }

  throw createError({
    statusCode: 400,
    message: 'Invalid verification type',
  });
});
