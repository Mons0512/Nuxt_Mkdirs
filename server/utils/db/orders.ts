import { supabaseAdmin } from '../supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface Order {
  id: string;
  user_id: string;
  item_id: string;
  status: 'success' | 'failed';
  payment_provider: string | null;
  payment_id: string | null;
  amount: number | null;
  currency: string | null;
  created_at: string;
  updated_at: string;
}

export async function createOrder(
  supabaseAdmin: SupabaseClient,
  input: Partial<Order>
): Promise<Order> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert(input)
    .select()
    .single();

  if (error) {
    console.error('createOrder error:', error);
    throw error;
  }

  return data;
}

export async function getOrderById(
  supabaseAdmin: SupabaseClient,
  id: string
): Promise<Order | null> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('getOrderById error:', error);
    throw error;
  }

  return data;
}

export async function getUserOrders(
  supabase: SupabaseClient,
  userId: string
): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getUserOrders error:', error);
    throw error;
  }

  return data || [];
}

export async function updateOrderStatus(
  supabaseAdmin: SupabaseClient,
  id: string,
  status: 'success' | 'failed'
): Promise<Order> {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('updateOrderStatus error:', error);
    throw error;
  }

  return data;
}
