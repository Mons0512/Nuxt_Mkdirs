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
  }));
});

const totalPages = computed(() => itemsData.value?.pagination?.totalPages || 1);

const { data: groupsData } = await useFetch('/api/groups');

const { data: categoriesData } = await useFetch('/api/categories');

const groups = computed(() => {
  if (!groupsData.value || groupsData.value.length === 0) return [];
  return groupsData.value.map((group: any) => ({
    id: group.id,
    name: group.name,
    slug: group.slug,
    categories: group.categories?.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
    })) || [],
  }));
});

const categories = computed(() => {
  if (!categoriesData.value) return [];
  return categoriesData.value.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }));
});

const categoryOptions = computed(() => {
  return categories.value.map((cat: any) => ({
    value: cat.slug,
    label: cat.name,
  }));
});

const { data: tagsData } = await useFetch('/api/tags');

const tags = computed(() => {
  if (!tagsData.value) return [];
  return tagsData.value.map((tag: any) => ({
    value: tag.slug,
    label: tag.name,
  }));
});

useSeoMeta({
  title: 'Home - Directory Template',
  description: 'Discover the best tools, products, and resources for your next project.',
});
</script>

<template>
  <LayoutContainer class="mt-12 mb-16 flex flex-col gap-12">
    <!-- Hero -->
    <HomeHero />

    <!-- Main Content with Sidebar -->
    <div class="flex flex-col md:flex-row gap-8">
      <!-- Left sidebar: category/group list (desktop only) -->
      <div class="hidden md:block w-[250px] shrink-0">
        <div class="sticky top-24">
          <HomeGroupList :groups="groups" :categories="categories" url-prefix="/home2" />
        </div>
      </div>

      <!-- Right content: filter + item grid -->
      <div class="flex-1 flex flex-col gap-8">
        <!-- Search Filter -->
        <HomeSearchFilter :tags="tags" :categories="categoryOptions" url-prefix="/home2" :show-date-picker="false" />

        <!-- Item Grid -->
        <SharedEmptyState v-if="items.length === 0" />

        <template v-else>
          <ItemGrid :items="items" />

          <!-- Pagination -->
          <div class="mt-8 flex items-center justify-center">
            <SharedPagination route-prefix="/home2" :total-pages="totalPages" />
          </div>
        </template>
      </div>
    </div>
  </LayoutContainer>
</template>
