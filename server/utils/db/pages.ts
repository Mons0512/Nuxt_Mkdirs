import { supabaseAdmin } from '../supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface Page {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  publish_date: string | null;
  created_at: string;
  updated_at: string;
}

export async function getPages(supabase: SupabaseClient): Promise<Page[]> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .not('publish_date', 'is', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getPages error:', error);
    throw error;
  }

  return data || [];
}

export async function getPageBySlug(supabase: SupabaseClient, slug: string): Promise<Page | null> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .not('publish_date', 'is', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getPageBySlug error:', error);
    throw error;
  }

  return data;
}

export async function getPageById(supabase: SupabaseClient, id: string): Promise<Page | null> {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getPageById error:', error);
    throw error;
  }

  return data;
}

export async function createPage(
  supabaseAdmin: SupabaseClient,
  input: Partial<Page>
): Promise<Page> {
  const { data, error } = await supabaseAdmin
    .from('pages')
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error('createPage error:', error);
    throw error;
  }

  return data;
}

export async function updatePage(
  supabaseAdmin: SupabaseClient,
  id: string,
  input: Partial<Page>
): Promise<Page> {
  const { data, error } = await supabaseAdmin
    .from('pages')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updatePage error:', error);
    throw error;
  }

  return data;
}

export async function deletePage(
  supabaseAdmin: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabaseAdmin.from('pages').delete().eq('id', id);
  if (error) {
    console.error('deletePage error:', error);
    throw error;
  }
}
