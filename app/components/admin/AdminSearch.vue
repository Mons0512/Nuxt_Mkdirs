<script setup lang="ts">
import { Search, X } from 'lucide-vue-next';

interface Props {
  keyword?: string;
  showKeyword?: boolean;
  status?: string;
  showStatus?: boolean;
  statusOptions?: { label: string; value: string }[];
  dateFrom?: string;
  dateTo?: string;
  showDateRange?: boolean;
  showReset?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  keyword: '',
  showKeyword: true,
  status: '',
  showStatus: false,
  statusOptions: () => [],
  dateFrom: '',
  dateTo: '',
  showDateRange: false,
  showReset: true,
});

const emit = defineEmits<{
  (e: 'update:keyword', value: string): void;
  (e: 'update:status', value: string): void;
  (e: 'update:dateFrom', value: string): void;
  (e: 'update:dateTo', value: string): void;
  (e: 'search'): void;
  (e: 'reset'): void;
}>();

const localKeyword = ref(props.keyword);
const localStatus = ref(props.status);
const localDateFrom = ref(props.dateFrom);
const localDateTo = ref(props.dateTo);

watch(() => props.keyword, (val) => localKeyword.value = val);
watch(() => props.status, (val) => localStatus.value = val);
watch(() => props.dateFrom, (val) => localDateFrom.value = val);
watch(() => props.dateTo, (val) => localDateTo.value = val);

function handleSearch() {
  emit('update:keyword', localKeyword.value);
  emit('update:status', localStatus.value);
  emit('update:dateFrom', localDateFrom.value);
  emit('update:dateTo', localDateTo.value);
  emit('search');
}

function handleReset() {
  localKeyword.value = '';
  localStatus.value = '';
  localDateFrom.value = '';
  localDateTo.value = '';
  emit('update:keyword', '');
  emit('update:status', '');
  emit('update:dateFrom', '');
  emit('update:dateTo', '');
  emit('reset');
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-xl p-4 mb-6">
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Keyword search -->
      <div v-if="showKeyword" class="flex-1 min-w-[200px]">
        <label class="block text-xs font-medium text-gray-700 mb-1.5">Search</label>
        <div class="relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            v-model="localKeyword"
            type="text"
            placeholder="Search..."
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
            @keydown.enter="handleSearch"
          />
          <button
            v-if="localKeyword"
            @click="localKeyword = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Status filter -->
      <div v-if="showStatus && statusOptions.length > 0" class="sm:w-48">
        <label class="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
        <select
          v-model="localStatus"
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all bg-white"
        >
          <option value="">All</option>
          <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </div>

      <!-- Date range from -->
      <div v-if="showDateRange" class="sm:w-44">
        <label class="block text-xs font-medium text-gray-700 mb-1.5">From</label>
        <input
          v-model="localDateFrom"
          type="date"
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all bg-white"
        />
      </div>

      <!-- Date range to -->
      <div v-if="showDateRange" class="sm:w-44">
        <label class="block text-xs font-medium text-gray-700 mb-1.5">To</label>
        <input
          v-model="localDateTo"
          type="date"
          class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all bg-white"
        />
      </div>

      <!-- Buttons -->
      <div class="flex items-end gap-2">
        <button
          @click="handleSearch"
          class="px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Search
        </button>
        <button
          v-if="showReset"
          @click="handleReset"
          class="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  </div>
</template>
