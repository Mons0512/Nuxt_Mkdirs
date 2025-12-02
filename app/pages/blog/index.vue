<script setup lang="ts">
import { getSanityImageUrl } from '~/utils/sanity-image';

const route = useRoute();

// Fetch blog categories from Sanity
const { data: categoriesData } = await useFetch('/api/blog/categories');

const categories = computed(() => {
  if (!categoriesData.value) return [];
  return categoriesData.value.map((cat: any) => ({
    _id: cat._id,
    name: cat.name,
    slug: cat.slug?.current || cat.slug,
  }));
});

// Reactive query params
const postsQuery = computed(() => ({
  limit: 6,
  page: route.query.page || undefined,
}));

// Fetch blog posts from Sanity
const { data: postsData } = await useFetch('/api/blog', {
  query: postsQuery,
  watch: [postsQuery],
});

const posts = computed(() => {
  if (!postsData.value?.posts) return [];
  return postsData.value.posts.map((post: any) => ({
    _id: post._id,
    title: post.title,
    slug: post.slug?.current || post.slug,
    excerpt: post.excerpt,
    image: post.image ? getSanityImageUrl(post.image, { width: 800, height: 400 }) : '',
    publishedAt: post.publishDate,
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
