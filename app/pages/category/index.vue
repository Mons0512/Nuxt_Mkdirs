<script setup lang="ts">
const route = useRoute();

const { data: categoriesData } = await useFetch('/api/categories');

const categories = computed(() => {
  if (!categoriesData.value) return [];
  return categoriesData.value.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    itemCount: 0,
  }));
});

const itemsQuery = computed(() => ({
  limit: 12,
  category: route.query.category || undefined,
  sort: route.query.sort || undefined,
  page: route.query.page || undefined,
}));

const { data: itemsData } = await useFetch('/api/items', {
  query: itemsQuery,
  watch: [itemsQuery],
});

const items = computed(() => {
  if (!itemsData.value?.items) return [];
  return itemsData.value.items.map((item: any) => ({
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
    categories: item.categories?.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
    })) || [],
  }));
});

const totalPages = computed(() => itemsData.value?.pagination?.totalPages || 1);

const { data: sponsorItemData } = await useFetch('/api/items/sponsor');

const sponsorItem = computed(() => {
  if (!sponsorItemData.value) return null;
  const item = sponsorItemData.value;
  return {
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
  };
});

useSeoMeta({
  title: 'Category - Directory Template',
  description: 'Explore by category.',
});
</script>

<template>
  <div class="mb-16">
    <!-- Header -->
    <div class="mt-8">
      <div class="w-full flex flex-col items-center justify-center gap-8">
        <SharedHeaderSection
          label="Category"
          title="Explore by categories"
        />

        <!-- Category Filter -->
        <div class="w-full">
          <CategoryFilter :categories="categories" />
        </div>
      </div>
    </div>

    <!-- Results -->
    <LayoutContainer class="mt-4">
      <!-- Empty state -->
      <SharedEmptyState v-if="items.length === 0" />

      <!-- Items grid with sponsor -->
      <template v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- First 2 items -->
          <ItemCard2
            v-for="item in items.slice(0, 2)"
            :key="item.id"
            :item="item"
          />

          <!-- Sponsor card at position 3 -->
          <ItemSponsorItemCard v-if="sponsorItem" :item="sponsorItem" />

          <!-- Rest of items -->
          <ItemCard2
            v-for="item in items.slice(2)"
            :key="item.id"
            :item="item"
          />
        </div>

        <!-- Pagination -->
        <div class="mt-8 flex items-center justify-center">
          <SharedPagination route-prefix="/category" :total-pages="totalPages" />
        </div>
      </template>
    </LayoutContainer>
  </div>
</template>
