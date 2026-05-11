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

    return {
      user: {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || user.user_metadata?.full_name,
        image: user.user_metadata?.avatar_url,
        role: (user.user_metadata?.role as 'USER' | 'ADMIN') || 'USER',
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
    // Update user metadata instead of database
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          ...profile,
        },
      }
    );

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
    // Get current user
    const { data: { user }, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (getUserError || !user) {
      console.error('updateUserRole: user not found:', getUserError);
      return false;
    }

    // Update role in user metadata
    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        user_metadata: {
          ...user.user_metadata,
          role: role,
        },
      }
    );

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

export async function getUsers(options: {
  page?: number;
  limit?: number;
  role?: string;
} = {}): Promise<{ users: UserWithRole[]; total: number }> {
  const { page = 1, limit = 20, role } = options;
  
  try {
    // List all users from Supabase Auth
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) {
      console.error('getUsers error:', error);
      return { users: [], total: 0 };
    }

    // Transform users and filter by role if needed
    let transformedUsers: UserWithRole[] = users.map(user => ({
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.user_metadata?.full_name,
      image: user.user_metadata?.avatar_url,
      role: (user.user_metadata?.role as 'USER' | 'ADMIN') || 'USER',
    }));

    if (role) {
      transformedUsers = transformedUsers.filter(u => u.role === role);
    }

    // Pagination
    const total = transformedUsers.length;
    const start = (page - 1) * limit;
    const paginatedUsers = transformedUsers.slice(start, start + limit);

    return { users: paginatedUsers, total };
  } catch (error) {
    console.error('getUsers error:', error);
    return { users: [], total: 0 };
  }
}

export async function getUserById(userId: string): Promise<UserWithRole | null> {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.user_metadata?.full_name,
      image: user.user_metadata?.avatar_url,
      role: (user.user_metadata?.role as 'USER' | 'ADMIN') || 'USER',
    };
  } catch (error) {
    console.error('getUserById error:', error);
    return null;
  }
}

export function isAdmin(user: UserWithRole | null): boolean {
  return user?.role === 'ADMIN';
}
