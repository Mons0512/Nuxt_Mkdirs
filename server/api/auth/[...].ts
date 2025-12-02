/**
 * Session API - Get current user session
 * This replaces the Auth.js catch-all handler with a simpler session endpoint
 */
export default defineEventHandler(async (event) => {
  const sessionToken = getCookie(event, 'auth-token');
  
  if (!sessionToken) {
    return { user: null };
  }

  try {
    // Decode the session token (base64 encoded JSON)
    const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString('utf-8'));
    return { user: sessionData };
  } catch (error) {
    // Invalid token, clear it
    deleteCookie(event, 'auth-token');
    return { user: null };
  }
});
