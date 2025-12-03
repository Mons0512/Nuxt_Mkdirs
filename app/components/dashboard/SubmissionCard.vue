<script setup lang="ts">
import { Edit, Globe } from 'lucide-vue-next';
import type { ItemInfo } from '~/types';
import { getSanityImageUrl } from '~/utils/sanity-image';

interface Props {
  item: ItemInfo;
}

const props = defineProps<Props>();

// Get image URL from Sanity
const imageUrl = computed(() => {
  const img = props.item.image as any;
  if (img?.asset) {
    return getSanityImageUrl(img, { width: 800, height: 450 });
  }
  return typeof img === 'string' ? img : '';
});

// Check if item is publishable
const publishable = computed(() => {
  const item = props.item;
  // Free plan: must be approved
  if (item.pricePlan === 'free') {
    return item.freePlanStatus === 'approved';
  }
  // Pro plan: must be approved
  if (item.pricePlan === 'pro') {
    return item.proPlanStatus === 'approved';
  }
  // Sponsor plan: must be approved
  if (item.pricePlan === 'sponsor') {
    return item.sponsorPlanStatus === 'approved';
  }
  return false;
});

// Format date
function formatDate(dateString?: string) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Get status display
function getStatus(item: ItemInfo) {
  if (item.pricePlan === 'free') {
    return item.freePlanStatus || 'draft';
  }
  if (item.pricePlan === 'pro') {
    return item.proPlanStatus || 'draft';
  }
  if (item.pricePlan === 'sponsor') {
    return item.sponsorPlanStatus || 'draft';
  }
  return 'draft';
}

// Get status color
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
      <!-- Left column - Image -->
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

      <!-- Right column - Details -->
      <div class="md:col-span-3 flex flex-col justify-between">
        <div class="space-y-4">
          <!-- Title -->
          <NuxtLink
            v-if="publishable && item.publishDate"
            :to="`/item/${item.slug}`"
          >
            <h3 class="text-2xl inline-block hover:underline">{{ item.name }}</h3>
          </NuxtLink>
          <h3 v-else class="text-2xl inline-block">{{ item.name }}</h3>

          <!-- Description -->
          <p class="text-muted-foreground line-clamp-2 text-balance leading-relaxed">
            {{ item.description }}
          </p>

          <!-- Plan & Status -->
          <div class="grid grid-cols-2 gap-4 text-sm pt-2">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Plan:</span>
              <span class="capitalize">{{ item.pricePlan || 'free' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Status:</span>
              <span :class="getStatusColor(getStatus(item))" class="capitalize">
                {{ getStatus(item) }}
              </span>
            </div>
          </div>

          <!-- Dates -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm pt-2">
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Publish Date:</span>
              <span v-if="item.publishDate" class="font-medium">
                {{ formatDate(item.publishDate) }}
              </span>
              <span v-else class="font-semibold">Not published</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-muted-foreground">Created Date:</span>
              <span>{{ formatDate(item._createdAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap gap-4 mt-6">
          <!-- Publish/Unpublish button -->
          <DashboardPublishButton v-if="!item.publishDate" :item="item" />
          <DashboardUnpublishButton v-else-if="publishable && item.publishDate" :item="item" />

          <!-- Edit button -->
          <NuxtLink :to="`/edit/${item._id}`">
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
