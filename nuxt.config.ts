// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-12-12',
  srcDir: './app',
  css: ['./assets/css/main.css'],
  devtools: { enabled: true },

  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },

  modules: [
    '@nuxthub/core',
    '@nuxtjs/color-mode',
    '@nuxtjs/sitemap',
    'nuxt-gtag',
  ],

  gtag: {
    enabled: true,
  },

  sitemap: {
    exclude: [
      '/dashboard/**',
      '/studio/**',
      '/auth/**',
      '/admin/**',
    ],
  },

  hub: {},

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  runtimeConfig: {
    resendApiKey: '',
    resendEmailFrom: 'onboarding@resend.dev',
    resendEmailAdmin: '',
    resendAudienceId: '',
    stripeSecretKey: '',
    stripeWebhookSecret: '',
    creemApiKey: '',
    creemWebhookSecret: '',
    creemTestMode: false,
    googleAiApiKey: '',
    deepseekApiKey: '',
    openaiApiKey: '',
    aiProvider: 'google',
    supabaseServiceKey: '',

    public: {
      siteUrl: 'http://localhost:3000',
      appUrl: 'http://localhost:3000',
      stripePublishableKey: '',
      stripeProPriceId: '',
      stripeSponsorPriceId: '',
      creemProProductId: '',
      creemSponsorProductId: '',
      googleAnalyticsId: '',
      supportCategoryGroup: true,
      supportItemIcon: true,
      supportAiSubmit: true,
      itemsPerPage: 12,
      supabaseUrl: '',
      supabaseAnonKey: '',
    },
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Nuxt Mkdirs - The Best Directory Website Template for Nuxt',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'This is the Nuxt.js version of Mkdirs template. The ultimate directory website template built with Nuxt.' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Inter:wght@400;500;600;700&display=swap' },
      ],
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
