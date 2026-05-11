import { z } from 'zod';
import { supabase } from '../../utils/supabase';
import { setAuthCookie } from '../../utils/supabase';

const NewPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const validatedFields = NewPasswordSchema.safeParse(body);
  if (!validatedFields.success) {
    throw createError({
      statusCode: 400,
      message: validatedFields.error.errors[0].message,
    });
  }

  const { password } = validatedFields.data;
  const token = getCookie(event, 'sb-access-token');

  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    });
  }

  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }

  return {
    success: true,
    message: 'Password updated successfully',
  };
});
