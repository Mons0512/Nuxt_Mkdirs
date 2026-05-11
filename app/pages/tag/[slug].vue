<script setup lang="ts">
const route = useRoute();
const slug = computed(() => route.params.slug as string);

const { data: tagsData } = await useFetch('/api/tags');

const tags = computed(() => {
  if (!tagsData.value) return [];
  return tagsData.value.map((tag: any) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    itemCount: 0,
  }));
});

const tagQuery = computed(() => ({
  limit: 12,
  page: route.query.page || undefined,
}));

const { data: tagData, error } = await useFetch(() => `/api/tags/${slug.value}`, {
  query: tagQuery,
  watch: [tagQuery],
});

const currentTag = computed(() => {
  if (!tagData.value?.tag) return null;
  const t = tagData.value.tag;
  return {
    id: t.id,
    name: t.name,
    slug: t.slug,
    description: t.description,
  };
});

const items = computed(() => {
  if (!tagData.value?.items) return [];
  return tagData.value.items.map((item: any) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    link: item.link,
    description: item.description,
    icon: item.icon_url,
    image: item.image_url,
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
    <div class="mt-8">
      <div class="w-full flex flex-col items-center justify-center gap-8">
        <SharedHeaderSection
          label="Tag"
          :title="`Explore items tagged with ${currentTag.value?.name || 'this tag'}`"
        />

        <div class="w-full">
          <TagFilter :tags="tags" />
        </div>
      </div>
    </div>

    <LayoutContainer class="mt-8">
      <SharedEmptyState v-if="items.length === 0" />

      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ItemCard2
            v-for="item in items"
            :key="item.id"
            :item="item"
          />
        </div>

        <div v-if="totalPages > 1" class="mt-8 flex justify-center">
          <SharedPagination :route-prefix="`/tag/${slug}`" :total-pages="totalPages" />
        </div>
      </template>
    </LayoutContainer>
  </div>
</template>
