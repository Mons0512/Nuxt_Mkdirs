<script setup lang="ts">
const { register } = useAuth();

const isLoading = ref(false);
const error = ref('');
const success = ref('');

const formData = reactive({
  name: '',
  email: '',
  password: '',
});

async function handleSubmit() {
  error.value = '';
  success.value = '';
  
  if (!formData.name || !formData.email || !formData.password) {
    error.value = 'Please fill in all fields';
    return;
  }

  if (formData.password.length < 6) {
    error.value = 'Password must be at least 6 characters';
    return;
  }

  isLoading.value = true;
  
  try {
    const result = await register(formData.name, formData.email, formData.password);
    success.value = result.message || 'Account created! Please check your email to verify.';
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to create account';
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <AuthCard
    header-label="Create an account"
    bottom-button-label="Already have an account? Sign in"
    bottom-button-href="/auth/login"
    show-social-login-button
  >
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <!-- Name -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Name</label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="John Doe"
            :disabled="isLoading"
            class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          />
        </div>

        <!-- Email -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Email</label>
          <input
            v-model="formData.email"
            type="email"
            placeholder="name@example.com"
            :disabled="isLoading"
            class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          />
        </div>

        <!-- Password -->
        <div class="space-y-2">
          <label class="text-sm font-medium">Password</label>
          <input
            v-model="formData.password"
            type="password"
            placeholder="******"
            :disabled="isLoading"
            class="w-full h-10 px-3 rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          />
        </div>
      </div>

      <!-- Error Message -->
      <div
        v-if="error"
        class="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {{ error }}
      </div>

      <!-- Success Message -->
      <div
        v-if="success"
        class="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        {{ success }}
      </div>

      <!-- Submit Button -->
      <UiButton
        type="submit"
        size="lg"
        class="w-full"
        :disabled="isLoading"
      >
        <svg
          v-if="isLoading"
          class="mr-2 h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Create an account
      </UiButton>
    </form>
  </AuthCard>
</template>
