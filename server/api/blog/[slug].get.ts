/**
 * Get single blog post by slug
 */
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required',
    });
  }

  try {
    // Get blog post with full details
    const postQuery = `*[_type == "blogPost" && slug.current == $slug][0] {
      _id,
      _createdAt,
      title,
      slug,
      excerpt,
      body,
      featured,
      image {
        ...,
        alt,
        "blurDataURL": asset->metadata.lqip,
      },
      publishDate,
      author->{
        _id,
        name,
        link,
        image {
          ...,
          "blurDataURL": asset->metadata.lqip,
        }
      },
      categories[]->{
        _id,
        name,
        slug
      },
      "relatedPosts": *[_type == "blogPost" && slug.current != $slug && defined(publishDate)] | order(publishDate desc) [0...3] {
        _id,
        _createdAt,
        title,
        slug,
        excerpt,
        image {
          ...,
          "blurDataURL": asset->metadata.lqip,
        },
        publishDate,
        author->,
        categories[]->,
      }
    }`;

    const post = await sanityFetch<any>(postQuery, { slug });

    if (!post) {
      throw createError({
        statusCode: 404,
        message: 'Blog post not found',
      });
    }

    return post;
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error('Error fetching blog post:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch blog post',
    });
  }
});
