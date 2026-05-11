import { z } from 'zod';
import { supabase } from '../../utils/supabase';

const SettingsSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  image: z.string().optional(),
  link: z.string().optional(),
  password: z.string().min(1, 'Password is required').optional(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').optional(),
});

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'sb-access-token');

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);

  if (userError || !user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid session',
    });
  }

  const body = await readBody(event);
  const validatedFields = SettingsSchema.safeParse(body);

  if (!validatedFields.success) {
    throw createError({
      statusCode: 400,
      message: validatedFields.error.errors[0].message,
    });
  }

  const { name, image, link, password, newPassword } = validatedFields.data;

  // Update user profile in database
  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };
  if (name !== undefined) updateData.name = name;
  if (image !== undefined) updateData.image = image;
  if (link !== undefined) updateData.link = link;

  if (Object.keys(updateData).length > 1) {
    await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id);
  }

  // Update Supabase auth user metadata
  const authMetadata: Record<string, any> = {};
  if (name !== undefined) authMetadata.name = name;
  if (link !== undefined) authMetadata.link = link;

  if (Object.keys(authMetadata).length > 0) {
    await supabase.auth.updateUser({
      data: authMetadata,
    });
  }

  // Handle password change
  if (password && newPassword) {
    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password,
    });

    if (signInError) {
      throw createError({
        statusCode: 400,
        message: 'Current password is incorrect',
      });
    }

    // Update password
    const { error: passwordError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (passwordError) {
      throw createError({
        statusCode: 400,
        message: passwordError.message,
      });
    }
  }

  return {
    success: true,
    message: 'Account information updated!',
  };
});
