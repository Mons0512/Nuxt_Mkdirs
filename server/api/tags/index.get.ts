/**
 * Get all tags from Sanity
 */
export default defineEventHandler(async () => {
  try {
    const query = `*[_type == "tag" && defined(slug.current)] 
      | order(slug.current asc) {
        _id,
        name,
        slug
      }`;

    const tags = await sanityFetch<any[]>(query);

    return tags || [];
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch tags',
    });
  }
});
