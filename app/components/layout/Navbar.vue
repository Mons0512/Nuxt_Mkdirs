<script setup lang="ts">
import { Menu, ArrowRight, Home, Search, FolderOpen, Tag, BookOpen, DollarSign, Send, LayoutGrid } from 'lucide-vue-next';
import { siteConfig } from '~/config/site';
import { cn } from '~/utils';
import type { MarketingConfig } from '~/types';

interface Props {
  scroll?: boolean;
  config: MarketingConfig;
}

const props = withDefaults(defineProps<Props>(), {
  scroll: false,
});

const route = useRoute();
const scrolled = ref(false);
const mobileMenuOpen = ref(false);

// Auth state
const { user, isAuthenticated, isLoading } = useAuth();

// Icon mapping
const iconMap: Record<string, any> = {
  home: Home,
  search: Search,
  collection: FolderOpen,
  category: LayoutGrid,
  tag: Tag,
  blog: BookOpen,
  pricing: DollarSign,
  submit: Send,
};

function getIcon(iconName?: string) {
  return iconName ? iconMap[iconName] || Home : Home;
}

function isLinkActive(href: string) {
  if (href === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(href);
}

// Handle scroll
onMounted(() => {
  const handleScroll = () => {
    scrolled.value = window.scrollY > 50;
  };
  window.addEventListener('scroll', handleScroll);
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
  });
});

// Prevent body scroll when mobile menu is open
watch(mobileMenuOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
});
</script>

<template>
  <div class="sticky top-0 z-40 w-full">
    <!-- Desktop View -->
    <header
      :class="cn(
        'hidden md:flex justify-center bg-background/60 backdrop-blur-xl transition-all',
        scroll ? (scrolled ? 'border-b' : 'bg-transparent') : 'border-b'
      )"
    >
      <LayoutContainer class="flex h-16 items-center justify-between">
        <!-- navbar left show logo and links -->
        <div class="flex items-center gap-6 md:gap-10">
          <!-- logo -->
          <NuxtLink to="/" class="flex items-center space-x-2">
            <LayoutLogo />
            <span class="text-xl font-bold">{{ siteConfig.name }}</span>
          </NuxtLink>

          <!-- links -->
          <nav v-if="config.menus && config.menus.length > 0" class="flex items-center gap-1">
            <NuxtLink
              v-for="item in config.menus"
              :key="item.title"
              :to="item.disabled ? '#' : item.href"
              :target="item.external ? '_blank' : undefined"
              :class="cn(
                'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
                isLinkActive(item.href)
                  ? 'text-foreground font-semibold'
                  : 'text-foreground/60',
                item.disabled && 'cursor-not-allowed opacity-80'
              )"
            >
              {{ item.title }}
            </NuxtLink>
          </nav>
        </div>

        <!-- navbar right show sign in or account -->
        <div class="flex items-center gap-x-4">
          <!-- Dark mode toggle -->
          <LayoutModeToggle />

          <!-- Show user button when authenticated -->
          <LayoutUserButton v-if="isAuthenticated" />
          
          <!-- Show sign in button when not authenticated -->
          <NuxtLink v-else to="/auth/login">
            <UiButton class="flex gap-2 px-5 rounded-full" variant="default">
              <span>Sign In</span>
              <ArrowRight class="size-4" />
            </UiButton>
          </NuxtLink>
        </div>
      </LayoutContainer>
    </header>

    <!-- Mobile View -->
    <header class="md:hidden flex justify-center bg-background/60 backdrop-blur-xl transition-all">
      <div class="w-full px-4 h-16 flex items-center justify-between">
        <!-- mobile navbar left show menu icon -->
        <div class="flex items-center gap-x-4">
          <UiButton
            variant="outline"
            size="icon"
            class="size-9 shrink-0"
            @click="mobileMenuOpen = true"
          >
            <Menu class="size-5" />
            <span class="sr-only">Toggle navigation menu</span>
          </UiButton>

          <!-- logo -->
          <NuxtLink to="/" class="flex items-center space-x-2">
            <LayoutLogo class="size-8" />
            <span class="text-xl font-bold">{{ siteConfig.name }}</span>
          </NuxtLink>
        </div>

        <!-- mobile navbar right -->
        <div class="flex items-center gap-x-4">
          <!-- Dark mode toggle -->
          <LayoutModeToggle />
          
          <!-- Show user button when authenticated -->
          <LayoutUserButton v-if="isAuthenticated" />
          
          <!-- Show sign in button when not authenticated -->
          <NuxtLink v-else to="/auth/login">
            <UiButton class="flex gap-2 px-5 rounded-full" variant="default">
              <span>Sign In</span>
              <ArrowRight class="size-4" />
            </UiButton>
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Mobile Menu Sheet -->
    <UiSheet v-model:open="mobileMenuOpen" side="left">
      <div class="flex h-screen flex-col">
        <!-- logo -->
        <NuxtLink
          to="/"
          class="flex items-center space-x-2 pl-4 pt-4"
          @click="mobileMenuOpen = false"
        >
          <LayoutLogo />
          <span class="text-xl font-bold">{{ siteConfig.name }}</span>
        </NuxtLink>

        <nav class="flex flex-1 flex-col gap-2 p-2 pt-8 font-medium">
          <NuxtLink
            v-for="item in config.menus"
            :key="item.title"
            :to="item.disabled ? '#' : item.href"
            :target="item.external ? '_blank' : undefined"
            :class="cn(
              'flex items-center rounded-md gap-2 p-2 text-sm font-medium hover:bg-muted',
              isLinkActive(item.href)
                ? 'bg-muted text-foreground'
                : 'text-muted-foreground hover:text-foreground',
              item.disabled && 'cursor-not-allowed opacity-80 hover:bg-transparent hover:text-muted-foreground'
            )"
            @click="!item.disabled && (mobileMenuOpen = false)"
          >
            <component :is="getIcon(item.icon)" class="size-5" />
            {{ item.title }}
          </NuxtLink>
        </nav>
      </div>
    </UiSheet>
  </div>
</template>
