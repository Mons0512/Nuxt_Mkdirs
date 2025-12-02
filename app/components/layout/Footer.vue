<script setup lang="ts">
import { Github, Twitter, Youtube, Mail } from 'lucide-vue-next';
import { footerConfig } from '~/config/footer';
import { siteConfig } from '~/config/site';
import { cn } from '~/utils';

interface Props {
  class?: string;
}

const props = defineProps<Props>();
</script>

<template>
  <footer :class="cn('border-t', props.class)">
    <LayoutContainer class="grid grid-cols-2 gap-8 py-12 md:grid-cols-6">
      <div class="flex flex-col items-start col-span-full md:col-span-2">
        <div class="space-y-4">
          <div class="items-center space-x-2 flex">
            <LayoutLogo />
            <span class="text-xl font-bold">{{ siteConfig.name }}</span>
          </div>

          <p class="text-muted-foreground text-base pr-4 md:pr-12">
            {{ siteConfig.tagline }}
          </p>

          <div class="flex items-center gap-2">
            <a
              v-if="siteConfig.links.github"
              :href="siteConfig.links.github"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              class="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <Github class="size-4" aria-hidden="true" />
            </a>
            <a
              v-if="siteConfig.links.twitter"
              :href="siteConfig.links.twitter"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              class="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <Twitter class="size-4" aria-hidden="true" />
            </a>
            <a
              v-if="siteConfig.links.youtube"
              :href="siteConfig.links.youtube"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              class="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <Youtube class="size-4" aria-hidden="true" />
            </a>
            <a
              v-if="siteConfig.mail"
              :href="`mailto:${siteConfig.mail}`"
              target="_blank"
              rel="noreferrer"
              aria-label="Email"
              class="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <Mail class="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div
        v-for="section in footerConfig.links"
        :key="section.title"
        class="col-span-1 md:col-span-1 items-start"
      >
        <span class="text-sm font-semibold uppercase">
          {{ section.title }}
        </span>
        <ul class="mt-4 list-inside space-y-3">
          <li v-for="link in section.items" :key="link.title">
            <NuxtLink
              v-if="link.href"
              :to="link.href"
              :target="link.external ? '_blank' : undefined"
              class="text-sm text-muted-foreground hover:text-primary"
            >
              {{ link.title }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </LayoutContainer>

    <div class="border-t py-4">
      <LayoutContainer class="flex items-center justify-between">
        <span class="text-muted-foreground text-sm">
          Copyright &copy; {{ new Date().getFullYear() }} All Rights Reserved.
        </span>

        <div class="flex items-center gap-3">
          <LayoutModeToggle />
        </div>
      </LayoutContainer>
    </div>
  </footer>
</template>
