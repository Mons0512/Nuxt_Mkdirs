<script setup lang="ts">
import { SearchX } from 'lucide-vue-next';

interface Props {
  title?: string;
  description?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'No results found',
  description: 'Try adjusting your search or filter to find what you\'re looking for.',
});
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <SearchX class="size-16 text-muted-foreground mb-4" />
    <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
    <p class="text-muted-foreground max-w-md">{{ description }}</p>
    <slot />
  </div>
</template>
