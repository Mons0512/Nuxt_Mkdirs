<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

interface Props {
  total: number;
  totalPages: number;
  currentPage?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  pageSize: 20,
  pageSizeOptions: () => [10, 20, 50, 100],
});

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void;
  (e: 'update:pageSize', size: number): void;
}>();

function goToPage(page: number) {
  if (page >= 1 && page <= props.totalPages) {
    emit('update:currentPage', page);
  }
}

function updatePageSize(size: number) {
  emit('update:pageSize', size);
  emit('update:currentPage', 1);
}

const startItem = computed(() => (props.currentPage - 1) * props.pageSize + 1);
const endItem = computed(() => Math.min(props.currentPage * props.pageSize, props.total));

const pages = computed(() => {
  const result: (number | string)[] = [];
  const total = props.totalPages;
  const current = props.currentPage;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      result.push(i);
    }
  } else {
    result.push(1);
    
    if (current > 3) {
      result.push('...');
    }
    
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      result.push(i);
    }
    
    if (current < total - 2) {
      result.push('...');
    }
    
    result.push(total);
  }

  return result;
});
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 border-t border-gray-200">
    <!-- Page info -->
    <div class="text-sm text-gray-500">
      Showing <span class="font-medium text-gray-900">{{ startItem }}</span> to <span class="font-medium text-gray-900">{{ endItem }}</span> of <span class="font-medium text-gray-900">{{ total }}</span> results
    </div>

    <div class="flex items-center gap-4">
      <!-- Page size selector -->
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-500">Show</label>
        <select
          :value="pageSize"
          @change="updatePageSize(Number(($event.target as HTMLSelectElement).value))"
          class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none bg-white"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
        </select>
        <span class="text-sm text-gray-500">per page</span>
      </div>

      <!-- Pagination controls -->
      <nav class="flex items-center gap-1">
        <!-- Previous -->
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft class="size-4" />
        </button>

        <!-- Page numbers -->
        <template v-for="(p, index) in pages" :key="index">
          <span
            v-if="p === '...'"
            class="inline-flex items-center justify-center h-9 w-9 text-sm text-gray-400"
          >
            ...
          </span>
          <button
            v-else
            @click="goToPage(p as number)"
            :class="
              p === currentPage
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            "
            class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 border transition-colors"
          >
            {{ p }}
          </button>
        </template>

        <!-- Next -->
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight class="size-4" />
        </button>
      </nav>
    </div>
  </div>
</template>
