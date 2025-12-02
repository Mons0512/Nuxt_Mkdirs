/**
 * Get groups list with categories from Sanity
 */
export default defineEventHandler(async () => {
  try {
    const query = `*[_type == "group"] | order(priority desc, _createdAt asc) {
      _id,
      name,
      slug,
      priority,
      "categories": *[_type == 'category' && references(^._id)] | order(priority desc, _createdAt asc) { 
        _id,
        name,
        slug,
        priority,
      }
    }`;

    const groups = await sanityFetch<any[]>(query);
    return groups;
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch groups',
    });
  }
});
