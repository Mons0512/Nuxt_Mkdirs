<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const route = useRoute()
const router = useRouter()

const keyword = ref((route.query.keyword as string) || '')
const status = ref((route.query.status as string) || '')
const currentPage = ref(Number(route.query.page) || 1)
const pageSize = ref(Number(route.query.limit) || 20)

const { data: subscribersData, pending, refresh } = await useFetch('/api/admin/subscribers', {
  query: computed(() => ({ 
    page: currentPage.value, 
    limit: pageSize.value,
    keyword: keyword.value || undefined,
    status: status.value || undefined
  })),
  watch: [keyword, status, currentPage, pageSize]
})

const subscribers = computed(() => subscribersData.value?.subscribers || [])
const totalPages = computed(() => subscribersData.value?.totalPages || 1)
const total = computed(() => subscribersData.value?.total || 0)

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Unsubscribed', value: 'unsubscribed' }
]

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

function handleSearch() {
  currentPage.value = 1
  updateUrl()
}

function handleReset() {
  keyword.value = ''
  status.value = ''
  currentPage.value = 1
  updateUrl()
}

function updateUrl() {
  router.replace({
    query: {
      ...route.query,
      page: currentPage.value !== 1 ? currentPage.value.toString() : undefined,
      limit: pageSize.value !== 20 ? pageSize.value.toString() : undefined,
      keyword: keyword.value || undefined,
      status: status.value || undefined
    }
  })
}

watch(currentPage, updateUrl)
watch(pageSize, () => {
  currentPage.value = 1
  updateUrl()
})
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Subscribers</h1>
        <p class="text-sm text-gray-500">{{ total }} subscribers total</p>
      </div>
    </div>

    <!-- Search -->
    <AdminSearch
      :keyword="keyword"
      :status="status"
      :status-options="statusOptions"
      @update:keyword="keyword = $event"
      @update:status="status = $event"
      @search="handleSearch"
      @reset="handleReset"
    />

    <div v-if="pending" class="text-center py-12">Loading...</div>

    <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscribed At
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="subscriber in subscribers" :key="subscriber.id" class="hover:bg-gray-50">
              <td class="px-4 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-900">{{ subscriber.email }}</span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ subscriber.source || 'N/A' }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusBadgeClass(subscriber.status)]">
                  {{ subscriber.status }}
                </span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
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

      <AdminPagination
        v-if="total > 0"
        :total="total"
        :total-pages="totalPages"
        :current-page="currentPage"
        :page-size="pageSize"
        @update:current-page="currentPage = $event"
        @update:page-size="pageSize = $event"
      />
    </div>
  </div>
</template>
