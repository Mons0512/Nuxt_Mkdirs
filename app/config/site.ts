import type { SiteConfig } from '~/types';

const SITE_URL = 'http://localhost:3000';

export const siteConfig: SiteConfig = {
  name: "Nuxt Mkdirs",
  tagline: "The Nuxt.js version of Mkdirs, the best directory website template",
  description:
    "This is a demo site for Nuxt Mkdirs template. Built with Nuxt.js, it offers the same power as the original Mkdirs. Build trending and profitable directory websites in minutes.",
  keywords: [
    "Directory",
    "Template",
    "Boilerplate",
    "Nuxt.js",
    "Vue.js",
    "Tailwindcss",
    "Mkdirs",
  ],
  author: "Mkdirs",
  url: SITE_URL,
  logo: "/logo.png",
  // set the logoDark if you have put the logo-dark.png in the public folder
  // logoDark: "/logo-dark.png",
  image: `${SITE_URL}/og.png?v=1`,
  mail: "support@mkdirs.com",
  utm: {
    source: "mkdirs.com",
    medium: "referral",
    campaign: "navigation",
  },
  links: {
    twitter: "https://x.com/MkdirsHQ",
    github: "https://github.com/MkdirsHQ",
    youtube: "https://www.youtube.com/@MkdirsHQ",
  },
};
