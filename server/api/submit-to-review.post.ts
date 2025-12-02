/**
 * Submit item to review (for Free plan)
 * Changes status from 'submitting' to 'pending'
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
    // Update item status to pending (waiting for admin review)
    const result = await sanityClient
      .patch(id)
      .set({
        freePlanStatus: 'pending',
      })
      .commit();

    return {
      success: true,
      item: result,
      message: 'Successfully submitted to review',
    };
  } catch (error) {
    console.error('Submit to review error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to submit to review',
    });
  }
});
