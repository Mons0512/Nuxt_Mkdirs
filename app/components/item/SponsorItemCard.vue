<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next';
import type { ItemInfo } from '~/types';
import { cn } from '~/utils';
import { getSanityImageUrl } from '~/utils/sanity-image';

interface Props {
  item: ItemInfo;
}

const props = defineProps<Props>();

// Get icon URL from Sanity image or string
const iconUrl = computed(() => {
  const icon = props.item.icon as any;
  if (icon?.asset) {
    return getSanityImageUrl(icon, { width: 64, height: 64 });
  }
  return typeof icon === 'string' ? icon : '';
});
</script>

<template>
  <a
    :href="item.link"
    target="_blank"
    rel="noopener noreferrer"
    :class="cn(
      'border rounded-lg flex flex-col justify-between p-6',
      'duration-300 shadow-sm hover:shadow-md transition-shadow',
      'border-sky-300 border-spacing-1.5 bg-sky-50/50 dark:bg-sky-950/10 hover:bg-sky-50 dark:hover:bg-accent/60'
    )"
  >
    <!-- Top section -->
    <div class="flex flex-col gap-4">
      <!-- Icon + Name -->
      <div class="flex w-full items-center gap-4">
        <img
          v-if="iconUrl"
          :src="iconUrl"
          :alt="`icon of ${item.name}`"
          :title="`icon of ${item.name}`"
          class="w-8 h-8 object-cover image-scale rounded-md"
        />
        <div
          v-else
          class="w-8 h-8 rounded-md bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-sm shrink-0"
        >
          {{ item.name.charAt(0).toUpperCase() }}
        </div>

        <div class="flex-1 flex justify-between items-center gap-4 min-w-0">
          <div class="min-w-0 flex-1">
            <h3
              :class="cn(
                'text-xl font-medium truncate',
                item.featured && 'text-gradient_indigo-purple font-semibold'
              )"
            >
              {{ item.name }}
            </h3>
          </div>

          <span class="text-sm text-sky-500 border border-sky-500 rounded-md px-2 py-0.5 shrink-0">
            AD
          </span>
        </div>
      </div>

      <!-- Description -->
      <p class="text-sm line-clamp-3 leading-relaxed min-h-[4.5rem]">
        {{ item.description }}
      </p>
    </div>

    <!-- Bottom section -->
    <div class="mt-4 w-full flex justify-center items-center">
      <button
        :class="cn(
          'overflow-hidden rounded-full w-full bg-sky-500 hover:bg-sky-600 h-10 px-8',
          'group transition-transform duration-300 ease-in-out hover:scale-105'
        )"
      >
        <div class="flex items-center justify-center gap-2">
          <span class="text-white font-semibold">Visit Website</span>
          <ArrowUpRight class="text-white font-semibold size-4 transition-transform group-hover:translate-x-1" />
        </div>
      </button>
    </div>
  </a>
</template>
