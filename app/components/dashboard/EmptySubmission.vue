<script setup lang="ts">
import { Upload } from 'lucide-vue-next';
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <Upload class="size-16 text-muted-foreground mb-4" />
    <h3 class="text-xl font-semibold mb-2">No submissions</h3>
    <p class="text-muted-foreground max-w-md mb-6">
      You don't have any submissions yet.
    </p>
    <NuxtLink to="/submit">
      <UiButton size="lg" class="group whitespace-nowrap">
        <Upload class="w-4 h-4 mr-2" />
        <span>Submit</span>
      </UiButton>
    </NuxtLink>
  </div>
</template>
