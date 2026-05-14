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

const { data: usersData, pending, refresh, error } = await useFetch(
  '/api/admin/users',
  {
    query: computed(() => ({
      page: currentPage.value,
      limit: pageSize.value,
      keyword: keyword.value,
    })),
    server: false,
  }
);

const users = computed(() => usersData.value?.users || []);
const total = computed(() => usersData.value?.total || 0);
const totalPages = computed(() => usersData.value?.totalPages || 1);

watch(currentPage, (val) => {
  updateUrl();
});
watch(pageSize, (val) => {
  currentPage.value = 1;
  updateUrl();
});
watch(keyword, (val) => {
  currentPage.value = 1;
  updateUrl();
});

function updateUrl() {
  const query: any = {};
  if (currentPage.value > 1) query.page = String(currentPage.value);
  if (pageSize.value !== 20) query.limit = String(pageSize.value);
  if (keyword.value) query.keyword = keyword.value;
  router.replace({ query });
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}

async function updateRole(userId: string, newRole: string) {
  try {
    await $fetch(`/api/admin/users/${userId}`, { method: 'PUT', body: { role: newRole } });
    await refresh();
  } catch {
    alert('Failed to update role');
  }
}

function handleSearch() {
  currentPage.value = 1;
  refresh();
}

function handleReset() {
  keyword.value = '';
  currentPage.value = 1;
  refresh();
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Users</h1>
        <p class="text-sm text-gray-500">Manage user accounts</p>
      </div>
    </div>

    <!-- Search -->
    <AdminSearch
      :keyword="keyword"
      @update:keyword="keyword = $event"
      @search="handleSearch"
      @reset="handleReset"
    />

    <div v-if="pending" class="text-center py-12">Loading...</div>

    <div v-else-if="error" class="text-center py-12 text-red-600">Failed to load users</div>

    <div v-else class="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
              <td class="px-4 py-4 text-sm font-medium text-gray-900">{{ user.name || '-' }}</td>
              <td class="px-4 py-4 text-sm text-gray-500">{{ user.email }}</td>
              <td class="px-4 py-4">
                <select
                  :value="user.role"
                  @change="updateRole(user.id, ($event.target as HTMLSelectElement).value)"
                  class="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </td>
              <td class="px-4 py-4 text-sm text-gray-500">{{ formatDate(user.created_at) }}</td>
              <td class="px-4 py-4 text-right"></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="users.length === 0" class="text-center py-12 text-gray-500">
        <div class="text-4xl mb-3">👥</div>
        <p>No users found</p>
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
