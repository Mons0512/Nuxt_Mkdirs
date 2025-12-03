<script setup lang="ts">
import { BellRing, Loader2 } from 'lucide-vue-next';

definePageMeta({
  layout: 'protected',
});

const { user, fetchSession } = useAuth();

// Form state
const isPending = ref(false);
const form = reactive({
  name: '',
  link: '',
  password: '',
  newPassword: '',
});

// Initialize form with user data
watch(user, (u) => {
  if (u) {
    form.name = u.name || '';
    form.link = (u as any).link || '';
  }
}, { immediate: true });

// Check if user is OAuth (no password change allowed)
const isOAuth = computed(() => (user.value as any)?.isOAuth === true);

async function onSubmit() {
  isPending.value = true;
  try {
    const response = await $fetch('/api/auth/settings', {
      method: 'POST',
      body: {
        name: form.name,
        link: form.link,
        password: form.password || undefined,
        newPassword: form.newPassword || undefined,
      },
    });
    
    if ((response as any).status === 'success') {
      await fetchSession();
      form.password = '';
      form.newPassword = '';
      alert('Settings saved successfully!');
    } else {
      alert((response as any).message || 'Failed to save settings');
    }
  } catch (error: any) {
    alert(error.data?.message || 'Something went wrong');
  } finally {
    isPending.value = false;
  }
}

useSeoMeta({
  title: 'Settings - Directory Template',
  description: 'Manage your account settings.',
});
</script>

<template>
  <div>
    <div class="flex flex-col space-y-4">
      <h1 class="text-2xl font-semibold">Settings</h1>
      <p class="text-muted-foreground">
        Manage your account settings and preferences.
      </p>
    </div>

    <div class="mt-8">
      <form @submit.prevent="onSubmit" class="space-y-6">
        <UiCard class="overflow-hidden">
          <UiCardContent class="mt-4 space-y-6">
            <!-- Name field -->
            <div class="space-y-2">
              <label for="name" class="text-sm font-medium">Name</label>
              <UiInput
                id="name"
                v-model="form.name"
                placeholder="Your name"
                :disabled="isPending"
              />
            </div>

            <!-- Link field -->
            <div class="space-y-2">
              <label for="link" class="text-sm font-medium">Link</label>
              <UiInput
                id="link"
                v-model="form.link"
                placeholder="Link (e.g. https://x.com/username)"
                :disabled="isPending"
              />
            </div>

            <!-- Password fields (only for non-OAuth users) -->
            <template v-if="!isOAuth">
              <div class="space-y-4">
                <div class="space-y-2">
                  <label for="password" class="text-sm font-medium">Password</label>
                  <UiInput
                    id="password"
                    v-model="form.password"
                    type="password"
                    placeholder="******"
                    :disabled="isPending"
                  />
                </div>

                <div class="space-y-2">
                  <label for="newPassword" class="text-sm font-medium">New Password</label>
                  <UiInput
                    id="newPassword"
                    v-model="form.newPassword"
                    type="password"
                    placeholder="******"
                    :disabled="isPending"
                  />
                </div>
              </div>
            </template>
          </UiCardContent>

          <UiCardFooter
            class="flex flex-col items-stretch space-y-4 border-t bg-accent px-6 py-4 sm:flex-row sm:justify-between sm:space-y-0 sm:gap-4"
          >
            <UiButton
              size="lg"
              type="submit"
              class="w-full sm:w-auto"
              :disabled="isPending"
            >
              <Loader2 v-if="isPending" class="mr-2 h-4 w-4 animate-spin" />
              Save Changes
            </UiButton>

            <div v-if="!isOAuth" class="text-muted-foreground flex items-center justify-center sm:justify-start gap-4">
              <BellRing class="h-5 w-5 sm:h-6 sm:w-4 flex-shrink-0" />
              <span class="text-sm">
                Password is optional when changing name or link.
              </span>
            </div>
          </UiCardFooter>
        </UiCard>
      </form>
    </div>
  </div>
</template>
