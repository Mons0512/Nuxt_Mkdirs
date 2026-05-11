import { supabase } from '../../../utils/supabase';
import { setAuthCookie } from '../../../utils/supabase';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const accessToken = body.access_token as string;
  const refreshToken = body.refresh_token as string;
  const type = body.type as string;

  if (!accessToken || !refreshToken) {
    throw createError({
      statusCode: 400,
      message: 'Access token and refresh token are required',
    });
  }

  try {
    // First, verify the access token is valid
    const { data: { user }, error: getUserError } = await supabase.auth.getUser(accessToken);
    
    if (getUserError || !user) {
      // Provide more specific error message
      const errorMsg = getUserError?.message || 'Invalid access token';
      throw createError({
        statusCode: 401,
        message: errorMsg,
      });
    }

    // Set the auth cookies
    setAuthCookie(event, accessToken, refreshToken);

    // Ensure role is set in user metadata
    if (!user.user_metadata?.role) {
      await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          role: 'USER',
        },
      });
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0],
      },
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error('Hash token callback error:', error);
    
    // Check if it's a Supabase Auth error (token expired etc.)
    const errorMessage = error?.message || 'Failed to process authentication callback';
    throw createError({
      statusCode: error?.status || 500,
      message: errorMessage,
    });
  }
});
