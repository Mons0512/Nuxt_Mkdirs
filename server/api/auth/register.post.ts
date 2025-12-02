import { z } from 'zod';
import { uuid } from '@sanity/uuid';

const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Register a new user
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Validate input
  const validatedFields = RegisterSchema.safeParse(body);
  if (!validatedFields.success) {
    throw createError({
      statusCode: 400,
      message: validatedFields.error.errors[0].message,
    });
  }

  const { name, email, password } = validatedFields.data;

  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw createError({
      statusCode: 400,
      message: 'Email already in use',
    });
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user in Sanity
  try {
    const user = await sanityClient.create({
      _type: 'user',
      _id: `user.${uuid()}`,
      name,
      email,
      password: hashedPassword,
      role: 'USER',
      emailVerified: null,
    });

    // Generate verification token
    const token = uuid();
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour

    await sanityClient.create({
      _type: 'verificationToken',
      identifier: email,
      token,
      expires: expires.toISOString(),
    });

    // Send verification email
    await sendVerificationEmail(email, token);

    return {
      success: true,
      message: 'Confirmation email sent!',
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create account',
    });
  }
});
