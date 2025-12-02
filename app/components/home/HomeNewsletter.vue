<script setup lang="ts">
import { Mail, ArrowRight } from 'lucide-vue-next';
import { siteConfig } from '~/config/site';

const email = ref('');
const isSubmitting = ref(false);
const isSubmitted = ref(false);

async function handleSubmit() {
  if (!email.value.trim()) return;
  
  isSubmitting.value = true;
  
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  isSubmitting.value = false;
  isSubmitted.value = true;
  email.value = '';
}
</script>

<template>
  <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-8 md:p-12">
    <!-- Background pattern -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');" />
    </div>
    
    <div class="relative flex flex-col md:flex-row items-center justify-between gap-8">
      <div class="flex-1 text-center md:text-left">
        <div class="flex items-center justify-center md:justify-start gap-2 mb-4">
          <Mail class="w-6 h-6 text-white" />
          <h2 class="text-2xl md:text-3xl font-bold text-white">
            Subscribe to our Newsletter
          </h2>
        </div>
        <p class="text-white/80 text-lg max-w-xl">
          Get the latest tools, resources, and updates delivered straight to your inbox. No spam, unsubscribe anytime.
        </p>
      </div>
      
      <div class="w-full md:w-auto">
        <div v-if="isSubmitted" class="text-center md:text-left">
          <p class="text-white text-lg font-medium">
            🎉 Thanks for subscribing!
          </p>
          <p class="text-white/80 text-sm mt-1">
            Check your inbox for confirmation.
          </p>
        </div>
        
        <form v-else class="flex flex-col sm:flex-row gap-3" @submit.prevent="handleSubmit">
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
            class="h-12 px-4 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 min-w-[280px]"
          />
          <button
            type="submit"
            :disabled="isSubmitting"
            class="h-12 px-6 rounded-lg bg-white text-indigo-600 font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {{ isSubmitting ? 'Subscribing...' : 'Subscribe' }}
            <ArrowRight v-if="!isSubmitting" class="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
