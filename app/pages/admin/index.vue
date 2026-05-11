<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const { data: dashboardData, pending, refresh } = await useFetch('/api/admin/dashboard/stats')

const stats = computed(() => dashboardData.value?.stats || {})
const recentItems = computed(() => dashboardData.value?.recentItems || [])
const pendingItems = computed(() => dashboardData.value?.pendingItems || [])

function formatDate(date: string) {
  return new Date(date).toLocaleDateString()
}

const statCards = computed(() => [
  { label: 'Total Items', value: stats.value.items, icon: '📁', color: 'bg-blue-500', path: '/admin/items' },
  { label: 'Categories', value: stats.value.categories, icon: '📂', color: 'bg-green-500', path: '/admin/categories' },
  { label: 'Tags', value: stats.value.tags, icon: '🏷️', color: 'bg-yellow-500', path: '/admin/tags' },
  { label: 'Collections', value: stats.value.collections, icon: '📚', color: 'bg-purple-500', path: '/admin/collections' },
  { label: 'Users', value: stats.value.users, icon: '👤', color: 'bg-indigo-500', path: '/admin/users' },
  { label: 'Blog Posts', value: stats.value.blogPosts, icon: '📝', color: 'bg-pink-500', path: '/admin/blog/posts' },
  { label: 'Orders', value: stats.value.orders, icon: '💳', color: 'bg-orange-500', path: '/admin/orders' },
  { label: 'Subscribers', value: stats.value.subscribers, icon: '📧', color: 'bg-teal-500', path: '/admin/subscribers' },
])
</script>

<template>
  <div>
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
      <p class="text-gray-600">Welcome back! Here's what's happening with your directory.</p>
    </div>

    <div v-if="pending" class="text-center py-12">
      <div class="animate-pulse">Loading dashboard data...</div>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <NuxtLink
          v-for="card in statCards"
          :key="card.label"
          :to="card.path"
          class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
        >
          <div class="flex items-center">
            <div :class="[card.color, 'w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl']">
              {{ card.icon }}
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">{{ card.label }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ card.value }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Recent Items</h3>
            <NuxtLink to="/admin/items" class="text-sm text-indigo-600 hover:text-indigo-800">View All</NuxtLink>
          </div>
          <div v-if="recentItems.length === 0" class="text-center py-8 text-gray-500">
            No recent items found
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="item in recentItems"
              :key="item.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(item.created_at) }}</p>
              </div>
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  item.publish_date ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                ]"
              >
                {{ item.publish_date ? 'Published' : 'Draft' }}
              </span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">Pending Items</h3>
            <NuxtLink to="/admin/items" class="text-sm text-indigo-600 hover:text-indigo-800">Review All</NuxtLink>
          </div>
          <div v-if="pendingItems.length === 0" class="text-center py-8 text-gray-500">
            No pending items to review
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="item in pendingItems"
              :key="item.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(item.created_at) }}</p>
              </div>
              <NuxtLink
                :to="`/admin/items/${item.id}`"
                class="px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
              >
                Edit
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
