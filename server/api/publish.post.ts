/**
 * Publish an item by ID (passed in body)
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
    // Update item to published state
    const result = await sanityClient
      .patch(id)
      .set({
        publishDate: new Date().toISOString(),
        freePlanStatus: 'approved',
      })
      .commit();

    return {
      success: true,
      item: result,
    };
  } catch (error) {
    console.error('Publish error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to publish item',
    });
  }
});
