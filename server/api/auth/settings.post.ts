import { z } from 'zod';
import { sanityClient } from '../../utils/sanity';
import { getUserByIdWithAccounts } from '../../utils/data/user';

const SettingsSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  link: z.string().optional(),
  password: z.string().optional(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

/**
 * Update user settings
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

  // Get user from database (with accounts to check OAuth status)
  const user = await getUserByIdWithAccounts(sessionData.id);
  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    });
  }

  // Parse and validate body
  const body = await readBody(event);
  const validatedFields = SettingsSchema.safeParse(body);
  
  if (!validatedFields.success) {
    throw createError({
      statusCode: 400,
      message: validatedFields.error.errors[0].message,
    });
  }

  const { name, link, password, newPassword } = validatedFields.data;

  // Check if user is OAuth (has accounts linked)
  const isOAuth = user.accounts && user.accounts.length > 0;

  // Prepare update data
  const updateData: Record<string, any> = {};

  if (name !== undefined) {
    updateData.name = name;
  }

  if (link !== undefined) {
    updateData.link = link;
  }

  // Handle password change (only for non-OAuth users)
  if (!isOAuth && password && newPassword) {
    // Verify current password
    if (!user.password) {
      throw createError({
        statusCode: 400,
        message: 'Cannot change password for OAuth users',
      });
    }

    const passwordsMatch = await verifyPassword(password, user.password);
    if (!passwordsMatch) {
      return {
        status: 'error',
        message: 'Incorrect password!',
      };
    }

    // Hash new password
    updateData.password = await hashPassword(newPassword);
  }

  // Update user in Sanity
  try {
    const updatedUser = await sanityClient
      .patch(user._id)
      .set(updateData)
      .commit();

    // Update session cookie with new data
    const newSessionData = {
      ...sessionData,
      name: updatedUser.name,
    };
    
    const newSessionToken = Buffer.from(JSON.stringify(newSessionData)).toString('base64');
    setCookie(event, 'auth-token', newSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return {
      status: 'success',
      message: 'Account information updated!',
    };
  } catch (error) {
    console.error('settings update error:', error);
    return {
      status: 'error',
      message: 'Failed to update account information!',
    };
  }
});
