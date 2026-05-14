<script setup lang="ts">
const route = useRoute()

const menuItems = [
  { title: 'Dashboard', path: '/admin', icon: 'dashboard' },
  { title: 'Products', path: '/admin/items', icon: 'products' },
  { title: 'Review', path: '/admin/items?status=pending', icon: 'review' },
  { title: 'Blog', path: '/admin/blog/posts', icon: 'blog' },
  { title: 'Categories', path: '/admin/categories', icon: 'categories' },
  { title: 'Tags', path: '/admin/tags', icon: 'tags' },
]

function isActive(path: string) {
  if (path.includes('?')) {
    // 处理带查询参数的路径
    const [basePath, queryString] = path.split('?')
    if (route.path !== basePath) return false
    
    // 检查查询参数是否匹配
    const params = new URLSearchParams(queryString)
    for (const [key, value] of params) {
      if (route.query[key] !== value) return false
    }
    return true
  } else {
    // 普通路径匹配，且没有特定的查询参数
    return route.path === path && !route.query.status
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
      <!-- Logo -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/>
            </svg>
          </div>
          <span class="font-bold text-gray-900">Admin Panel</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-3">
        <div class="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2 px-2">
          Navigation
        </div>
        <ul class="space-y-1">
          <li v-for="item in menuItems" :key="item.path">
            <NuxtLink
              :to="item.path"
              :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                isActive(item.path)
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              <!-- Icon -->
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <template v-if="item.icon === 'dashboard'">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </template>
                <template v-else-if="item.icon === 'products'">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </template>
                <template v-else-if="item.icon === 'review'">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </template>
                <template v-else-if="item.icon === 'blog'">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                </template>
                <template v-else-if="item.icon === 'categories'">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                </template>
                <template v-else-if="item.icon === 'tags'">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </template>
              </svg>
              <span>{{ item.title }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Back to Site -->
      <div class="p-3 border-t border-gray-200">
        <NuxtLink
          to="/"
          class="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>Back to Site</span>
        </NuxtLink>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto">
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>
