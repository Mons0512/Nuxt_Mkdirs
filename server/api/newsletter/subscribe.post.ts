import { z } from 'zod';
import { subscribe } from '../../utils/db/subscribers';

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
    await subscribe(supabase, email, 'website');

    if (config.resendApiKey) {
      await sendWelcomeEmail(email, config);
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

async function sendWelcomeEmail(email: string, config: any) {
  if (!config.resendApiKey) {
    return;
  }

  try {
    const result = await resend.emails.send({
      from: config.resendEmailFrom,
      to: email,
      subject: 'Welcome to our newsletter!',
      html: getWelcomeEmailHtml(email, config.public.appUrl),
    });
    console.log('Newsletter welcome email result:', result);
  } catch (error) {
    console.warn('Failed to send welcome email:', error);
  }
}

function getWelcomeEmailHtml(email: string, siteUrl: string): string {
  const unsubscribeUrl = `${siteUrl}/unsubscribe?email=${encodeURIComponent(email)}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="${siteUrl}/logo.png" width="48" height="48" alt="Logo" style="margin-bottom: 16px;">
          <h1 style="color: #6366f1; margin-bottom: 10px;">Welcome to Our Newsletter!</h1>
        </div>
        <p style="font-size: 16px; margin-bottom: 20px;">
          Welcome to our community!
        </p>
        <p style="font-size: 12px; color: #999; text-align: center;">
          If you wish to unsubscribe, <a href="${unsubscribeUrl}" style="color: #6366f1;">click here</a>.
        </p>
      </body>
    </html>
  `;
}
