<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';

const route = useRoute();
const slug = computed(() => route.params.slug as string);

// Reactive query params
const collectionQuery = computed(() => ({
  limit: 12,
  page: route.query.page || undefined,
}));

// Fetch collection with items from Sanity
const { data: collectionData, error } = await useFetch(() => `/api/collections/${slug.value}`, {
  query: collectionQuery,
  watch: [collectionQuery],
});

const collection = computed(() => {
  if (!collectionData.value?.collection) return null;
  const c = collectionData.value.collection;
  return {
    _id: c._id,
    name: c.name,
    slug: c.slug?.current || c.slug,
    description: c.description,
  };
});

const items = computed(() => {
  if (!collectionData.value?.items) return [];
  return collectionData.value.items.map((item: any) => ({
    _id: item._id,
    name: item.name,
    slug: item.slug?.current || item.slug,
    link: item.link,
    description: item.description,
    icon: item.icon,
    image: item.image,
    featured: item.featured,
    tags: item.tags?.map((t: any) => t.name) || [],
    category: item.categories?.[0]?.name || '',
  }));
});

const totalPages = computed(() => collectionData.value?.pagination?.totalPages || 1);

useSeoMeta({
  title: () => `${collection.value?.name || 'Collection'} | Directory`,
  description: () => collection.value?.description || 'View this collection.',
});
</script>

<template>
  <div class="py-8">
    <LayoutContainer>
      <div v-if="collection">
        <NuxtLink
          to="/collection"
          class="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft class="size-4" />
          Back to Collections
        </NuxtLink>

        <h1 class="text-3xl font-bold mb-4">{{ collection.name }}</h1>
        <p v-if="collection.description" class="text-lg text-muted-foreground mb-8">
          {{ collection.description }}
        </p>

        <!-- Items Grid -->
        <SharedEmptyState v-if="items.length === 0" title="No items yet" description="This collection is empty." />
        
        <template v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <ItemCard2
              v-for="item in items"
              :key="item._id"
              :item="item"
            />
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center">
            <SharedPagination :route-prefix="`/collection/${slug}`" :total-pages="totalPages" />
          </div>
        </template>
      </div>

      <SharedEmptyState
        v-else
        title="Collection not found"
        description="The collection you're looking for doesn't exist."
      >
        <NuxtLink to="/collection" class="mt-4">
          <UiButton>Browse all collections</UiButton>
        </NuxtLink>
      </SharedEmptyState>
    </LayoutContainer>
  </div>
</template>
