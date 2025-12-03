<script setup lang="ts">
import { dashboardConfig } from '~/config/dashboard';

const { user, isAuthenticated, isLoading } = useAuth();

// Wait for auth to be ready, then redirect if not authenticated
const authChecked = ref(false);

watch(isLoading, (loading) => {
  if (!loading) {
    authChecked.value = true;
    if (!isAuthenticated.value) {
      navigateTo('/auth/login');
    }
  }
});

// Also check immediately if already loaded
onMounted(() => {
  if (!isLoading.value) {
    authChecked.value = true;
    if (!isAuthenticated.value) {
      navigateTo('/auth/login');
    }
  }
});
</script>

<template>
  <div class="min-h-screen bg-background antialiased">
    <!-- Show loading state while checking auth -->
    <div v-if="!authChecked" class="flex min-h-screen items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>

    <!-- Show content when authenticated -->
    <template v-else-if="isAuthenticated">
      <LayoutNavbar :config="dashboardConfig" :scroll="false" />
      
      <main>
        <LayoutContainer class="mt-8 pb-16">
          <slot />
        </LayoutContainer>
      </main>

      <LayoutFooter />
    </template>
  </div>
</template>
