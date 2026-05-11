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
    const { data: profile } = await supabase
      .from('users')
      .select('name, image, role')
      .eq('id', data.user.id)
      .single();

    if (!profile) {
      await supabase.from('users').upsert({
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.user_metadata?.full_name,
        image: data.user.user_metadata?.avatar_url,
        role: 'USER',
        provider: 'google',
        provider_id: data.user.user_metadata?.sub,
      });
    }
  }

  return sendRedirect(event, callbackUrl);
});
