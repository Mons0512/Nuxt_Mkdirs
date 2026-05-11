import { supabaseAdmin } from '../../utils/supabase';

export default defineEventHandler(async (event) => {
  const body = await readRawBody(event);
  const signature = getHeader(event, 'creem-signature');

  if (!body || !signature) {
    throw createError({
      statusCode: 400,
      message: 'Missing body or signature',
    });
  }

  try {
    await handleCreemWebhook(body, signature, {
      onCheckoutCompleted: async (data) => {
        console.log('Creem checkout completed:', data.id);

        const userId = data.metadata?.userId;
        const itemId = data.metadata?.itemId;
        const pricePlan = data.metadata?.pricePlan || (data.product?.name?.toLowerCase().includes('sponsor') ? 'sponsor' : 'pro');
        const customerEmail = data.customer?.email;
        const customerName = data.customer?.name;
        const orderId = data.order?.id;

        if (userId && itemId) {
          console.log(`Processing Creem payment for user ${userId}, item ${itemId}, plan: ${pricePlan}`);

          try {
            const { data: orderResult, error: orderError } = await supabaseAdmin
              .from('orders')
              .insert({
                user_id: userId,
                item_id: itemId,
                status: 'success',
                provider: 'creem',
                external_order_id: orderId,
              })
              .select()
              .single();

            if (orderError) {
              console.error('Order creation error:', orderError);
              return;
            }
            console.log('Order created:', orderResult.id);

            const updateData: any = {
              paid: true,
              featured: true,
              price_plan: pricePlan,
              sponsor: pricePlan === 'sponsor',
            };

            if (pricePlan === 'pro') {
              updateData.pro_plan_status = 'success';
            } else if (pricePlan === 'sponsor') {
              updateData.sponsor_plan_status = 'success';
            }

            if (orderResult) {
              updateData.order_id = orderResult.id;
            }

            const { data: itemResult, error: itemError } = await supabaseAdmin
              .from('items')
              .update(updateData)
              .eq('id', itemId)
              .select()
              .single();

            if (itemError) {
              console.error('Item update error:', itemError);
              return;
            }
            console.log('Item updated:', itemResult.id);

            if (customerEmail) {
              console.log(`Should send confirmation email to ${customerEmail}`);
            }
          } catch (err) {
            console.error('Error processing checkout completion:', err);
          }
        }
      },

      onGrantAccess: async (context) => {
        const { reason, customer, product, metadata } = context;
        const userId = metadata?.userId;

        console.log(`Granting access (${reason}) to user ${userId}`);
        console.log(`Customer: ${customer?.email}, Product: ${product?.name}`);
      },

      onRevokeAccess: async (context) => {
        const { reason, customer, product, metadata } = context;
        const userId = metadata?.userId;

        console.log(`Revoking access (${reason}) from user ${userId}`);
        console.log(`Customer: ${customer?.email}, Product: ${product?.name}`);
      },

      onSubscriptionActive: async (data) => {
        console.log('Subscription active:', data.id);
      },

      onSubscriptionCanceled: async (data) => {
        console.log('Subscription canceled:', data.id);
      },

      onSubscriptionPaid: async (data) => {
        console.log('Subscription paid:', data.id);
      },

      onSubscriptionExpired: async (data) => {
        console.log('Subscription expired:', data.id);
      },

      onRefundCreated: async (data) => {
        console.log('Refund created:', data.id);
      },

      onDisputeCreated: async (data) => {
        console.log('Dispute created:', data.id);
      },
    });

    return { received: true };
  } catch (error) {
    console.error('Creem webhook error:', error);
    throw createError({
      statusCode: 400,
      message: 'Invalid signature or webhook processing failed',
    });
  }
});
