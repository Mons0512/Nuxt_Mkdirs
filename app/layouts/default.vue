<script setup lang="ts">
import { marketingConfig } from '~/config/marketing';
</script>

<template>
  <div class="min-h-screen bg-background antialiased">
    <LayoutNavbar :config="marketingConfig" scroll />
    
    <main>
      <slot />
    </main>

    <LayoutFooter />
  </div>
</template>
