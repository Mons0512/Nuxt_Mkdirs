<script setup lang="ts">
import { cn } from '~/utils';

interface BlogCategory {
  _id: string;
  name: string;
  slug: string;
}

interface Props {
  categories: BlogCategory[];
  urlPrefix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  urlPrefix: '/blog',
});

const route = useRoute();

// Get current slug from route - handle both /blog/category/[slug] and /blog
const currentSlug = computed(() => {
  const path = route.path;
  if (path.includes('/blog/category/')) {
    return route.params.slug as string;
  }
  return '';
});
</script>

<template>
  <section class="w-full">
    <!-- Desktop View -->
    <LayoutContainer class="hidden md:block">
      <div class="flex items-center justify-center">
        <div class="h-9 overflow-hidden rounded-full border bg-background p-1 flex">
          <!-- All button -->
          <NuxtLink
            :to="urlPrefix"
            :class="cn(
              'h-7 rounded-full px-5 flex items-center justify-center text-sm font-medium transition-colors',
              !currentSlug
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            )"
          >
            All
          </NuxtLink>

          <!-- Category buttons -->
          <NuxtLink
            v-for="category in categories"
            :key="category._id"
            :to="`${urlPrefix}/category/${category.slug}`"
            :class="cn(
              'h-7 rounded-full px-5 flex items-center justify-center text-sm font-medium transition-colors',
              currentSlug === category.slug
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            )"
          >
            {{ category.name }}
          </NuxtLink>
        </div>
      </div>
    </LayoutContainer>

    <!-- Mobile View -->
    <div class="block md:hidden w-full px-4">
      <div class="flex items-center justify-center">
        <div class="h-9 overflow-hidden rounded-full border bg-background p-1 flex overflow-x-auto">
          <!-- All button -->
          <NuxtLink
            :to="urlPrefix"
            :class="cn(
              'h-7 rounded-full px-5 flex items-center justify-center text-sm font-medium transition-colors whitespace-nowrap',
              !currentSlug
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            )"
          >
            All
          </NuxtLink>

          <!-- Category buttons -->
          <NuxtLink
            v-for="category in categories"
            :key="category._id"
            :to="`${urlPrefix}/category/${category.slug}`"
            :class="cn(
              'h-7 rounded-full px-5 flex items-center justify-center text-sm font-medium transition-colors whitespace-nowrap',
              currentSlug === category.slug
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            )"
          >
            {{ category.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
