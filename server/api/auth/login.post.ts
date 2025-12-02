import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Login with credentials
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate input
  const validatedFields = LoginSchema.safeParse(body);
  if (!validatedFields.success) {
    throw createError({
      statusCode: 400,
      message: validatedFields.error.errors[0].message,
    });
  }

  const { email, password } = validatedFields.data;

  // Find user
  const user = await getUserByEmail(email);
  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials',
    });
  }

  // Check password
  if (!user.password) {
    throw createError({
      statusCode: 401,
      message: 'Please use OAuth to sign in',
    });
  }

  const passwordsMatch = await verifyPassword(password, user.password);
  if (!passwordsMatch) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials',
    });
  }

  // Check email verification
  if (!user.emailVerified) {
    throw createError({
      statusCode: 401,
      message: 'Please verify your email first',
    });
  }

  // Create session data
  const sessionData = {
    id: user._id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  };

  // Set session cookie (simple base64 encoded JSON for now)
  const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');
  setCookie(event, 'auth-token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  return {
    success: true,
    user: sessionData,
  };
});
