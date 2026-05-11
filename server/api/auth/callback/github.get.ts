import { supabase } from '../../../utils/supabase';
import { setAuthCookie } from '../../../utils/supabase';

export default defineEventHandler(async (event) => {
  const code = getQuery(event).code as string;
  const callbackUrl = getCookie(event, 'auth-callback-url') || '/';

  deleteCookie(event, 'auth-callback-url');

  if (!code) {
    throw createError({
      statusCode: 400,
      message: 'No authorization code provided',
    });
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }

  if (data.session) {
    setAuthCookie(event, data.session.access_token, data.session.refresh_token);
  }

  if (data.user) {
    // Ensure role is set in user metadata
    if (!data.user.user_metadata?.role) {
      await supabase.auth.updateUser({
        data: {
          ...data.user.user_metadata,
          role: 'USER',
          provider: 'github',
        },
      });
    }
  }

  return sendRedirect(event, callbackUrl);
});
