<script setup lang="ts">
const route = useRoute();
const slug = computed(() => route.params.slug as string);

const { data: categoriesData } = await useFetch('/api/blog/categories');

const categories = computed(() => {
  if (!categoriesData.value) return [];
  return categoriesData.value.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
  }));
});

const currentCategory = computed(() =>
  categories.value.find((c: any) => c.slug === slug.value)
);

const postsQuery = computed(() => ({
  limit: 6,
  category: slug.value,
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
  title: () => `${currentCategory.value?.name || 'Category'} - Blog - Directory Template`,
  description: () => `Read blog posts about ${currentCategory.value?.name || 'this category'}.`,
});
</script>

<template>
  <div class="mb-16">
    <div class="mt-8 w-full flex flex-col items-center justify-center gap-8">
      <SharedHeaderSection
        label="Blog"
        title="Read our latest blog posts"
      />

      <BlogFilter :categories="categories" />
    </div>

    <LayoutContainer class="mt-8">
      <SharedEmptyState v-if="posts.length === 0" />

      <template v-else>
        <BlogGrid :posts="posts" />

        <div class="mt-8 flex items-center justify-center">
          <SharedPagination :route-prefix="`/blog/category/${slug}`" :total-pages="totalPages" />
        </div>
      </template>
    </LayoutContainer>
  </div>
</template>
