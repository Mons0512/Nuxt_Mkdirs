<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const { data: tagsData, pending, refresh } = await useFetch('/api/admin/tags')

const tags = computed(() => tagsData.value || [])

const editingTag = ref<any>(null)
const isModalOpen = ref(false)

function openModal(tag?: any) {
  editingTag.value = tag ? { ...tag } : { name: '', slug: '', description: '' }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  editingTag.value = null
}

async function saveTag() {
  try {
    if (editingTag.value.id) {
      await $fetch(`/api/admin/tags/${editingTag.value.id}`, {
        method: 'PUT',
        body: editingTag.value,
      })
    } else {
      await $fetch('/api/admin/tags', {
        method: 'POST',
        body: editingTag.value,
      })
    }
    closeModal()
    await refresh()
  } catch {
    alert('Failed to save tag')
  }
}

async function deleteTag(id: string) {
  if (!confirm('Are you sure?')) return
  try {
    await $fetch(`/api/admin/tags/${id}`, { method: 'DELETE' })
    await refresh()
  } catch {
    alert('Failed to delete tag')
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Tags</h2>
      <button
        @click="openModal()"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Add New Tag
      </button>
    </div>

    <div v-if="pending" class="text-center py-12">Loading...</div>

    <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="tag in tags" :key="tag.id">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ tag.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ tag.slug }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ tag.description || '-' }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="openModal(tag)" class="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
              <button @click="deleteTag(tag.id)" class="text-red-600 hover:text-red-900">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="tags.length === 0" class="text-center py-12 text-gray-500">No tags found</div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">{{ editingTag?.id ? 'Edit Tag' : 'Add New Tag' }}</h3>
        <form @submit.prevent="saveTag" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input v-model="editingTag.name" type="text" required class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input v-model="editingTag.slug" type="text" required class="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="editingTag.description" rows="3" class="w-full px-3 py-2 border rounded-lg"></textarea>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="closeModal" class="px-4 py-2 border rounded-lg">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
