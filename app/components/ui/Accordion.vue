<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import { cn } from '~/utils';

interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

interface Props {
  items: AccordionItem[];
  type?: 'single' | 'multiple';
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'single',
});

const openItems = ref<Set<string>>(new Set());

function toggleItem(id: string) {
  if (props.type === 'single') {
    if (openItems.value.has(id)) {
      openItems.value = new Set();
    } else {
      openItems.value = new Set([id]);
    }
  } else {
    const newSet = new Set(openItems.value);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    openItems.value = newSet;
  }
}

function isOpen(id: string) {
  return openItems.value.has(id);
}
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <div
      v-for="item in items"
      :key="item.id"
      class="border-b"
    >
      <!-- Trigger -->
      <button
        type="button"
        class="flex flex-1 w-full items-center justify-between py-4 font-medium transition-all hover:underline"
        @click="toggleItem(item.id)"
      >
        <div class="text-left text-base">{{ item.title }}</div>
        <ChevronDown
          :class="cn(
            'h-4 w-4 shrink-0 transition-transform duration-200',
            isOpen(item.id) && 'rotate-180'
          )"
        />
      </button>

      <!-- Content with animation -->
      <div
        :class="cn(
          'overflow-hidden text-sm transition-all duration-200 ease-in-out',
          isOpen(item.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )"
      >
        <div class="pb-4 pt-0 text-base text-muted-foreground">
          <div v-html="item.content.replace(/\n/g, '<br>')" />
        </div>
      </div>
    </div>
  </div>
</template>
