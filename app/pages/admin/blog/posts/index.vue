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

const { data: postsData, pending, refresh } = await useFetch('/api/admin/blog/posts', {
  query: computed(() => ({ 
    page: currentPage.value, 
    limit: pageSize.value,
    keyword: keyword.value || undefined,
    status: status.value || undefined
  })),
  watch: [keyword, status, currentPage, pageSize]
})

const posts = computed(() => postsData.value?.posts || [])
const totalPages = computed(() => postsData.value?.totalPages || 1)
const total = computed(() => postsData.value?.total || 0)

const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' }
]

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

async function deletePost(id: string) {
  if (!confirm('Are you sure you want to delete this blog post?')) return

  try {
    await $fetch(`/api/admin/blog/posts/${id}`, { method: 'DELETE' })
    await refresh()
  } catch {
    alert('Failed to delete blog post')
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
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Blog Posts</h1>
        <p class="text-sm text-gray-500">{{ total }} posts total</p>
      </div>
      <NuxtLink
        to="/admin/blog/posts/new"
        class="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add New Post
      </NuxtLink>
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
                Title
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Featured
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
            <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
              <td class="px-4 py-4">
                <div class="text-sm font-medium text-gray-900">{{ post.title }}</div>
                <div v-if="post.excerpt" class="text-xs text-gray-500 mt-1 truncate max-w-xs">
                  {{ post.excerpt }}
                </div>
              </td>
              <td class="px-4 py-4 text-sm text-gray-500">
                {{ post.slug }}
              </td>
              <td class="px-4 py-4">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    post.publish_date ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]"
                >
                  {{ post.publish_date ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm text-gray-500">
                {{ post.featured ? '✓ Yes' : 'No' }}
              </td>
              <td class="px-4 py-4 text-sm text-gray-500">
                {{ formatDate(post.created_at) }}
              </td>
              <td class="px-4 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink
                    :to="`/admin/blog/posts/${post.id}`"
                    class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </NuxtLink>
                  <button
                    @click="deletePost(post.id)"
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

      <div v-if="posts.length === 0" class="text-center py-12 text-gray-500">
        <div class="text-4xl mb-3">📝</div>
        <p>No blog posts found</p>
        <NuxtLink
          to="/admin/blog/posts/new"
          class="inline-flex items-center gap-2 mt-4 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Write your first post
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
