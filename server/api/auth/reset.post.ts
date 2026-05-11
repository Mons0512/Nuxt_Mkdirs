import { z } from 'zod';
import { supabase } from '../../utils/supabase';

const ResetSchema = z.object({
  email: z.string().email('Invalid email'),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const validatedFields = ResetSchema.safeParse(body);
  if (!validatedFields.success) {
    throw createError({
      statusCode: 400,
      message: validatedFields.error.errors[0].message,
    });
  }

  const { email } = validatedFields.data;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getRequestURL(event).origin}/auth/callback/reset`,
  });

  if (error) {
    console.error('Password reset error:', error);
  }

  return {
    success: true,
    message: 'If an account exists, a reset email has been sent.',
  };
});
