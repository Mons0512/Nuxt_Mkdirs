<script setup lang="ts">
definePageMeta({
  layout: false,
})

const form = reactive({
  email: '',
  password: '',
})

const error = ref('')

async function handleLogin() {
  error.value = ''

  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: form,
    })

    if (response.user?.role !== 'ADMIN') {
      error.value = 'You do not have admin access'
      return
    }

    await navigateTo('/admin')
  } catch (e: any) {
    error.value = e.data?.message || 'Login failed'
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="max-w-md w-full mx-4">
      <div class="bg-white rounded-xl shadow-sm p-8">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p class="text-gray-600 mt-2">Sign in to your admin account</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            Sign In
          </button>
        </form>

        <div class="mt-6 text-center">
          <NuxtLink to="/auth/login" class="text-sm text-indigo-600 hover:text-indigo-500">
            Back to main login
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
