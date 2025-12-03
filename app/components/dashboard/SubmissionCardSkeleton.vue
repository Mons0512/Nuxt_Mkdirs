<template>
  <UiCard class="grow flex items-center p-4">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8 w-full">
      <!-- Left column -->
      <div class="md:col-span-2 flex flex-col">
        <div class="relative group overflow-hidden rounded-lg aspect-video">
          <UiSkeleton class="w-full h-full" />
        </div>
      </div>

      <!-- Right column -->
      <div class="md:col-span-3 flex flex-col justify-between">
        <div class="space-y-4">
          <UiSkeleton class="h-8 w-1/2" />
          <UiSkeleton class="h-8 w-full" />
          
          <div class="grid grid-cols-2 gap-4 text-sm pt-2">
            <div class="flex items-center gap-2">
              <UiSkeleton class="h-8 w-12" />
              <UiSkeleton class="h-8 w-20" />
            </div>
            <div class="flex items-center gap-2">
              <UiSkeleton class="h-8 w-16" />
              <UiSkeleton class="h-8 w-24" />
            </div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
            <div class="flex items-center gap-2">
              <UiSkeleton class="h-8 w-24" />
              <UiSkeleton class="h-8 w-32" />
            </div>
            <div class="flex items-center gap-2">
              <UiSkeleton class="h-8 w-24" />
              <UiSkeleton class="h-8 w-32" />
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-4 mt-6">
          <UiSkeleton class="h-12 w-32" />
          <UiSkeleton class="h-12 w-32" />
        </div>
      </div>
    </div>
  </UiCard>
</template>
