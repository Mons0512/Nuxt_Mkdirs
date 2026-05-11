<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const { data: categoriesData, pending, refresh, error } = await useFetch('/api/admin/categories')

const categories = computed(() => categoriesData.value || [])

const newCategory = reactive({
  name: '',
  slug: '',
  description: '',
  priority: 0,
})

const isModalOpen = ref(false)
const editingCategory = ref<any>(null)

function openModal(category?: any) {
  if (category) {
    editingCategory.value = { ...category }
  } else {
    editingCategory.value = { ...newCategory }
  }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  editingCategory.value = null
}

async function saveCategory() {
  try {
    if (editingCategory.value.id) {
      await $fetch(`/api/admin/categories/${editingCategory.value.id}`, {
        method: 'PUT',
        body: editingCategory.value,
      })
    } else {
      await $fetch('/api/admin/categories', {
        method: 'POST',
        body: editingCategory.value,
      })
    }
    closeModal()
    await refresh()
  } catch (error) {
    alert('Failed to save category')
  }
}

async function deleteCategory(id: string) {
  if (!confirm('Are you sure you want to delete this category?')) return

  try {
    await $fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (error) {
    alert('Failed to delete category')
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Categories</h2>
      <button
        @click="openModal()"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Add New Category
      </button>
    </div>

    <div v-if="pending" class="text-center py-12">Loading...</div>

    <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Slug
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Priority
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="category in categories" :key="category.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ category.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ category.slug }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ category.priority }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="openModal(category)"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                Edit
              </button>
              <button
                @click="deleteCategory(category.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="categories.length === 0" class="text-center py-12 text-gray-500">
        No categories found
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">
          {{ editingCategory?.id ? 'Edit Category' : 'Add New Category' }}
        </h3>

        <form @submit.prevent="saveCategory" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              v-model="editingCategory.name"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              v-model="editingCategory.slug"
              type="text"
              required
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              v-model="editingCategory.description"
              rows="3"
              class="w-full px-3 py-2 border rounded-lg"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <input
              v-model.number="editingCategory.priority"
              type="number"
              class="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
