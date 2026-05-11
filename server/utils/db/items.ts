import { supabaseAdmin } from '../supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface Item {
  id: string;
  name: string;
  slug: string;
  link: string | null;
  affiliate_link: string | null;
  description: string | null;
  introduction: string | null;
  image_url: string | null;
  image_alt: string | null;
  icon_url: string | null;
  icon_alt: string | null;
  featured: boolean;
  sponsor: boolean;
  sponsor_start_date: string | null;
  sponsor_end_date: string | null;
  publish_date: string | null;
  price_plan: 'free' | 'pro' | 'sponsor';
  free_plan_status: 'submitting' | 'pending' | 'approved' | 'rejected' | null;
  pro_plan_status: 'submitting' | 'pending' | 'success' | 'failed' | null;
  sponsor_plan_status: 'submitting' | 'pending' | 'success' | 'failed' | null;
  rejection_reason: string | null;
  paid: boolean;
  force_hidden: boolean;
  note: string | null;
  submitter_id: string | null;
  order_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ItemWithRelations extends Item {
  categories: Category[];
  tags: Tag[];
  collections: Collection[];
  submitter?: User;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  group_id: string | null;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  icon_alt: string | null;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priority: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: 'USER' | 'ADMIN';
}

export interface CreateItemInput {
  name: string;
  slug: string;
  link?: string;
  affiliate_link?: string;
  description?: string;
  introduction?: string;
  image_url?: string;
  image_alt?: string;
  icon_url?: string;
  icon_alt?: string;
  featured?: boolean;
  sponsor?: boolean;
  sponsor_start_date?: string;
  sponsor_end_date?: string;
  publish_date?: string;
  price_plan?: 'free' | 'pro' | 'sponsor';
  free_plan_status?: 'submitting' | 'pending' | 'approved' | 'rejected';
  pro_plan_status?: 'submitting' | 'pending' | 'success' | 'failed';
  sponsor_plan_status?: 'submitting' | 'pending' | 'success' | 'failed';
  rejection_reason?: string;
  paid?: boolean;
  force_hidden?: boolean;
  note?: string;
  submitter_id?: string;
  category_ids?: string[];
  tag_ids?: string[];
  collection_ids?: string[];
}

export interface UpdateItemInput extends Partial<CreateItemInput> {
  id: string;
}

export async function getItems(
  supabase: SupabaseClient,
  options: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    featured?: boolean;
    sort?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    filter?: string;
  } = {}
): Promise<{ items: ItemWithRelations[]; total: number }> {
  const { page = 1, limit = 12 } = options;

  let query = supabase
    .from('items')
    .select('*', { count: 'exact' })
    .is('force_hidden', false)
    .not('publish_date', 'is', null);

  if (options.featured !== undefined) {
    query = query.eq('featured', options.featured);
  }

  if (options.category) {
    const { data: categoryData } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', options.category)
      .single();

    if (categoryData) {
      const { data: itemIds } = await supabase
        .from('item_categories')
        .select('item_id')
        .eq('category_id', categoryData.id);

      if (itemIds && itemIds.length > 0) {
        query = query.in('id', itemIds.map(i => i.item_id));
      } else {
        query = query.in('id', ['00000000-0000-0000-0000-000000000000']);
      }
    }
  }

  if (options.search) {
    query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`);
  }

  if (options.dateFrom) {
    query = query.gte('publish_date', options.dateFrom);
  }

  if (options.dateTo) {
    query = query.lte('publish_date', options.dateTo);
  }

  if (options.filter) {
    switch (options.filter) {
      case 'featured':
        query = query.eq('featured', true);
        break;
      case 'free':
        query = query.eq('price_plan', 'free');
        break;
      case 'paid':
        query = query.in('price_plan', ['pro', 'sponsor']);
        break;
    }
  }

  switch (options.sort) {
    case 'time-asc':
      query = query.order('created_at', { ascending: true });
      break;
    case 'name-asc':
      query = query.order('name', { ascending: true });
      break;
    case 'name-desc':
      query = query.order('name', { ascending: false });
      break;
    default:
      query = query.order('featured', { ascending: false }).order('publish_date', { ascending: false });
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('getItems error:', error);
    throw error;
  }

  const itemsWithRelations = await Promise.all(
    (data || []).map(async (item) => {
      const [categories, tags, collections] = await Promise.all([
        getItemCategories(supabase, item.id),
        getItemTags(supabase, item.id),
        getItemCollections(supabase, item.id),
      ]);
      return { ...item, categories, tags, collections };
    })
  );

  return { items: itemsWithRelations, total: count || 0 };
}

export async function getItemBySlug(supabase: SupabaseClient, slug: string): Promise<ItemWithRelations | null> {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('slug', slug)
    .not('publish_date', 'is', null)
    .is('force_hidden', false)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getItemBySlug error:', error);
    throw error;
  }

  const [categories, tags, collections] = await Promise.all([
    getItemCategories(supabase, data.id),
    getItemTags(supabase, data.id),
    getItemCollections(supabase, data.id),
  ]);

  return { ...data, categories, tags, collections };
}

export async function getItemById(supabase: SupabaseClient, id: string): Promise<ItemWithRelations | null> {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getItemById error:', error);
    throw error;
  }

  const [categories, tags, collections] = await Promise.all([
    getItemCategories(supabase, data.id),
    getItemTags(supabase, data.id),
    getItemCollections(supabase, data.id),
  ]);

  return { ...data, categories, tags, collections };
}

export async function getFeaturedItems(supabase: SupabaseClient, count: number = 10): Promise<ItemWithRelations[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('featured', true)
    .not('publish_date', 'is', null)
    .is('force_hidden', false)
    .order('publish_date', { ascending: false })
    .limit(count);

  if (error) {
    console.error('getFeaturedItems error:', error);
    throw error;
  }

  return data || [];
}

export async function getLatestItems(supabase: SupabaseClient, count: number = 10): Promise<ItemWithRelations[]> {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .not('publish_date', 'is', null)
    .is('force_hidden', false)
    .order('publish_date', { ascending: false })
    .limit(count);

  if (error) {
    console.error('getLatestItems error:', error);
    throw error;
  }

  return data || [];
}

export async function getSponsorItems(supabase: SupabaseClient): Promise<ItemWithRelations[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('sponsor', true)
    .not('publish_date', 'is', null)
    .is('force_hidden', false)
    .lte('sponsor_start_date', now)
    .gte('sponsor_end_date', now)
    .order('featured', { ascending: false })
    .order('publish_date', { ascending: false });

  if (error) {
    console.error('getSponsorItems error:', error);
    throw error;
  }

  return data || [];
}

export async function createItem(supabase: SupabaseClient, input: CreateItemInput): Promise<Item> {
  const { category_ids, tag_ids, collection_ids, ...itemData } = input;

  const { data, error } = await supabase
    .from('items')
    .insert(itemData)
    .select()
    .single();

  if (error) {
    console.error('createItem error:', error);
    throw error;
  }

  if (category_ids?.length) {
    await supabase.from('item_categories').insert(
      category_ids.map(cid => ({ item_id: data.id, category_id: cid }))
    );
  }

  if (tag_ids?.length) {
    await supabase.from('item_tags').insert(
      tag_ids.map(tid => ({ item_id: data.id, tag_id: tid }))
    );
  }

  if (collection_ids?.length) {
    await supabase.from('item_collections').insert(
      collection_ids.map(cid => ({ item_id: data.id, collection_id: cid }))
    );
  }

  return data;
}

export async function updateItem(supabase: SupabaseClient, input: UpdateItemInput): Promise<Item> {
  const { id, category_ids, tag_ids, collection_ids, ...itemData } = input;

  const { data, error } = await supabase
    .from('items')
    .update({ ...itemData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updateItem error:', error);
    throw error;
  }

  if (category_ids !== undefined) {
    await supabase.from('item_categories').delete().eq('item_id', id);
    if (category_ids.length) {
      await supabase.from('item_categories').insert(
        category_ids.map(cid => ({ item_id: id, category_id: cid }))
      );
    }
  }

  if (tag_ids !== undefined) {
    await supabase.from('item_tags').delete().eq('item_id', id);
    if (tag_ids.length) {
      await supabase.from('item_tags').insert(
        tag_ids.map(tid => ({ item_id: id, tag_id: tid }))
      );
    }
  }

  if (collection_ids !== undefined) {
    await supabase.from('item_collections').delete().eq('item_id', id);
    if (collection_ids.length) {
      await supabase.from('item_collections').insert(
        collection_ids.map(cid => ({ item_id: id, collection_id: cid }))
      );
    }
  }

  return data;
}

export async function deleteItem(supabase: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from('items').delete().eq('id', id);
  if (error) {
    console.error('deleteItem error:', error);
    throw error;
  }
}

export async function getUserSubmissions(supabase: SupabaseClient, userId: string, page: number = 1, limit: number = 10) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabase
    .from('items')
    .select('*', { count: 'exact' })
    .eq('submitter_id', userId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('getUserSubmissions error:', error);
    throw error;
  }

  return { submissions: data || [], total: count || 0 };
}

async function getItemCategories(supabase: SupabaseClient, itemId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('item_categories')
    .select('categories(*)')
    .eq('item_id', itemId);

  if (error) {
    console.error('getItemCategories error:', error);
    return [];
  }

  return data?.map(d => d.categories).filter(Boolean) || [];
}

async function getItemTags(supabase: SupabaseClient, itemId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('item_tags')
    .select('tags(*)')
    .eq('item_id', itemId);

  if (error) {
    console.error('getItemTags error:', error);
    return [];
  }

  return data?.map(d => d.tags).filter(Boolean) || [];
}

async function getItemCollections(supabase: SupabaseClient, itemId: string): Promise<Collection[]> {
  const { data, error } = await supabase
    .from('item_collections')
    .select('collections(*)')
    .eq('item_id', itemId);

  if (error) {
    console.error('getItemCollections error:', error);
    return [];
  }

  return data?.map(d => d.collections).filter(Boolean) || [];
}
