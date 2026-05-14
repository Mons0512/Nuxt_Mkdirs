<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
});

const route = useRoute();
const router = useRouter();

const currentPage = ref(Number(route.query.page) || 1);
const pageSize = ref(Number(route.query.limit) || 20);
const keyword = ref((route.query.keyword as string) || '');
const status = ref((route.query.status as string) || '');

let isSyncingFromRoute = false;

const { data: itemsData, pending, refresh, error } = await useFetch(
  '/api/admin/items',
  {
    query: computed(() => ({
      page: currentPage.value,
      limit: pageSize.value,
      keyword: keyword.value,
      status: status.value,
    })),
    server: false,
  }
);

const items = computed(() => itemsData.value?.items || []);
const total = computed(() => itemsData.value?.total || 0);
const totalPages = computed(() => itemsData.value?.totalPages || 1);

// 监听路由查询参数变化，同步到本地状态
watch(
  () => route.query,
  (newQuery) => {
    isSyncingFromRoute = true;
    currentPage.value = Number(newQuery.page) || 1;
    pageSize.value = Number(newQuery.limit) || 20;
    keyword.value = (newQuery.keyword as string) || '';
    status.value = (newQuery.status as string) || '';
    refresh();
    isSyncingFromRoute = false;
  },
  { immediate: true }
);

watch(currentPage, (val) => {
  if (!isSyncingFromRoute) updateUrl();
});
watch(pageSize, (val) => {
  if (!isSyncingFromRoute) {
    currentPage.value = 1;
    updateUrl();
  }
});
watch(keyword, (val) => {
  if (!isSyncingFromRoute) {
    currentPage.value = 1;
    updateUrl();
  }
});
watch(status, (val) => {
  if (!isSyncingFromRoute) {
    currentPage.value = 1;
    updateUrl();
  }
});

function updateUrl() {
  const query: any = {};
  if (currentPage.value > 1) query.page = String(currentPage.value);
  if (pageSize.value !== 20) query.limit = String(pageSize.value);
  if (keyword.value) query.keyword = keyword.value;
  if (status.value) query.status = status.value;
  router.replace({ query });
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

function getItemStatus(item: any) {
  if (item.publish_date) {
    return { label: 'Published', class: 'bg-green-100 text-green-800' };
  }
  if (item.free_plan_status === 'pending' || item.pro_plan_status === 'pending' || item.sponsor_plan_status === 'pending') {
    return { label: 'Pending', class: 'bg-yellow-100 text-yellow-800' };
  }
  if (item.free_plan_status === 'rejected' || item.pro_plan_status === 'rejected' || item.sponsor_plan_status === 'rejected') {
    return { label: 'Rejected', class: 'bg-red-100 text-red-800' };
  }
  if (item.free_plan_status === 'submitting' || item.pro_plan_status === 'submitting' || item.sponsor_plan_status === 'submitting') {
    return { label: 'Draft', class: 'bg-gray-100 text-gray-800' };
  }
  return { label: 'Draft', class: 'bg-gray-100 text-gray-800' };
}

async function deleteItem(id: string) {
  if (!confirm('Are you sure you want to delete this item?')) return;

  try {
    await $fetch(`/api/admin/items/${id}`, { method: 'DELETE' });
    await refresh();
  } catch {
    alert('Failed to delete item');
  }
}

function handleSearch() {
  currentPage.value = 1;
  refresh();
}

function handleReset() {
  keyword.value = '';
  status.value = '';
  currentPage.value = 1;
  refresh();
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-1">
          {{ status === 'pending' ? 'Review' : status === 'approved' ? 'Published' : status === 'rejected' ? 'Rejected' : 'Products' }}
        </h1>
        <p class="text-sm text-gray-500">
          {{ status === 'pending' ? 'Review pending product submissions' : 'Manage your product listings' }}
        </p>
      </div>
      <NuxtLink
        to="/admin/items/new"
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Product
      </NuxtLink>
    </div>

    <!-- Search -->
    <AdminSearch
      :keyword="keyword"
      :status="status"
      :show-status="true"
      :status-options="[
        { label: 'All', value: '' },
        { label: 'Pending Review', value: 'pending' },
        { label: 'Published', value: 'approved' },
        { label: 'Rejected', value: 'rejected' }
      ]"
      @update:keyword="keyword = $event"
      @update:status="status = $event"
      @search="handleSearch"
      @reset="handleReset"
    />

    <div v-if="pending" class="text-center py-12">Loading...</div>

    <div v-else-if="error" class="text-center py-12 text-red-600">Failed to load products</div>

    <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
              <td class="px-4 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-gray-900">{{ item.name }}</p>
                    <a v-if="item.link" :href="item.link" target="_blank" class="text-xs text-gray-400 hover:text-gray-600 truncate max-w-xs">
                      {{ item.link }}
                    </a>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4 text-sm text-gray-500">Code Hosting</td>
              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <span
                    :class="[
                      'px-2.5 py-1 text-xs font-medium rounded-full',
                      getItemStatus(item).class
                    ]"
                  >
                    {{ getItemStatus(item).label }}
                  </span>
                  <span v-if="item.sponsor" class="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-600">
                    Sponsor
                  </span>
                  <span v-if="item.featured" class="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-900 text-white">
                    Featured
                  </span>
                </div>
              </td>
              <td class="px-4 py-4 text-sm text-gray-500">{{ formatDate(item.created_at) }}</td>
              <td class="px-4 py-4 text-sm text-gray-500">{{ formatDate(item.updated_at || item.created_at) }}</td>
              <td class="px-4 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/items/${item.id}`"
                    class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </NuxtLink>
                  <button
                    @click="deleteItem(item.id)"
                    class="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="items.length === 0" class="text-center py-12 text-gray-500">
        <div class="text-4xl mb-3">📦</div>
        <p>No products found</p>
        <NuxtLink
          to="/admin/items/new"
          class="inline-block mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 text-sm"
        >
          Add your first product
        </NuxtLink>
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
