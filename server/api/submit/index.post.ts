import { z } from 'zod';
import { supabase } from '../../utils/supabase';
import { uploadBase64Image } from '../../utils/storage';

const SubmitSchema = z.object({
  link: z.string().url('Invalid URL'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  introduction: z.string().optional(),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  tags: z.array(z.string()).optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  pricePlan: z.enum(['free', 'pro', 'sponsor']).default('free'),
});

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const validatedFields = SubmitSchema.safeParse(body);
  if (!validatedFields.success) {
    throw createError({
      statusCode: 400,
      message: validatedFields.error.errors[0].message,
    });
  }

  const data = validatedFields.data;

  const token = getCookie(event, 'sb-access-token');
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Please login to submit',
    });
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) {
    throw createError({
      statusCode: 401,
      message: 'Invalid session',
    });
  }

  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  let imageUrl: string | undefined;
  let iconUrl: string | undefined;

  if (data.image) {
    const result = await uploadBase64Image(data.image, 'images');
    if (result.url) {
      imageUrl = result.url;
    }
  }

  if (data.icon) {
    const result = await uploadBase64Image(data.icon, 'icons');
    if (result.url) {
      iconUrl = result.url;
    }
  }

  const itemData: any = {
    name: data.name,
    slug,
    link: data.link,
    description: data.description,
    introduction: data.introduction,
    image_url: imageUrl,
    image_alt: `image of ${data.name}`,
    icon_url: iconUrl,
    icon_alt: `icon of ${data.name}`,
    price_plan: data.pricePlan,
    free_plan_status: data.pricePlan === 'free' ? 'submitting' : null,
    pro_plan_status: data.pricePlan === 'pro' ? 'submitting' : null,
    sponsor_plan_status: data.pricePlan === 'sponsor' ? 'submitting' : null,
    submitter_id: user.id,
  };

  const { data: item, error: itemError } = await supabase
    .from('items')
    .insert(itemData)
    .select()
    .single();

  if (itemError) {
    console.error('Submit error:', itemError);
    throw createError({
      statusCode: 500,
      message: 'Failed to submit item',
    });
  }

  if (data.categories?.length) {
    await supabase.from('item_categories').insert(
      data.categories.map(cid => ({ item_id: item.id, category_id: cid }))
    );
  }

  if (data.tags?.length) {
    await supabase.from('item_tags').insert(
      data.tags.map(tid => ({ item_id: item.id, tag_id: tid }))
    );
  }

  if (data.pricePlan !== 'free') {
    const priceId = data.pricePlan === 'pro'
      ? config.public.stripeProPriceId
      : config.public.stripeSponsorPriceId;

    if (priceId) {
      const session = await createCheckoutSession({
        priceId,
        userId: user.id,
        itemId: item.id,
        successUrl: `${config.public.appUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${config.public.appUrl}/payment/cancel`,
      });

      return {
        success: true,
        item,
        checkoutUrl: session.url,
      };
    }
  }

  return {
    success: true,
    item,
    message: 'Submission received! We will review it shortly.',
  };
});
