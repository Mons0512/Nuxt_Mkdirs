<script setup lang="ts">
const route = useRoute();

const itemsQuery = computed(() => ({
  limit: 12,
  q: route.query.q || undefined,
  category: route.query.category || undefined,
  tag: route.query.tag || undefined,
  sort: route.query.sort || undefined,
  f: route.query.f || undefined,
  page: route.query.page || undefined,
  dateFrom: route.query.dateFrom || undefined,
  dateTo: route.query.dateTo || undefined,
}));

const { data: itemsData } = await useFetch('/api/items', {
  query: itemsQuery,
  watch: [itemsQuery],
});

const items = computed(() => {
  if (!itemsData.value?.items) return [];
  return itemsData.value.items.map((item: any) => ({
    _id: item.id,
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

const totalPages = computed(() => itemsData.value?.pagination?.totalPages || 1);

const { data: tagsData } = await useFetch('/api/tags');

const tags = computed(() => {
  if (!tagsData.value) return [];
  return tagsData.value.map((tag: any) => ({
    value: tag.slug,
    label: tag.name,
  }));
});

const { data: categoriesData } = await useFetch('/api/categories');

const categories = computed(() => {
  if (!categoriesData.value) return [];
  return categoriesData.value.map((cat: any) => ({
    value: cat.slug,
    label: cat.name,
  }));
});

useSeoMeta({
  title: 'Search - Directory Template',
  description: 'Search for your needs.',
});
</script>

<template>
  <div class="mb-16">
    <div class="mt-8">
      <div class="w-full flex flex-col items-center justify-center gap-8">
        <SharedHeaderSection
          label="Search"
          title="Search anything you want"
        />

        <div class="w-full">
          <LayoutContainer class="hidden md:flex md:flex-col">
            <HomeSearchFilter :tags="tags" :categories="categories" url-prefix="/search" />
          </LayoutContainer>

          <div class="md:hidden flex flex-col mx-4">
            <HomeSearchFilter :tags="tags" :categories="categories" url-prefix="/search" />
          </div>
        </div>
      </div>
    </div>

    <LayoutContainer class="mt-8">
      <SharedEmptyState v-if="items.length === 0" />

      <template v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ItemCard
            v-for="item in items"
            :key="item._id"
            :item="item"
          />
        </div>

        <div class="mt-8 flex items-center justify-center">
          <SharedPagination route-prefix="/search" :total-pages="totalPages" />
        </div>
      </template>
    </LayoutContainer>
  </div>
</template>
