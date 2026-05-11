<script setup lang="ts">
const route = useRoute();
const slug = computed(() => route.params.slug as string);

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

const categoryQuery = computed(() => ({
  limit: 12,
  page: route.query.page || undefined,
}));

const { data: categoryData, error } = await useFetch(() => `/api/categories/${slug.value}`, {
  query: categoryQuery,
  watch: [categoryQuery],
});

const currentCategory = computed(() => {
  if (!categoryData.value?.category) return null;
  const c = categoryData.value.category;
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
  };
});

const items = computed(() => {
  if (!categoryData.value?.items) return [];
  return categoryData.value.items.map((item: any) => ({
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

const totalPages = computed(() => categoryData.value?.pagination?.totalPages || 1);

useSeoMeta({
  title: () => `${currentCategory.value?.name || 'Category'} - Directory Template`,
  description: () => `Explore items in ${currentCategory.value?.name || 'this category'}.`,
});
</script>

<template>
  <div class="mb-16">
    <div class="mt-8">
      <div class="w-full flex flex-col items-center justify-center gap-8">
        <SharedHeaderSection
          label="Category"
          :title="`Explore items in ${currentCategory.value?.name || 'this category'}`"
        />

        <div class="w-full">
          <CategoryFilter :categories="categories" />
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
          <SharedPagination :route-prefix="`/category/${slug}`" :total-pages="totalPages" />
        </div>
      </template>
    </LayoutContainer>
  </div>
</template>
