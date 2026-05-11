import { supabase } from '../../utils/supabase';
import { setAuthCookie } from '../../utils/supabase';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const code = body.code as string;

  if (!code) {
    throw createError({
      statusCode: 400,
      message: 'Authorization code is required',
    });
  }

  try {
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      throw createError({
        statusCode: 400,
        message: error.message,
      });
    }

    if (data.session) {
      // Set the auth cookies
      setAuthCookie(event, data.session.access_token, data.session.refresh_token);

      // Ensure role is set in user metadata
      if (data.user && !data.user.user_metadata?.role) {
        await supabase.auth.updateUser({
          data: {
            ...data.user.user_metadata,
            role: 'USER',
          },
        });
      }

      return {
        success: true,
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
        } : null,
      };
    }

    throw createError({
      statusCode: 400,
      message: 'No session returned from Supabase',
    });
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error('Auth callback error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to process authentication callback',
    });
  }
});
