import { supabaseAdmin } from '../supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Category, Group } from './items';

export async function getCategories(supabase: SupabaseClient): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('priority', { ascending: false });

  if (error) {
    console.error('getCategories error:', error);
    throw error;
  }

  return data || [];
}

export async function getCategoryBySlug(supabase: SupabaseClient, slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getCategoryBySlug error:', error);
    throw error;
  }

  return data;
}

export async function getCategoryById(supabase: SupabaseClient, id: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getCategoryById error:', error);
    throw error;
  }

  return data;
}

export async function getCategoriesByGroup(supabase: SupabaseClient, groupId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('group_id', groupId)
    .order('priority', { ascending: false });

  if (error) {
    console.error('getCategoriesByGroup error:', error);
    throw error;
  }

  return data || [];
}

export async function createCategory(supabaseAdmin: SupabaseClient, input: Partial<Category>): Promise<Category> {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error('createCategory error:', error);
    throw error;
  }

  return data;
}

export async function updateCategory(supabaseAdmin: SupabaseClient, id: string, input: Partial<Category>): Promise<Category> {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updateCategory error:', error);
    throw error;
  }

  return data;
}

export async function deleteCategory(supabaseAdmin: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
  if (error) {
    console.error('deleteCategory error:', error);
    throw error;
  }
}

export async function getGroups(supabase: SupabaseClient): Promise<Group[]> {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .order('priority', { ascending: false });

  if (error) {
    console.error('getGroups error:', error);
    throw error;
  }

  return data || [];
}

export async function getGroupBySlug(supabase: SupabaseClient, slug: string): Promise<Group | null> {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getGroupBySlug error:', error);
    throw error;
  }

  return data;
}

export async function getGroupById(supabase: SupabaseClient, id: string): Promise<Group | null> {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getGroupById error:', error);
    throw error;
  }

  return data;
}

export async function createGroup(supabaseAdmin: SupabaseClient, input: Partial<Group>): Promise<Group> {
  const { data, error } = await supabaseAdmin
    .from('groups')
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error('createGroup error:', error);
    throw error;
  }

  return data;
}

export async function updateGroup(supabaseAdmin: SupabaseClient, id: string, input: Partial<Group>): Promise<Group> {
  const { data, error } = await supabaseAdmin
    .from('groups')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updateGroup error:', error);
    throw error;
  }

  return data;
}

export async function deleteGroup(supabaseAdmin: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabaseAdmin.from('groups').delete().eq('id', id);
  if (error) {
    console.error('deleteGroup error:', error);
    throw error;
  }
}

export async function getGroupsWithCategories(supabase: SupabaseClient): Promise<(Group & { categories: Category[] })[]> {
  const groups = await getGroups(supabase);
  const result = await Promise.all(
    groups.map(async (group) => {
      const categories = await getCategoriesByGroup(supabase, group.id);
      return { ...group, categories };
    })
  );
  return result;
}
