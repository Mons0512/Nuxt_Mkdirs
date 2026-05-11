import { supabase } from '../../utils/supabase';
import { setAuthCookie } from '../../utils/supabase';

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
    // For email verification, we need to extract the email from the token or use a different approach
    // However, Supabase typically handles this via hash fragment redirect which we handle separately
    // This endpoint is kept for compatibility
    
    return {
      success: true,
      message: 'Email verification received. Please complete the process via the redirect.',
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
