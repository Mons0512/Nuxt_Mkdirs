<script setup lang="ts">
definePageMeta({
  layout: false,
});

useSeoMeta({
  title: 'Sanity Studio',
});

const config = useRuntimeConfig();
const projectId = config.public.sanityProjectId;
</script>

<template>
  <div class="min-h-screen bg-[#101112] text-white">
    <!-- Header -->
    <header class="border-b border-gray-800 px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <svg class="h-8 w-8 text-[#f03e2f]" viewBox="0 0 512 512" fill="currentColor">
            <path d="M161.3 386.5c-49.5 0-89.6-23.3-100.4-62.6l62.6-26.2c4.8 22.4 22.4 37.4 48.8 37.4 20.5 0 33.6-9.5 33.6-24.3 0-42.2-138.8-16.7-138.8-109.6 0-51.4 44.1-82.1 99.5-82.1 46.9 0 84.5 22.4 96.2 60.7l-62.6 25.2c-5.7-20.5-21.4-32.6-44.1-32.6-17.6 0-29.3 8.6-29.3 22.4 0 40.3 138.8 14.8 138.8 109.6.1 52.3-42.2 82.1-104.3 82.1zm175.1-3.8V127.8h68.3v254.9h-68.3z"/>
          </svg>
          <span class="text-xl font-semibold">Sanity Studio</span>
        </div>
        <NuxtLink to="/" class="text-gray-400 hover:text-white text-sm">
          ← 返回网站
        </NuxtLink>
      </div>
    </header>

    <!-- Content -->
    <main class="max-w-4xl mx-auto px-6 py-12">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold mb-4">内容管理</h1>
        <p class="text-gray-400">
          Sanity Studio 需要独立运行。请选择以下方式之一：
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-6 mb-12">
        <!-- Option 1: Hosted Studio -->
        <a
          :href="`https://${projectId}.sanity.studio/`"
          target="_blank"
          class="block p-6 bg-gray-900 rounded-lg border border-gray-800 hover:border-[#f03e2f] transition-colors"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-[#f03e2f]/20 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-[#f03e2f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold">托管 Studio</h3>
          </div>
          <p class="text-gray-400 text-sm mb-4">
            访问 Sanity 托管的 Studio，无需本地运行。
          </p>
          <span class="text-[#f03e2f] text-sm">打开 {{ projectId }}.sanity.studio →</span>
        </a>

        <!-- Option 2: Sanity Manage -->
        <a
          href="https://www.sanity.io/manage"
          target="_blank"
          class="block p-6 bg-gray-900 rounded-lg border border-gray-800 hover:border-blue-500 transition-colors"
        >
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Sanity Manage</h3>
          </div>
          <p class="text-gray-400 text-sm mb-4">
            管理项目设置、API、数据集等。
          </p>
          <span class="text-blue-500 text-sm">打开 sanity.io/manage →</span>
        </a>
      </div>

      <!-- Quick Actions -->
      <div class="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h3 class="text-lg font-semibold mb-4">快速操作</h3>
        <div class="grid md:grid-cols-3 gap-4">
          <NuxtLink
            to="/api/admin/users"
            target="_blank"
            class="flex items-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
            </svg>
            <span>查看用户</span>
          </NuxtLink>
          <NuxtLink
            to="/api/categories"
            target="_blank"
            class="flex items-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
            </svg>
            <span>查看分类</span>
          </NuxtLink>
          <NuxtLink
            to="/api/items"
            target="_blank"
            class="flex items-center gap-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <svg class="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
            <span>查看项目</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Local Studio Instructions -->
      <div class="mt-8 p-6 bg-gray-900/50 rounded-lg border border-gray-800">
        <h3 class="text-lg font-semibold mb-3">本地运行 Studio</h3>
        <p class="text-gray-400 text-sm mb-4">
          如果托管 Studio 不可用，可以在原版 Next.js 项目中运行：
        </p>
        <div class="bg-black rounded-lg p-4 font-mono text-sm">
          <p class="text-gray-500"># 进入原版项目目录</p>
          <p class="text-green-400">cd mkdirs-template-main</p>
          <p class="text-gray-500 mt-2"># 安装依赖并运行</p>
          <p class="text-green-400">pnpm install</p>
          <p class="text-green-400">pnpm dev</p>
          <p class="text-gray-500 mt-2"># 然后访问</p>
          <p class="text-blue-400">http://localhost:3000/studio</p>
        </div>
      </div>
    </main>
  </div>
</template>
