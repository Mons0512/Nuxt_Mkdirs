/**
 * Create Stripe checkout session
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const { priceId, userId, itemId } = body;

  if (!priceId || !userId || !itemId) {
    throw createError({
      statusCode: 400,
      message: 'Missing required fields: priceId, userId, itemId',
    });
  }

  try {
    const session = await createCheckoutSession({
      priceId,
      userId,
      itemId,
      successUrl: `${config.public.appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${config.public.appUrl}/payment/cancel`,
    });

    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to create checkout session',
    });
  }
});
