<script setup lang="ts">
import { Mail, ArrowRight, Send } from 'lucide-vue-next';
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
  <div class="relative overflow-hidden rounded-2xl bg-muted/30 p-8 md:p-16">
    <div class="flex flex-col items-center text-center gap-8">
      <div class="max-w-2xl space-y-4">
        <p class="text-sm font-bold tracking-wider uppercase text-muted-foreground">
          Newsletter
        </p>
        <h2 class="text-3xl md:text-4xl font-bold">
          Join the Community
        </h2>
        <p class="text-muted-foreground text-lg">
          Subscribe to our newsletter for the latest news and updates
        </p>
      </div>
      
      <div class="w-full max-w-md">
        <div v-if="isSubmitted" class="text-center">
          <p class="text-lg font-medium text-green-600 dark:text-green-400">
            🎉 Thanks for subscribing!
          </p>
          <p class="text-muted-foreground text-sm mt-1">
            Check your inbox for confirmation.
          </p>
        </div>
        
        <form v-else class="relative flex items-center" @submit.prevent="handleSubmit">
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
            class="w-full h-12 px-4 rounded-full bg-background border focus:outline-none focus:ring-2 focus:ring-primary pr-36"
          />
          <button
            type="submit"
            :disabled="isSubmitting"
            class="absolute right-1 top-1 bottom-1 px-6 rounded-full bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {{ isSubmitting ? '...' : 'Subscribe' }}
            <Send v-if="!isSubmitting" class="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
