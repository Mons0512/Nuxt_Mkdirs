/**
 * Get single category by slug with its items
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
    // Get category
    const categoryQuery = `*[_type == "category" && slug.current == $slug][0] {
      _id,
      _createdAt,
      name,
      slug,
      description,
      icon {
        ...,
        "blurDataURL": asset->metadata.lqip,
      }
    }`;

    const category = await sanityFetch<any>(categoryQuery, { slug });

    if (!category) {
      throw createError({
        statusCode: 404,
        message: 'Category not found',
      });
    }

    // Count items in category
    const countQuery = `count(*[_type == "item" && defined(slug.current) 
      && forceHidden != true && sponsor != true
      && $slug in categories[]->slug.current])`;
    const total = await sanityFetch<number>(countQuery, { slug });

    // Get items in category
    const start = (page - 1) * limit;
    const end = start + limit;
    const itemsQuery = `*[_type == "item" && defined(slug.current) 
      && forceHidden != true && sponsor != true
      && $slug in categories[]->slug.current] 
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

    const items = await sanityFetch<any[]>(itemsQuery, { slug });

    return {
      category,
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
    console.error('Error fetching category:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch category',
    });
  }
});
