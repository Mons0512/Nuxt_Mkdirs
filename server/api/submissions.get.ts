import { sanityFetch } from '../utils/sanity';
import { itemSimpleFields } from '../utils/sanity-queries';

const SUBMISSIONS_PER_PAGE = 10;

/**
 * Get user submissions
 */
export default defineEventHandler(async (event) => {
  // Get current user from session
  const sessionToken = getCookie(event, 'auth-token');
  
  if (!sessionToken) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  let sessionData;
  try {
    sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString('utf-8'));
  } catch {
    throw createError({
      statusCode: 401,
      message: 'Invalid session',
    });
  }

  const userId = sessionData.id;
  const query = getQuery(event);
  const currentPage = Number(query.page) || 1;

  // Build queries
  const offsetStart = (currentPage - 1) * SUBMISSIONS_PER_PAGE;
  const offsetEnd = offsetStart + SUBMISSIONS_PER_PAGE;

  const countQuery = `count(*[_type == "item" && defined(slug.current) && submitter._ref == $userId])`;
  const dataQuery = `*[_type == "item" && defined(slug.current) && submitter._ref == $userId] | order(_createdAt desc) [$offsetStart...$offsetEnd] {
    ${itemSimpleFields}
  }`;

  try {
    const [totalCount, submissions] = await Promise.all([
      sanityFetch<number>(countQuery, { userId }),
      sanityFetch<any[]>(dataQuery, { userId, offsetStart, offsetEnd }),
    ]);

    const totalPages = Math.ceil(totalCount / SUBMISSIONS_PER_PAGE);

    return {
      submissions,
      totalCount,
      totalPages,
      currentPage,
    };
  } catch (error) {
    console.error('submissions fetch error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch submissions',
    });
  }
});
