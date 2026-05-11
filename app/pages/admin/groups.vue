<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const { data: groupsData, pending, refresh } = await useFetch('/api/admin/groups')
const groups = computed(() => groupsData.value || [])

const editingGroup = ref<any>(null)
const isModalOpen = ref(false)

function openModal(group?: any) {
  editingGroup.value = group ? { ...group } : { name: '', slug: '', description: '', priority: 0 }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  editingGroup.value = null
}

async function saveGroup() {
  try {
    if (editingGroup.value.id) {
      await $fetch(`/api/admin/groups/${editingGroup.value.id}`, { method: 'PUT', body: editingGroup.value })
    } else {
      await $fetch('/api/admin/groups', { method: 'POST', body: editingGroup.value })
    }
    closeModal()
    await refresh()
  } catch { alert('Failed to save group') }
}

async function deleteGroup(id: string) {
  if (!confirm('Are you sure?')) return
  try {
    await $fetch(`/api/admin/groups/${id}`, { method: 'DELETE' })
    await refresh()
  } catch { alert('Failed to delete group') }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Groups</h2>
      <button @click="openModal()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add New Group</button>
    </div>

    <div v-if="pending" class="text-center py-12">Loading...</div>

    <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="group in groups" :key="group.id">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ group.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ group.slug }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ group.description || '-' }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ group.priority }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="openModal(group)" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
              <button @click="deleteGroup(group.id)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="groups.length === 0" class="text-center py-12 text-gray-500">No groups found</div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">{{ editingGroup?.id ? 'Edit Group' : 'Add New Group' }}</h3>
        <form @submit.prevent="saveGroup" class="space-y-4">
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Name</label><input v-model="editingGroup.name" type="text" required class="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Slug</label><input v-model="editingGroup.slug" type="text" required class="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea v-model="editingGroup.description" rows="3" class="w-full px-3 py-2 border rounded-lg"></textarea></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Priority</label><input v-model.number="editingGroup.priority" type="number" class="w-full px-3 py-2 border rounded-lg" /></div>
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="closeModal" class="px-4 py-2 border rounded-lg">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
