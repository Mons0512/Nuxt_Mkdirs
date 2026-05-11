import { supabaseAdmin } from '../supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { User } from './items';

export async function getUsers(
  supabaseAdmin: SupabaseClient,
  options: {
    page?: number;
    limit?: number;
    role?: string;
  } = {}
): Promise<{ users: User[]; total: number }> {
  const { page = 1, limit = 20, role } = options;

  let query = supabaseAdmin
    .from('users')
    .select('id, name, email, image, role, created_at', { count: 'exact' });

  if (role) {
    query = query.eq('role', role);
  }

  query = query.order('created_at', { ascending: false });

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('getUsers error:', error);
    throw error;
  }

  return { users: data || [], total: count || 0 };
}

export async function getUserById(supabase: SupabaseClient, id: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, image, role')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getUserById error:', error);
    throw error;
  }

  return data;
}

export async function getUserByEmail(supabase: SupabaseClient, email: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, image, role')
    .eq('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getUserByEmail error:', error);
    throw error;
  }

  return data;
}

export async function updateUser(
  supabaseAdmin: SupabaseClient,
  id: string,
  input: Partial<User>
): Promise<User> {
  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, name, email, image, role')
    .single();

  if (error) {
    console.error('updateUser error:', error);
    throw error;
  }

  return data;
}

export async function deleteUser(
  supabaseAdmin: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabaseAdmin.from('users').delete().eq('id', id);
  if (error) {
    console.error('deleteUser error:', error);
    throw error;
  }
}
