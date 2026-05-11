<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: ['admin'],
})

const route = useRoute()
const router = useRouter()
const itemId = computed(() => route.params.id as string)
const isEdit = computed(() => itemId.value && itemId.value !== 'new')

const { data: itemData, pending: itemPending } = await useFetch(
  () => (isEdit.value ? `/api/admin/items/${itemId.value}` : null),
  { server: false }
)

const { data: categoriesData } = await useFetch('/api/admin/categories', { server: false })
const { data: tagsData } = await useFetch('/api/admin/tags', { server: false })
const { data: collectionsData } = await useFetch('/api/admin/collections', { server: false })

const categories = computed(() => categoriesData.value || [])
const tags = computed(() => tagsData.value || [])
const collections = computed(() => collectionsData.value || [])

const form = reactive({
  name: '',
  slug: '',
  link: '',
  affiliate_link: '',
  description: '',
  introduction: '',
  image_url: '',
  image_alt: '',
  icon_url: '',
  icon_alt: '',
  featured: false,
  sponsor: false,
  sponsor_start_date: '',
  sponsor_end_date: '',
  publish_date: '',
  price_plan: 'free' as 'free' | 'pro' | 'sponsor',
  free_plan_status: 'approved' as 'submitting' | 'pending' | 'approved' | 'rejected' | null,
  pro_plan_status: 'submitting' as 'submitting' | 'pending' | 'success' | 'failed' | null,
  sponsor_plan_status: 'submitting' as 'submitting' | 'pending' | 'success' | 'failed' | null,
  rejection_reason: '',
  paid: false,
  force_hidden: false,
  note: '',
  category_ids: [] as string[],
  tag_ids: [] as string[],
  collection_ids: [] as string[]
})

watch(() => itemData.value, (newVal) => {
  if (newVal) {
    Object.assign(form, newVal)
  }
}, { immediate: true })

const loading = ref(false)
const error = ref('')

async function generateSlug() {
  if (form.name && !form.slug) {
    form.slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

async function handleSubmit() {
  if (!form.name || !form.slug) {
    error.value = 'Name and slug are required'
    return
  }

  loading.value = true
  error.value = ''

  try {
    if (isEdit.value) {
      await $fetch(`/api/admin/items/${itemId.value}`, {
        method: 'PUT',
        body: form
      })
    } else {
      await $fetch('/api/admin/items', {
        method: 'POST',
        body: form
      })
    }
    await router.push('/admin/items')
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to save item'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <div>
          <NuxtLink to="/admin/items" class="text-sm text-gray-600 hover:text-gray-800 mb-2 inline-flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Items
          </NuxtLink>
          <h1 class="text-2xl font-bold text-gray-900 mt-1">
            {{ isEdit ? 'Edit Item' : 'Add New Item' }}
          </h1>
        </div>
        <div class="flex gap-3">
          <NuxtLink
            to="/admin/items"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </NuxtLink>
          <button
            @click="handleSubmit"
            :disabled="loading"
            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Saving...' : 'Save Item' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
      {{ error }}
    </div>

    <div v-if="itemPending" class="text-center py-12">
      Loading...
    </div>

    <template v-else>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                v-model="form.name"
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
              <label class="block text-sm font-medium text-gray-700 mb-1">Link</label>
              <input
                v-model="form.link"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Affiliate Link</label>
              <input
                v-model="form.affiliate_link"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <textarea
              v-model="form.description"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Introduction</label>
            <textarea
              v-model="form.introduction"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Icon URL</label>
              <input
                v-model="form.icon_url"
                type="url"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Icon Alt Text</label>
              <input
                v-model="form.icon_alt"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Categorization</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Categories</label>
              <div class="flex flex-wrap gap-2">
                <label
                  v-for="cat in categories"
                  :key="cat.id"
                  class="inline-flex items-center px-3 py-1 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                >
                  <input
                    v-model="form.category_ids"
                    type="checkbox"
                    :value="cat.id"
                    class="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-sm">{{ cat.name }}</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div class="flex flex-wrap gap-2">
                <label
                  v-for="tag in tags"
                  :key="tag.id"
                  class="inline-flex items-center px-3 py-1 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                >
                  <input
                    v-model="form.tag_ids"
                    type="checkbox"
                    :value="tag.id"
                    class="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-sm">{{ tag.name }}</span>
                </label>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Collections</label>
              <div class="flex flex-wrap gap-2">
                <label
                  v-for="col in collections"
                  :key="col.id"
                  class="inline-flex items-center px-3 py-1 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                >
                  <input
                    v-model="form.collection_ids"
                    type="checkbox"
                    :value="col.id"
                    class="mr-2 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span class="text-sm">{{ col.name }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Pricing & Status</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Price Plan</label>
              <select
                v-model="form.price_plan"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="sponsor">Sponsor</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
              <input
                v-model="form.publish_date"
                type="datetime-local"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div class="mt-4 flex flex-wrap gap-4">
            <label class="inline-flex items-center">
              <input
                v-model="form.featured"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700">Featured</span>
            </label>
            <label class="inline-flex items-center">
              <input
                v-model="form.sponsor"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700">Sponsor</span>
            </label>
            <label class="inline-flex items-center">
              <input
                v-model="form.paid"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700">Paid</span>
            </label>
            <label class="inline-flex items-center">
              <input
                v-model="form.force_hidden"
                type="checkbox"
                class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700">Force Hidden</span>
            </label>
          </div>
          <div v-if="form.sponsor" class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sponsor Start Date</label>
              <input
                v-model="form.sponsor_start_date"
                type="datetime-local"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sponsor End Date</label>
              <input
                v-model="form.sponsor_end_date"
                type="datetime-local"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Free Plan Status</label>
              <select
                v-model="form.free_plan_status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="submitting">Submitting</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Pro Plan Status</label>
              <select
                v-model="form.pro_plan_status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="submitting">Submitting</option>
                <option value="pending">Pending</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sponsor Plan Status</label>
              <select
                v-model="form.sponsor_plan_status"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="submitting">Submitting</option>
                <option value="pending">Pending</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Admin Notes</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Internal Note</label>
            <textarea
              v-model="form.note"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
          <div v-if="form.free_plan_status === 'rejected'" class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
            <textarea
              v-model="form.rejection_reason"
              rows="2"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
        </div>
      </form>
    </template>
  </div>
</template>
