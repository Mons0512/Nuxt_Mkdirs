import { sanityClient } from '../utils/sanity';

/**
 * Unpublish an item by ID (passed in body)
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const id = body?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Item ID is required',
    });
  }

  try {
    // Update item to unpublished state
    const result = await sanityClient
      .patch(id)
      .unset(['publishDate'])
      .commit();

    return {
      success: true,
      item: result,
    };
  } catch (error) {
    console.error('Unpublish error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to unpublish item',
    });
  }
});
