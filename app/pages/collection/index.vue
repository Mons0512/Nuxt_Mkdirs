<script setup lang="ts">
import { getSanityImageUrl } from '~/utils/sanity-image';

const route = useRoute();

// Reactive query params
const collectionsQuery = computed(() => ({
  limit: 12,
  page: route.query.page || undefined,
}));

// Fetch collections from Sanity
const { data: collectionsData } = await useFetch('/api/collections', {
  query: collectionsQuery,
  watch: [collectionsQuery],
});

const collections = computed(() => {
  if (!collectionsData.value?.collections) return [];
  return collectionsData.value.collections.map((c: any) => ({
    _id: c._id,
    name: c.name,
    slug: c.slug?.current || c.slug,
    description: c.description,
    image: c.image ? getSanityImageUrl(c.image, { width: 400, height: 300 }) : '',
    itemCount: c.itemCount || 0,
  }));
});

const totalPages = computed(() => collectionsData.value?.pagination?.totalPages || 1);

useSeoMeta({
  title: 'Collections | Directory',
  description: 'Curated collections of the best tools and resources.',
});
</script>

<template>
  <div class="mb-16">
    <!-- Header -->
    <div class="mt-8">
      <div class="w-full flex flex-col items-center justify-center gap-8">
        <SharedHeaderSection
          label="Collection"
          title="Explore by collections"
        />
      </div>
    </div>

    <!-- Collections Grid -->
    <LayoutContainer class="mt-8">
      <SharedEmptyState v-if="collections.length === 0" />

      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="collection in collections"
            :key="collection._id"
            :to="`/collection/${collection.slug}`"
            class="group flex flex-col rounded-lg border bg-card hover:bg-accent transition-colors overflow-hidden"
          >
            <!-- Image -->
            <div v-if="collection.image" class="aspect-video overflow-hidden">
              <img
                :src="collection.image"
                :alt="collection.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div v-else class="aspect-video bg-muted flex items-center justify-center">
              <span class="text-4xl">📚</span>
            </div>

            <!-- Content -->
            <div class="p-6 flex flex-col gap-2">
              <h2 class="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                {{ collection.name }}
              </h2>
              <p v-if="collection.description" class="text-muted-foreground line-clamp-2">
                {{ collection.description }}
              </p>
              <span v-if="collection.itemCount" class="text-sm text-muted-foreground mt-2">
                {{ collection.itemCount }} items
              </span>
            </div>
          </NuxtLink>
        </div>

        <!-- Pagination -->
        <div class="mt-8 flex items-center justify-center">
          <SharedPagination route-prefix="/collection" :total-pages="totalPages" />
        </div>
      </template>
    </LayoutContainer>
  </div>
</template>
