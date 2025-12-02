/**
 * Get sponsor item from Sanity (first one)
 */
export default defineEventHandler(async () => {
  try {
    const groqQuery = `*[_type == "item" && defined(slug.current) 
      && defined(publishDate)
      && sponsor == true] 
      | order(_createdAt desc) [0] {
        _id,
        _createdAt,
        name,
        slug,
        description,
        link,
        featured,
        sponsor,
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

    const item = await sanityFetch<any>(groqQuery);
    return item || null;
  } catch (error) {
    console.error('Error fetching sponsor item:', error);
    return null;
  }
});
