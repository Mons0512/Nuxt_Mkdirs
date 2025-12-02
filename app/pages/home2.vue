<script setup lang="ts">
import { Sparkles, Star, FileText, ArrowRight } from 'lucide-vue-next';
import { getSanityImageUrl } from '~/utils/sanity-image';

// Fetch latest items from Sanity
const { data: latestItemsData } = await useFetch('/api/items/latest', {
  query: { count: 6 },
});

const latestItems = computed(() => {
  if (!latestItemsData.value) return [];
  return latestItemsData.value.map((item: any) => ({
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

// Fetch featured items from Sanity
const { data: featuredItemsData } = await useFetch('/api/items/featured', {
  query: { count: 6 },
});

const featuredItems = computed(() => {
  if (!featuredItemsData.value) return [];
  return featuredItemsData.value.map((item: any) => ({
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

// Fetch latest blog posts from Sanity
const { data: blogPostsData } = await useFetch('/api/blog/latest', {
  query: { count: 6 },
});

const blogPosts = computed(() => {
  if (!blogPostsData.value) return [];
  return blogPostsData.value.map((post: any) => ({
    _id: post._id,
    title: post.title,
    slug: post.slug?.current || post.slug,
    excerpt: post.excerpt,
    image: post.image ? getSanityImageUrl(post.image, { width: 800, height: 600 }) : '',
    publishedAt: post.publishDate,
    author: post.author?.name || '',
    categories: post.categories?.map((c: any) => c.name) || [],
  }));
});

useSeoMeta({
  title: 'Home 2 - Directory Template',
  description: 'Alternative home page layout with Latest Products, Featured Products, and Blog Posts.',
});
</script>

<template>
  <LayoutContainer class="mt-12 mb-16 flex flex-col gap-12">
    <!-- Hero -->
    <HomeHero url-prefix="/home2" />

    <!-- Content Sections -->
    <div class="flex flex-col gap-12">
      <!-- Latest Products -->
      <section v-if="latestItems.length > 0" class="flex flex-col gap-8">
        <div class="flex items-center justify-between gap-8">
          <div class="flex items-center gap-2">
            <Sparkles class="w-4 h-4 text-indigo-500" />
            <h2 class="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
              Latest Products
            </h2>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ItemCard
            v-for="item in latestItems"
            :key="item._id"
            :item="item"
          />
        </div>

        <NuxtLink to="/search" class="mx-auto">
          <UiButton size="lg" class="text-lg font-semibold px-16 group flex items-center gap-2">
            <span class="tracking-wider">More Latest Products</span>
            <ArrowRight class="size-4 icon-scale" />
          </UiButton>
        </NuxtLink>
      </section>

      <!-- Featured Products -->
      <section v-if="featuredItems.length > 0" class="flex flex-col gap-8">
        <div class="flex items-center justify-between gap-8">
          <div class="flex items-center gap-2">
            <Star class="w-4 h-4 text-indigo-500" />
            <h2 class="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
              Featured Products
            </h2>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <ItemCard
            v-for="item in featuredItems"
            :key="item._id"
            :item="item"
          />
        </div>

        <NuxtLink to="/search?f=featured" class="mx-auto">
          <UiButton size="lg" class="text-lg font-semibold px-16 group flex items-center gap-2">
            <span class="tracking-wider">More Featured Products</span>
            <ArrowRight class="size-4 icon-scale" />
          </UiButton>
        </NuxtLink>
      </section>

      <!-- Latest Blog Posts -->
      <section v-if="blogPosts.length > 0" class="flex flex-col gap-8">
        <div class="flex items-center justify-between gap-8">
          <div class="flex items-center gap-2">
            <FileText class="w-4 h-4 text-indigo-500" />
            <h2 class="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
              Latest Posts
            </h2>
          </div>
        </div>

        <BlogGrid :posts="blogPosts" />

        <NuxtLink to="/blog" class="mx-auto">
          <UiButton size="lg" class="text-lg font-semibold px-16 group flex items-center gap-2">
            <span class="tracking-wider">More Blog Posts</span>
            <ArrowRight class="size-4 icon-scale" />
          </UiButton>
        </NuxtLink>
      </section>
    </div>

    <!-- Newsletter -->
    <HomeNewsletter />
  </LayoutContainer>
</template>
