/**
 * Get latest items from Sanity
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const count = Number(query.count) || 6;

  try {
    const groqQuery = `*[_type == "item" && defined(slug.current) 
      && defined(publishDate)
      && forceHidden != true
      && sponsor != true] 
      | order(_createdAt desc) [0...$count] {
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

    const items = await sanityFetch<any[]>(groqQuery, { count });
    return items || [];
  } catch (error) {
    console.error('Error fetching latest items:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch latest items',
    });
  }
});
