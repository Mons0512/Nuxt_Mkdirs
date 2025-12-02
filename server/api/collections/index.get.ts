/**
 * Get collections list from Sanity
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;

  try {
    // Count query
    const countQuery = `count(*[_type == "collection" && defined(slug.current)])`;
    const total = await sanityFetch<number>(countQuery);

    // Data query
    const start = (page - 1) * limit;
    const end = start + limit;
    const dataQuery = `*[_type == "collection" && defined(slug.current)] 
      | order(priority desc, _createdAt desc) [${start}...${end}] {
        _id,
        _createdAt,
        name,
        slug,
        description,
        image {
          ...,
          "blurDataURL": asset->metadata.lqip,
        },
        "itemCount": count(*[_type == "item" && references(^._id)])
      }`;

    const collections = await sanityFetch<any[]>(dataQuery);

    return {
      collections: collections || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch collections',
    });
  }
});
