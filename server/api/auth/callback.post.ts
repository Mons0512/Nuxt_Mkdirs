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

      // Upsert user to database if not exists
      if (data.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (!profile) {
          await supabase.from('users').upsert({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
            role: 'USER',
            email_verified: data.user.email_confirmed_at ? new Date().toISOString() : null,
          });
        } else {
          // Update email_verified status
          await supabase.from('users').update({
            email_verified: data.user.email_confirmed_at ? new Date().toISOString() : null,
          }).eq('id', data.user.id);
        }
      }

      return {
        success: true,
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
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
