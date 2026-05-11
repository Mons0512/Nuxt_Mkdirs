import { supabaseAdmin } from '../supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Tag } from './items';

export async function getTags(supabase: SupabaseClient): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('slug', { ascending: true });

  if (error) {
    console.error('getTags error:', error);
    throw error;
  }

  return data || [];
}

export async function getTagBySlug(supabase: SupabaseClient, slug: string): Promise<Tag | null> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getTagBySlug error:', error);
    throw error;
  }

  return data;
}

export async function getTagById(supabase: SupabaseClient, id: string): Promise<Tag | null> {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getTagById error:', error);
    throw error;
  }

  return data;
}

export async function createTag(supabaseAdmin: SupabaseClient, input: Partial<Tag>): Promise<Tag> {
  const { data, error } = await supabaseAdmin
    .from('tags')
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error('createTag error:', error);
    throw error;
  }

  return data;
}

export async function updateTag(supabaseAdmin: SupabaseClient, id: string, input: Partial<Tag>): Promise<Tag> {
  const { data, error } = await supabaseAdmin
    .from('tags')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updateTag error:', error);
    throw error;
  }

  return data;
}

export async function deleteTag(supabaseAdmin: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabaseAdmin.from('tags').delete().eq('id', id);
  if (error) {
    console.error('deleteTag error:', error);
    throw error;
  }
}
