<script setup lang="ts">
// Pricing plans data
const plans = [
  {
    title: 'Free',
    description: 'For Beginners',
    benefits: [
      'Get 3 dofollow links to boost your SEO',
      'Permanent link with backlink maintenance',
      'Reviewed and listed within 72 hours',
      'Publish your product the day you want',
    ],
    limitations: [
      'Backlink to our site is required',
      'No customer support',
    ],
    price: 0,
    priceSuffix: '',
    isPopular: false,
  },
  {
    title: 'Pro',
    description: 'For Pro Users',
    benefits: [
      'Get >= 3 dofollow links to boost your SEO',
      'List right now, publish whenever you want',
      'Permanent link, no backlink required',
      'Featured placement at the top of listings',
      'Share through social media and newsletters',
      'Premium customer support',
    ],
    limitations: [],
    price: 9.9,
    priceSuffix: '',
    isPopular: true,
  },
  {
    title: 'Sponsor',
    description: 'For Sponsors',
    benefits: [
      'Everything in Pro plan',
      'Promote your product on almost every page',
      'Available for all kinds of product',
      'Only one advertisement per period',
      'Schedule your advertising period',
      'Premium customer support',
    ],
    limitations: [],
    price: 19.9,
    priceSuffix: '/ week',
    isPopular: false,
  },
];

// FAQ data
const faqItems = [
  {
    id: 'item-1',
    question: 'Is it free to submit my product?',
    answer: 'Yes, it is. \nYou can submit your product for free to get 3 dofollow links to boost your SEO. \nHowever, the free plan has limitations:\n- Reviewed and listed within 72 hours\n- Requires a backlink to our site\n- No customer support',
  },
  {
    id: 'item-2',
    question: 'What are the benefits of the Pro plan?',
    answer: 'The Pro plan offers several benefits:\n- At least 3 dofollow links\n- Immediate listing, or publish it whenever you want\n- Permanent links with no backlink requirement\n- Featured in listings with an award icon\n- Promotion through our social media and newsletters\n- Premium customer support',
  },
  {
    id: 'item-3',
    question: 'The differences between Free and Pro plans?',
    answer: 'Free plan submissions are reviewed and listed within 72 hours, a backlink to our site is required. \nWhile Pro plan submissions are included immediately, no backlink is required. \nBoth plans can be launched whenever you want and update product information anytime.',
  },
  {
    id: 'item-4',
    question: 'Do I need to provide a backlink for my listing?',
    answer: 'For the Free plan, a backlink to our site is required. \nHowever, if you choose the Pro plan, you get a permanent link without any backlink requirement.',
  },
];

useSeoMeta({
  title: 'Pricing - Directory Template',
  description: 'Choose a pricing plan for submitting your product.',
});
</script>

<template>
  <LayoutContainer class="mt-8 pb-16">
    <div class="w-full flex flex-col gap-16">
      <!-- Pricing Section -->
      <section class="w-full flex flex-col gap-8 justify-center">
        <SharedHeaderSection
          label="Pricing"
          title="Choose a pricing plan"
        />

        <!-- Pricing Cards -->
        <div class="w-full mx-auto">
          <div class="grid gap-8 w-full sm:grid-cols-1 lg:grid-cols-3 items-center">
            <PricingPlanCard
              v-for="plan in plans"
              :key="plan.title"
              :plan="plan"
            />
          </div>
        </div>

        <!-- Test environment tip -->
        <p class="text-center text-sm text-muted-foreground leading-normal">
          This is in <span class="font-bold">TEST</span> environment.
          <br />
          You can use Stripe test card to simulate the paid submission process.
          <br />
          Stripe test card number: 4242 4242 4242 4242
        </p>
      </section>

      <!-- FAQ Section -->
      <section class="w-full flex flex-col gap-8 justify-center">
        <SharedHeaderSection
          label="FAQ"
          title="Frequently Asked Questions"
        />

        <div class="w-full max-w-4xl mx-auto">
          <UiAccordion
            :items="faqItems.map(item => ({ id: item.id, title: item.question, content: item.answer }))"
            type="single"
          />
        </div>
      </section>
    </div>
  </LayoutContainer>
</template>
