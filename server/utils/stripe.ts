import Stripe from 'stripe';

const config = useRuntimeConfig();

/**
 * Stripe client for payment processing
 */
export const stripe = new Stripe(config.stripeSecretKey, {
  apiVersion: '2024-04-10',
  typescript: true,
});

/**
 * Create a checkout session for product submission
 */
export async function createCheckoutSession(params: {
  priceId: string;
  userId: string;
  itemId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: params.priceId,
        quantity: 1,
      },
    ],
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    metadata: {
      userId: params.userId,
      itemId: params.itemId,
    },
  });

  return session;
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    config.stripeWebhookSecret
  );
}

/**
 * Get price details
 */
export async function getPrice(priceId: string) {
  return stripe.prices.retrieve(priceId);
}

/**
 * Get product details
 */
export async function getProduct(productId: string) {
  return stripe.products.retrieve(productId);
}
