<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const { data: collectionsData, pending, refresh } = await useFetch('/api/admin/collections')
const collections = computed(() => collectionsData.value || [])

const editingCollection = ref<any>(null)
const isModalOpen = ref(false)

function openModal(collection?: any) {
  editingCollection.value = collection ? { ...collection } : { name: '', slug: '', description: '', icon_url: '', icon_alt: '', priority: 0 }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  editingCollection.value = null
}

async function saveCollection() {
  try {
    if (editingCollection.value.id) {
      await $fetch(`/api/admin/collections/${editingCollection.value.id}`, { method: 'PUT', body: editingCollection.value })
    } else {
      await $fetch('/api/admin/collections', { method: 'POST', body: editingCollection.value })
    }
    closeModal()
    await refresh()
  } catch { alert('Failed to save collection') }
}

async function deleteCollection(id: string) {
  if (!confirm('Are you sure?')) return
  try {
    await $fetch(`/api/admin/collections/${id}`, { method: 'DELETE' })
    await refresh()
  } catch { alert('Failed to delete collection') }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Collections</h2>
      <button @click="openModal()" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Add New Collection</button>
    </div>

    <div v-if="pending" class="text-center py-12">Loading...</div>

    <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="collection in collections" :key="collection.id">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ collection.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ collection.slug }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ collection.priority }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="openModal(collection)" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
              <button @click="deleteCollection(collection.id)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="collections.length === 0" class="text-center py-12 text-gray-500">No collections found</div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">{{ editingCollection?.id ? 'Edit Collection' : 'Add New Collection' }}</h3>
        <form @submit.prevent="saveCollection" class="space-y-4">
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Name</label><input v-model="editingCollection.name" type="text" required class="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Slug</label><input v-model="editingCollection.slug" type="text" required class="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea v-model="editingCollection.description" rows="3" class="w-full px-3 py-2 border rounded-lg"></textarea></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Icon URL</label><input v-model="editingCollection.icon_url" type="text" class="w-full px-3 py-2 border rounded-lg" /></div>
          <div><label class="block text-sm font-medium text-gray-700 mb-1">Priority</label><input v-model.number="editingCollection.priority" type="number" class="w-full px-3 py-2 border rounded-lg" /></div>
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="closeModal" class="px-4 py-2 border rounded-lg">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
