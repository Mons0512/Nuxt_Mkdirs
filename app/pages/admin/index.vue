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
  { label: 'Total Products', value: stats.value.items || 0, icon: 'package', color: 'bg-blue-100 text-blue-600' },
  { label: 'User Submissions', value: '0', icon: 'inbox', color: 'bg-orange-100 text-orange-600' },
  { label: 'Categories', value: stats.value.categories || 0, icon: 'folder', color: 'bg-purple-100 text-purple-600' },
  { label: 'Tags', value: stats.value.tags || 0, icon: 'tag', color: 'bg-pink-100 text-pink-600' },
  { label: 'Blog Posts', value: stats.value.blogPosts || 0, icon: 'file-text', color: 'bg-green-100 text-green-600' },
  { label: 'Users', value: stats.value.users || 0, icon: 'users', color: 'bg-indigo-100 text-indigo-600' },
])
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p class="text-gray-500 text-sm">Welcome to your admin dashboard</p>
    </div>

    <div v-if="pending" class="text-center py-12">
      <div class="animate-pulse">Loading dashboard data...</div>
    </div>

    <template v-else>
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div
          v-for="card in statCards"
          :key="card.label"
          class="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between"
        >
          <div>
            <p class="text-sm text-gray-600">{{ card.label }}</p>
            <p class="text-3xl font-bold text-gray-900 mt-1">{{ card.value }}</p>
          </div>
          <div :class="['w-11 h-11 rounded-lg flex items-center justify-center', card.color]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <template v-if="card.icon === 'package'">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </template>
              <template v-else-if="card.icon === 'inbox'">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
              </template>
              <template v-else-if="card.icon === 'folder'">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
              </template>
              <template v-else-if="card.icon === 'tag'">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </template>
              <template v-else-if="card.icon === 'file-text'">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </template>
              <template v-else-if="card.icon === 'users'">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
              </template>
            </svg>
          </div>
        </div>
      </div>

      <!-- Two Columns -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Recent User Submissions -->
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 class="text-sm font-medium text-gray-900">Recent User Submissions</h3>
            <button class="text-xs text-gray-500 hover:text-gray-700">View All →</button>
          </div>
          <div class="p-6">
            <div class="flex flex-col items-center justify-center py-8 text-gray-400">
              <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
              </svg>
              <p class="text-sm">No user submissions yet</p>
            </div>
          </div>
        </div>

        <!-- Recent Products -->
        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div class="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 class="text-sm font-medium text-gray-900">Recent Products</h3>
            <button class="text-xs text-gray-500 hover:text-gray-700">View All →</button>
          </div>
          <div class="divide-y divide-gray-100">
            <template v-if="recentItems.length > 0">
              <div
                v-for="item in recentItems"
                :key="item.id"
                class="flex items-center justify-between px-4 py-3"
              >
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ item.name }}</p>
                    <p class="text-xs text-gray-400">IDE & Editors • {{ formatDate(item.created_at) }}</p>
                  </div>
                </div>
                <NuxtLink
                  :to="`/admin/items/${item.id}`"
                  class="text-xs text-gray-500 hover:text-gray-700"
                >
                  Edit
                </NuxtLink>
              </div>
            </template>
            <template v-else>
              <div class="flex flex-col items-center justify-center py-8 text-gray-400">
                <p class="text-sm">No recent products</p>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
