<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const route = useRoute()
const currentPage = computed(() => Number(route.query.page) || 1)

const { data: postsData, pending, refresh } = await useFetch('/api/admin/blog/posts', {
  query: { page: currentPage }
})

const posts = computed(() => postsData.value?.posts || [])
const totalPages = computed(() => postsData.value?.totalPages || 1)
const total = computed(() => postsData.value?.total || 0)

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
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Blog Posts</h2>
        <p class="text-sm text-gray-600 mt-1">{{ total }} posts total</p>
      </div>
      <NuxtLink
        to="/admin/blog/posts/new"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add New Post
      </NuxtLink>
    </div>

    <div v-if="pending" class="text-center py-12">
      <div class="animate-pulse">Loading...</div>
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Featured
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ post.title }}</div>
                <div v-if="post.excerpt" class="text-xs text-gray-500 mt-1 truncate max-w-xs">
                  {{ post.excerpt }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ post.slug }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    post.publish_date ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]"
                >
                  {{ post.publish_date ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ post.featured ? '✓ Yes' : 'No' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(post.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <NuxtLink
                  :to="`/admin/blog/posts/${post.id}`"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Edit
                </NuxtLink>
                <button
                  @click="deletePost(post.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
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
          class="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Write your first post
        </NuxtLink>
      </div>

      <div v-if="totalPages > 1" class="px-6 py-4 flex justify-between items-center border-t">
        <NuxtLink
          :to="`/admin/blog/posts?page=${Math.max(1, currentPage - 1)}`"
          :class="[
            'px-4 py-2 border rounded-lg',
            currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
          ]"
        >
          Previous
        </NuxtLink>
        <span class="text-sm text-gray-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <NuxtLink
          :to="`/admin/blog/posts?page=${Math.min(totalPages, currentPage + 1)}`"
          :class="[
            'px-4 py-2 border rounded-lg',
            currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
          ]"
        >
          Next
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
