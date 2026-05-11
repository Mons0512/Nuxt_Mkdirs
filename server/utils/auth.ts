import { supabaseAdmin, supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

export interface UserWithRole {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthResult {
  user: UserWithRole | null;
  error: string | null;
}

export async function getCurrentUser(token: string): Promise<AuthResult> {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      return { user: null, error: error?.message || 'Invalid token' };
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('name, image, role')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Profile fetch error:', profileError);
    }

    return {
      user: {
        id: user.id,
        email: user.email || '',
        name: profile?.name || user.user_metadata?.name || user.user_metadata?.full_name,
        image: profile?.image || user.user_metadata?.avatar_url,
        role: (profile?.role as 'USER' | 'ADMIN') || 'USER',
      },
      error: null,
    };
  } catch (error) {
    console.error('getCurrentUser error:', error);
    return { user: null, error: 'Failed to get user' };
  }
}

export async function upsertUserProfile(
  userId: string,
  profile: {
    name?: string;
    image?: string;
    role?: string;
    email?: string;
  }
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .upsert({
        id: userId,
        email: profile.email,
        name: profile.name,
        image: profile.image,
        role: profile.role || 'USER',
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id',
      });

    if (error) {
      console.error('upsertUserProfile error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('upsertUserProfile error:', error);
    return false;
  }
}

export async function updateUserRole(userId: string, role: 'USER' | 'ADMIN'): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('updateUserRole error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('updateUserRole error:', error);
    return false;
  }
}

export function isAdmin(user: UserWithRole | null): boolean {
  return user?.role === 'ADMIN';
}
