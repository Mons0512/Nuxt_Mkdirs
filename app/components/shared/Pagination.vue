<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { cn } from '~/utils';

interface Props {
  routePrefix?: string;
  totalPages: number;
  currentPage?: number;
}

const props = withDefaults(defineProps<Props>(), {
  routePrefix: '/',
  currentPage: 1,
});

const route = useRoute();

const page = computed(() => {
  return Number(route.query.page) || props.currentPage;
});

const pages = computed(() => {
  const result: (number | string)[] = [];
  const total = props.totalPages;
  const current = page.value;

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

function getPageUrl(pageNum: number) {
  const query = { ...route.query, page: pageNum.toString() };
  if (pageNum === 1) {
    delete query.page;
  }
  return { path: props.routePrefix, query };
}
</script>

<template>
  <nav v-if="totalPages > 1" class="flex items-center justify-center gap-1">
    <!-- Previous -->
    <NuxtLink
      v-if="page > 1"
      :to="getPageUrl(page - 1)"
      class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
    >
      <ChevronLeft class="size-4" />
    </NuxtLink>
    <span
      v-else
      class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 border border-input bg-background opacity-50 cursor-not-allowed"
    >
      <ChevronLeft class="size-4" />
    </span>

    <!-- Page numbers -->
    <template v-for="(p, index) in pages" :key="index">
      <span
        v-if="p === '...'"
        class="inline-flex items-center justify-center h-9 w-9 text-sm text-muted-foreground"
      >
        ...
      </span>
      <NuxtLink
        v-else
        :to="getPageUrl(p as number)"
        :class="cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 border',
          p === page
            ? 'bg-primary text-primary-foreground border-primary'
            : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
        )"
      >
        {{ p }}
      </NuxtLink>
    </template>

    <!-- Next -->
    <NuxtLink
      v-if="page < totalPages"
      :to="getPageUrl(page + 1)"
      class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
    >
      <ChevronRight class="size-4" />
    </NuxtLink>
    <span
      v-else
      class="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 w-9 border border-input bg-background opacity-50 cursor-not-allowed"
    >
      <ChevronRight class="size-4" />
    </span>
  </nav>
</template>
