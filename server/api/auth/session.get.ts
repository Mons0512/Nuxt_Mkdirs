import { getUserByIdWithAccounts } from '../../utils/data/user';

/**
 * Session API - Get current user session
 * Validates session and fetches fresh user data from Sanity
 */
export default defineEventHandler(async (event) => {
  const sessionToken = getCookie(event, 'auth-token');
  
  if (!sessionToken) {
    return { user: null };
  }

  try {
    // Decode the session token (base64 encoded JSON)
    const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString('utf-8'));
    
    // Fetch fresh user data from Sanity (with accounts to check OAuth status)
    const user = await getUserByIdWithAccounts(sessionData.id);
    
    if (!user) {
      // User no longer exists, clear session
      deleteCookie(event, 'auth-token');
      return { user: null };
    }

    // Check if user is OAuth (has accounts linked)
    const isOAuth = user.accounts && user.accounts.length > 0;

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        link: user.link,
        isOAuth,
      },
    };
  } catch (error) {
    // Invalid token, clear it
    deleteCookie(event, 'auth-token');
    return { user: null };
  }
});
