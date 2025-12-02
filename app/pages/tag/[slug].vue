<script setup lang="ts">
const route = useRoute();
const slug = computed(() => route.params.slug as string);

// Fetch all tags from Sanity
const { data: tagsData } = await useFetch('/api/tags');

const tags = computed(() => {
  if (!tagsData.value) return [];
  return tagsData.value.map((tag: any) => ({
    _id: tag._id,
    name: tag.name,
    slug: tag.slug?.current || tag.slug,
    itemCount: 0,
  }));
});

// Reactive query params
const tagQuery = computed(() => ({
  limit: 12,
  page: route.query.page || undefined,
}));

// Fetch tag with items from Sanity
const { data: tagData, error } = await useFetch(() => `/api/tags/${slug.value}`, {
  query: tagQuery,
  watch: [tagQuery],
});

const currentTag = computed(() => {
  if (!tagData.value?.tag) return null;
  const t = tagData.value.tag;
  return {
    _id: t._id,
    name: t.name,
    slug: t.slug?.current || t.slug,
    description: t.description,
  };
});

const items = computed(() => {
  if (!tagData.value?.items) return [];
  return tagData.value.items.map((item: any) => ({
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

const totalPages = computed(() => tagData.value?.pagination?.totalPages || 1);

useSeoMeta({
  title: () => `${currentTag.value?.name || 'Tag'} - Directory Template`,
  description: () => `Explore items tagged with ${currentTag.value?.name || 'this tag'}.`,
});
</script>

<template>
  <div class="mb-16">
    <!-- Header -->
    <div class="mt-8">
      <div class="w-full flex flex-col items-center justify-center gap-8">
        <SharedHeaderSection
          label="Tag"
          title="Explore by tags"
        />

        <!-- Tag Filter -->
        <div class="w-full">
          <TagFilter :tags="tags" />
        </div>
      </div>
    </div>

    <!-- Results -->
    <LayoutContainer class="mt-4">
      <!-- Empty state -->
      <SharedEmptyState v-if="items.length === 0" />

      <!-- Items grid -->
      <template v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ItemCard2
            v-for="item in items"
            :key="item._id"
            :item="item"
          />
        </div>

        <!-- Pagination -->
        <div class="mt-8 flex items-center justify-center">
          <SharedPagination :route-prefix="`/tag/${slug}`" :total-pages="totalPages" />
        </div>
      </template>
    </LayoutContainer>
  </div>
</template>
