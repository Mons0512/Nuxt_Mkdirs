<script setup lang="ts">
import { EyeOff, Loader2 } from 'lucide-vue-next';
import type { ItemInfo } from '~/types';

interface Props {
  item: ItemInfo;
}

const props = defineProps<Props>();
const isPending = ref(false);

async function handleUnpublish() {
  isPending.value = true;
  try {
    await $fetch('/api/unpublish', {
      method: 'POST',
      body: { id: props.item._id },
    });
    // Refresh the page to show updated status
    window.location.reload();
  } catch (error: any) {
    alert(error.data?.message || 'Failed to unpublish');
  } finally {
    isPending.value = false;
  }
}
</script>

<template>
  <UiButton
    variant="outline"
    class="group overflow-hidden"
    :disabled="isPending"
    @click="handleUnpublish"
  >
    <Loader2 v-if="isPending" class="w-4 h-4 mr-2 animate-spin" />
    <EyeOff v-else class="w-4 h-4 mr-2" />
    Unpublish
  </UiButton>
</template>
