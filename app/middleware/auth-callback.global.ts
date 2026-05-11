/**
 * Global middleware to handle Supabase auth callbacks
 * Detects auth codes and hash fragment tokens in URL and processes them
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Check for auth callback parameters
  const code = to.query.code as string;
  const error = to.query.error as string;
  const errorDescription = to.query.error_description as string;

  // Only process on client side
  if (!process.client) {
    return;
  }

  // If there's an error in the URL, show user-friendly message
  if (error) {
    console.error('Auth callback error:', error, errorDescription);
    
    // Clean URL first
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Store error message to display (could use a toast or state)
    const authError = useState<string>('auth-error', () => '');
    authError.value = errorDescription || error || 'Authentication failed. Please try again.';
    
    return;
  }

  // Process OAuth code flow
  if (code) {
    try {
      const response = await $fetch('/api/auth/callback', {
        method: 'POST',
        body: { code },
      });

      if (response.success) {
        const auth = useAuth();
        await auth.fetchSession();
        return navigateTo(to.path, { replace: true });
      }
    } catch (err: any) {
      console.error('Failed to process auth callback:', err);
      
      // Clean URL
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
      // Show error
      const authError = useState<string>('auth-error', () => '');
      authError.value = err.data?.message || 'Authentication failed. Please try again.';
    }
  }

  // Process hash fragment tokens (email verification flow)
  if (typeof window !== 'undefined') {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      try {
        // Parse hash fragment parameters
        const hashParams = new URLSearchParams(hash.slice(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        const expiresIn = hashParams.get('expires_in');

        if (accessToken && refreshToken) {
          // Send tokens to server to set cookies
          const response = await $fetch('/api/auth/callback/hash', {
            method: 'POST',
            body: { 
              access_token: accessToken, 
              refresh_token: refreshToken,
              type 
            },
          });

          if (response.success) {
            // Refresh auth state
            const auth = useAuth();
            await auth.fetchSession();
            
            // Clean URL - remove hash fragment
            window.history.replaceState({}, document.title, window.location.pathname);
            return navigateTo(to.path, { replace: true });
          }
        }
      } catch (err: any) {
        console.error('Failed to process hash token callback:', err);
        
        // Clean URL regardless of error
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Check if it's a token expiration error
        const errorMessage = err.data?.message || err.message || '';
        const isExpired = errorMessage.toLowerCase().includes('expired') || 
                         errorMessage.toLowerCase().includes('invalid');
        
        // Show user-friendly error
        const authError = useState<string>('auth-error', () => '');
        if (isExpired) {
          authError.value = 'Verification link has expired. Please request a new verification email.';
        } else {
          authError.value = 'Verification failed. Please try again or request a new verification email.';
        }
      }
    }
  }
});
