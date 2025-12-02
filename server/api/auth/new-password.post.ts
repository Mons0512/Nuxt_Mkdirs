import { z } from 'zod';

const NewPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Set new password with reset token
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate input
  const validatedFields = NewPasswordSchema.safeParse(body);
  if (!validatedFields.success) {
    throw createError({
      statusCode: 400,
      message: validatedFields.error.errors[0].message,
    });
  }

  const { token, password } = validatedFields.data;

  // Find reset token
  const resetToken = await sanityFetch<any>(
    `*[_type == "passwordResetToken" && token == $token][0]`,
    { token }
  );

  if (!resetToken) {
    throw createError({
      statusCode: 400,
      message: 'Invalid or expired token',
    });
  }

  // Check if token is expired
  if (new Date(resetToken.expires) < new Date()) {
    await sanityClient.delete(resetToken._id);
    throw createError({
      statusCode: 400,
      message: 'Token has expired',
    });
  }

  // Find user
  const user = await getUserByEmail(resetToken.email);
  if (!user) {
    throw createError({
      statusCode: 400,
      message: 'User not found',
    });
  }

  // Hash new password
  const hashedPassword = await hashPassword(password);

  // Update user password
  await sanityClient
    .patch(user._id)
    .set({ password: hashedPassword })
    .commit();

  // Delete reset token
  await sanityClient.delete(resetToken._id);

  return {
    success: true,
    message: 'Password updated successfully',
  };
});
