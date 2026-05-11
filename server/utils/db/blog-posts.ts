import { supabaseAdmin } from '../supabase';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { User } from './items';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured: boolean;
  body: string | null;
  image_url: string | null;
  image_alt: string | null;
  publish_date: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPostWithRelations extends BlogPost {
  categories: BlogCategory[];
  related_posts?: BlogPost[];
  author?: User;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priority: number;
  created_at: string;
  updated_at: string;
}

export async function getBlogPosts(
  supabase: SupabaseClient,
  options: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
  } = {}
): Promise<{ posts: BlogPostWithRelations[]; total: number }> {
  const { page = 1, limit = 12 } = options;

  let query = supabase
    .from('blog_posts')
    .select('*', { count: 'exact' })
    .not('publish_date', 'is', null);

  if (options.featured !== undefined) {
    query = query.eq('featured', options.featured);
  }

  query = query.order('publish_date', { ascending: false });

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('getBlogPosts error:', error);
    throw error;
  }

  const postsWithRelations = await Promise.all(
    (data || []).map(async (post) => {
      const [categories, author] = await Promise.all([
        getBlogPostCategories(supabase, post.id),
        post.author_id ? getBlogPostAuthor(supabase, post.author_id) : Promise.resolve(null),
      ]);
      return { ...post, categories, author };
    })
  );

  return { posts: postsWithRelations, total: count || 0 };
}

export async function getBlogPostBySlug(supabase: SupabaseClient, slug: string): Promise<BlogPostWithRelations | null> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .not('publish_date', 'is', null)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getBlogPostBySlug error:', error);
    throw error;
  }

  const [categories, author] = await Promise.all([
    getBlogPostCategories(supabase, data.id),
    data.author_id ? getBlogPostAuthor(supabase, data.author_id) : Promise.resolve(null),
  ]);

  return { ...data, categories, author };
}

export async function getLatestBlogPosts(supabase: SupabaseClient, count: number = 5): Promise<BlogPostWithRelations[]> {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .not('publish_date', 'is', null)
    .order('publish_date', { ascending: false })
    .limit(count);

  if (error) {
    console.error('getLatestBlogPosts error:', error);
    throw error;
  }

  return data || [];
}

export async function createBlogPost(supabaseAdmin: SupabaseClient, input: Partial<BlogPost> & { category_ids?: string[] }): Promise<BlogPost> {
  const { category_ids, ...postData } = input;

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .insert(postData)
    .select()
    .single();

  if (error) {
    console.error('createBlogPost error:', error);
    throw error;
  }

  if (category_ids?.length) {
    await supabaseAdmin.from('blog_post_categories').insert(
      category_ids.map(cid => ({ blog_post_id: data.id, blog_category_id: cid }))
    );
  }

  return data;
}

export async function updateBlogPost(
  supabaseAdmin: SupabaseClient,
  id: string,
  input: Partial<BlogPost> & { category_ids?: string[] }
): Promise<BlogPost> {
  const { category_ids, ...postData } = input;

  const { data, error } = await supabaseAdmin
    .from('blog_posts')
    .update({ ...postData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updateBlogPost error:', error);
    throw error;
  }

  if (category_ids !== undefined) {
    await supabaseAdmin.from('blog_post_categories').delete().eq('blog_post_id', id);
    if (category_ids.length) {
      await supabaseAdmin.from('blog_post_categories').insert(
        category_ids.map(cid => ({ blog_post_id: id, blog_category_id: cid }))
      );
    }
  }

  return data;
}

export async function deleteBlogPost(supabaseAdmin: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id);
  if (error) {
    console.error('deleteBlogPost error:', error);
    throw error;
  }
}

async function getBlogPostCategories(supabase: SupabaseClient, postId: string): Promise<BlogCategory[]> {
  const { data, error } = await supabase
    .from('blog_post_categories')
    .select('blog_categories(*)')
    .eq('blog_post_id', postId);

  if (error) {
    console.error('getBlogPostCategories error:', error);
    return [];
  }

  return data?.map(d => d.blog_categories).filter(Boolean) || [];
}

async function getBlogPostAuthor(supabase: SupabaseClient, authorId: string): Promise<User | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, image, role')
    .eq('id', authorId)
    .single();

  if (error) {
    console.error('getBlogPostAuthor error:', error);
    return null;
  }

  return data;
}

export async function getBlogCategories(supabase: SupabaseClient): Promise<BlogCategory[]> {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .order('priority', { ascending: false });

  if (error) {
    console.error('getBlogCategories error:', error);
    throw error;
  }

  return data || [];
}

export async function getBlogCategoryBySlug(supabase: SupabaseClient, slug: string): Promise<BlogCategory | null> {
  const { data, error } = await supabase
    .from('blog_categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getBlogCategoryBySlug error:', error);
    throw error;
  }

  return data;
}

export async function createBlogCategory(supabaseAdmin: SupabaseClient, input: Partial<BlogCategory>): Promise<BlogCategory> {
  const { data, error } = await supabaseAdmin
    .from('blog_categories')
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error('createBlogCategory error:', error);
    throw error;
  }

  return data;
}

export async function updateBlogCategory(
  supabaseAdmin: SupabaseClient,
  id: string,
  input: Partial<BlogCategory>
): Promise<BlogCategory> {
  const { data, error } = await supabaseAdmin
    .from('blog_categories')
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updateBlogCategory error:', error);
    throw error;
  }

  return data;
}

export async function deleteBlogCategory(supabaseAdmin: SupabaseClient, id: string): Promise<void> {
  const { error } = await supabaseAdmin.from('blog_categories').delete().eq('id', id);
  if (error) {
    console.error('deleteBlogCategory error:', error);
    throw error;
  }
}
