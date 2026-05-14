<script setup lang="ts">
import { Sparkles, Star, FileText, ArrowRight } from 'lucide-vue-next';
import { useWebsiteSchema, useOrganizationSchema } from '~/composables/useJsonLd';

const { data: latestItemsData } = await useFetch('/api/items', {
  query: { count: 8 },
});

const latestItems = computed(() => {
  if (!latestItemsData.value?.items) return [];
  return latestItemsData.value.items.slice(0, 8).map((item: any) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    link: item.link,
    description: item.description,
    icon: item.icon_url,
    image: item.image_url,
    featured: item.featured,
    tags: item.tags?.map((t: any) => ({ id: t.id, name: t.name, slug: t.slug })) || [],
    categories: item.categories?.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug })) || [],
    category: item.categories?.[0]?.name || '',
  }));
});

const { data: featuredItemsData } = await useFetch('/api/items', {
  query: { featured: true, count: 8 },
});

const featuredItems = computed(() => {
  if (!featuredItemsData.value?.items) return [];
  return featuredItemsData.value.items.slice(0, 8).map((item: any) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    link: item.link,
    description: item.description,
    icon: item.icon_url,
    image: item.image_url,
    featured: item.featured,
    tags: item.tags?.map((t: any) => ({ id: t.id, name: t.name, slug: t.slug })) || [],
    categories: item.categories?.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug })) || [],
    category: item.categories?.[0]?.name || '',
  }));
});

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
    tags: item.tags?.map((t: any) => ({ id: t.id, name: t.name, slug: t.slug })) || [],
    categories: item.categories?.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug })) || [],
    category: item.categories?.[0]?.name || '',
  };
});

const { data: blogPostsData } = await useFetch('/api/blog/latest', {
  query: { count: 8 },
});

const blogPosts = computed(() => {
  if (!blogPostsData.value) return [];
  return blogPostsData.value.map((post: any) => ({
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

useSeoMeta({
  title: 'Home',
  description: 'Discover the best tools and resources in our directory. Browse latest products, featured items, and blog posts.',
});

useWebsiteSchema();
useOrganizationSchema();
</script>

<template>
  <LayoutContainer class="mt-12 mb-16 flex flex-col gap-12">
    <HomeHero url-prefix="/search" />

    <div class="flex flex-col gap-12">
      <section v-if="latestItems.length > 0" class="flex flex-col gap-8">
        <div class="flex items-center justify-between gap-8">
          <div class="flex items-center gap-2">
            <Sparkles class="w-4 h-4 text-primary" />
            <h2 class="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
              Latest Products
            </h2>
          </div>
          <NuxtLink to="/search" class="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
            More <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ItemCard
            v-for="item in latestItems.slice(0, 2)"
            :key="item.id"
            :item="item"
          />

          <ItemSponsorItemCard
            v-if="sponsorItem"
            :item="sponsorItem"
          />

          <ItemCard
            v-for="item in latestItems.slice(2)"
            :key="item.id"
            :item="item"
          />
        </div>
      </section>

      <section v-if="featuredItems.length > 0" class="flex flex-col gap-8">
        <div class="flex items-center justify-between gap-8">
          <div class="flex items-center gap-2">
            <Star class="w-4 h-4 text-primary" />
            <h2 class="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
              Featured Products
            </h2>
          </div>
          <NuxtLink to="/search?f=featured" class="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
            More <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ItemCard
            v-for="item in featuredItems"
            :key="item.id"
            :item="item"
          />
        </div>
      </section>

      <section v-if="blogPosts.length > 0" class="flex flex-col gap-8">
        <div class="flex items-center justify-between gap-8">
          <div class="flex items-center gap-2">
            <FileText class="w-4 h-4 text-primary" />
            <h2 class="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
              Latest Posts
            </h2>
          </div>
          <NuxtLink to="/blog" class="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
            More <ArrowRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </NuxtLink>
        </div>

        <BlogGrid :posts="blogPosts" />
      </section>
    </div>

    <HomeNewsletter />
  </LayoutContainer>
</template>
