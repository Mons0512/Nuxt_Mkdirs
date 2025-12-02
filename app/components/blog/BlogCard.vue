<script setup lang="ts">
import type { BlogPostInfo } from '~/types';
import { getLocaleDate } from '~/utils';

interface Props {
  post: BlogPostInfo;
}

defineProps<Props>();
</script>

<template>
  <div class="group cursor-pointer flex flex-col gap-4">
    <!-- Image container -->
    <div class="group overflow-hidden relative aspect-[4/3] rounded-lg transition-all">
      <NuxtLink :to="`/blog/${post.slug}`">
        <div v-if="post.image" class="relative w-full h-full">
          <img
            :src="post.image"
            :alt="post.title"
            :title="post.title"
            class="object-cover w-full h-full image-scale"
          />

          <div v-if="post.categories && post.categories.length > 0" class="absolute left-2 bottom-2 opacity-100 transition-opacity duration-300">
            <div class="flex flex-wrap gap-1">
              <span
                v-for="category in post.categories"
                :key="category"
                class="text-xs font-medium text-white bg-black bg-opacity-50 px-2 py-1 rounded-md"
              >
                {{ category }}
              </span>
            </div>
          </div>
        </div>
        <div v-else class="w-full h-full bg-muted flex items-center justify-center">
          <span class="text-muted-foreground">No Image</span>
        </div>
      </NuxtLink>
    </div>

    <!-- Post info container -->
    <div class="flex flex-col flex-grow">
      <div>
        <!-- Post title -->
        <h3 class="text-lg line-clamp-2 font-medium">
          <NuxtLink :to="`/blog/${post.slug}`">
            <span
              class="bg-gradient-to-r from-green-200 to-green-100 
                bg-[length:0px_10px] bg-left-bottom bg-no-repeat
                transition-[background-size]
                duration-500
                hover:bg-[length:100%_3px]
                group-hover:bg-[length:100%_10px]
                dark:from-purple-800 dark:to-purple-900"
            >
              {{ post.title }}
            </span>
          </NuxtLink>
        </h3>
      </div>

      <!-- Author and date -->
      <div class="mt-auto pt-4 flex items-center justify-between space-x-4 text-muted-foreground">
        <div class="flex items-center gap-2">
          <div class="border h-6 w-6 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
            {{ post.author?.charAt(0)?.toUpperCase() || 'A' }}
          </div>
          <span class="truncate text-sm">{{ post.author || 'Anonymous' }}</span>
        </div>

        <time v-if="post.publishedAt" class="truncate text-sm" :datetime="post.publishedAt">
          {{ getLocaleDate(post.publishedAt) }}
        </time>
      </div>
    </div>
  </div>
</template>
