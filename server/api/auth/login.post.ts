import { z } from 'zod';
import { supabase } from '../../utils/supabase';
import { setAuthCookie } from '../../utils/supabase';

const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const validatedFields = LoginSchema.safeParse(body);
  if (!validatedFields.success) {
    throw createError({
      statusCode: 400,
      message: validatedFields.error.errors[0].message,
    });
  }

  const { email, password } = validatedFields.data;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw createError({
      statusCode: 401,
      message: error.message,
    });
  }

  if (data.user) {
    setAuthCookie(event, data.session.access_token, data.session.refresh_token);
  }

  return {
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email,
      name: data.user.user_metadata?.name || data.user.user_metadata?.full_name,
      image: data.user.user_metadata?.avatar_url,
      role: data.user.user_metadata?.role || 'USER',
    },
  };
});
