<script setup lang="ts">
import type { CategoryInfo } from '~/types';

interface Props {
  categories: CategoryInfo[];
}

defineProps<Props>();
</script>

<template>
  <div class="py-8">
    <h2 class="text-2xl font-bold mb-6">Browse by Category</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <NuxtLink
        v-for="category in categories"
        :key="category._id"
        :to="`/category/${category.slug}`"
        class="group flex flex-col items-center justify-center p-6 rounded-lg border bg-card hover:bg-accent transition-colors"
      >
        <span class="text-lg font-medium group-hover:text-primary transition-colors">
          {{ category.name }}
        </span>
        <span v-if="category.itemCount" class="text-sm text-muted-foreground mt-1">
          {{ category.itemCount }} items
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
