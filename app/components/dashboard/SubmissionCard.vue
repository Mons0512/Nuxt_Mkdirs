<script setup lang="ts">
import { Edit, Globe } from 'lucide-vue-next';

interface Props {
  item: {
    id?: string;
    name?: string;
    slug?: string;
    link?: string | null;
    description?: string | null;
    icon?: string | null;
    image?: string | null;
    featured?: boolean;
    price_plan?: string;
    free_plan_status?: string;
    pro_plan_status?: string;
    sponsor_plan_status?: string;
    publish_date?: string;
    created_at?: string;
  };
}

const props = defineProps<Props>();

const imageUrl = computed(() => {
  return props.item.image || '';
});

const publishable = computed(() => {
  const item = props.item;
  if (item.price_plan === 'free') {
    return item.free_plan_status === 'approved';
  }
  if (item.price_plan === 'pro') {
    return item.pro_plan_status === 'approved';
  }
  if (item.price_plan === 'sponsor') {
    return item.sponsor_plan_status === 'approved';
  }
  return false;
});

function formatDate(dateString?: string) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStatus(item: typeof props.item) {
  if (item.price_plan === 'free') {
    return item.free_plan_status || 'draft';
  }
  if (item.price_plan === 'pro') {
    return item.pro_plan_status || 'draft';
  }
  if (item.price_plan === 'sponsor') {
    return item.sponsor_plan_status || 'draft';
  }
  return 'draft';
}

function getStatusColor(status: string) {
  switch (status) {
    case 'approved':
      return 'text-green-600';
    case 'pending':
      return 'text-yellow-600';
    case 'rejected':
      return 'text-red-600';
    default:
      return 'text-muted-foreground';
  }
}
</script>

<template>
  <UiCard class="flex-grow flex items-center p-4">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8 w-full">
      <div class="md:col-span-2 flex flex-col">
        <div class="relative group overflow-hidden rounded-lg aspect-video bg-muted">
          <img
            v-if="imageUrl"
            :src="imageUrl"
            :alt="item.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <span class="text-4xl">{{ item.name?.charAt(0) || '?' }}</span>
          </div>
        </div>
      </div>

      <div class="md:col-span-3 flex flex-col justify-between">
        <div class="space-y-4">
          <NuxtLink
            v-if="publishable && item.publish_date"
            :to="`/item/${item.slug}`"
          >
            <h3 class="text-2xl inline-block hover:underline">{{ item.name }}</h3>
          </NuxtLink>
          <h3 v-else class="text-2xl inline-block">{{ item.name }}</h3>

          <p class="text-muted-foreground line-clamp-2 text-balance leading-relaxed">
            {{ item.description }}
          </p>

          <div class="grid grid-cols-2 gap-4 text-sm pt-2">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Plan:</span>
              <span class="capitalize">{{ item.price_plan || 'free' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Status:</span>
              <span :class="getStatusColor(getStatus(item))" class="capitalize">
                {{ getStatus(item) }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Publish Date:</span>
              <span v-if="item.publish_date" class="font-medium">
                {{ formatDate(item.publish_date) }}
              </span>
              <span v-else class="font-semibold">Not published</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Created Date:</span>
              <span>{{ formatDate(item.created_at) }}</span>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap gap-4 mt-6">
          <DashboardPublishButton v-if="!item.publish_date" :item="item" />
          <DashboardUnpublishButton v-else-if="publishable && item.publish_date" :item="item" />

          <NuxtLink :to="`/edit/${item.id}`">
            <UiButton variant="outline" class="group overflow-hidden">
              <Edit class="w-4 h-4 mr-2" />
              Edit
            </UiButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </UiCard>
</template>
