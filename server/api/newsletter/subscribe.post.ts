import { z } from 'zod';
import { subscribe } from '../../utils/db/subscribers';
import { supabaseAdmin } from '../../utils/supabase';
import { sendNewsletterWelcomeEmail } from '../../utils/mail';

const SubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const validatedFields = SubscribeSchema.safeParse(body);
  if (!validatedFields.success) {
    throw createError({
      statusCode: 400,
      message: validatedFields.error.errors[0].message,
    });
  }

  const { email } = validatedFields.data;
  const config = useRuntimeConfig();

  try {
    await subscribe(supabaseAdmin, email, 'website');

    if (config.resendApiKey) {
      await sendNewsletterWelcomeEmail(email);
    }

    return {
      success: true,
      message: 'Thanks for subscribing!',
    };
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to subscribe. Please try again.',
    });
  }
});
