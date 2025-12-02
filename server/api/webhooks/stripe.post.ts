import type Stripe from 'stripe';

/**
 * Stripe webhook handler
 * Handles payment events from Stripe
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readRawBody(event);
  const signature = getHeader(event, 'stripe-signature');

  if (!body || !signature) {
    throw createError({
      statusCode: 400,
      message: 'Missing body or signature',
    });
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = verifyWebhookSignature(body, signature);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    throw createError({
      statusCode: 400,
      message: 'Invalid signature',
    });
  }

  // Handle the event
  switch (stripeEvent.type) {
    case 'checkout.session.completed': {
      const session = stripeEvent.data.object as Stripe.Checkout.Session;
      console.log('Payment successful:', session.id);

      // Get metadata
      const userId = session.metadata?.userId;
      const itemId = session.metadata?.itemId;

      if (userId && itemId) {
        // TODO: Update item status in Sanity
        // TODO: Send confirmation email
        console.log(`Processing payment for user ${userId}, item ${itemId}`);
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent succeeded:', paymentIntent.id);
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent failed:', paymentIntent.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`);
  }

  return { received: true };
});
