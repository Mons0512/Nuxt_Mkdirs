/**
 * Sign out - Clear session cookie
 */
export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-token', {
    path: '/',
  });

  return { success: true };
});
