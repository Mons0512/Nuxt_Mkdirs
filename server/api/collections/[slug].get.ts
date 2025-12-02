/**
 * Get single collection by slug with its items
 */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const query = getQuery(event);
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 12;

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required',
    });
  }

  try {
    // Get collection
    const collectionQuery = `*[_type == "collection" && slug.current == $slug][0] {
      _id,
      _createdAt,
      name,
      slug,
      description,
      image {
        ...,
        "blurDataURL": asset->metadata.lqip,
      }
    }`;

    const collection = await sanityFetch<any>(collectionQuery, { slug });

    if (!collection) {
      throw createError({
        statusCode: 404,
        message: 'Collection not found',
      });
    }

    // Count items in collection
    const countQuery = `count(*[_type == "item" && defined(slug.current) 
      && forceHidden != true && sponsor != true
      && references($collectionId)])`;
    const total = await sanityFetch<number>(countQuery, { collectionId: collection._id });

    // Get items in collection
    const start = (page - 1) * limit;
    const end = start + limit;
    const itemsQuery = `*[_type == "item" && defined(slug.current) 
      && forceHidden != true && sponsor != true
      && references($collectionId)] 
      | order(coalesce(featured, false) desc, _createdAt desc) [${start}...${end}] {
        _id,
        _createdAt,
        name,
        slug,
        description,
        link,
        featured,
        icon {
          ...,
          "blurDataURL": asset->metadata.lqip,
        },
        image {
          ...,
          "blurDataURL": asset->metadata.lqip,
        },
        categories[]->,
        tags[]->,
      }`;

    const items = await sanityFetch<any[]>(itemsQuery, { collectionId: collection._id });

    return {
      collection,
      items: items || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error('Error fetching collection:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch collection',
    });
  }
});
