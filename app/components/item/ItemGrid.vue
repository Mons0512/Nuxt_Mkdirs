<script setup lang="ts">
import type { ItemInfo } from '~/types';

interface Props {
  items: ItemInfo[];
  sponsorItems?: ItemInfo[];
  showSponsor?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  sponsorItems: () => [],
  showSponsor: false,
});

// Merge sponsor items into the list (at position 3)
const displayItems = computed<ItemInfo[]>(() => {
  if (!props.showSponsor || !props.sponsorItems.length) {
    return props.items;
  }
  
  const result: ItemInfo[] = [
    ...props.items.slice(0, 2),
  ];
  
  if (props.sponsorItems[0]) {
    result.push(props.sponsorItems[0]);
  }
  
  result.push(...props.items.slice(2));
  
  return result;
});
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    <ItemCard
      v-for="item in displayItems"
      :key="item._id"
      :item="item"
    />
  </div>
</template>
