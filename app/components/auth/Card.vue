<script setup lang="ts">
import { cn } from '~/utils';

interface Props {
  headerLabel: string;
  bottomButtonLabel: string;
  bottomButtonHref: string;
  showSocialLoginButton?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showSocialLoginButton: false,
});
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <!-- Header -->
    <div class="flex flex-col items-center space-y-2 mb-6">
      <NuxtLink to="/" class="mb-2">
        <LayoutLogo />
      </NuxtLink>
      <p class="text-sm text-muted-foreground">{{ headerLabel }}</p>
    </div>

    <!-- Content -->
    <div class="space-y-6">
      <slot />
    </div>

    <!-- Social Login Buttons -->
    <div v-if="showSocialLoginButton" class="mt-6">
      <AuthSocialButtons />
    </div>

    <!-- Bottom Button -->
    <div class="mt-6 text-center">
      <NuxtLink
        :to="bottomButtonHref"
        class="text-sm text-muted-foreground hover:text-primary underline"
      >
        {{ bottomButtonLabel }}
      </NuxtLink>
    </div>
  </div>
</template>
