import { z } from 'zod';
import { supabaseAdmin } from '../../utils/supabase';
import { unsubscribe as unsubscribeSubscriber } from '../../utils/db/subscribers';

const UnsubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const validatedFields = UnsubscribeSchema.safeParse(body);
  if (!validatedFields.success) {
    throw createError({
      statusCode: 400,
      message: validatedFields.error.errors[0].message,
    });
  }

  const { email } = validatedFields.data;
  const config = useRuntimeConfig();

  if (config.resendApiKey && config.resendAudienceId) {
    try {
      const contactsResult = await resend.contacts.list({
        audienceId: config.resendAudienceId,
      });

      if (contactsResult.error) {
        throw new Error(contactsResult.error.message);
      }

      const contact = contactsResult.data?.data?.find(
        (c: any) => c.email === email
      );

      if (contact) {
        await resend.contacts.update({
          id: contact.id,
          audienceId: config.resendAudienceId,
          unsubscribed: true,
        });
      }
    } catch (error: any) {
      console.error('Newsletter unsubscribe error:', error);
    }
  }

  try {
    await unsubscribeSubscriber(supabaseAdmin, email);
  } catch (error) {
    console.error('Local unsubscribe error:', error);
  }

  return {
    success: true,
    message: 'You have been unsubscribed.',
  };
});
