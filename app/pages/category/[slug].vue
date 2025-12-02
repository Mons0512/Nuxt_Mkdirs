<script setup lang="ts">
const route = useRoute();
const slug = computed(() => route.params.slug as string);

// Fetch all categories from Sanity
const { data: categoriesData } = await useFetch('/api/categories');

const categories = computed(() => {
  if (!categoriesData.value) return [];
  return categoriesData.value.map((cat: any) => ({
    _id: cat._id,
    name: cat.name,
    slug: cat.slug?.current || cat.slug,
    itemCount: 0,
  }));
});

// Reactive query params
const categoryQuery = computed(() => ({
  limit: 12,
  page: route.query.page || undefined,
}));

// Fetch category with items from Sanity
const { data: categoryData, error } = await useFetch(() => `/api/categories/${slug.value}`, {
  query: categoryQuery,
  watch: [categoryQuery],
});

const currentCategory = computed(() => {
  if (!categoryData.value?.category) return null;
  const c = categoryData.value.category;
  return {
    _id: c._id,
    name: c.name,
    slug: c.slug?.current || c.slug,
    description: c.description,
  };
});

const items = computed(() => {
  if (!categoryData.value?.items) return [];
  return categoryData.value.items.map((item: any) => ({
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

const totalPages = computed(() => categoryData.value?.pagination?.totalPages || 1);

useSeoMeta({
  title: () => `${currentCategory.value?.name || 'Category'} - Directory Template`,
  description: () => `Explore items in ${currentCategory.value?.name || 'this category'}.`,
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
          <SharedPagination :route-prefix="`/category/${slug}`" :total-pages="totalPages" />
        </div>
      </template>
    </LayoutContainer>
  </div>
</template>
