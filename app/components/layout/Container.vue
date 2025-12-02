<script setup lang="ts">
import { cn } from '~/utils';

interface Props {
  class?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div :class="cn('container', 'max-w-7xl', props.class)">
    <slot />
  </div>
</template>
