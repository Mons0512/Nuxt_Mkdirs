<script setup lang="ts">
import type { BlogPostInfo } from '~/types';

interface Props {
  posts: BlogPostInfo[];
}

defineProps<Props>();
</script>

<template>
  <div v-if="posts && posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    <BlogCard
      v-for="post in posts"
      :key="post._id"
      :post="post"
    />
  </div>
</template>
