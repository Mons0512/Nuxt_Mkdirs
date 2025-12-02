<script setup lang="ts">
import { Search } from 'lucide-vue-next';
import { cn } from '~/utils';

interface Props {
  urlPrefix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  urlPrefix: '/',
});

const router = useRouter();
const route = useRoute();
const searchQuery = ref((route.query.q as string) || '');

function handleSearch() {
  const query = searchQuery.value.trim();
  const newQuery: Record<string, string> = {};
  
  if (query) {
    newQuery.q = query;
  }
  
  router.push({
    path: props.urlPrefix,
    query: newQuery,
  });
}
</script>

<template>
  <div class="flex items-center justify-center">
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search any products you need"
      autocomplete="off"
      :class="cn(
        'w-[320px] sm:w-[480px] md:w-[640px] h-12 rounded-r-none',
        'border border-input bg-background px-3 py-1 text-base shadow-sm transition-colors',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary focus:border-2 focus:border-r-0'
      )"
      @keydown.enter="handleSearch"
    />
    <UiButton type="submit" class="rounded-l-none size-12" @click="handleSearch">
      <Search class="size-6" aria-hidden="true" />
      <span class="sr-only">Search</span>
    </UiButton>
  </div>
</template>
