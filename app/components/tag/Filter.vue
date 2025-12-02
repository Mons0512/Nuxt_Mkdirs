<script setup lang="ts">
import type { TagInfo } from '~/types';

interface Props {
  tags: TagInfo[];
  urlPrefix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  urlPrefix: '/tag',
});

const route = useRoute();
const router = useRouter();

const currentSlug = computed(() => route.params.slug as string || '');
const selectedSort = computed(() => (route.query.sort as string) || '');

const sortOptions = [
  { value: '', label: 'Sort by Time (desc)' },
  { value: 'time-asc', label: 'Sort by Time (asc)' },
  { value: 'name-asc', label: 'Sort by Name (A-Z)' },
  { value: 'name-desc', label: 'Sort by Name (Z-A)' },
];

function handleSortChange(value: string) {
  const newQuery = { ...route.query };
  if (!value) {
    delete newQuery.sort;
  } else {
    newQuery.sort = value;
  }
  delete newQuery.page;
  
  const path = currentSlug.value ? `${props.urlPrefix}/${currentSlug.value}` : props.urlPrefix;
  router.push({ path, query: newQuery });
}
</script>

<template>
  <div>
    <!-- Desktop View -->
    <LayoutContainer class="hidden md:block">
      <div class="flex items-center justify-between gap-8">
        <!-- Tag List with horizontal scroll -->
        <div class="flex-1 overflow-x-auto pb-4">
          <ul class="flex gap-x-2">
            <li>
              <NuxtLink :to="urlPrefix">
                <UiButton
                  :variant="!currentSlug ? 'default' : 'outline'"
                  size="sm"
                  class="px-3 py-3"
                >
                  All
                </UiButton>
              </NuxtLink>
            </li>
            <li v-for="tag in tags" :key="tag._id">
              <NuxtLink :to="`${urlPrefix}/${tag.slug}`">
                <UiButton
                  :variant="currentSlug === tag.slug ? 'default' : 'outline'"
                  size="sm"
                  class="px-3 py-3"
                >
                  {{ tag.name }}
                </UiButton>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Sort -->
        <div class="pb-4 shrink-0">
          <UiComboBox
            :options="sortOptions"
            :model-value="selectedSort"
            placeholder="Sort by Time (desc)"
            @update:model-value="handleSortChange"
          />
        </div>
      </div>
    </LayoutContainer>

    <!-- Mobile View -->
    <div class="md:hidden flex flex-col gap-4 px-4">
      <!-- Tag Scroll -->
      <div class="overflow-x-auto pb-2">
        <ul class="flex gap-x-2">
          <li>
            <NuxtLink :to="urlPrefix">
              <UiButton
                :variant="!currentSlug ? 'default' : 'outline'"
                size="sm"
                class="px-3 py-3"
              >
                All
              </UiButton>
            </NuxtLink>
          </li>
          <li v-for="tag in tags" :key="tag._id">
            <NuxtLink :to="`${urlPrefix}/${tag.slug}`">
              <UiButton
                :variant="currentSlug === tag.slug ? 'default' : 'outline'"
                size="sm"
                class="px-3 py-3"
              >
                {{ tag.name }}
              </UiButton>
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Sort -->
      <UiComboBox
        :options="sortOptions"
        :model-value="selectedSort"
        placeholder="Sort by Time (desc)"
        @update:model-value="handleSortChange"
      />
    </div>
  </div>
</template>
