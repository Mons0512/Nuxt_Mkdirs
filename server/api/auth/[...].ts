import { supabase } from '../../utils/supabase';
import { setAuthCookie } from '../../utils/supabase';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const token = query.token as string;
  const type = query.type as string;

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

    if (data.session) {
      setAuthCookie(event, data.session.access_token, data.session.refresh_token);
    }

    return { success: true };
  }

  throw createError({
    statusCode: 400,
    message: 'Invalid callback type',
  });
});
