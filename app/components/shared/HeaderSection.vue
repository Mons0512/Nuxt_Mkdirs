<script setup lang="ts">
import { cn } from '~/utils';

interface Props {
  id?: string;
  label?: string;
  title?: string;
  subtitle?: string;
  class?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div
    :id="id"
    :class="cn('flex flex-col items-center text-center', props.class)"
  >
    <p v-if="label" class="uppercase tracking-wider text-gradient_indigo-purple font-semibold">
      {{ label }}
    </p>
    <h2 v-if="title" class="mt-4 px-4 text-2xl md:text-4xl">
      {{ title }}
    </h2>
    <p v-if="subtitle" class="mt-6 px-4 text-balance text-lg text-foreground/80">
      {{ subtitle }}
    </p>
    <slot />
  </div>
</template>
