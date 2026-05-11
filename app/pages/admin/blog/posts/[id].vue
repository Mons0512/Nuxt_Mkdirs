<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const route = useRoute()
const router = useRouter()
const postId = computed(() => route.params.id as string)
const isEdit = computed(() => postId.value && postId.value !== 'new')

const { data: postData, pending: postPending } = await useFetch(
  () => (isEdit.value ? `/api/admin/blog/posts/${postId.value}` : null),
  { server: false }
)

const { data: categoriesData } = await useFetch('/api/admin/blog/categories', { server: false })
const categories = computed(() => categoriesData.value || [])

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  body: '',
  image_url: '',
  image_alt: '',
  featured: false,
  publish_date: '',
  category_ids: [] as string[]
})

watch(() => postData.value, (newVal) => {
  if (newVal) {
    Object.assign(form, newVal)
  }
}, { immediate: true })

const loading = ref(false)
const error = ref('')

async function generateSlug() {
  if (form.title && !form.slug) {
    form.slug = form.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

async function handleSubmit() {
  if (!form.title || !form.slug) {
    error.value = 'Title and slug are required'
    return
  }

  loading.value = true
  error.value = ''

  try {
    if (isEdit.value) {
      await $fetch(`/api/admin/blog/posts/${postId.value}`, {
        method: 'PUT',
        body: form
      })
    } else {
      await $fetch('/api/admin/blog/posts', {
        method: 'POST',
        body: form
      })
    }
    await router.push('/admin/blog/posts')
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to save blog post'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <NuxtLink to="/admin/blog/posts" class="text-sm text-gray-600 hover:text-gray-800 mb-2 inline-flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Posts
          </NuxtLink>
          <h1 class="text-2xl font-bold text-gray-900 mt-1">
            {{ isEdit ? 'Edit Post' : 'Add New Post' }}
          </h1>
        </div>
        <div class="flex gap-3">
          <NuxtLink
            to="/admin/blog/posts"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </NuxtLink>
          <button
            @click="handleSubmit"
            :disabled="loading"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Saving...' : 'Save Post' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
      {{ error }}
    </div>

    <div v-if="postPending" class="text-center py-12">
      Loading...
    </div>

    <template v-else>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                v-model="form.title"
                @blur="generateSlug"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                v-model="form.slug"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea
                v-model="form.excerpt"
                rows="2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Content</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Body</label>
            <textarea
              v-model="form.body"
              rows="12"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
            ></textarea>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Media</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                v-model="form.image_url"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Image Alt Text</label>
              <input
                v-model="form.image_alt"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
          <div class="flex flex-wrap gap-2">
            <label
              v-for="category in categories"
              :key="category.id"
              class="inline-flex items-center px-3 py-1 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
            >
              <input
                v-model="form.category_ids"
                type="checkbox"
                :value="category.id"
                class="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="text-sm">{{ category.name }}</span>
            </label>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
              <input
                v-model="form.publish_date"
                type="datetime-local"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <label class="inline-flex items-center">
              <input
                v-model="form.featured"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700">Featured Post</span>
            </label>
          </div>
        </div>
      </form>
    </template>
  </div>
</template>
