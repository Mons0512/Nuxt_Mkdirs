/**
 * Authentication composable
 * Provides auth state and methods for the client
 */

export interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
  role?: 'USER' | 'ADMIN';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const user = useState<User | null>('auth-user', () => null);
  const isLoading = useState<boolean>('auth-loading', () => true);

  const isAuthenticated = computed(() => !!user.value);

  /**
   * Fetch current session
   */
  async function fetchSession() {
    isLoading.value = true;
    try {
      const response = await $fetch<{ user: User | null }>('/api/auth/session');
      user.value = response?.user || null;
    } catch (error) {
      user.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Login with credentials
   */
  async function login(email: string, password: string) {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    await fetchSession();
    return response;
  }

  /**
   * Register a new user
   */
  async function register(name: string, email: string, password: string) {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { name, email, password },
    });
    return response;
  }

  /**
   * Sign in with OAuth provider
   */
  function signInWithProvider(provider: 'google' | 'github') {
    const callbackUrl = window.location.origin;
    window.location.href = `/api/auth/signin/${provider}?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  }

  /**
   * Sign out
   */
  async function signOut() {
    await $fetch('/api/auth/signout', { method: 'POST' });
    user.value = null;
    navigateTo('/');
  }

  // Fetch session on mount
  onMounted(() => {
    fetchSession();
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    signInWithProvider,
    signOut,
    fetchSession,
  };
}
