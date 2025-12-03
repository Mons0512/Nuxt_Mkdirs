<script setup lang="ts">
import { Upload } from 'lucide-vue-next';

definePageMeta({
  layout: 'protected',
});

const { user } = useAuth();
const route = useRoute();

// Pagination
const currentPage = computed(() => {
  const page = route.query.page;
  return page ? Number(page) : 1;
});

// Fetch submissions
const { data: submissionsData, pending } = await useFetch('/api/submissions', {
  query: {
    page: currentPage,
  },
});

const submissions = computed(() => submissionsData.value?.submissions || []);
const totalPages = computed(() => submissionsData.value?.totalPages || 1);

useSeoMeta({
  title: 'Dashboard - Directory Template',
  description: 'Overview of submissions',
});
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="pending" class="space-y-8">
      <DashboardSubmissionCardSkeleton v-for="i in 3" :key="i" />
    </div>

    <!-- Empty state -->
    <template v-else-if="submissions.length === 0">
      <DashboardEmptySubmission />
    </template>

    <!-- Submissions list -->
    <template v-else>
      <section>
        <div class="gap-8 grid grid-cols-1">
          <DashboardSubmissionCard
            v-for="item in submissions"
            :key="item._id"
            :item="item"
          />
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center">
          <SharedPagination route-prefix="/dashboard" :total-pages="totalPages" />
        </div>
      </section>
    </template>
  </div>
</template>
