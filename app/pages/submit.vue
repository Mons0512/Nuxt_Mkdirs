<script setup lang="ts">
// Stepper steps
const steps = [
  { title: 'Details', description: 'Enter product information' },
  { title: 'Payment', description: 'Select pricing plan' },
  { title: 'Publish', description: 'Publish your product' },
];

// Fetch categories from Sanity
const { data: categoriesData } = await useFetch('/api/categories');

const categories = computed(() => {
  if (!categoriesData.value) return [];
  return categoriesData.value.map((cat: any) => ({
    value: cat._id,
    label: cat.name,
  }));
});

// Fetch tags from Sanity
const { data: tagsData } = await useFetch('/api/tags');

const tags = computed(() => {
  if (!tagsData.value) return [];
  return tagsData.value.map((tag: any) => ({
    value: tag._id,
    label: tag.name,
  }));
});

useSeoMeta({
  title: 'Submit your product (1/3) - Directory Template',
  description: 'Submit your product – Enter product details.',
});
</script>

<template>
  <LayoutContainer class="py-8">
    <div>
      <!-- Header -->
      <div class="flex flex-col gap-8 md:gap-36 lg:gap-48 md:items-center md:flex-row md:justify-between">
        <div class="flex flex-col space-y-4">
          <!-- Title -->
          <div class="flex items-center space-x-4">
            <h1 class="text-2xl font-semibold">Submit</h1>
          </div>

          <div class="flex items-center space-x-2">
            <!-- Label -->
            <span class="inline-flex items-center rounded-sm border px-2.5 py-0.5 text-xs font-semibold">
              1 / 3
            </span>
            <!-- Subtitle -->
            <h2 class="text-base">Enter product details</h2>
          </div>
        </div>

        <!-- Stepper -->
        <div class="flex-1 md:max-w-[50%]">
          <SubmitStepper :steps="steps" :current-step="1" />
        </div>
      </div>

      <!-- Form -->
      <div class="mt-8">
        <SubmitForm :categories="categories" :tags="tags" />
      </div>
    </div>
  </LayoutContainer>
</template>
