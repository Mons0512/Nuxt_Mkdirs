<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const { data: settingsData, pending, refresh } = await useFetch('/api/admin/settings')

const settings = ref<any>({
  site_name: '',
  site_description: '',
  social_links: {
    twitter: '',
    github: '',
  },
  featured_items_limit: 10,
  items_per_page: 12,
})

watch(() => settingsData.value, (newVal) => {
  if (newVal) {
    // Parse JSON values
    const parsedSettings: any = {}
    newVal.forEach((s: any) => {
      try {
        parsedSettings[s.key] = JSON.parse(s.value)
      } catch {
        parsedSettings[s.key] = s.value
      }
    })
    settings.value = { ...settings.value, ...parsedSettings }
  }
}, { immediate: true })

const loading = ref(false)
const success = ref('')
const error = ref('')

async function saveSettings() {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    await $fetch('/api/admin/settings', {
      method: 'PUT',
      body: settings.value,
    })
    success.value = 'Settings saved successfully!'
    await refresh()
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to save settings'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Settings</h2>
      <p class="text-sm text-gray-600 mt-1">Manage your site settings</p>
    </div>

    <div v-if="success" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
      {{ success }}
    </div>

    <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
      {{ error }}
    </div>

    <div v-if="pending" class="text-center py-12">
      <div class="animate-pulse">Loading...</div>
    </div>

    <form v-else @submit.prevent="saveSettings" class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Site Information</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
            <input
              v-model="settings.site_name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
            <textarea
              v-model="settings.site_description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
            <input
              v-model="settings.social_links.twitter"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
            <input
              v-model="settings.social_links.github"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Pagination Settings</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Featured Items Limit</label>
            <input
              v-model.number="settings.featured_items_limit"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Items Per Page</label>
            <input
              v-model.number="settings.items_per_page"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="loading"
          class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Saving...' : 'Save Settings' }}
        </button>
      </div>
    </form>
  </div>
</template>
