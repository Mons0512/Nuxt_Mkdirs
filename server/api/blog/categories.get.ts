/**
 * Get blog categories from Sanity
 */
export default defineEventHandler(async () => {
  try {
    const query = `*[_type == "blogCategory" && defined(slug.current)] | order(name asc) {
      _id,
      name,
      slug,
      description
    }`;

    const categories = await sanityFetch<any[]>(query);
    return categories || [];
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch blog categories',
    });
  }
});
