/**
 * Get single item by ID (passed as query parameter)
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = query.id as string;

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Item ID is required',
    });
  }

  try {
    const groqQuery = `*[_type == "item" && _id == $id][0] {
      _id,
      _createdAt,
      name,
      slug,
      description,
      introduction,
      link,
      featured,
      pricePlan,
      freePlanStatus,
      proPlanStatus,
      sponsorPlanStatus,
      publishDate,
      icon {
        ...,
        "blurDataURL": asset->metadata.lqip,
      },
      image {
        ...,
        "blurDataURL": asset->metadata.lqip,
      },
      categories[]->{
        _id,
        name,
        slug
      },
      tags[]->{
        _id,
        name,
        slug
      },
      submitter->{
        _id,
        name,
        email
      }
    }`;

    const item = await sanityFetch<any>(groqQuery, { id });

    if (!item) {
      throw createError({
        statusCode: 404,
        message: 'Item not found',
      });
    }

    return item;
  } catch (error: any) {
    if (error.statusCode) throw error;
    console.error('Error fetching item by ID:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch item',
    });
  }
});
