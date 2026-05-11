import { supabaseAdmin } from '../supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Collection } from './items';

export async function getCollections(supabase: SupabaseClient): Promise<Collection[]> {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('priority', { ascending: false });

  if (error) {
    console.error('getCollections error:', error);
    throw error;
  }

  return data || [];
}

export async function getCollectionBySlug(supabase: SupabaseClient, slug: string): Promise<Collection | null> {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getCollectionBySlug error:', error);
    throw error;
  }

  return data;
}

export async function getCollectionById(supabase: SupabaseClient, id: string): Promise<Collection | null> {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getCollectionById error:', error);
    throw error;
  }

  return data;
}

export async function createCollection(supabaseAdmin: SupabaseClient, input: Partial<Collection>): Promise<Collection> {
  const { data, error } = await supabaseAdmin
    .from('collections')
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error('createCollection error:', error);
    throw error;
  }

  return data;
}

export async function updateCollection(supabaseAdmin: SupabaseClient, id: string, input: Partial<Collection>): Promise<Collection> {
  const { data, error } = await supabaseAdmin
    .from('collections')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updateCollection error:', error);
    throw error;
  }

  return data;
}

export async function deleteCollection(supabaseAdmin: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabaseAdmin.from('collections').delete().eq('id', id);
  if (error) {
    console.error('deleteCollection error:', error);
    throw error;
  }
}
