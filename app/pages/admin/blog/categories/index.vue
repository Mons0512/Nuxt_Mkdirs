<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const route = useRoute()
const router = useRouter()

const keyword = ref((route.query.keyword as string) || '')
const currentPage = ref(Number(route.query.page) || 1)
const pageSize = ref(Number(route.query.limit) || 20)

const { data: categoriesData, pending, refresh } = await useFetch('/api/admin/blog/categories', {
  query: computed(() => ({ 
    page: currentPage.value, 
    limit: pageSize.value,
    keyword: keyword.value || undefined
  })),
  watch: [keyword, currentPage, pageSize]
})

const categories = computed(() => categoriesData.value?.categories || [])
const totalPages = computed(() => categoriesData.value?.totalPages || 1)
const total = computed(() => categoriesData.value?.total || 0)

const editingCategory = ref<any>(null)
const isModalOpen = ref(false)

function openModal(category?: any) {
  editingCategory.value = category ? { ...category } : { name: '', slug: '', description: '', priority: 0 }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
  editingCategory.value = null
}

async function saveCategory() {
  try {
    if (editingCategory.value.id) {
      await $fetch(`/api/admin/blog/categories/${editingCategory.value.id}`, {
        method: 'PUT',
        body: editingCategory.value
      })
    } else {
      await $fetch('/api/admin/blog/categories', {
        method: 'POST',
        body: editingCategory.value
      })
    }
    closeModal()
    await refresh()
  } catch {
    alert('Failed to save category')
  }
}

async function deleteCategory(id: string) {
  if (!confirm('Are you sure you want to delete this category?')) return

  try {
    await $fetch(`/api/admin/blog/categories/${id}`, { method: 'DELETE' })
    await refresh()
  } catch {
    alert('Failed to delete category')
  }
}

function handleSearch() {
  currentPage.value = 1
  updateUrl()
}

function handleReset() {
  keyword.value = ''
  currentPage.value = 1
  updateUrl()
}

function updateUrl() {
  router.replace({
    query: {
      ...route.query,
      page: currentPage.value !== 1 ? currentPage.value.toString() : undefined,
      limit: pageSize.value !== 20 ? pageSize.value.toString() : undefined,
      keyword: keyword.value || undefined
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
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Blog Categories</h1>
        <p class="text-sm text-gray-500">{{ total }} categories total</p>
      </div>
      <button
        @click="openModal()"
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add New Category
      </button>
    </div>

    <!-- Search -->
    <AdminSearch
      :keyword="keyword"
      @update:keyword="keyword = $event"
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
                Name
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50">
              <td class="px-4 py-4 text-sm font-medium text-gray-900">
                {{ category.name }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-500">
                {{ category.slug }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-500">
                {{ category.description || '-' }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-500">
                {{ category.priority }}
              </td>
              <td class="px-4 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openModal(category)"
                    class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    @click="deleteCategory(category.id)"
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

      <div v-if="categories.length === 0" class="text-center py-12 text-gray-500">
        <div class="text-4xl mb-3">📂</div>
        <p>No blog categories found</p>
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

    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl w-full max-w-md">
        <div class="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ editingCategory?.id ? 'Edit Blog Category' : 'Add New Blog Category' }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveCategory" class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
            <input
              v-model="editingCategory.name"
              type="text"
              required
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
            <input
              v-model="editingCategory.slug"
              type="text"
              required
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              v-model="editingCategory.description"
              rows="3"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
            <input
              v-model.number="editingCategory.priority"
              type="number"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
            />
          </div>

          <div class="flex justify-end gap-2 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
