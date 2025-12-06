<script setup lang="ts">
import { ArrowRight, Hash, Sparkles } from 'lucide-vue-next';
import type { ItemInfo } from '~/types';
import { cn } from '~/utils';
import { getSanityImageUrl } from '~/utils/sanity-image';

interface Props {
  item: ItemInfo;
}

const props = defineProps<Props>();

// Get image URL from Sanity image or string
const imageUrl = computed(() => {
  const img = props.item.image as any;
  if (img?.asset) {
    return getSanityImageUrl(img, { width: 800, height: 450 });
  }
  return typeof img === 'string' ? img : '';
});
</script>

<template>
  <div
    :class="cn(
      'cursor-pointer border rounded-lg flex flex-col justify-between gap-4',
      'hover:bg-accent/60 transition-colors duration-300'
    )"
  >
    <!-- Top section -->
    <div class="flex flex-col gap-4">
      <!-- Image container -->
      <div class="group overflow-hidden relative aspect-video rounded-t-md transition-all border-b">
        <!-- Image -->
        <div class="relative w-full h-full" v-if="imageUrl">
          <img
            :src="imageUrl"
            :alt="`image of ${item.name}`"
            :title="`image of ${item.name}`"
            class="object-cover w-full h-full image-scale"
          />
        </div>
        <!-- Placeholder when no image -->
        <div v-else class="relative w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
          <span class="text-4xl font-bold text-muted-foreground/30">{{ item.name?.charAt(0)?.toUpperCase() || '?' }}</span>
        </div>

        <!-- Sponsored badge (always visible) -->
        <div class="absolute top-2 left-2">
          <span class="inline-flex items-center gap-1 text-xs font-medium text-white bg-primary/90 backdrop-blur-sm rounded-full px-2 py-1">
            <Sparkles class="size-3" />
            Sponsored
          </span>
        </div>

        <!-- Visit Website overlay -->
        <a
          v-if="item.link"
          :href="item.link"
          target="_blank"
          rel="noopener noreferrer"
          class="absolute inset-0 flex items-center justify-center bg-black opacity-0 group-hover:opacity-75 transition-opacity duration-300 rounded-t-lg"
        >
          <span class="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Visit Website
          </span>
        </a>
      </div>

      <!-- Center content -->
      <NuxtLink :to="`/item/${item.slug}`" class="flex flex-col gap-4 group">
        <div class="px-4 flex flex-col gap-4">
          <div class="flex items-center justify-between gap-4">
            <h3 class="min-w-0 flex-1 text-xl font-medium truncate overflow-hidden text-ellipsis text-gradient_indigo-purple font-semibold">
              <span class="flex items-center gap-2">
                <span class="truncate">{{ item.name }}</span>
              </span>
            </h3>
            <div class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0">
              <span>Details</span>
              <ArrowRight class="size-4 icon-scale" />
            </div>
          </div>

          <!-- Description -->
          <p class="text-sm line-clamp-2 leading-relaxed min-h-[3rem]">
            {{ item.description }}
          </p>
        </div>
      </NuxtLink>
    </div>

    <!-- Bottom section: Tags -->
    <div class="px-4 pb-4 flex justify-end items-center">
      <div v-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-2 items-center">
        <NuxtLink
          v-for="(tag, index) in item.tags.slice(0, 5)"
          :key="index"
          :to="`/tag/${typeof tag === 'string' ? tag.toLowerCase().replace(/[\s/]+/g, '-') : tag}`"
          class="flex items-center justify-center space-x-0.5 group"
        >
          <Hash class="w-3 h-3 text-muted-foreground icon-scale" />
          <span class="text-sm text-muted-foreground link-underline">
            {{ typeof tag === 'string' ? tag : tag }}
          </span>
        </NuxtLink>
        <span v-if="item.tags.length > 5" class="text-sm text-muted-foreground px-1">
          +{{ item.tags.length - 5 }}
        </span>
      </div>
    </div>
  </div>
</template>
