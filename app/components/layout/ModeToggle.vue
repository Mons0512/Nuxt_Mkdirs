<script setup lang="ts">
import { Sun, Moon, Monitor } from 'lucide-vue-next';

const colorMode = useColorMode();

const modes = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
] as const;

function cycleMode() {
  const currentIndex = modes.findIndex(m => m.value === colorMode.preference);
  const nextIndex = (currentIndex + 1) % modes.length;
  colorMode.preference = modes[nextIndex].value;
}

const currentIcon = computed(() => {
  const mode = modes.find(m => m.value === colorMode.preference);
  return mode?.icon || Sun;
});
</script>

<template>
  <button
    class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-input bg-background text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    @click="cycleMode"
  >
    <component :is="currentIcon" class="h-4 w-4" />
    <span class="sr-only">Toggle theme</span>
  </button>
</template>
