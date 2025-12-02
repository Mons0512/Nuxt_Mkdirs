/**
 * Get latest blog posts from Sanity
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const count = Number(query.count) || 6;

  try {
    const groqQuery = `*[_type == "blogPost" && defined(slug.current) && defined(publishDate)] 
      | order(publishDate desc) [0...$count] {
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

    const posts = await sanityFetch<any[]>(groqQuery, { count });
    return posts || [];
  } catch (error) {
    console.error('Error fetching latest blog posts:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch latest blog posts',
    });
  }
});
