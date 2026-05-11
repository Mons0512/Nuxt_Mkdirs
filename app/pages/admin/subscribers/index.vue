<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const route = useRoute()
const currentPage = computed(() => Number(route.query.page) || 1)

const { data: subscribersData, pending, refresh } = await useFetch('/api/admin/subscribers', {
  query: { page: currentPage }
})

const subscribers = computed(() => subscribersData.value?.subscribers || [])
const totalPages = computed(() => subscribersData.value?.totalPages || 1)
const total = computed(() => subscribersData.value?.total || 0)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-gray-100 text-gray-800'
    case 'unsubscribed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Subscribers</h2>
      <p class="text-sm text-gray-600 mt-1">{{ total }} subscribers total</p>
    </div>

    <div v-if="pending" class="text-center py-12">
      <div class="animate-pulse">Loading...</div>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscribed At
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="subscriber in subscribers" :key="subscriber.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-900">{{ subscriber.email }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ subscriber.source || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusBadgeClass(subscriber.status)]">
                  {{ subscriber.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(subscriber.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="subscribers.length === 0" class="text-center py-12 text-gray-500">
        <div class="text-4xl mb-3">📧</div>
        <p>No subscribers found</p>
      </div>

      <div v-if="totalPages > 1" class="px-6 py-4 flex justify-between items-center border-t">
        <NuxtLink
          :to="`/admin/subscribers?page=${Math.max(1, currentPage - 1)}`"
          :class="['px-4 py-2 border rounded-lg', currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50']"
        >
          Previous
        </NuxtLink>
        <span class="text-sm text-gray-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <NuxtLink
          :to="`/admin/subscribers?page=${Math.min(totalPages, currentPage + 1)}`"
          :class="['px-4 py-2 border rounded-lg', currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50']"
        >
          Next
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
