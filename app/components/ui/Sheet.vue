<script setup lang="ts">
import { cn } from '~/utils';
import { X } from 'lucide-vue-next';

interface Props {
  open?: boolean;
  side?: 'left' | 'right' | 'top' | 'bottom';
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  side: 'left',
});

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const sideClasses = {
  left: 'inset-y-0 left-0 h-full w-3/4 sm:max-w-sm border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left',
  right: 'inset-y-0 right-0 h-full w-3/4 sm:max-w-sm border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right',
  top: 'inset-x-0 top-0 border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top',
  bottom: 'inset-x-0 bottom-0 border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
};

function close() {
  emit('update:open', false);
}
</script>

<template>
  <Teleport to="body">
    <!-- Overlay -->
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 bg-black/80"
        @click="close"
      />
    </Transition>

    <!-- Content -->
    <Transition name="slide">
      <div
        v-if="open"
        :class="cn(
          'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out',
          sideClasses[side]
        )"
        :data-state="open ? 'open' : 'closed'"
      >
        <slot />
        
        <button
          class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          @click="close"
        >
          <X class="h-4 w-4" />
          <span class="sr-only">Close</span>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
