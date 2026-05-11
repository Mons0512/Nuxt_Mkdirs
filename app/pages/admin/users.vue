<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const { data: usersData, pending, refresh } = await useFetch('/api/admin/users')
const users = computed(() => usersData.value?.users || [])
const totalPages = computed(() => usersData.value?.totalPages || 1)
const currentPage = ref(1)

async function goToPage(page: number) {
  currentPage.value = page
  await refresh()
}

async function updateRole(userId: string, newRole: string) {
  try {
    await $fetch(`/api/admin/users/${userId}`, { method: 'PUT', body: { role: newRole } })
    await refresh()
  } catch { alert('Failed to update role') }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Users</h2>
    </div>

    <div v-if="pending" class="text-center py-12">Loading...</div>

    <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ user.name || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ user.email }}</td>
            <td class="px-6 py-4">
              <select
                :value="user.role"
                @change="updateRole(user.id, ($event.target as HTMLSelectElement).value)"
                class="px-2 py-1 text-sm border rounded"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ new Date(user.created_at).toLocaleDateString() }}</td>
            <td class="px-6 py-4 text-right"></td>
          </tr>
        </tbody>
      </table>
      <div v-if="users.length === 0" class="text-center py-12 text-gray-500">No users found</div>

      <div v-if="totalPages > 1" class="px-6 py-4 flex justify-between items-center border-t">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1" class="px-4 py-2 border rounded-lg disabled:opacity-50">Previous</button>
        <span class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-4 py-2 border rounded-lg disabled:opacity-50">Next</button>
      </div>
    </div>
  </div>
</template>
