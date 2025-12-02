import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const config = useRuntimeConfig();

/**
 * Sanity client for server-side data fetching
 */
export const sanityClient = createClient({
  projectId: config.public.sanityProjectId,
  dataset: config.public.sanityDataset,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: config.sanityApiToken,
});

/**
 * Image URL builder
 */
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

/**
 * Helper to fetch data from Sanity
 */
export async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  return sanityClient.fetch<T>(query, params);
}
