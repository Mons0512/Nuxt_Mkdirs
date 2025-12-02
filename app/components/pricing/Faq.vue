<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface Props {
  items: FaqItem[];
}

defineProps<Props>();

const openItem = ref<string | null>(null);

function toggleItem(id: string) {
  openItem.value = openItem.value === id ? null : id;
}
</script>

<template>
  <div class="w-full divide-y border rounded-lg">
    <div
      v-for="item in items"
      :key="item.id"
      class="overflow-hidden"
    >
      <button
        type="button"
        class="flex w-full items-center justify-between px-4 py-4 text-left font-medium transition-all hover:bg-muted/50"
        @click="toggleItem(item.id)"
      >
        <span class="text-base">{{ item.question }}</span>
        <ChevronDown
          :class="[
            'h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
            openItem === item.id && 'rotate-180'
          ]"
        />
      </button>
      <div
        v-show="openItem === item.id"
        class="px-4 pb-4 text-base text-muted-foreground"
      >
        <div v-html="item.answer.replace(/\n/g, '<br>')" />
      </div>
    </div>
  </div>
</template>
