import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { H3Event } from 'h3';

const config = useRuntimeConfig();

export const supabase: SupabaseClient = createClient(
  config.public.supabaseUrl,
  config.public.supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: true,
    },
  }
);

export const supabaseAdmin: SupabaseClient = createClient(
  config.public.supabaseUrl,
  config.supabaseServiceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function getSupabaseWithAuth(event: H3Event): Promise<SupabaseClient> {
  const token = getCookie(event, 'sb-access-token');
  if (!token) {
    return supabase;
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return supabase;
  }

  return supabase;
}

export function setAuthCookie(event: H3Event, accessToken: string, refreshToken?: string) {
  setCookie(event, 'sb-access-token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  if (refreshToken) {
    setCookie(event, 'sb-refresh-token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  }
}

export function clearAuthCookies(event: H3Event) {
  deleteCookie(event, 'sb-access-token', { path: '/' });
  deleteCookie(event, 'sb-refresh-token', { path: '/' });
}
