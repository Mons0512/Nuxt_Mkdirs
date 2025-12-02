<script setup lang="ts">
const route = useRoute();

// Reactive query params for items API
const itemsQuery = computed(() => ({
  limit: 12,
  q: route.query.q || undefined,
  category: route.query.category || undefined,
  tag: route.query.tag || undefined,
  sort: route.query.sort || undefined,
  f: route.query.f || undefined,
  page: route.query.page || undefined,
}));

// Fetch items from Sanity - reactive to URL changes
const { data: itemsData } = await useFetch('/api/items', {
  query: itemsQuery,
  watch: [itemsQuery],
});

const items = computed(() => {
  if (!itemsData.value?.items) return [];
  return itemsData.value.items.map((item: any) => ({
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

// Fetch groups from Sanity
const { data: groupsData } = await useFetch('/api/groups');

// Fetch categories from Sanity
const { data: categoriesData } = await useFetch('/api/categories');

// Groups (if available)
const groups = computed(() => {
  if (!groupsData.value || groupsData.value.length === 0) return [];
  return groupsData.value.map((group: any) => ({
    _id: group._id,
    name: group.name,
    slug: group.slug?.current || group.slug,
    categories: group.categories?.map((cat: any) => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug?.current || cat.slug,
    })) || [],
  }));
});

// Categories (flat list)
const categories = computed(() => {
  if (!categoriesData.value) return [];
  return categoriesData.value.map((cat: any) => ({
    _id: cat._id,
    name: cat.name,
    slug: cat.slug?.current || cat.slug,
  }));
});

// Fetch tags from Sanity
const { data: tagsData } = await useFetch('/api/tags');

const tags = computed(() => {
  if (!tagsData.value) return [];
  return tagsData.value.map((tag: any) => ({
    value: tag.slug?.current || tag.slug,
    label: tag.name,
  }));
});

useSeoMeta({
  title: 'Directory - The Best Directory Website Template',
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
          <HomeGroupList :groups="groups" :categories="categories" url-prefix="/" />
        </div>
      </div>

      <!-- Right content: filter + item grid -->
      <div class="flex-1">
        <div class="flex flex-col gap-8">
          <!-- Search Filter -->
          <HomeSearchFilter :tags="tags" url-prefix="/" />

          <!-- Item Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <ItemCard2
              v-for="item in items"
              :key="item._id"
              :item="item"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Newsletter -->
    <HomeNewsletter />
  </LayoutContainer>
</template>
