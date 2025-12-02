<script setup lang="ts">
import type { CategoryInfo } from '~/types';
import { cn } from '~/utils';

interface Props {
  categories: CategoryInfo[];
  urlPrefix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  urlPrefix: '/',
});

const route = useRoute();

function isActive(slug: string) {
  return route.query.category === slug;
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <h3 class="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
      Categories
    </h3>
    
    <NuxtLink
      :to="urlPrefix"
      :class="cn(
        'px-3 py-2 rounded-md text-sm font-medium transition-colors',
        !route.query.category
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
      )"
    >
      All
    </NuxtLink>
    
    <NuxtLink
      v-for="category in categories"
      :key="category._id"
      :to="{ path: urlPrefix, query: { category: category.slug } }"
      :class="cn(
        'px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between',
        isActive(category.slug)
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
      )"
    >
      <span>{{ category.name }}</span>
      <span v-if="category.itemCount" class="text-xs text-muted-foreground">
        {{ category.itemCount }}
      </span>
    </NuxtLink>
  </div>
</template>
