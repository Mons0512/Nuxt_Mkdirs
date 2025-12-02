<script setup lang="ts">
import { Hash } from 'lucide-vue-next';
import type { ItemInfo } from '~/types';
import { cn } from '~/utils';
import { getSanityImageUrl } from '~/utils/sanity-image';

interface Props {
  item: ItemInfo;
}

const props = defineProps<Props>();

// Get icon URL from Sanity image
const iconUrl = computed(() => {
  const icon = props.item.icon as any;
  if (icon?.asset) {
    return getSanityImageUrl(icon, { width: 64, height: 64 });
  }
  return typeof icon === 'string' ? icon : '';
});
</script>

<template>
  <div
    :class="cn(
      'border rounded-lg flex flex-col justify-between p-6',
      'duration-300 shadow-sm hover:shadow-md transition-shadow',
      item.featured
        ? 'border-orange-300 border-spacing-1.5 bg-orange-50/50 dark:bg-orange-950/10 hover:bg-orange-50 dark:hover:bg-accent/60'
        : 'hover:bg-accent/60 transition-colors duration-300'
    )"
  >
    <!-- Top section -->
    <div class="flex flex-col gap-4">
      <!-- Icon + Name -->
      <div class="flex w-full items-center gap-4">
        <!-- Show icon if available, otherwise show fallback with first letter -->
        <img
          v-if="iconUrl"
          :src="iconUrl"
          :alt="`icon of ${item.name}`"
          :title="`icon of ${item.name}`"
          class="w-8 h-8 object-cover image-scale rounded-md shrink-0"
        />
        <div
          v-else
          class="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0"
        >
          {{ item.name.charAt(0).toUpperCase() }}
        </div>

        <NuxtLink :to="`/item/${item.slug}`" class="min-w-0 flex-1">
          <h3
            :class="cn(
              'text-xl font-medium truncate overflow-hidden text-ellipsis',
              item.featured && 'text-gradient_indigo-purple font-semibold'
            )"
          >
            {{ item.name }}
          </h3>
        </NuxtLink>
      </div>

      <!-- Categories -->
      <div class="flex flex-col gap-2">
        <div v-if="item.categories && item.categories.length > 0" class="flex flex-wrap gap-2 items-center">
          <NuxtLink
            v-for="category in item.categories"
            :key="category._id"
            :to="`/category/${category.slug}`"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-2 py-1 h-6"
          >
            <span class="text-sm text-muted-foreground">{{ category.name }}</span>
          </NuxtLink>
        </div>
        <div v-else-if="item.category" class="flex flex-wrap gap-2 items-center">
          <NuxtLink
            :to="`/category/${item.category}`"
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground px-2 py-1 h-6"
          >
            <span class="text-sm text-muted-foreground">{{ item.category }}</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Description - min-h-[4.5rem] ensures consistent card height -->
      <NuxtLink :to="`/item/${item.slug}`" class="block cursor-pointer">
        <p class="text-sm line-clamp-3 leading-relaxed min-h-[4.5rem]">
          {{ item.description }}
        </p>
      </NuxtLink>
    </div>

    <!-- Bottom section: Tags -->
    <div class="mt-4 flex justify-end items-center">
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
