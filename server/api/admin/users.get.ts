/**
 * Get all registered users (Admin only)
 * For development/debugging purposes
 */
export default defineEventHandler(async (event) => {
  // TODO: Add admin authentication check
  // const session = await getSession(event);
  // if (session?.user?.role !== 'ADMIN') {
  //   throw createError({ statusCode: 403, message: 'Forbidden' });
  // }

  try {
    const query = `*[_type == "user"] | order(_createdAt desc) {
      _id,
      _createdAt,
      name,
      email,
      role,
      emailVerified,
      image
    }`;

    const users = await sanityFetch<any[]>(query);

    return {
      total: users?.length || 0,
      users: users || [],
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch users',
    });
  }
});
