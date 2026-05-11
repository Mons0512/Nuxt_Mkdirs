/**
 * Global middleware to handle Supabase auth callbacks
 * Detects auth codes in URL and processes them
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Check for auth callback parameters
  const code = to.query.code as string;
  const error = to.query.error as string;
  const errorDescription = to.query.error_description as string;

  // If there's an error in the URL, log it but don't process
  if (error) {
    console.error('Auth callback error:', error, errorDescription);
    return;
  }

  // If there's a code, we need to process it
  if (code) {
    // Only process on client side
    if (process.client) {
      try {
        // Call the auth callback API to exchange the code for a session
        const response = await $fetch('/api/auth/callback', {
          method: 'POST',
          body: { code },
        });

        if (response.success) {
          // Refresh the auth session
          const auth = useAuth();
          await auth.fetchSession();

          // Remove auth parameters from URL by redirecting to the same path without query params
          const newPath = to.path;
          return navigateTo(newPath, { replace: true });
        }
      } catch (err: any) {
        console.error('Failed to process auth callback:', err);
      }
    }
  }
});
