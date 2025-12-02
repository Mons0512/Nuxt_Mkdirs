<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import { cn } from '~/utils';

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

interface GroupItem {
  _id: string;
  name: string;
  slug: string;
  categories?: CategoryItem[];
}

interface Props {
  groups?: GroupItem[];
  categories?: CategoryItem[];
  urlPrefix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  urlPrefix: '/',
});

const route = useRoute();
const router = useRouter();

const selectedCategory = computed(() => (route.query.category as string) || '');
const openGroups = ref<Set<string>>(new Set());

// Check if we're using groups or flat categories
const hasGroups = computed(() => props.groups && props.groups.length > 0);

// Auto-expand group containing selected category
watch(selectedCategory, (newVal) => {
  if (!newVal || !hasGroups.value) {
    openGroups.value = new Set();
    return;
  }
  
  const parentGroup = props.groups?.find(group => 
    group.categories?.some(cat => cat.slug === newVal)
  );
  
  if (parentGroup) {
    openGroups.value = new Set([parentGroup.slug]);
  }
}, { immediate: true });

function toggleGroup(slug: string) {
  const newSet = new Set<string>();
  if (!openGroups.value.has(slug)) {
    newSet.add(slug);
  }
  openGroups.value = newSet;
}

function handleCategoryClick(categorySlug: string) {
  const newQuery = { ...route.query };
  
  if (!categorySlug || categorySlug === 'all') {
    delete newQuery.category;
  } else {
    newQuery.category = categorySlug;
  }
  
  delete newQuery.page;
  
  router.push({ path: props.urlPrefix, query: newQuery });
}

function isAllSelected() {
  return !selectedCategory.value;
}
</script>

<template>
  <div class="hidden md:flex border rounded-lg p-4">
    <ul class="flex flex-col gap-y-2 w-full">
      <!-- All Categories -->
      <li>
        <button
          :class="cn(
            'w-full px-3 py-3 rounded-md text-sm font-medium text-left transition-colors',
            isAllSelected()
              ? 'bg-primary text-primary-foreground'
              : 'hover:bg-muted'
          )"
          @click="handleCategoryClick('all')"
        >
          All Categories
        </button>
      </li>

      <!-- Mode 1: Groups with collapsible categories -->
      <template v-if="hasGroups">
        <li v-for="group in groups" :key="group._id" class="w-full space-y-2">
          <button
            class="w-full px-3 py-3 rounded-md text-sm font-medium text-left transition-colors hover:bg-muted flex items-center justify-between"
            @click="toggleGroup(group.slug)"
          >
            <span>{{ group.name }}</span>
            <ChevronDown
              v-if="group.categories && group.categories.length > 0"
              :class="cn(
                'h-4 w-4 transition-transform duration-200',
                openGroups.has(group.slug) && 'rotate-180'
              )"
            />
          </button>

          <!-- Subcategories -->
          <div
            v-if="group.categories && group.categories.length > 0 && openGroups.has(group.slug)"
            class="space-y-1"
          >
            <button
              v-for="category in group.categories"
              :key="category._id"
              :class="cn(
                'w-full px-6 py-2 rounded-md text-sm font-medium text-left transition-colors',
                selectedCategory === category.slug
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )"
              @click="handleCategoryClick(category.slug)"
            >
              {{ category.name }}
            </button>
          </div>
        </li>
      </template>

      <!-- Mode 2: Flat categories list -->
      <template v-else-if="categories && categories.length > 0">
        <li v-for="category in categories" :key="category._id">
          <button
            :class="cn(
              'w-full px-3 py-3 rounded-md text-sm font-medium text-left transition-colors',
              selectedCategory === category.slug
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )"
            @click="handleCategoryClick(category.slug)"
          >
            {{ category.name }}
          </button>
        </li>
      </template>
    </ul>
  </div>
</template>
