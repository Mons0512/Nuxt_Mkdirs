import { supabaseAdmin } from '../supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface Subscriber {
  id: string;
  email: string;
  status: 'active' | 'unsubscribed' | 'bounced';
  source: string;
  subscribed_at: string;
  unsubscribed_at: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export async function subscribe(
  supabase: SupabaseClient,
  email: string,
  source: string = 'website',
  metadata?: Record<string, any>
): Promise<Subscriber> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('subscribers')
    .upsert({
      email,
      status: 'active',
      source,
      subscribed_at: now,
      metadata,
      updated_at: now,
    }, {
      onConflict: 'email',
    })
    .select()
    .single();

  if (error) {
    console.error('subscribe error:', error);
    throw error;
  }

  return data;
}

export async function unsubscribe(
  supabaseAdmin: SupabaseClient,
  email: string
): Promise<void> {
  const now = new Date().toISOString();

  const { error } = await supabaseAdmin
    .from('subscribers')
    .update({
      status: 'unsubscribed',
      unsubscribed_at: now,
      updated_at: now,
    })
    .eq('email', email);

  if (error) {
    console.error('unsubscribe error:', error);
    throw error;
  }
}

export async function getSubscribers(
  supabaseAdmin: SupabaseClient,
  options: {
    page?: number;
    limit?: number;
    status?: 'active' | 'unsubscribed' | 'bounced';
  } = {}
): Promise<{ subscribers: Subscriber[]; total: number }> {
  const { page = 1, limit = 20, status } = options;

  let query = supabaseAdmin
    .from('subscribers')
    .select('*', { count: 'exact' });

  if (status) {
    query = query.eq('status', status);
  }

  query = query.order('subscribed_at', { ascending: false });

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('getSubscribers error:', error);
    throw error;
  }

  return { subscribers: data || [], total: count || 0 };
}

export async function getSubscriberByEmail(
  supabase: SupabaseClient,
  email: string
): Promise<Subscriber | null> {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getSubscriberByEmail error:', error);
    throw error;
  }

  return data;
}
