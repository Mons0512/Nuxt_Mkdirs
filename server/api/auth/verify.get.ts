/**
 * Verify email with token
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const token = query.token as string;

  if (!token) {
    throw createError({
      statusCode: 400,
      message: 'Token is required',
    });
  }

  // Find verification token
  const verificationToken = await getVerificationTokenByToken(token);
  if (!verificationToken) {
    throw createError({
      statusCode: 400,
      message: 'Invalid token',
    });
  }

  // Check if token is expired
  if (new Date(verificationToken.expires) < new Date()) {
    // Delete expired token
    await sanityClient.delete(verificationToken._id);
    throw createError({
      statusCode: 400,
      message: 'Token has expired',
    });
  }

  // Find user
  const user = await getUserByEmail(verificationToken.identifier);
  if (!user) {
    throw createError({
      statusCode: 400,
      message: 'User not found',
    });
  }

  // Update user email verification
  await sanityClient
    .patch(user._id)
    .set({ emailVerified: new Date().toISOString() })
    .commit();

  // Delete verification token
  await sanityClient.delete(verificationToken._id);

  return {
    success: true,
    message: 'Email verified successfully',
  };
});
