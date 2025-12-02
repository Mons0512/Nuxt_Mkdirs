<script setup lang="ts">
import { Check, ExternalLink, Share2, PartyPopper } from 'lucide-vue-next';
import { getSanityImageUrl } from '~/utils/sanity-image';

const route = useRoute();
const config = useRuntimeConfig();
const itemId = computed(() => route.params.id as string);

// Check if coming from successful payment
const showConfetti = computed(() => route.query.pay === 'success');

// Stepper steps
const steps = [
  { title: 'Details', description: 'Enter product information' },
  { title: 'Payment', description: 'Select pricing plan' },
  { title: 'Publish', description: 'Publish your product' },
];

// Fetch item from Sanity
const { data: item, error } = await useFetch('/api/item', {
  query: { id: itemId },
});

// Computed image URL
const imageUrl = computed(() => {
  if (!item.value?.image) return '';
  return getSanityImageUrl(item.value.image, { width: 400, height: 225 });
});

// Item URL
const itemUrl = computed(() => {
  if (!item.value?.slug) return '';
  const slug = item.value.slug?.current || item.value.slug;
  return `${config.public.appUrl}/item/${slug}`;
});

// Publishing state
const isPublishing = ref(false);
const isPublished = ref(false);

// Handle publish
async function handlePublish() {
  isPublishing.value = true;

  try {
    await $fetch('/api/publish', {
      method: 'POST',
      body: { id: itemId.value },
    });

    isPublished.value = true;
  } catch (error) {
    console.error('Publish error:', error);
    alert('Failed to publish');
  } finally {
    isPublishing.value = false;
  }
}

// Handle share
function handleShare() {
  if (navigator.share) {
    navigator.share({
      title: item.value?.name,
      text: item.value?.description,
      url: itemUrl.value,
    });
  } else {
    navigator.clipboard.writeText(itemUrl.value);
    alert('Link copied to clipboard!');
  }
}

useSeoMeta({
  title: 'Submit your product (3/3) - Directory Template',
  description: 'Submit your product – Review and publish.',
});
</script>

<template>
  <LayoutContainer class="py-8">
    <div>
      <!-- Confetti effect placeholder -->
      <div v-if="showConfetti" class="fixed inset-0 pointer-events-none z-50">
        <div class="absolute top-1/4 left-1/2 -translate-x-1/2 text-center">
          <PartyPopper class="w-16 h-16 text-yellow-500 mx-auto animate-bounce" />
          <p class="text-2xl font-bold mt-4">Payment Successful!</p>
        </div>
      </div>

      <!-- Header -->
      <div class="flex flex-col gap-8 md:gap-36 lg:gap-48 md:items-center md:flex-row md:justify-between">
        <div class="flex flex-col space-y-4">
          <!-- Title -->
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-semibold">Publish</h1>
          </div>

          <div class="flex items-center space-x-2">
            <!-- Label -->
            <span class="inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold">
              3 / 3
            </span>
            <!-- Subtitle -->
            <h2 class="text-base">Review and publish your product</h2>
          </div>
        </div>

        <!-- Stepper -->
        <div class="flex-1 md:max-w-[50%]">
          <SubmitStepper :steps="steps" :current-step="3" />
        </div>
      </div>

      <!-- Content -->
      <div class="mt-8">
        <div v-if="error" class="text-center py-12">
          <p class="text-destructive">Failed to load item</p>
        </div>

        <div v-else-if="item" class="border rounded-xl overflow-hidden">
          <!-- Success State -->
          <div v-if="isPublished" class="p-12 text-center">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check class="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 class="text-2xl font-bold mb-2">Successfully Published!</h3>
            <p class="text-muted-foreground mb-8">Your product is now live and visible to everyone.</p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <NuxtLink :to="`/item/${item.slug?.current || item.slug}`">
                <UiButton class="gap-2">
                  <ExternalLink class="w-4 h-4" />
                  View Product
                </UiButton>
              </NuxtLink>
              <UiButton variant="outline" class="gap-2" @click="handleShare">
                <Share2 class="w-4 h-4" />
                Share
              </UiButton>
            </div>
          </div>

          <!-- Review State -->
          <template v-else>
            <!-- Item Preview -->
            <div class="p-6">
              <h3 class="text-lg font-semibold mb-4">Review your submission</h3>
              
              <div class="flex flex-col md:flex-row gap-6">
                <!-- Image -->
                <div class="md:w-1/3">
                  <img
                    v-if="imageUrl"
                    :src="imageUrl"
                    :alt="item.name"
                    class="w-full aspect-video object-cover rounded-lg"
                  />
                  <div v-else class="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <span class="text-muted-foreground">No image</span>
                  </div>
                </div>

                <!-- Details -->
                <div class="md:w-2/3 space-y-4">
                  <div>
                    <label class="text-sm text-muted-foreground">Name</label>
                    <p class="font-semibold">{{ item.name }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-muted-foreground">Link</label>
                    <p class="text-primary">{{ item.link }}</p>
                  </div>
                  <div>
                    <label class="text-sm text-muted-foreground">Description</label>
                    <p>{{ item.description }}</p>
                  </div>
                  <div v-if="item.categories?.length">
                    <label class="text-sm text-muted-foreground">Categories</label>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <span
                        v-for="cat in item.categories"
                        :key="cat._id"
                        class="px-2 py-1 bg-muted rounded text-sm"
                      >
                        {{ cat.name }}
                      </span>
                    </div>
                  </div>
                  <div v-if="item.tags?.length">
                    <label class="text-sm text-muted-foreground">Tags</label>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <span
                        v-for="tag in item.tags"
                        :key="tag._id"
                        class="px-2 py-1 bg-muted rounded text-sm"
                      >
                        {{ tag.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="p-6 border-t bg-accent flex justify-between items-center">
              <NuxtLink :to="`/payment/${itemId}`">
                <UiButton variant="outline">Back</UiButton>
              </NuxtLink>
              <UiButton
                :disabled="isPublishing"
                @click="handlePublish"
              >
                <svg
                  v-if="isPublishing"
                  class="mr-2 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {{ isPublishing ? 'Publishing...' : 'Publish Now' }}
              </UiButton>
            </div>
          </template>
        </div>
      </div>
    </div>
  </LayoutContainer>
</template>
