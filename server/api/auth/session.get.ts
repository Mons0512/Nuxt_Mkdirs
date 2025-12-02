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
    
    // Fetch fresh user data from Sanity to ensure it's up to date
    const user = await getUserById(sessionData.id);
    
    if (!user) {
      // User no longer exists, clear session
      deleteCookie(event, 'auth-token');
      return { user: null };
    }

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      },
    };
  } catch (error) {
    // Invalid token, clear it
    deleteCookie(event, 'auth-token');
    return { user: null };
  }
});
