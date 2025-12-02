<script setup lang="ts">
definePageMeta({
  layout: 'auth',
});

useSeoMeta({
  title: 'Verify Email',
});

const route = useRoute();
const isLoading = ref(true);
const error = ref('');
const success = ref('');

onMounted(async () => {
  const token = route.query.token as string;

  if (!token) {
    error.value = 'Missing verification token';
    isLoading.value = false;
    return;
  }

  try {
    await $fetch('/api/auth/verify', {
      method: 'GET',
      query: { token },
    });
    success.value = 'Email verified successfully! You can now login.';
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to verify email';
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <AuthCard
    header-label="Confirming your email"
    bottom-button-label="Back to login"
    bottom-button-href="/auth/login"
  >
    <div class="flex flex-col items-center justify-center w-full space-y-4">
      <!-- Loading -->
      <div v-if="isLoading" class="flex items-center gap-2">
        <svg
          class="h-5 w-5 animate-spin text-muted-foreground"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span class="text-muted-foreground">Verifying your email...</span>
      </div>

      <!-- Error Message -->
      <div
        v-if="error && !isLoading"
        class="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive w-full"
      >
        <svg class="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {{ error }}
      </div>

      <!-- Success Message -->
      <div
        v-if="success && !isLoading"
        class="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500 w-full"
      >
        <svg class="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        {{ success }}
      </div>

      <!-- Login Button -->
      <NuxtLink
        v-if="success && !isLoading"
        to="/auth/login"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Go to Login
      </NuxtLink>
    </div>
  </AuthCard>
</template>
