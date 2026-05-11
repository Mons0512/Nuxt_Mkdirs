<script setup lang="ts">
const route = useRoute();

const { data: categoriesData } = await useFetch('/api/blog/categories');

const categories = computed(() => {
  if (!categoriesData.value) return [];
  return categoriesData.value.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }));
});

const postsQuery = computed(() => ({
  limit: 6,
  page: route.query.page || undefined,
}));

const { data: postsData } = await useFetch('/api/blog', {
  query: postsQuery,
  watch: [postsQuery],
});

const posts = computed(() => {
  if (!postsData.value?.posts) return [];
  return postsData.value.posts.map((post: any) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    image: post.image_url || '',
    publishedAt: post.publish_date,
    author: post.author?.name || '',
    categories: post.categories?.map((c: any) => c.name) || [],
  }));
});

const totalPages = computed(() => postsData.value?.pagination?.totalPages || 1);

useSeoMeta({
  title: 'Blog - Directory Template',
  description: 'Read our latest blog posts.',
});
</script>

<template>
  <div class="mb-16">
    <!-- Header -->
    <div class="mt-8 w-full flex flex-col items-center justify-center gap-8">
      <SharedHeaderSection
        label="Blog"
        title="Read our latest blog posts"
      />

      <!-- Blog Category Filter -->
      <BlogFilter :categories="categories" />
    </div>

    <!-- Blog Grid -->
    <LayoutContainer class="mt-8">
      <SharedEmptyState v-if="posts.length === 0" />

      <template v-else>
        <BlogGrid :posts="posts" />

        <!-- Pagination -->
        <div class="mt-8 flex items-center justify-center">
          <SharedPagination route-prefix="/blog" :total-pages="totalPages" />
        </div>
      </template>
    </LayoutContainer>

    <!-- Newsletter -->
    <LayoutContainer class="mt-8">
      <HomeNewsletter />
    </LayoutContainer>
  </div>
</template>
