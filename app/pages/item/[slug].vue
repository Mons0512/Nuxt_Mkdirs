<script setup lang="ts">
import { Globe, Hash, LayoutGrid, ArrowLeft } from 'lucide-vue-next';

const route = useRoute();
const slug = computed(() => route.params.slug as string);

const { data: item, error } = await useFetch(`/api/items/${slug.value}`);

function formatDate(dateString: string | undefined | null) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const imageUrl = computed(() => {
  return item.value?.image_url || '';
});

const iconUrl = computed(() => {
  return item.value?.icon_url || '';
});

const websiteHostname = computed(() => {
  if (!item.value?.link) return '';
  try {
    return new URL(item.value.link).hostname;
  } catch {
    return item.value.link;
  }
});

const itemLink = computed(() => {
  return item.value?.affiliate_link || item.value?.link || '#';
});

const relatedItems = computed(() => item.value?.related || []);

useSeoMeta({
  title: () => `${item.value?.name || 'Item'} | Directory`,
  description: () => item.value?.description || 'View this item.',
});
</script>

<template>
  <LayoutContainer class="py-8">
    <div v-if="item" class="flex flex-col gap-8">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div class="lg:col-span-3 gap-8 flex flex-col">
          <nav class="flex items-center gap-2 text-sm text-muted-foreground">
            <NuxtLink to="/" class="hover:text-foreground">Home</NuxtLink>
            <span>/</span>
            <NuxtLink
              v-if="item.categories?.[0]"
              :to="`/category/${item.categories[0].slug}`"
              class="hover:text-foreground"
            >
              {{ item.categories[0].name }}
            </NuxtLink>
            <span v-if="item.categories?.[0]">/</span>
            <span class="text-foreground">{{ item.name }}</span>
          </nav>

          <div class="flex flex-1 items-center">
            <div class="flex flex-col gap-8">
              <div class="flex w-full items-center gap-4">
                <img
                  v-if="iconUrl"
                  :src="iconUrl"
                  :alt="`icon of ${item.name}`"
                  class="w-8 h-8 object-cover"
                />
                <h1
                  :class="[
                    'text-4xl tracking-wider font-bold flex items-center gap-2',
                    item.featured && 'text-gradient_indigo-purple font-semibold'
                  ]"
                >
                  {{ item.name }}
                </h1>
              </div>
              <p class="text-muted-foreground text-balance leading-relaxed">
                {{ item.description }}
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <a :href="itemLink" target="_blank" rel="noopener noreferrer">
              <UiButton size="lg" class="group flex items-center gap-2">
                <Globe class="w-4 h-4 icon-scale" />
                <span>Visit Website</span>
              </UiButton>
            </a>
          </div>
        </div>

        <div class="lg:col-span-2">
          <div class="relative group overflow-hidden rounded-lg aspect-video">
            <a :href="itemLink" target="_blank" rel="noopener noreferrer" class="relative block w-full h-full">
              <img
                v-if="imageUrl"
                :src="imageUrl"
                :alt="`image for ${item.name}`"
                class="border w-full h-full shadow-lg object-cover image-scale"
              />
              <div v-else class="w-full h-full bg-muted flex items-center justify-center">
                <span class="text-4xl font-bold text-muted-foreground/30">{{ item.name?.charAt(0)?.toUpperCase() }}</span>
              </div>
              <div class="absolute inset-0 flex items-center justify-center bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                <span class="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Visit Website
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div class="lg:col-span-3 flex flex-col">
          <div v-if="item.introduction" class="bg-muted/50 rounded-lg p-6 mr-0 lg:mr-8">
            <h2 class="text-lg font-semibold mb-4">Introduction</h2>
            <div class="prose prose-sm dark:prose-invert max-w-none">
              <p>{{ item.introduction }}</p>
            </div>
          </div>

          <div class="flex items-center justify-start mt-16">
            <UiButton variant="outline" @click="$router.back()">
              <ArrowLeft class="w-4 h-4 mr-2" />
              Back
            </UiButton>
          </div>
        </div>

        <div class="lg:col-span-2">
          <div class="flex flex-col space-y-4">
            <div class="bg-muted/50 rounded-lg p-6">
              <h2 class="text-lg font-semibold mb-4">Information</h2>
              <ul class="space-y-4 text-sm">
                <li v-if="item.submitter" class="flex justify-between">
                  <span class="text-muted-foreground">Publisher</span>
                  <span class="font-medium">{{ item.submitter.name }}</span>
                </li>
                <li class="flex justify-between space-x-4">
                  <span class="text-muted-foreground">Website</span>
                  <a
                    :href="itemLink"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="font-medium link-underline line-clamp-1"
                  >
                    {{ websiteHostname }}
                  </a>
                </li>
                <li class="flex justify-between">
                  <span class="text-muted-foreground">Published date</span>
                  <span class="font-medium">{{ formatDate(item.publish_date) }}</span>
                </li>
              </ul>
            </div>

            <div v-if="item.categories?.length" class="bg-muted/50 rounded-lg p-6">
              <h2 class="text-lg font-semibold mb-4">Categories</h2>
              <ul class="flex flex-wrap gap-4">
                <li v-for="category in item.categories" :key="category.id">
                  <NuxtLink
                    :to="`/category/${category.slug}`"
                    class="text-sm link-underline"
                  >
                    {{ category.name }}
                  </NuxtLink>
                </li>
              </ul>
            </div>

            <div v-if="item.tags?.length" class="bg-muted/50 rounded-lg p-6">
              <h2 class="text-lg font-semibold mb-4">Tags</h2>
              <ul class="flex flex-wrap gap-4">
                <li v-for="tag in item.tags" :key="tag.id">
                  <NuxtLink
                    :to="`/tag/${tag.slug}`"
                    class="text-sm link-underline flex items-center justify-center space-x-0.5 group"
                  >
                    <Hash class="w-3 h-3 text-muted-foreground icon-scale" />
                    <span>{{ tag.name }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div v-if="relatedItems.length > 0" class="flex flex-col gap-4 mt-8">
        <div class="flex items-center gap-2">
          <LayoutGrid class="w-4 h-4 text-indigo-500" />
          <h2 class="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
            More Products
          </h2>
        </div>
        <div class="mt-4">
          <ItemGrid :items="relatedItems" />
        </div>
      </div>
    </div>

    <SharedEmptyState
      v-else-if="error"
      title="Item not found"
      description="The item you're looking for doesn't exist."
    >
      <NuxtLink to="/" class="mt-4">
        <UiButton>Browse all items</UiButton>
      </NuxtLink>
    </SharedEmptyState>
  </LayoutContainer>
</template>
