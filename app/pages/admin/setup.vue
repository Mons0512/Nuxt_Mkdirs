<script setup lang="ts">
definePageMeta({
  layout: false,
})

const userId = ref('')
const result = ref<{ success: boolean; message: string } | null>(null)
const loading = ref(false)

async function setupAdmin() {
  if (!userId.value.trim()) {
    result.value = { success: false, message: 'Please enter a user ID' }
    return
  }

  loading.value = true
  result.value = null

  try {
    const response = await $fetch('/api/admin/setup-first-admin', {
      method: 'POST',
      body: { userId: userId.value.trim() }
    })

    result.value = { success: true, message: response.message }
  } catch (e: any) {
    result.value = { 
      success: false, 
      message: e.data?.message || 'Failed to setup admin' 
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md w-full mx-4">
      <div class="bg-white rounded-xl shadow-sm p-8">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Setup First Admin</h1>
          <p class="text-gray-600 mt-2">
            Use this page to promote an existing user to ADMIN
          </p>
        </div>

        <div class="space-y-6">
          <div v-if="result" :class="result.success ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'" class="p-3 rounded-lg text-sm">
            {{ result.message }}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              User ID (from Supabase Auth)
            </label>
            <input
              v-model="userId"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
              placeholder="e.g., a1b2c3d4-1234-5678-90ab-cdef01234567"
            />
            <p class="mt-2 text-xs text-gray-500">
              Get this from your Supabase dashboard → Authentication → Users
            </p>
          </div>

          <button
            @click="setupAdmin"
            :disabled="loading"
            class="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Setting up...' : 'Set as Admin' }}
          </button>

          <div class="pt-4 border-t border-gray-200">
            <p class="text-xs text-gray-500">
              ⚠️ Important: Delete or disable <code class="bg-gray-100 px-1 rounded">server/api/admin/setup-first-admin.post.ts</code> 
              and <code class="bg-gray-100 px-1 rounded">app/pages/admin/setup.vue</code> after you've set up your admin!
            </p>
          </div>

          <div class="text-center">
            <NuxtLink to="/" class="text-sm text-indigo-600 hover:text-indigo-500">
              ← Back to home
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
