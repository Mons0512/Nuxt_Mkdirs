<script setup lang="ts">
import { Hash } from 'lucide-vue-next';
import { cn } from '~/utils';

interface Props {
  item: {
    id?: string;
    name?: string;
    slug?: string;
    link?: string | null;
    description?: string | null;
    icon?: string | null;
    image?: string | null;
    featured?: boolean;
    tags?: Array<{ id?: string; name: string; slug?: string }>;
    categories?: Array<{ id?: string; name: string; slug?: string }>;
    category?: string;
  };
}

const props = defineProps<Props>();

const iconUrl = computed(() => {
  return props.item.icon || '';
});

const bgImageUrl = computed(() => {
  return props.item.image || '';
});
</script>

<template>
  <div
    :class="cn(
      'relative border rounded-lg flex flex-col justify-between overflow-hidden min-h-[280px]',
      'duration-300 shadow-sm hover:shadow-lg transition-all group',
      item.featured
        ? 'border-orange-300 border-spacing-1.5'
        : ''
    )"
  >
    <div
      v-if="bgImageUrl"
      class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
      :style="{ backgroundImage: `url(${bgImageUrl})` }"
    />
    <div
      :class="cn(
        'absolute inset-0 transition-opacity duration-300',
        bgImageUrl
          ? 'bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60'
          : 'bg-card'
      )"
    />

    <div class="relative z-10 flex flex-col justify-between h-full p-6">
      <div class="flex items-start justify-between gap-4">
        <div v-if="iconUrl" class="flex items-center justify-center w-16 h-16 rounded-lg bg-white/10 backdrop-blur-sm">
          <img :src="iconUrl" :alt="item.name" class="w-10 h-10 object-contain" />
        </div>
        <div v-else class="flex items-center justify-center w-16 h-16 rounded-lg bg-white/10 backdrop-blur-sm">
          <span class="text-2xl font-bold text-white/50">{{ item.name?.charAt(0)?.toUpperCase() || '?' }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <NuxtLink :to="`/item/${item.slug}`" class="group/title">
          <h3 class="text-xl font-semibold text-white group-hover/title:text-primary transition-colors line-clamp-2">
            {{ item.name }}
          </h3>
        </NuxtLink>
        <p class="text-sm text-white/70 line-clamp-2">
          {{ item.description }}
        </p>
        <div v-if="item.tags && item.tags.length > 0" class="flex flex-wrap gap-2">
          <NuxtLink
            v-for="(tag, index) in item.tags.slice(0, 3)"
            :key="index"
            :to="`/tag/${(tag.slug || tag.name).toLowerCase().replace(/[\s/]+/g, '-')}`"
            class="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors"
          >
            <Hash class="w-3 h-3" />
            {{ tag.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
