/**
 * Get all categories from Sanity
 */
export default defineEventHandler(async () => {
  try {
    const query = `*[_type == "category" && defined(slug.current)] 
      | order(priority desc) {
        _id,
        name,
        slug,
        description,
        icon,
        priority
      }`;

    const categories = await sanityFetch<any[]>(query);

    return categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch categories',
    });
  }
});
