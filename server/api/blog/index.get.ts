/**
 * Get blog posts list from Sanity
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 6;
  const category = query.category as string | undefined;

  try {
    // Build query
    let baseQuery = `*[_type == "blogPost" && defined(slug.current) && defined(publishDate)`;
    const params: Record<string, any> = {};

    if (category) {
      baseQuery += ` && $category in categories[]->slug.current`;
      params.category = category;
    }

    baseQuery += `]`;

    // Count query
    const countQuery = baseQuery.replace('*[', 'count(*[') + ')';
    const total = await sanityFetch<number>(countQuery, params);

    // Data query
    const start = (page - 1) * limit;
    const end = start + limit;
    const dataQuery = `${baseQuery} | order(publishDate desc) [${start}...${end}] {
      _id,
      _createdAt,
      title,
      slug,
      excerpt,
      featured,
      image {
        ...,
        "blurDataURL": asset->metadata.lqip,
      },
      publishDate,
      author->,
      categories[]->,
    }`;

    const posts = await sanityFetch<any[]>(dataQuery, params);

    return {
      posts: posts || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch blog posts',
    });
  }
});
