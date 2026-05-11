import { z } from 'zod';
import { supabase } from '../../utils/supabase';

const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const validatedFields = RegisterSchema.safeParse(body);
  if (!validatedFields.success) {
    throw createError({
      statusCode: 400,
      message: validatedFields.error.errors[0].message,
    });
  }

  const { name, email, password } = validatedFields.data;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    throw createError({
      statusCode: 400,
      message: error.message,
    });
  }

  if (data.user) {
    await supabase.from('users').upsert({
      id: data.user.id,
      email: data.user.email,
      name,
      role: 'USER',
      email_verified: data.user.email_confirmed_at ? new Date().toISOString() : null,
    });
  }

  return {
    success: true,
    message: data.user?.email_confirmed_at 
      ? 'Account created successfully!' 
      : 'Confirmation email sent! Please check your email.',
  };
});
