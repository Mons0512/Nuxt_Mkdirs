<script setup lang="ts">
import { Twitter } from 'lucide-vue-next';
import { heroConfig } from '~/config/hero';

interface Props {
  urlPrefix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  urlPrefix: '/',
});
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="max-w-5xl flex flex-col items-center text-center gap-8">
      <!-- Label badge -->
      <a
        :href="heroConfig.label.href"
        target="_blank"
        class="inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-4"
      >
        <span class="mr-2">🎉</span>
        <span>{{ heroConfig.label.text }}</span>
        <Twitter class="size-4 ml-1" />
      </a>

      <!-- Title -->
      <h1 class="max-w-5xl font-bold text-balance text-3xl sm:text-4xl md:text-5xl">
        {{ heroConfig.title.first }}
        <span class="text-gradient_indigo-purple font-bold">
          {{ heroConfig.title.second }}
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="max-w-4xl text-balance text-muted-foreground sm:text-xl">
        {{ heroConfig.subtitle }}
      </p>

      <!-- Search Box -->
      <div class="w-full">
        <HomeSearchBox :url-prefix="urlPrefix" />
      </div>
    </div>
  </div>
</template>
