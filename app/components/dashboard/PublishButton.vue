<script setup lang="ts">
import { Upload, Loader2 } from 'lucide-vue-next';
import type { ItemInfo } from '~/types';

interface Props {
  item: ItemInfo;
}

const props = defineProps<Props>();
const isPending = ref(false);

async function handlePublish() {
  isPending.value = true;
  try {
    await $fetch('/api/publish', {
      method: 'POST',
      body: { id: props.item._id },
    });
    // Refresh the page to show updated status
    window.location.reload();
  } catch (error: any) {
    alert(error.data?.message || 'Failed to publish');
  } finally {
    isPending.value = false;
  }
}
</script>

<template>
  <UiButton
    variant="default"
    class="group overflow-hidden"
    :disabled="isPending"
    @click="handlePublish"
  >
    <Loader2 v-if="isPending" class="w-4 h-4 mr-2 animate-spin" />
    <Upload v-else class="w-4 h-4 mr-2" />
    Publish
  </UiButton>
</template>
