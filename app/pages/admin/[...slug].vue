<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { data: session, refresh } = await useFetch('/api/auth/session')

if (!session.value?.user) {
  await navigateTo('/admin/login')
}

const sidebarOpen = ref(true)

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
  { name: 'Items', path: '/admin/items', icon: 'folder' },
  { name: 'Categories', path: '/admin/categories', icon: 'category' },
  { name: 'Tags', path: '/admin/tags', icon: 'tag' },
  { name: 'Collections', path: '/admin/collections', icon: 'collections' },
  { name: 'Groups', path: '/admin/groups', icon: 'group' },
  { name: 'Blog Posts', path: '/admin/blog/posts', icon: 'article' },
  { name: 'Blog Categories', path: '/admin/blog/categories', icon: 'category' },
  { name: 'Users', path: '/admin/users', icon: 'users' },
  { name: 'Orders', path: '/admin/orders', icon: 'payment' },
  { name: 'Subscribers', path: '/admin/subscribers', icon: 'mail' },
  { name: 'Settings', path: '/admin/settings', icon: 'settings' },
]

const route = useRoute()

async function handleLogout() {
  await $fetch('/api/auth/signout', { method: 'POST' })
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex h-screen overflow-hidden">
      <aside
        :class="[
          'bg-white border-r border-gray-200 transition-all duration-300 ease-in-out',
          sidebarOpen ? 'w-64' : 'w-16'
        ]"
      >
        <div class="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <span v-if="sidebarOpen" class="text-lg font-semibold text-gray-800">Admin</span>
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <nav class="p-4 space-y-1">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors',
              route.path === item.path
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            ]"
          >
            <span :class="['mr-3', !sidebarOpen && 'mr-0']">{{ getIcon(item.icon) }}</span>
            <span v-if="sidebarOpen">{{ item.name }}</span>
          </NuxtLink>
        </nav>
      </aside>

      <div class="flex-1 flex flex-col overflow-hidden">
        <header class="bg-white border-b border-gray-200">
          <div class="flex items-center justify-between h-16 px-6">
            <h1 class="text-xl font-semibold text-gray-800">
              {{ menuItems.find(m => m.path === route.path)?.name || 'Dashboard' }}
            </h1>

            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-600">
                {{ session?.user?.email }}
              </span>
              <button
                @click="handleLogout"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main class="flex-1 overflow-y-auto p-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
function getIcon(name: string): string {
  const icons: Record<string, string> = {
    dashboard: '📊',
    folder: '📁',
    category: '📂',
    tag: '🏷️',
    collections: '📚',
    group: '👥',
    article: '📝',
    users: '👤',
    payment: '💳',
    mail: '📧',
    settings: '⚙️',
  }
  return icons[name] || '📄'
}
</script>
