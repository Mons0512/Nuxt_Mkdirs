import { supabase } from '../../../utils/supabase';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const callbackUrl = (query.callbackUrl as string) || '/';

  setCookie(event, 'auth-callback-url', callbackUrl, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 10,
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${getRequestURL(event).origin}/api/auth/callback/github`,
      scopes: 'read:user user:email',
    },
  });

  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    });
  }

  return sendRedirect(event, data.url);
});
