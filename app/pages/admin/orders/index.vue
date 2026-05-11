<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const route = useRoute()
const currentPage = computed(() => Number(route.query.page) || 1)

const { data: ordersData, pending, refresh } = await useFetch('/api/admin/orders', {
  query: { page: currentPage }
})

const orders = computed(() => ordersData.value?.orders || [])
const totalPages = computed(() => ordersData.value?.totalPages || 1)
const total = computed(() => ordersData.value?.total || 0)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

function formatCurrency(amount: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'success':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Orders</h2>
      <p class="text-sm text-gray-600 mt-1">{{ total }} orders total</p>
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
                Order ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-mono text-gray-900">{{ order.id.slice(0, 8) }}...</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.users?.name || 'N/A' }}</div>
                <div class="text-sm text-gray-500">{{ order.users?.email || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm text-gray-900">{{ order.items?.name || 'N/A' }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-900">{{ formatCurrency(order.amount, order.currency) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusBadgeClass(order.status)]">
                  {{ order.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(order.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="orders.length === 0" class="text-center py-12 text-gray-500">
        <div class="text-4xl mb-3">💳</div>
        <p>No orders found</p>
      </div>

      <div v-if="totalPages > 1" class="px-6 py-4 flex justify-between items-center border-t">
        <NuxtLink
          :to="`/admin/orders?page=${Math.max(1, currentPage - 1)}`"
          :class="['px-4 py-2 border rounded-lg', currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50']"
        >
          Previous
        </NuxtLink>
        <span class="text-sm text-gray-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <NuxtLink
          :to="`/admin/orders?page=${Math.min(totalPages, currentPage + 1)}`"
          :class="['px-4 py-2 border rounded-lg', currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50']"
        >
          Next
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
