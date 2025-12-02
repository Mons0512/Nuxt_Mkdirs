import { z } from 'zod';
import { uuid } from '@sanity/uuid';

const ResetSchema = z.object({
  email: z.string().email('Invalid email'),
});

/**
 * Send password reset email
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate input
  const validatedFields = ResetSchema.safeParse(body);
  if (!validatedFields.success) {
    throw createError({
      statusCode: 400,
      message: validatedFields.error.errors[0].message,
    });
  }

  const { email } = validatedFields.data;

  // Find user
  const user = await getUserByEmail(email);
  if (!user) {
    // Don't reveal if user exists
    return {
      success: true,
      message: 'If an account exists, a reset email has been sent.',
    };
  }

  // Generate reset token
  const token = uuid();
  const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

  // Delete existing tokens for this email
  const existingTokens = await sanityFetch<any[]>(
    `*[_type == "passwordResetToken" && email == $email]`,
    { email }
  );

  for (const t of existingTokens || []) {
    await sanityClient.delete(t._id);
  }

  // Create new token
  await sanityClient.create({
    _type: 'passwordResetToken',
    email,
    token,
    expires: expires.toISOString(),
  });

  // Send reset email
  await sendPasswordResetEmail(user.name || 'User', email, token);

  return {
    success: true,
    message: 'If an account exists, a reset email has been sent.',
  };
});
