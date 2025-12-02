<script setup lang="ts">
interface FilterOption {
  value: string;
  label: string;
}

interface Props {
  tags?: FilterOption[];
  categories?: FilterOption[];
  urlPrefix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  tags: () => [],
  categories: () => [],
  urlPrefix: '/',
});

const route = useRoute();
const router = useRouter();

const selectedCategory = computed(() => (route.query.category as string) || '');
const selectedTags = computed({
  get: () => {
    const tagParam = route.query.tag as string;
    return tagParam ? tagParam.split(',') : [];
  },
  set: (val: string[]) => {
    handleFilterChange('tag', val.length > 0 ? val.join(',') : '');
  },
});
const selectedSort = computed({
  get: () => (route.query.sort as string) || '',
  set: (val: string) => handleFilterChange('sort', val),
});
const selectedFilter = computed({
  get: () => (route.query.f as string) || '',
  set: (val: string) => handleFilterChange('f', val),
});

const sortOptions: FilterOption[] = [
  { value: '', label: 'Sort by Time (desc)' },
  { value: 'time-asc', label: 'Sort by Time (asc)' },
  { value: 'name-asc', label: 'Sort by Name (A-Z)' },
  { value: 'name-desc', label: 'Sort by Name (Z-A)' },
];

const filterOptions: FilterOption[] = [
  { value: '', label: 'No Filter' },
  { value: 'featured', label: 'Featured' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
];

function handleFilterChange(type: string, value: string) {
  const newQuery = { ...route.query };
  
  if (!value) {
    delete newQuery[type];
  } else {
    newQuery[type] = value;
  }
  
  delete newQuery.page;
  
  router.push({ path: props.urlPrefix, query: newQuery });
}

function handleReset() {
  router.push(props.urlPrefix);
}

// For mobile category select
const categoryOptions = computed(() => [
  { value: '', label: 'All Categories' },
  ...props.categories,
]);
</script>

<template>
  <div class="grid md:grid-cols-[1fr_1fr_1fr_0.5fr] gap-4 z-10 items-center">
    <!-- Mobile: Category Select -->
    <div class="flex md:hidden">
      <UiComboBox
        :options="categoryOptions"
        :model-value="selectedCategory"
        placeholder="All Categories"
        @update:model-value="handleFilterChange('category', $event)"
      />
    </div>

    <!-- Tags MultiSelect -->
    <UiMultiSelect
      v-model="selectedTags"
      :options="tags"
      placeholder="Select tags"
      :max-count="1"
    />

    <!-- Filter Select -->
    <UiComboBox
      v-model="selectedFilter"
      :options="filterOptions"
      placeholder="No Filter"
    />

    <!-- Sort Select -->
    <UiComboBox
      v-model="selectedSort"
      :options="sortOptions"
      placeholder="Sort by Time (desc)"
    />

    <!-- Reset Button -->
    <UiButton variant="outline" @click="handleReset">
      Reset
    </UiButton>
  </div>
</template>
